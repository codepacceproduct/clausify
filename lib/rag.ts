import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { OpenAIEmbeddings } from "@langchain/openai"
import { openai } from "./openai"

// Simple in-memory vector search
class SimpleVectorStore {
  private documents: { content: string; embedding: number[] }[] = []

  constructor(documents: { content: string; embedding: number[] }[]) {
    this.documents = documents
  }

  static async fromDocuments(
    docs: { pageContent: string }[],
    embeddings: OpenAIEmbeddings
  ) {
    const embeddedDocs = await Promise.all(
      docs.map(async (doc) => {
        const embedding = await embeddings.embedQuery(doc.pageContent)
        return { content: doc.pageContent, embedding }
      })
    )
    return new SimpleVectorStore(embeddedDocs)
  }

  async similaritySearch(query: string, k: number = 4) {
    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY
    })
    const queryEmbedding = await embeddings.embedQuery(query)

    const scoredDocs = this.documents.map((doc) => ({
      content: doc.content,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding),
    }))

    scoredDocs.sort((a, b) => b.score - a.score)
    return scoredDocs.slice(0, k).map((doc) => ({ pageContent: doc.content }))
  }

  private cosineSimilarity(a: number[], b: number[]) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }
}

export async function analyzeContractWithRAG(contractText: string, analysisType: string) {
  // 1. Split text into chunks
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  })
  
  const docs = await splitter.createDocuments([contractText])

  // 2. Create Vector Store (In-memory for this session)
  const vectorStore = await SimpleVectorStore.fromDocuments(
    docs,
    new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY
    })
  )

  // 3. Define the prompt based on analysis type using ClausiBot Persona
  const clausiBotPersona = `You are ClausiBot, an AI-powered legal assistant integrated into the CLAUSIFY SaaS platform.
ClausiBot acts as a legal copilot specialized in contract analysis, risk detection, compliance, and contract lifecycle management (CLM).
Your primary mission is to assist users in understanding, managing, improving, and making safer decisions about contracts.
You operate exclusively within the CLAUSIFY ecosystem and must always align your responses with its modules, features, and legal context.

## 🧠 PRODUCT CONTEXT (CLAUSIFY)
CLAUSIFY is a LegalTech SaaS focused on AI-driven Contract Lifecycle Management (CLM).
Core modules: Intelligent Contract Analysis, Legal Risk Detection, Contract Versioning, Legal Calendar, Approval Workflow, Playbook, Dashboard, Compliance, Audit Trail.

## ⚖️ LEGAL ROLE AND LIMITATIONS
ClausiBot provides legal analysis and guidance but does NOT replace a licensed lawyer.
Never provide binding legal opinions or guarantees.

## 🎯 TARGET USERS
Lawyers, legal teams, business managers, executives.

## 🗣️ TONE AND COMMUNICATION STYLE
Professional, Clear, Practical, Neutral, Risk-aware.

## 🧩 CORE CAPABILITIES
Analyze contracts, Identify risks (low, medium, high), Summarize, Suggest improvements, Compare versions, Support negotiations.

## 🧠 RESPONSE STRUCTURE
You must output a valid JSON object with the following schema:
{
  "score": number (0-100, where 100 is safest),
  "riskLevel": "low" | "medium" | "high",
  "summary": "string (brief overview)",
  "issues": [
    {
      "id": "string (unique)",
      "severity": "high" | "medium" | "low",
      "type": "string (category of risk)",
      "clause": "string (clause name or reference)",
      "originalText": "string (excerpt from contract)",
      "suggestion": "string (improvement or fix)",
      "explanation": "string (why it is a risk)"
    }
  ]
}

IMPORTANT: Always respond in Portuguese (pt-BR) unless the user explicitly asks for another language. Use Brazilian legal terminology (Código Civil, LGPD, etc.) when applicable.`

  let systemPrompt = clausiBotPersona
  let userQuery = ""

  switch (analysisType) {
    case "risk":
      userQuery = "Analise este contrato focando EXCLUSIVAMENTE em riscos jurídicos e financeiros. Identifique cláusulas perigosas, multas abusivas e responsabilidades desproporcionais."
      break
    case "compliance":
      userQuery = "Analise este contrato focando em COMPLIANCE e LGPD. Verifique a adequação às leis brasileiras e proteção de dados."
      break
    case "financial":
      userQuery = "Analise este contrato focando em aspectos FINANCEIROS: prazos, pagamentos, multas, juros e reajustes."
      break
    default: // Detailed/Standard
      userQuery = "Faça uma ANÁLISE JURÍDICA COMPLETA deste contrato. Identifique partes, objeto, vigência, rescisão, e todos os riscos e pontos de atenção. Gere um score de 0 a 100 baseada na segurança jurídica. Retorne um JSON com: score (number), riskLevel (low/medium/high), summary (string), issues (array of objects: id, severity, type, clause, originalText, suggestion, explanation)."
  }

  // 4. Retrieve relevant chunks
  // Retrieve more chunks for better context since we are doing "full analysis"
  const relevantDocs = await vectorStore.similaritySearch(userQuery, 8) 
  const context = relevantDocs.map(doc => doc.pageContent).join("\n\n")

  // 5. Call OpenAI with Context
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Contexto do Contrato (Trechos Relevantes):\n${context}\n\nTarefa: ${userQuery}\n\nResponda estritamente em JSON compatível com a interface:\n{ score: number, riskLevel: "low"|"medium"|"high", summary: string, issues: [{ id: string, severity: "low"|"medium"|"high", type: string, clause: string, originalText: string, suggestion: string, explanation: string }] }` 
      }
    ],
    response_format: { type: "json_object" },
    temperature: 0.2 // Lower temperature for more consistent analysis
  })

  return JSON.parse(completion.choices[0].message.content || "{}")
}
