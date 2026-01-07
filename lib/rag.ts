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

  // 3. Define the prompt based on analysis type
  let systemPrompt = ""
  let userQuery = ""

  switch (analysisType) {
    case "risk":
      systemPrompt = "Você é um advogado especialista em análise de riscos contratuais. Identifique cláusulas perigosas, multas abusivas e responsabilidades desproporcionais."
      userQuery = "Quais são os principais riscos jurídicos e financeiros neste contrato? Liste-os com severidade (Alta, Média, Baixa) e sugira mitigações."
      break
    case "compliance":
      systemPrompt = "Você é um especialista em compliance e LGPD. Verifique se o contrato está em conformidade com as leis brasileiras."
      userQuery = "Este contrato está em conformidade com a LGPD e o Código Civil Brasileiro? Aponte violações ou pontos de atenção."
      break
    case "financial":
      systemPrompt = "Você é um analista financeiro. Foque em prazos de pagamento, multas, juros e reajustes."
      userQuery = "Analise as condições financeiras: prazos de pagamento, índices de reajuste e penalidades por atraso. São justas?"
      break
    default: // Detailed/Standard
      systemPrompt = "Você é um assistente jurídico sênior. Faça uma análise completa do contrato."
      userQuery = "Faça um resumo detalhado do contrato, destacando obrigações das partes, prazos, valores e pontos de atenção."
  }

  // 4. Retrieve relevant chunks
  const relevantDocs = await vectorStore.similaritySearch(userQuery, 5)
  const context = relevantDocs.map(doc => doc.pageContent).join("\n\n")

  // 5. Call OpenAI with Context
  const completion = await openai.chat.completions.create({
    model: "gpt-4-turbo-preview",
    messages: [
      { role: "system", content: systemPrompt },
      { 
        role: "user", 
        content: `Contexto do Contrato:\n${context}\n\nPergunta: ${userQuery}\n\nResponda em formato JSON estruturado com os campos: score (0-100), riskLevel (low, medium, high), summary (texto), and issues (array de objetos com id, severity, type, clause, originalText, suggestion, explanation).` 
      }
    ],
    response_format: { type: "json_object" }
  })

  return JSON.parse(completion.choices[0].message.content || "{}")
}
