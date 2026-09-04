import { NextResponse } from "next/server";
import { z } from "zod";

import { createClient } from "@/lib/supabase/server";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "text/plain",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
]);

function safeFileName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(-180) || "arquivo";
}

export async function POST(
  request: Request,
  context: RouteContext<"/api/preparacoes/[id]/arquivos">,
) {
  const { id } = await context.params;
  if (!z.uuid().safeParse(id).success) {
    return NextResponse.json({ error: "Preparação inválida." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub;
  if (!userId) {
    return NextResponse.json({ error: "Sua sessão expirou." }, { status: 401 });
  }

  const { data: preparation } = await supabase
    .from("lesson_preparations")
    .select("id")
    .eq("id", id)
    .eq("author_id", userId)
    .single();
  if (!preparation) {
    return NextResponse.json({ error: "Acesso insuficiente." }, { status: 403 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Escolha um arquivo para anexar." }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "O arquivo pode ter no máximo 20 MB." }, { status: 400 });
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "Este formato de arquivo não é aceito." }, { status: 400 });
  }

  const storagePath = `${userId}/${id}/${crypto.randomUUID()}-${safeFileName(file.name)}`;
  const { error: uploadError } = await supabase.storage
    .from("preparation-files")
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) {
    return NextResponse.json({ error: "Não foi possível enviar o arquivo." }, { status: 500 });
  }

  const { data: attachment, error: metadataError } = await supabase
    .from("preparation_attachments")
    .insert({
      preparation_id: id,
      author_id: userId,
      file_name: file.name,
      storage_path: storagePath,
      mime_type: file.type,
      size_bytes: file.size,
    })
    .select("id, file_name, mime_type, size_bytes")
    .single();

  if (metadataError || !attachment) {
    await supabase.storage.from("preparation-files").remove([storagePath]);
    return NextResponse.json({ error: "Não foi possível registrar o anexo." }, { status: 500 });
  }

  const { data: signed } = await supabase.storage
    .from("preparation-files")
    .createSignedUrl(storagePath, 60 * 60);

  return NextResponse.json({
    attachment: {
      id: attachment.id,
      fileName: attachment.file_name,
      mimeType: attachment.mime_type,
      sizeBytes: attachment.size_bytes,
      url: signed?.signedUrl || null,
    },
  });
}
