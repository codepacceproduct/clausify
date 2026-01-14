import crypto from "crypto"

// Constants
const DATAJUD_API_KEY = "APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw=="

// Mapping based on J.TR code
const COURT_ALIASES: Record<string, string> = {
  // Justiça Federal (J=4)
  "4.01": "trf1", "4.02": "trf2", "4.03": "trf3", "4.04": "trf4", "4.05": "trf5", "4.06": "trf6",
  
  // Justiça do Trabalho (J=5)
  "5.01": "trt1", "5.02": "trt2", "5.03": "trt3", "5.04": "trt4", "5.05": "trt5",
  "5.06": "trt6", "5.07": "trt7", "5.08": "trt8", "5.09": "trt9", "5.10": "trt10",
  "5.11": "trt11", "5.12": "trt12", "5.13": "trt13", "5.14": "trt14", "5.15": "trt15",
  "5.16": "trt16", "5.17": "trt17", "5.18": "trt18", "5.19": "trt19", "5.20": "trt20",
  "5.21": "trt21", "5.22": "trt22", "5.23": "trt23", "5.24": "trt24",

  // Justiça Estadual (J=8)
  "8.01": "tjac", "8.02": "tjal", "8.03": "tjap", "8.04": "tjam", "8.05": "tjba",
  "8.06": "tjce", "8.07": "tjdft", "8.08": "tjes", "8.09": "tjgo", "8.10": "tjma",
  "8.11": "tjmt", "8.12": "tjms", "8.13": "tjmg", "8.14": "tjpa", "8.15": "tjpb",
  "8.16": "tjpr", "8.17": "tjpe", "8.18": "tjpi", "8.19": "tjrj", "8.20": "tjrn",
  "8.21": "tjrs", "8.22": "tjro", "8.23": "tjrr", "8.24": "tjsc", "8.25": "tjse",
  "8.26": "tjsp", "8.27": "tjto",

  // Superiores
  "stj": "stj", "tst": "tst", "tse": "tse", "stm": "stm"
}

export interface DataJudProcess {
  numeroProcesso: string
  classe: {
    codigo: number
    nome: string
  }
  sistema?: {
    nome: string
  }
  tribunal?: string
  dataAjuizamento: string
  movimentos: Array<{
    dataHora: string
    nome: string
    codigo: number
    complementosTabelados?: Array<{
      descricao: string
    }>
  }>
}

export interface DataJudResponse {
  hits: {
    hits: Array<{
      _source: DataJudProcess
    }>
  }
}

export class DataJudClient {
  private static getApiUrl(processNumber: string): string {
    const clean = processNumber.replace(/\D/g, "")
    
    // If not a full CNJ number, default to TJSP as requested by user or common default
    if (clean.length !== 20) {
      return "https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search"
    }

    const j = clean.substring(13, 14)
    const tr = clean.substring(14, 16)
    const key = `${j}.${tr}`
    
    const alias = COURT_ALIASES[key]
    
    if (alias) {
      return `https://api-publica.datajud.cnj.jus.br/api_publica_${alias}/_search`
    }
    
    // Fallback
    return "https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search"
  }

  static async consultProcess(cnjNumber: string): Promise<DataJudProcess | null> {
    const cleanTerm = cnjNumber.replace(/\D/g, "")
    const apiUrl = this.getApiUrl(cleanTerm)
    
    const payload = {
      query: {
        match: {
          numeroProcesso: cleanTerm
        }
      }
    }

    return this.executeSearch(apiUrl, payload)
  }

  static async consultByCpf(cpf: string, tribunal: string = "tjse"): Promise<DataJudProcess[]> {
    const cleanCpf = cpf.replace(/\D/g, "")
    // Ensure we use the specific tribunal endpoint if provided, otherwise default logic (though for CPF we need a target)
    // User requested TJSE specifically for CPF, so default is tjse.
    const apiUrl = `https://api-publica.datajud.cnj.jus.br/api_publica_${tribunal}/_search`

    const payload = {
      query: {
        bool: {
          should: [
            { match: { "dadosBasicos.poloAtivo.parte.pessoa.numeroDocumentoPrincipal": cleanCpf } },
            { match: { "dadosBasicos.poloPassivo.parte.pessoa.numeroDocumentoPrincipal": cleanCpf } }
          ]
        }
      },
      sort: [{ "dataAjuizamento": { "order": "desc" } }],
      size: 20
    }

    const results = await this.executeSearchList(apiUrl, payload)
    return results
  }

  private static async executeSearch(url: string, payload: any): Promise<DataJudProcess | null> {
    const start = Date.now()
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": DATAJUD_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error(`DataJud API Error (${response.status}):`, await response.text())
        return null
      }

      const data = await response.json() as DataJudResponse
      
      if (data.hits.hits.length > 0) {
        return data.hits.hits[0]._source
      }
      
      return null
    } catch (error) {
      console.error("DataJud Client Error:", error)
      return null
    }
  }

  private static async executeSearchList(url: string, payload: any): Promise<DataJudProcess[]> {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Authorization": DATAJUD_API_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        console.error(`DataJud API Error (${response.status}):`, await response.text())
        return []
      }

      const data = await response.json() as DataJudResponse
      return data.hits.hits.map(h => h._source)
    } catch (error) {
      console.error("DataJud Client Error:", error)
      return []
    }
  }

  static generateMovementHash(date: string, description: string, details: string = ""): string {
    const content = `${date}|${description}|${details}`
    return crypto.createHash('sha256').update(content).digest('hex')
  }
}
