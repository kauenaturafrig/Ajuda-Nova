//src/app/api/uploads/recados/[filename]/route.ts
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile, access } from "fs/promises";

export const dynamic = "force-dynamic";

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
      "recados",
      filename
    );

    console.log("GET /admin/api/uploads/recados chamado");
    console.log("filename:", filename);
    console.log("IMG PATH:", filePath);

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