import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plug, Check, ExternalLink } from "lucide-react"

const integrations = [
  {
    name: "Slack",
    description: "Receba notificações e atualizações diretamente no Slack",
    icon: "💬",
    connected: true,
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Google Drive",
    description: "Sincronize contratos automaticamente com o Google Drive",
    icon: "📁",
    connected: true,
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Zapier",
    description: "Conecte com milhares de aplicativos via Zapier",
    icon: "⚡",
    connected: false,
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Microsoft Teams",
    description: "Integre com Microsoft Teams para colaboração",
    icon: "👥",
    connected: false,
    color: "from-indigo-500 to-purple-500",
  },
  {
    name: "Salesforce",
    description: "Sincronize contratos com seus registros do Salesforce",
    icon: "☁️",
    connected: false,
    color: "from-blue-600 to-blue-400",
  },
  {
    name: "DocuSign",
    description: "Envie contratos para assinatura eletrônica",
    icon: "✍️",
    connected: true,
    color: "from-yellow-500 to-orange-500",
  },
]

export function IntegrationSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Plug className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Integrações Disponíveis</CardTitle>
          </div>
          <CardDescription>Conecte o LegalAI com suas ferramentas favoritas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${integration.color} text-2xl`}
                >
                  {integration.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{integration.name}</h3>
                    {integration.connected && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Conectado
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{integration.description}</p>
                  <div className="flex gap-2">
                    {integration.connected ? (
                      <>
                        <Button variant="outline" size="sm">
                          Configurar
                        </Button>
                        <Button variant="ghost" size="sm">
                          Desconectar
                        </Button>
                      </>
                    ) : (
                      <Button size="sm">Conectar</Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API e Webhooks</CardTitle>
          <CardDescription>Configure integrações customizadas via API</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-lg bg-muted/30">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">API Key</h4>
              <Button variant="ghost" size="sm">
                Regenerar
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="flex-1 text-sm bg-background px-3 py-2 rounded border font-mono">
                sk_live_51JxK2lB4...
              </code>
              <Button variant="outline" size="sm">
                Copiar
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Webhooks</div>
              <div className="text-sm text-muted-foreground">Configure endpoints para receber eventos</div>
            </div>
            <Button variant="outline" size="sm">
              Configurar
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Documentação da API</div>
              <div className="text-sm text-muted-foreground">Guia completo para desenvolvedores</div>
            </div>
            <Button variant="outline" size="sm">
              Ver Docs
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
