import { NextResponse } from "next/server"

// Mocked data simulating a Git repository source
const templates = [
  {
    id: "tmpl_001",
    title: "Contrato de Prestação de Serviços de TI",
    category: "Serviços",
    type: "Contrato",
    description: "Modelo padrão para desenvolvimento de software e consultoria técnica.",
    format: "md",
    source_url: "https://github.com/clausify-templates/legal/blob/main/servicos/ti.md",
    content: `# CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE TECNOLOGIA DA INFORMAÇÃO

## 1. DAS PARTES
**CONTRATANTE**: [Nome da Empresa], CNPJ nº [CNPJ], com sede em [Endereço].
**CONTRATADA**: [Nome do Prestador], CNPJ nº [CNPJ], com sede em [Endereço].

## 2. DO OBJETO
O presente contrato tem por objeto a prestação de serviços de desenvolvimento de software e consultoria técnica...

## 3. DO PRAZO
Este contrato terá vigência de [12] meses, renovável automaticamente por iguais períodos...

## 4. DA CONFIDENCIALIDADE
As partes se comprometem a manter sigilo sobre todas as informações acessadas...`
  },
  {
    id: "tmpl_002",
    title: "Acordo de Confidencialidade (NDA)",
    category: "Compliance",
    type: "Acordo",
    description: "Proteção de informações sensíveis e propriedade intelectual entre partes.",
    format: "md",
    source_url: "https://github.com/clausify-templates/legal/blob/main/compliance/nda.md",
    content: `# ACORDO DE CONFIDENCIALIDADE (NDA)

Pelo presente instrumento particular, as partes abaixo qualificadas celebram o presente Acordo...

## 1. INFORMAÇÕES CONFIDENCIAIS
Consideram-se Informações Confidenciais todas as informações técnicas, comerciais, financeiras...

## 2. OBRIGAÇÕES
A parte Receptora obriga-se a não divulgar, reproduzir ou utilizar as Informações Confidenciais...`
  },
  {
    id: "tmpl_003",
    title: "Termo de Rescisão de Contrato de Trabalho",
    category: "Trabalhista",
    type: "Termo",
    description: "Modelo para formalização de desligamento de colaborador sem justa causa.",
    format: "docx",
    source_url: "https://github.com/clausify-templates/legal/blob/main/trabalhista/rescisao.docx",
    content: `TERMO DE RESCISÃO DE CONTRATO DE TRABALHO

EMPREGADOR: [Nome], CNPJ [CNPJ]
EMPREGADO: [Nome], CPF [CPF]

Pelo presente termo, as partes formalizam o encerramento do vínculo empregatício...`
  },
  {
    id: "tmpl_004",
    title: "Política de Privacidade e Proteção de Dados",
    category: "LGPD",
    type: "Política",
    description: "Adequado à Lei Geral de Proteção de Dados (Lei 13.709/2018).",
    format: "pdf",
    source_url: "https://github.com/clausify-templates/legal/blob/main/lgpd/politica.pdf",
    content: `# POLÍTICA DE PRIVACIDADE

## 1. INTRODUÇÃO
A sua privacidade é importante para nós. Esta política explica como coletamos e tratamos seus dados...

## 2. COLETA DE DADOS
Coletamos apenas os dados necessários para a prestação dos nossos serviços...`
  }
]

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800))
  
  return NextResponse.json(templates)
}
