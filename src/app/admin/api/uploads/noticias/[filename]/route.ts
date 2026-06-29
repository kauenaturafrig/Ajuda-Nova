//src/app/api/uploads/noticias/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile, access } from "fs/promises";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  console.log("POST /admin/api/noticias recebeu requisição");
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    const filePath = path.join(
      process.cwd(),
      "storage",
      "uploads",
      "noticias",
      filename
    );

    await access(filePath);

    const file = await readFile(filePath);
    const ext = filename.split(".").pop()?.toLowerCase() || "jpg";

    const contentTypeMap: Record<string, string> = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
      gif: "image/gif",
      svg: "image/svg+xml",
    };

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentTypeMap[ext] || "application/octet-stream",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (err) {
    console.error("IMG ERROR:", err);
    return NextResponse.json({ error: "Imagem não encontrada" }, { status: 404 });
  }
}