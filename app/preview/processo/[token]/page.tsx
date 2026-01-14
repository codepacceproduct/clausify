import { createClient } from "@/lib/supabase/server"
import { ProcessResult } from "@/components/consultas/process-result"

type PreviewRecord = {
  payload: any
  expires_at: string
}

async function getPreview(token: string): Promise<PreviewRecord | null> {
  console.log("PublicProcessPreview:getPreview:start", { token })

  const supabase = await createClient()
  const now = new Date().toISOString()

  const { data, error } = await supabase
    .from("process_public_previews")
    .select("payload, expires_at")
    .eq("token", token)
    .gt("expires_at", now)
    .single()

  if (error || !data) {
    console.error("PublicProcessPreview:getPreview:error_or_not_found", {
      token,
      now,
      errorCode: error?.code,
      errorMessage: error?.message,
      errorDetails: error?.details,
      errorHint: error?.hint,
      hasData: !!data,
    })
    return null
  }

  console.log("PublicProcessPreview:getPreview:success", {
    token,
    expires_at: data.expires_at,
  })

  return data as PreviewRecord
}

export default async function PublicProcessPreviewPage(props: { params: Promise<{ token: string }> }) {
  const { token } = await props.params

  console.log("PublicProcessPreview:page:request", { token })

  const preview = await getPreview(token)

  if (!preview) {
    console.warn("PublicProcessPreview:page:no_preview", { token })

    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full text-center space-y-3">
          <h1 className="text-2xl font-semibold tracking-tight">Link inválido ou expirado</h1>
          <p className="text-sm text-muted-foreground">
            Este link de visualização pública não está mais disponível. Peça um novo link a quem compartilhou com você.
          </p>
        </div>
      </div>
    )
  }

  const payload = preview.payload as any

  const formattedExpiry = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(preview.expires_at))

  return (
    <div className="min-h-screen bg-background px-4 py-6 flex justify-center">
      <div className="w-full max-w-6xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Visualização pública do processo</h1>
            <p className="text-xs text-muted-foreground">
              Qualquer pessoa com este link pode acompanhar o andamento deste processo.
            </p>
          </div>
          <div className="text-[11px] text-muted-foreground">
            Link válido até <span className="font-medium">{formattedExpiry}</span>
          </div>
        </div>

        <ProcessResult
          processNumber={payload.processNumber}
          title={payload.title}
          status={payload.status}
          events={payload.events || []}
          documents={payload.documents || []}
          showBackButton={false}
        />
      </div>
    </div>
  )
}
