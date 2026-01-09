import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import mammoth from "mammoth"

// Helper to load pdf-parse safely
async function parsePDF(buffer: Buffer): Promise<string> {
    try {
        // Dynamic import to handle the ESM/CJS nature of the library
        const module = await import("pdf-parse");
        
        // Handle v2.x (Class based) vs v1.x (Function based)
        // Based on recent debugging, it is v2.x which exports a PDFParse class
        if (module.PDFParse) {
            const parser = new module.PDFParse();
            // Assuming the API is load() -> getText() based on prototype inspection
            // Use 'any' to avoid TS errors since we don't have types for this specific version
            await (parser as any).load(buffer);
            const text = await (parser as any).getText();
            return text;
        } else if (typeof module.default === 'function') {
            // Fallback for v1.x
            const data = await module.default(buffer);
            return data.text;
        } else {
            console.error("Unknown pdf-parse export structure:", Object.keys(module));
            return "";
        }
    } catch (e) {
        console.error("PDF Parse error:", e);
        return "";
    }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string
    const clientName = formData.get("clientName") as string
    const notes = formData.get("notes") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        return NextResponse.json({ error: "Unauthorized: Please log in to upload contracts." }, { status: 401 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 2. Extract Text
    let content = ""
    console.log(`Processing upload: ${file.name} (${file.type})`)

    try {
        const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
        const isDOCX = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.toLowerCase().endsWith(".docx")
        const isTXT = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")

        if (isPDF) {
            content = await parsePDF(buffer)
        } else if (isDOCX) {
            const result = await mammoth.extractRawText({ buffer: buffer })
            content = result.value
        } else if (isTXT) {
            // Try UTF-8 first
            const utf8 = buffer.toString("utf-8");
            // Check for excessive replacement characters (\uFFFD) indicating encoding mismatch
            const replacementCount = (utf8.match(/\uFFFD/g) || []).length;
            if (replacementCount > 0 && replacementCount > (utf8.length * 0.01)) { 
                // If > 1% errors, try latin1 (common for legacy docs in Brazil)
                content = buffer.toString("latin1");
            } else {
                content = utf8;
            }
        } else {
            // Fallback logic
            content = buffer.toString("utf-8") 
        }
    } catch (e) {
        console.error("Extraction error:", e)
    }

    if (!content || content.trim().length < 10) {
        content = `[ERRO DE LEITURA DO ARQUIVO]
O sistema não conseguiu extrair o texto deste documento. Motivos prováveis:
1. O arquivo é um PDF digitalizado (imagem) e não contém texto selecionável.
2. O arquivo está corrompido ou protegido.
3. O formato DOCX/PDF possui formatação complexa não suportada.

A Análise de IA requer texto legível. Por favor, faça upload de um arquivo DOCX ou PDF com texto selecionável.`
    }

    // 3. Save Metadata to DB
    const { data: contract, error: dbError } = await supabase
        .from("contracts")
        .insert({
            user_id: user?.id,
            name: file.name,
            type,
            client_name: clientName,
            content, // Storing full text for RAG later
            status: "uploaded",
            notes
        })
        .select()
        .single()

    // If table doesn't exist or insert failed, throw error to avoid mock data
    if (dbError) {
        console.error("Database error during contract upload:", dbError)
        throw new Error("Failed to save contract to database: " + dbError.message)
    }

    return NextResponse.json({ success: true, contract })

  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
