"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2, Building2 } from "lucide-react"

export function OrganizationSettings() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [org, setOrg] = useState<any>(null)
  
  // Form states
  const [name, setName] = useState("")
  const [legalName, setLegalName] = useState("")
  const [taxId, setTaxId] = useState("") // CNPJ
  const [industry, setIndustry] = useState("")
  const [size, setSize] = useState("")
  const [website, setWebsite] = useState("")
  const [email, setEmail] = useState("")
  
  // Address
  const [addressLine1, setAddressLine1] = useState("")
  const [city, setCity] = useState("")
  const [region, setRegion] = useState("") // State/Province
  const [postalCode, setPostalCode] = useState("")
  const [country, setCountry] = useState("")

  useEffect(() => {
    loadOrganization()
  }, [])

  async function loadOrganization() {
    try {
      const res = await fetch("/api/organizations/current")
      if (!res.ok) throw new Error("Failed to load organization")
      const data = await res.json()
      if (data.organization) {
        const o = data.organization
        setOrg(o)
        setName(o.name || "")
        setLegalName(o.legal_name || "")
        setTaxId(o.tax_id || "")
        setIndustry(o.industry || "")
        setSize(o.size || "")
        setWebsite(o.website || "")
        setEmail(o.email || "")
        setAddressLine1(o.address_line1 || "")
        setCity(o.city || "")
        setRegion(o.region || "")
        setPostalCode(o.postal_code || "")
        setCountry(o.country || "")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao carregar organização")
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      const res = await fetch("/api/organizations/current", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organization: {
            name,
            legal_name: legalName,
            tax_id: taxId,
            industry,
            size,
            website,
            email,
            address_line1: addressLine1,
            city,
            region,
            postal_code: postalCode,
            country
          }
        }),
      })

      if (!res.ok) throw new Error("Failed to update")
      
      toast.success("Organização atualizada com sucesso")
    } catch (error) {
      toast.error("Erro ao atualizar organização")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Organização</h3>
        <p className="text-sm text-muted-foreground">
          Gerencie os detalhes da sua empresa e informações legais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Empresa</CardTitle>
          <CardDescription>
            Informações visíveis para sua equipe e em documentos.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Fantasia</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Clausify"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="legalName">Razão Social</Label>
              <Input
                id="legalName"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                placeholder="Ex: Clausify Tecnologia Ltda"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taxId">CNPJ / Tax ID</Label>
              <Input
                id="taxId"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                placeholder="00.000.000/0001-00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

           <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail de Contato</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@empresa.com"
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="industry">Setor</Label>
              <Input
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="Ex: Tecnologia, Jurídico"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Endereço</CardTitle>
          <CardDescription>
            Localização física da organização.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Rua, Número, Complemento"
            />
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Estado</Label>
              <Input
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP</Label>
              <Input
                id="postalCode"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Salvar Alterações
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
