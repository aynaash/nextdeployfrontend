
import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "scripts/windows.ps1")
  const content = readFileSync(filePath, "utf-8")

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/x-powershell",
      "Content-Disposition": "inline; filename=windows.ps1",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  })
}
