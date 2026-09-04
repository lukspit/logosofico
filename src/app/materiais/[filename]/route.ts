import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse } from "next/server";

import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

const allowedFilename = /^aula-0[1-6]-(aluno|professor)\.pdf$/;
const staffRoles = new Set(["teacher", "editor", "director", "admin"]);

type MaterialRouteProps = { params: Promise<{ filename: string }> };

export async function GET(request: Request, { params }: MaterialRouteProps) {
  const { filename } = await params;
  if (!allowedFilename.test(filename)) {
    return NextResponse.json({ error: "Material não encontrado." }, { status: 404 });
  }

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;
    if (!userId) {
      return NextResponse.json({ error: "Acesso não autorizado." }, { status: 401 });
    }

    const { data: memberships } = await supabase
      .from("memberships")
      .select("role")
      .eq("user_id", userId)
      .eq("is_active", true);
    if (!memberships?.length) {
      return NextResponse.json({ error: "Usuário sem vínculo ativo." }, { status: 403 });
    }

    if (
      filename.endsWith("-professor.pdf") &&
      !memberships.some(({ role }) => staffRoles.has(role))
    ) {
      return NextResponse.json({ error: "Material restrito à equipe pedagógica." }, { status: 403 });
    }
  }

  try {
    const filePath = path.join(process.cwd(), "content", "materials", filename);
    const fileStats = await stat(filePath);
    const download = new URL(request.url).searchParams.get("download") === "1";
    const range = request.headers.get("range");
    const disposition = `${download ? "attachment" : "inline"}; filename="${filename}"`;

    if (range && !download) {
      const match = /^bytes=(\d+)-(\d*)$/.exec(range);
      if (!match) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${fileStats.size}` },
        });
      }

      const start = Number(match[1]);
      const requestedEnd = match[2] ? Number(match[2]) : fileStats.size - 1;
      const end = Math.min(requestedEnd, fileStats.size - 1);
      if (start > end || start >= fileStats.size) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${fileStats.size}` },
        });
      }

      const stream = createReadStream(filePath, { start, end });
      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          "Accept-Ranges": "bytes",
          "Cache-Control": "private, max-age=300",
          "Content-Disposition": disposition,
          "Content-Length": String(end - start + 1),
          "Content-Range": `bytes ${start}-${end}/${fileStats.size}`,
          "Content-Type": "application/pdf",
          "X-Content-Type-Options": "nosniff",
        },
      });
    }

    const stream = createReadStream(filePath);
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        "Accept-Ranges": "bytes",
        "Content-Type": "application/pdf",
        "Content-Disposition": disposition,
        "Content-Length": String(fileStats.size),
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Material não encontrado." }, { status: 404 });
  }
}
