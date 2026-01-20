import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import mammoth from "mammoth"
import WordExtractor from "word-extractor"
import crypto from 'crypto'

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

    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")
    if (isPDF) {
        return NextResponse.json({ 
            error: "Formato PDF não é mais suportado. Por favor, envie arquivos DOCX ou TXT." 
        }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Check for OLE Binary Header (Legacy .doc) which starts with D0 CF 11 E0
    const isDoc = buffer.length > 4 && buffer[0] === 0xD0 && buffer[1] === 0xCF && buffer[2] === 0x11 && buffer[3] === 0xE0;

    // Calculate file hash for deduplication/caching
    const fileHash = crypto.createHash('md5').update(buffer).digest('hex');

    // 2. Extract Text
    let content = ""
    console.log(`Processing upload: ${file.name} (${file.type})`)
    const startTime = Date.now();

    // Check if we already processed this file
    try {
        const { data: existingContract } = await supabase
            .from('contracts')
            .select('content')
            .eq('file_hash', fileHash)
            .not('content', 'is', null)
            .limit(1)
            .maybeSingle();

        if (existingContract?.content && existingContract.content.length > 10) {
            console.log(`Cache hit! Found existing content for hash ${fileHash}`);
            content = existingContract.content;
        }
    } catch (e) {
        console.warn("Cache check failed:", e);
    }

    if (!content) {
        try {
            const isDOCX = file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || file.name.toLowerCase().endsWith(".docx")
            const isTXT = file.type === "text/plain" || file.name.toLowerCase().endsWith(".txt")

            if (isDoc) {
                console.time("DOC Parsing");
                const extractor = new WordExtractor();
                const extracted = await extractor.extract(buffer);
                content = extracted.getBody();
                console.timeEnd("DOC Parsing");
            } else if (isDOCX) {
                console.time("DOCX Parsing");
                const result = await mammoth.extractRawText({ buffer: buffer })
                content = result.value
                console.timeEnd("DOCX Parsing");
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
                // Reject unknown types explicitly to prevent garbage text
                 throw new Error("Tipo de arquivo não suportado. Apenas DOC, DOCX e TXT são permitidos.")
            }
        } catch (e: any) {
            console.error("Extraction error:", e)
            return NextResponse.json({ error: e.message || "Erro ao ler arquivo" }, { status: 400 })
        }
    }
    
    console.log(`Text extraction took ${Date.now() - startTime}ms`);

    if (!content || content.trim().length < 10) {
        // Only return specific error if we really have no content
        content = `[ERRO DE LEITURA DO ARQUIVO]
O sistema não conseguiu extrair o texto deste documento. Motivos prováveis:
1. O arquivo está corrompido ou protegido.
2. O formato DOCX possui formatação complexa não suportada.
3. O arquivo está vazio.`
    }

    // Sanitize content to remove null bytes which Postgres doesn't support
    // and other potential issues
    content = content.replace(/\u0000/g, "").replace(/\\u0000/g, "");

    // 3. Save Metadata to DB
    const { data: contract, error: dbError } = await supabase
        .from("contracts")
        .insert({
            user_id: user?.id,
            name: file.name,
            type,
            client_name: clientName,
            content, // Storing full text for RAG later
            file_hash: fileHash,
            status: "uploaded",
            notes,
            current_version: 1
        })
        .select()
        .single()

    // If table doesn't exist or insert failed, throw error to avoid mock data
    if (dbError) {
        console.error("Database error during contract upload:", dbError)
        throw new Error("Failed to save contract to database: " + dbError.message)
    }

    // 4. Create Initial Version
    const { error: versionError } = await supabase
        .from("contract_versions")
        .insert({
            contract_id: contract.id,
            version_number: 1,
            content,
            changes_summary: "Versão inicial (Upload)",
            status: "uploaded",
            created_by: user?.id
        })

    if (versionError) {
        console.error("Error creating initial version:", versionError)
        // We don't throw here to avoid failing the whole upload if versioning fails
    }

    return NextResponse.json({ success: true, contract })

  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 })
  }
}
