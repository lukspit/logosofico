"use client";

import dynamic from "next/dynamic";

import type { MaterialManifest } from "@/lib/material-reader";

const MaterialReader = dynamic(
  () => import("@/components/material-reader").then((module) => module.MaterialReader),
  {
    ssr: false,
    loading: () => (
      <div className="grid min-h-[70vh] place-items-center bg-[#edf1ec]">
        <div className="text-center">
          <div className="mx-auto size-9 animate-pulse rounded-xl bg-[#9fcf35]" />
          <p className="mt-4 text-sm font-medium text-[#53655c]">Preparando o material…</p>
        </div>
      </div>
    ),
  },
);

export function MaterialReaderLoader({ manifest, initialPage }: { manifest: MaterialManifest; initialPage: number }) {
  return <MaterialReader manifest={manifest} initialPage={initialPage} />;
}
