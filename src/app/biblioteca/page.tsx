import { LibraryWorkspace } from "@/components/library-workspace";
import { PlatformShell } from "@/components/platform-shell";
import { getLibraryContributions } from "@/lib/data/library";
import { lessonDetails } from "@/lib/lesson-details";

export const dynamic = "force-dynamic";

export default async function LibraryPage() {
  const library = await getLibraryContributions();

  return (
    <PlatformShell activeHref="/biblioteca">
      <LibraryWorkspace
        initialContributions={library.contributions}
        lessons={lessonDetails}
        persistence={library.persistence}
      />
    </PlatformShell>
  );
}
