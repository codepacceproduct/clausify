import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Simple Diff Implementation
function computeDiff(oldText: string, newText: string) {
  const oldLines = oldText.split(/\r?\n/)
  const newLines = newText.split(/\r?\n/)
  
  // This is a very naive diff. For production, use 'diff' package.
  // We will just do a simple line matching or use a basic LCS if needed.
  // For now, let's just return a structure that the frontend expects.
  
  // Since implementing a full Myers diff algorithm here is verbose, 
  // I'll implement a simplified version that checks for changed blocks.
  
  const changes = []
  let i = 0, j = 0
  
  while (i < oldLines.length || j < newLines.length) {
    const oldLine = oldLines[i]
    const newLine = newLines[j]
    
    if (oldLine === newLine) {
      changes.push({ type: "unchanged", lineNumber: { old: i + 1, new: j + 1 }, content: oldLine })
      i++
      j++
    } else {
      // Look ahead to see if we can find a match
      let matchFound = false
      // Look ahead in newLines
      for (let k = 1; k < 5 && j + k < newLines.length; k++) {
        if (oldLine === newLines[j + k]) {
           // Lines inserted
           for (let m = 0; m < k; m++) {
             changes.push({ type: "added", lineNumber: { new: j + 1 + m }, content: newLines[j + m] })
           }
           j += k
           matchFound = true
           break
        }
      }
      
      if (!matchFound) {
        // Look ahead in oldLines
        for (let k = 1; k < 5 && i + k < oldLines.length; k++) {
            if (oldLines[i + k] === newLine) {
                // Lines deleted
                for (let m = 0; m < k; m++) {
                    changes.push({ type: "removed", lineNumber: { old: i + 1 + m }, content: oldLines[i + m] })
                }
                i += k
                matchFound = true
                break
            }
        }
      }

      if (!matchFound) {
          // Both changed or just different
          if (i < oldLines.length) {
            changes.push({ type: "removed", lineNumber: { old: i + 1 }, content: oldLine })
            i++
          }
          if (j < newLines.length) {
            changes.push({ type: "added", lineNumber: { new: j + 1 }, content: newLine })
            j++
          }
      }
    }
  }
  
  return changes
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { version1Id, version2Id } = await request.json()

    if (!version1Id || !version2Id) {
        return NextResponse.json({ error: "Missing version IDs" }, { status: 400 })
    }

    // Fetch versions
    const { data: v1 } = await supabase.from("contract_versions").select("content, version_number").eq("id", version1Id).single()
    const { data: v2 } = await supabase.from("contract_versions").select("content, version_number").eq("id", version2Id).single()

    if (!v1 || !v2) {
        return NextResponse.json({ error: "Versions not found" }, { status: 404 })
    }

    const diff = computeDiff(v1.content || "", v2.content || "")
    
    return NextResponse.json({
        diff,
        v1: { name: `v${v1.version_number}` },
        v2: { name: `v${v2.version_number}` }
    })

  } catch (error: any) {
    console.error("Diff error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
