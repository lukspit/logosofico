import { notFound } from "next/navigation";

import { MaterialReaderLoader } from "@/components/material-reader-loader";
import { getMaterialManifest } from "@/lib/material-reader";
import { createClient, hasSupabaseEnv } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const staffRoles = new Set(["teacher", "editor", "director", "admin"]);

type ReaderPageProps = {
  params: Promise<{ filename: string }>;
  searchParams: Promise<{ pagina?: string }>;
};

export default async function ReaderPage({ params, searchParams }: ReaderPageProps) {
  const [{ filename }, query] = await Promise.all([params, searchParams]);
  const manifest = getMaterialManifest(filename);
  if (!manifest) notFound();

  if (hasSupabaseEnv()) {
    const supabase = await createClient();
    const { data: claimsData } = await supabase.auth.getClaims();
    const userId = claimsData?.claims?.sub;
    if (!userId) notFound();

    const { data: memberships } = await supabase
      .from("memberships")
      .select("role")
      .eq("user_id", userId)
      .eq("is_active", true);

    if (!memberships?.length) notFound();
    if (manifest.audience === "professor" && !memberships.some(({ role }) => staffRoles.has(role))) notFound();
  }

  const requestedPage = Number.parseInt(query.pagina || "1", 10);
  const initialPage = Number.isFinite(requestedPage)
    ? Math.min(Math.max(requestedPage, 1), manifest.pageCount)
    : 1;

  return <MaterialReaderLoader manifest={manifest} initialPage={initialPage} />;
}
