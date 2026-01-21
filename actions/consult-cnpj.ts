"use server"

import { createClient } from "@/lib/supabase/server"
import { getPlanLimits } from "@/lib/permissions"
import { createClient as createAdminClient } from "@supabase/supabase-js"

export async function consultCNPJ(cnpj: string) {
  const cleanCNPJ = cnpj.replace(/\D/g, "")
  const supabase = await createClient()
  const supabaseAdmin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Check Plan Limits
  let organizationId: string | undefined
  const { data: { user } } = await supabase.auth.getUser()
  
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("organization_id")
      .eq("id", user.id)
      .single()

    organizationId = profile?.organization_id

    if (organizationId) {
      // Use Service Role client to bypass RLS for subscription fetching
      const { data: subs } = await supabaseAdmin
        .from("subscriptions")
        .select("plan")
        .eq("organization_id", organizationId)
        .single()

      const plan = subs?.plan || "free"
      const limits = await getPlanLimits(plan)

      if (limits.max_datalake_queries !== Infinity) {
        // Check DAILY usage
        const today = new Date().toISOString().split('T')[0]
        const { data: usage } = await supabaseAdmin
          .from("usage_logs")
          .select("count")
          .eq("organization_id", organizationId)
          .eq("action", "datalake_query")
          .eq("date", today)
          .single()

        if ((usage?.count || 0) >= limits.max_datalake_queries) {
          throw new Error(`Limite diário de consultas atingido para o plano ${plan} (${limits.max_datalake_queries}). Faça upgrade para continuar.`)
        }
      }
    }
  }

  const incrementUsage = async () => {
    if (organizationId) {
      const today = new Date().toISOString().split('T')[0]
      await supabase.rpc('increment_usage_log', {
        org_id: organizationId,
        action_name: 'datalake_query',
        log_date: today
      })
    }
  }

  try {
    // Tentativa 1: BrasilAPI
    console.log(`Consultando BrasilAPI para CNPJ: ${cleanCNPJ}`)
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const data = await response.json()
      await incrementUsage()
      return mapBrasilApiData(data)
    } else {
      console.warn(`BrasilAPI falhou com status: ${response.status}`)
    }
  } catch (error) {
    console.warn("Erro ao consultar BrasilAPI:", error)
  }

  try {
    // Tentativa 2: ReceitaWS (Fallback)
    console.log(`Consultando ReceitaWS para CNPJ: ${cleanCNPJ}`)
    const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCNPJ}`, {
      cache: 'no-store'
    })

    if (response.ok) {
      const data = await response.json()
      if (data.status === "ERROR") {
        throw new Error(data.message || "Erro na API ReceitaWS")
      }
      await incrementUsage()
      return mapReceitaWsData(data)
    }
  } catch (error) {
    console.error("Erro ao consultar ReceitaWS:", error)
  }

  console.error("Todas as tentativas de consulta de CNPJ falharam.")
  return null
}

function mapBrasilApiData(data: any) {
  return {
    type: "pj",
    name: data.razao_social,
    tradeName: data.nome_fantasia,
    document: data.cnpj,
    status: data.descricao_situacao_cadastral,
    birthDate: data.data_inicio_atividade,
    addresses: [
      {
        street: data.logradouro,
        number: data.numero,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.municipio,
        state: data.uf,
        zipCode: data.cep
      }
    ],
    phones: [
      { 
        number: `(${data.ddd_telefone_1?.slice(0, 2)}) ${data.ddd_telefone_1?.slice(2) || data.telefone_1}`, 
        type: "Principal", 
        isWhatsapp: false 
      },
      data.ddd_telefone_2 && { 
        number: `(${data.ddd_telefone_2?.slice(0, 2)}) ${data.ddd_telefone_2?.slice(2) || data.telefone_2}`, 
        type: "Secundário", 
        isWhatsapp: false 
      }
    ].filter(Boolean),
    emails: [data.email].filter(Boolean),
    partners: data.qsa?.map((socio: any) => ({
      name: socio.nome_socio,
      role: socio.qualificacao_socio,
      share: "Não informado"
    })) || [],
    mainActivity: {
        code: data.cnae_fiscal,
        text: data.cnae_fiscal_descricao
      },
      secondaryActivities: data.cnaes_secundarios?.map((cnae: any) => ({
        code: cnae.codigo,
        text: cnae.descricao
      })) || [],
      legalNature: data.natureza_juridica,
      shareCapital: data.capital_social,
      taxInfo: {
        isSimples: data.opcao_pelo_simples,
        isMei: data.opcao_pelo_mei
      },
      vehicles: []
    }
  }

function mapReceitaWsData(data: any) {
  return {
    type: "pj",
    name: data.nome,
    tradeName: data.fantasia,
    document: data.cnpj,
    status: data.situacao,
    birthDate: data.abertura,
    addresses: [
      {
        street: data.logradouro,
        number: data.numero,
        complement: data.complemento,
        neighborhood: data.bairro,
        city: data.municipio,
        state: data.uf,
        zipCode: data.cep
      }
    ],
    phones: [
      { 
        number: data.telefone, 
        type: "Principal", 
        isWhatsapp: false 
      }
    ].filter(Boolean),
    emails: [data.email].filter(Boolean),
    partners: data.qsa?.map((socio: any) => ({
      name: socio.nome,
      role: socio.qual,
      share: "Não informado"
    })) || [],
    mainActivity: {
      code: data.atividade_principal?.[0]?.code,
      text: data.atividade_principal?.[0]?.text
    },
    secondaryActivities: data.atividades_secundarias?.map((cnae: any) => ({
      code: cnae.code,
      text: cnae.text
    })) || [],
    legalNature: data.natureza_juridica,
    shareCapital: data.capital_social,
    taxInfo: {
      isSimples: data.simples?.optante,
      isMei: data.simei?.optante
    },
    vehicles: []
  }
}
