"use server"

export async function consultCNPJ(cnpj: string) {
  const cleanCNPJ = cnpj.replace(/\D/g, "")
  
  try {
    // Tentativa 1: BrasilAPI
    console.log(`Consultando BrasilAPI para CNPJ: ${cleanCNPJ}`)
    const response = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${cleanCNPJ}`, {
      cache: 'no-store'
    })
    
    if (response.ok) {
      const data = await response.json()
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
