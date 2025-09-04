
import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import path from "path"

export async function GET() {
  const filePath = path.join(process.cwd(), "scripts/mac-cli.sh")
  const content = readFileSync(filePath, "utf-8")

  return new NextResponse(content, {
    headers: {
      "Content-Type": "application/x-sh",
      "Content-Disposition": "inline; filename=mac-cli.sh",
      "Cache-Control": "public, max-age=3600, immutable",
    },
  })
}
