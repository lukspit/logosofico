"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  ExternalLink,
  FileSearch,
  ListTree,
  LoaderCircle,
  Menu,
  Minus,
  Plus,
  Printer,
  Search,
  X,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import type { PDFDocumentProxy } from "pdfjs-dist";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { MaterialManifest, MaterialSection } from "@/lib/material-reader";
import { cn } from "@/lib/utils";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

type SearchResult = { page: number; snippet: string };

function clampPage(page: number, total: number) {
  return Math.min(Math.max(Math.round(page || 1), 1), total);
}

function sectionForPage(sections: MaterialSection[], page: number) {
  return sections.find((section) => page >= section.startPage && page <= section.endPage) ?? sections[0];
}

function extractUrls(items: Array<unknown>) {
  const text = items
    .map((item) => item && typeof item === "object" && "str" in item ? String(item.str) : "")
    .join(" ");
  return Array.from(new Set(text.match(/https?:\/\/[^\s<>{}\[\]"']+/g) || []))
    .map((url) => url.replace(/[),.;:]+$/, ""))
    .filter((url) => url.length > 12)
    .slice(0, 8);
}

export function MaterialReader({ manifest, initialPage }: { manifest: MaterialManifest; initialPage: number }) {
  const [page, setPage] = useState(() => clampPage(initialPage, manifest.pageCount));
  const [numPages, setNumPages] = useState(manifest.pageCount);
  const [zoom, setZoom] = useState(1);
  const [containerWidth, setContainerWidth] = useState(760);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [references, setReferences] = useState<string[]>([]);
  const [mobileContents, setMobileContents] = useState(false);
  const documentRef = useRef<PDFDocumentProxy | null>(null);
  const pageContainerRef = useRef<HTMLDivElement | null>(null);
  const pdfUrl = `/materiais/${manifest.filename}`;
  const currentSection = sectionForPage(manifest.sections, page);

  useEffect(() => {
    const element = pageContainerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(Math.max(300, entry.contentRect.width));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return;
      if (event.key === "ArrowLeft") setPage((current) => clampPage(current - 1, numPages));
      if (event.key === "ArrowRight") setPage((current) => clampPage(current + 1, numPages));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [numPages]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("pagina", String(page));
    window.history.replaceState(null, "", url);
  }, [page]);

  const renderedWidth = useMemo(
    () => Math.min(Math.max(containerWidth - 32, 280), 860) * zoom,
    [containerWidth, zoom],
  );

  function goToPage(nextPage: number) {
    setPage(clampPage(nextPage, numPages));
    setReferences([]);
    setMobileContents(false);
  }

  function submitPage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    goToPage(Number(data.get("page")));
  }

  async function searchDocument(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    const pdf = documentRef.current;
    if (!pdf || normalizedQuery.length < 2) return;

    setSearching(true);
    const matches: SearchResult[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const pdfPage = await pdf.getPage(pageNumber);
      const content = await pdfPage.getTextContent();
      const text = content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" ")
        .replace(/\s+/g, " ");
      const matchIndex = text.toLocaleLowerCase("pt-BR").indexOf(normalizedQuery);
      if (matchIndex >= 0) {
        matches.push({
          page: pageNumber,
          snippet: text.slice(Math.max(0, matchIndex - 54), matchIndex + normalizedQuery.length + 94),
        });
      }
      if (matches.length >= 24) break;
    }
    setResults(matches);
    setSearching(false);
  }

  const contents = (
    <div className="space-y-1.5">
      {manifest.sections.map((section, index) => {
        const active = section.id === currentSection.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => goToPage(section.startPage)}
            className={cn(
              "w-full rounded-xl px-3 py-3 text-left transition",
              active ? "bg-[#e5f1dc] text-[#214c42]" : "text-[#617168] hover:bg-[#f0f3ef]",
            )}
          >
            <span className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold">{section.title}</span>
              <span className="text-[10px] tabular-nums opacity-60">{section.startPage}–{section.endPage}</span>
            </span>
            <span className="mt-1 block text-[10px] leading-relaxed opacity-70">{section.description}</span>
            {active && <span className="mt-2 block h-1 overflow-hidden rounded-full bg-[#cbdcc2]"><span className="block h-full bg-[#78a933]" style={{ width: `${Math.max(7, ((page - section.startPage + 1) / (section.endPage - section.startPage + 1)) * 100)}%` }} /></span>}
            <span className="sr-only">Seção {index + 1}</span>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e9eeea] text-[#173657]">
      <header className="sticky top-0 z-30 border-b border-[#d7ded8] bg-[#f9faf8]/95 backdrop-blur-xl">
        <div className="flex min-h-[72px] items-center gap-3 px-3 sm:px-5">
          <Button asChild variant="ghost" size="icon" className="shrink-0 rounded-xl"><Link href={`/aulas/${manifest.lessonSlug}`}><ArrowLeft className="size-[18px]" /><span className="sr-only">Voltar para a aula</span></Link></Button>
          <div className="min-w-0 border-l border-[#dbe1dc] pl-3">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.16em] text-[#17767a]">Aula {manifest.lessonNumber} · Caderno do {manifest.audience}</p>
            <h1 className="truncate font-serif text-base sm:text-lg">{manifest.lessonTitle}</h1>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <Button type="button" variant="outline" size="icon" className="rounded-xl bg-white lg:hidden" onClick={() => setMobileContents(true)}><Menu className="size-4" /><span className="sr-only">Abrir conteúdo</span></Button>
            <Button asChild variant="outline" size="icon" className="hidden rounded-xl bg-white sm:inline-flex"><a href={`${pdfUrl}?download=1`}><Download className="size-4" /><span className="sr-only">Baixar PDF original</span></a></Button>
            <Button asChild variant="outline" size="icon" className="hidden rounded-xl bg-white sm:inline-flex"><a href={pdfUrl} target="_blank" rel="noreferrer"><Printer className="size-4" /><span className="sr-only">Abrir para imprimir</span></a></Button>
          </div>
        </div>
      </header>

      {mobileContents && (
        <div className="fixed inset-0 z-50 bg-[#10263b]/35 backdrop-blur-sm lg:hidden" role="dialog" aria-modal="true" aria-label="Conteúdo do material">
          <div className="h-full w-[min(88vw,340px)] overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#17767a]">Mapa do material</p><p className="font-serif text-xl">Navegue por blocos</p></div><Button variant="ghost" size="icon" onClick={() => setMobileContents(false)}><X className="size-4" /></Button></div>
            {contents}
          </div>
        </div>
      )}

      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[270px_minmax(0,1fr)] xl:grid-cols-[270px_minmax(0,1fr)_286px]">
        <aside className="hidden border-r border-[#d8dfd9] bg-[#f8faf7] p-4 lg:block">
          <div className="sticky top-[88px]">
            <div className="mb-4 flex items-center gap-2 px-2"><ListTree className="size-4 text-[#17767a]" /><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#66766e]">Mapa do material</p></div>
            {contents}
          </div>
        </aside>

        <main className="min-w-0">
          <div className="sticky top-[72px] z-20 flex flex-wrap items-center justify-center gap-2 border-b border-[#d8dfd9] bg-[#eef2ed]/94 px-3 py-2 backdrop-blur-lg">
            <Button variant="ghost" size="icon" className="rounded-lg" disabled={page <= 1} onClick={() => goToPage(page - 1)}><ChevronLeft className="size-4" /><span className="sr-only">Página anterior</span></Button>
            <form onSubmit={submitPage} className="flex items-center gap-2 text-xs text-[#68776f]"><Input key={page} name="page" inputMode="numeric" defaultValue={page} className="h-8 w-14 rounded-lg bg-white px-2 text-center text-xs font-semibold tabular-nums" aria-label="Ir para página" /><span>de {numPages}</span></form>
            <Button variant="ghost" size="icon" className="rounded-lg" disabled={page >= numPages} onClick={() => goToPage(page + 1)}><ChevronRight className="size-4" /><span className="sr-only">Próxima página</span></Button>
            <div className="mx-1 h-5 w-px bg-[#cfd8d1]" />
            <Button variant="ghost" size="icon" className="rounded-lg" disabled={zoom <= 0.75} onClick={() => setZoom((value) => Math.max(0.75, value - 0.15))}><Minus className="size-3.5" /><span className="sr-only">Diminuir zoom</span></Button>
            <span className="w-10 text-center text-[10px] font-semibold tabular-nums text-[#627168]">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" className="rounded-lg" disabled={zoom >= 1.6} onClick={() => setZoom((value) => Math.min(1.6, value + 0.15))}><Plus className="size-3.5" /><span className="sr-only">Aumentar zoom</span></Button>
          </div>

          <div ref={pageContainerRef} className="min-h-[calc(100vh-120px)] overflow-auto px-3 py-6 sm:px-6 sm:py-8">
            <div className="mx-auto mb-3 flex max-w-[860px] items-center justify-between text-[10px] text-[#68786f]"><span className="font-semibold text-[#2f5f58]">{currentSection.title}</span><span>Página {page}</span></div>
            <Document
              file={pdfUrl}
              onLoadSuccess={(pdf) => { documentRef.current = pdf; setNumPages(pdf.numPages); }}
              loading={<div className="grid h-[60vh] place-items-center"><LoaderCircle className="size-7 animate-spin text-[#17767a]" /></div>}
              error={<div className="mx-auto max-w-md rounded-2xl bg-white p-8 text-center shadow-sm"><FileSearch className="mx-auto size-8 text-[#9b422e]" /><p className="mt-4 font-serif text-xl">Não foi possível abrir este material</p><p className="mt-2 text-xs text-[#748078]">Atualize a página ou confira seu vínculo com o colégio.</p></div>}
              className="flex justify-center"
            >
              <Page
                key={`${page}-${zoom}`}
                pageNumber={page}
                width={renderedWidth}
                renderTextLayer
                renderAnnotationLayer
                onGetTextSuccess={(content) => setReferences(extractUrls(content.items))}
                loading={<div className="h-[70vh] w-full max-w-[760px] animate-pulse rounded-lg bg-white/70" />}
                className="overflow-hidden rounded-md bg-white shadow-[0_18px_55px_rgba(30,51,65,0.16)]"
              />
            </Document>
            <div className="mx-auto mt-5 flex max-w-[860px] items-center justify-between">
              <Button variant="outline" className="rounded-xl bg-white" disabled={page <= 1} onClick={() => goToPage(page - 1)}><ChevronLeft className="size-4" />Anterior</Button>
              <span className="text-xs text-[#6a7971]">{page} / {numPages}</span>
              <Button className="rounded-xl bg-[#08366f]" disabled={page >= numPages} onClick={() => goToPage(page + 1)}>Próxima<ChevronRight className="size-4" /></Button>
            </div>

            <div className="mx-auto mt-6 max-w-[860px] rounded-2xl bg-white p-5 xl:hidden">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#17767a]">Referências desta página</p>
              {references.length ? <div className="mt-3 space-y-2">{references.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer" className="flex items-start gap-2 break-all text-xs text-[#185b78] hover:underline"><ExternalLink className="mt-0.5 size-3.5 shrink-0" />{url}</a>)}</div> : <p className="mt-2 text-xs leading-relaxed text-[#7a8780]">Nenhum endereço foi detectado nesta página.</p>}
            </div>
          </div>
        </main>

        <aside className="hidden border-l border-[#d8dfd9] bg-[#f8faf7] p-4 xl:block">
          <div className="sticky top-[88px] space-y-5">
            <div>
              <div className="mb-3 flex items-center gap-2 px-1"><Search className="size-4 text-[#17767a]" /><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#66766e]">Buscar no caderno</p></div>
              <form onSubmit={searchDocument} className="flex gap-2"><Input value={query} onChange={(event) => setQuery(event.target.value)} minLength={2} placeholder="Ex.: alimentação" className="h-9 rounded-xl bg-white text-xs" /><Button type="submit" size="icon" className="size-9 shrink-0 rounded-xl bg-[#08366f]" disabled={searching}>{searching ? <LoaderCircle className="size-4 animate-spin" /> : <Search className="size-4" />}<span className="sr-only">Buscar no material</span></Button></form>
              {results.length > 0 && <div className="mt-3 max-h-72 space-y-2 overflow-y-auto">{results.map((result) => <button key={`${result.page}-${result.snippet}`} type="button" onClick={() => goToPage(result.page)} className="w-full rounded-xl bg-white p-3 text-left shadow-sm"><span className="text-[10px] font-semibold text-[#17767a]">Página {result.page}</span><span className="mt-1 block text-[10px] leading-relaxed text-[#66756d]">…{result.snippet}…</span></button>)}</div>}
              {!searching && query.length >= 2 && results.length === 0 && <p className="mt-3 text-[10px] leading-relaxed text-[#7b8780]">Faça a busca para encontrar ocorrências em todas as páginas.</p>}
            </div>
            <div className="border-t border-[#e0e5e1] pt-5">
              <div className="mb-3 flex items-center gap-2 px-1"><ExternalLink className="size-4 text-[#17767a]" /><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#66766e]">Referências da página</p></div>
              {references.length ? <div className="space-y-2">{references.map((url) => <a key={url} href={url} target="_blank" rel="noreferrer" className="block rounded-xl bg-white p-3 text-[10px] leading-relaxed break-all text-[#185b78] shadow-sm hover:underline">{url}<ExternalLink className="ml-1 inline size-3" /></a>)}</div> : <p className="rounded-xl bg-[#eef2ed] p-3 text-[10px] leading-relaxed text-[#738078]">Quando uma página tiver endereços escritos, eles aparecem aqui como links acessíveis.</p>}
            </div>
            <div className="border-t border-[#e0e5e1] pt-5"><p className="text-[10px] leading-relaxed text-[#77847d]">Você está lendo uma camada navegável. O PDF original permanece preservado para download e impressão.</p></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
