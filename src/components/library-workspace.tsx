"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpenText,
  Check,
  ExternalLink,
  FileText,
  Filter,
  Link2,
  Play,
  Search,
  SlidersHorizontal,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { LibraryContribution, LibraryContributionKind } from "@/lib/data/library";
import { getReaderHref } from "@/lib/material-reader";

type LessonSummary = {
  number: number;
  slug: string;
  studentPages: number;
  studentPdf: string;
  teacherPages: number;
  teacherPdf: string;
  title: string;
};

type LibraryWorkspaceProps = {
  initialContributions: LibraryContribution[];
  lessons: LessonSummary[];
  persistence: "local" | "supabase";
};

const storageKey = "logosofico:biblioteca:contribuicoes";
const filters = ["Todos", "Cadernos", "Vídeos", "Para imprimir", "Contribuições", "Em revisão"];

function normalized(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function validWebUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function LibraryWorkspace({ initialContributions, lessons, persistence }: LibraryWorkspaceProps) {
  const [contributions, setContributions] = useState<LibraryContribution[]>(initialContributions);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("Todos");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [kind, setKind] = useState<LibraryContributionKind>("Vídeo");
  const [lessonSlug, setLessonSlug] = useState("none");
  const [formError, setFormError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (persistence !== "local") return;
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as LibraryContribution[];
      const safeContributions = parsed.filter(
        (item) => item.id && item.title && item.url && validWebUrl(item.url),
      );
      const timeout = window.setTimeout(() => setContributions(safeContributions), 0);
      return () => window.clearTimeout(timeout);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, [persistence]);

  const officialResources = useMemo(
    () => lessons.flatMap((lesson) => [
      { ...lesson, kind: "Professor", pages: lesson.teacherPages, href: lesson.teacherPdf, accent: "#e5eff7" },
      { ...lesson, kind: "Aluno", pages: lesson.studentPages, href: lesson.studentPdf, accent: "#ebf3df" },
    ]),
    [lessons],
  );

  const visibleOfficial = officialResources.filter((resource) => {
    if (!["Todos", "Cadernos"].includes(activeFilter)) return false;
    return normalized(`${resource.title} aula ${resource.number} ${resource.kind}`).includes(normalized(query));
  });

  const visibleContributions = contributions.filter((contribution) => {
    const matchesFilter =
      activeFilter === "Todos" ||
      activeFilter === "Contribuições" ||
      activeFilter === "Em revisão" ||
      activeFilter === contribution.kind ||
      (activeFilter === "Vídeos" && contribution.kind === "Vídeo");
    if (!matchesFilter) return false;
    const lesson = lessons.find((item) => item.slug === contribution.lessonSlug);
    return normalized(`${contribution.title} ${contribution.description} ${contribution.kind} ${lesson?.title || ""}`).includes(normalized(query));
  });

  const totalVisible = visibleOfficial.length + visibleContributions.length;

  function resetForm() {
    setTitle("");
    setUrl("");
    setDescription("");
    setKind("Vídeo");
    setLessonSlug("none");
    setFormError("");
  }

  async function saveContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanTitle = title.trim();
    const cleanUrl = url.trim();
    if (cleanTitle.length < 3) {
      setFormError("Dê um título curto para o material.");
      return;
    }
    if (!validWebUrl(cleanUrl)) {
      setFormError("Cole um link completo, começando com http:// ou https://.");
      return;
    }

    setSaving(true);
    setFormError("");
    const draftContribution: LibraryContribution = {
      authorName: "Marina Costa",
      createdAt: new Date().toISOString(),
      description: description.trim(),
      id: crypto.randomUUID(),
      kind,
      lessonSlug: lessonSlug === "none" ? "" : lessonSlug,
      title: cleanTitle,
      url: cleanUrl,
    };
    let contribution = draftContribution;
    if (persistence === "supabase") {
      try {
        const response = await fetch("/api/biblioteca/contribuicoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draftContribution),
        });
        const data = (await response.json()) as { contribution?: LibraryContribution; error?: string };
        if (!response.ok || !data.contribution) {
          throw new Error(data.error || "Não foi possível salvar o material no acervo.");
        }
        contribution = data.contribution;
      } catch (error) {
        setFormError(error instanceof Error ? error.message : "Não foi possível salvar o material no acervo.");
        setSaving(false);
        return;
      }
    }

    const next = [contribution, ...contributions];
    setContributions(next);
    if (persistence === "local") window.localStorage.setItem(storageKey, JSON.stringify(next));
    setActiveFilter("Contribuições");
    setQuery("");
    setSavedMessage(`“${cleanTitle}” foi adicionado às contribuições.`);
    setDialogOpen(false);
    setSaving(false);
    resetForm();
    window.requestAnimationFrame(() => {
      document.getElementById("contribuicoes-professores")?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

  return (
    <>
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#17767a]">Acervo vivo</p><h1 className="mt-1 font-serif text-4xl tracking-[-0.025em] text-[#173657] sm:text-5xl">Biblioteca pedagógica</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6f7c75]">Encontre materiais oficiais, referências curadas e contribuições construídas pelos professores.</p></div>
        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setFormError(""); }}>
          <DialogTrigger asChild><Button className="self-start rounded-xl bg-[#0b407e]"><FileText className="size-4" />Sugerir um material</Button></DialogTrigger>
          <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto p-0 sm:max-w-xl">
            <form onSubmit={saveContribution}>
              <DialogHeader className="border-b border-[#e5ebe6] px-6 py-5 pr-14">
                <div className="grid size-10 place-items-center rounded-xl bg-[#e5eff7] text-[#22577e]"><Link2 className="size-5" /></div>
                <DialogTitle className="font-serif text-2xl font-normal text-[#173657]">Sugerir um material</DialogTitle>
                <DialogDescription className="leading-relaxed">Compartilhe uma referência com os professores. Se fizer sentido, conecte-a a uma aula específica.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-5 px-6 py-5">
                <div className="grid gap-2"><Label htmlFor="contribution-title">Título</Label><Input id="contribution-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Como as cidades crescem" autoFocus /></div>
                <div className="grid gap-2"><Label htmlFor="contribution-url">Link do material</Label><Input id="contribution-url" type="url" value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://youtube.com/..." /></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-2"><Label>Tipo de material</Label><Select value={kind} onValueChange={(value) => setKind(value as LibraryContributionKind)}><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Vídeo">Vídeo</SelectItem><SelectItem value="Site">Site ou artigo</SelectItem><SelectItem value="Atividade">Atividade</SelectItem><SelectItem value="Para imprimir">Para imprimir</SelectItem></SelectContent></Select></div>
                  <div className="grid gap-2"><Label>Vincular a uma aula <span className="font-normal text-[#7b8881]">(opcional)</span></Label><Select value={lessonSlug} onValueChange={setLessonSlug}><SelectTrigger className="h-10 w-full"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">Biblioteca geral</SelectItem>{lessons.map((lesson) => <SelectItem key={lesson.slug} value={lesson.slug}>Aula {lesson.number} · {lesson.title}</SelectItem>)}</SelectContent></Select></div>
                </div>
                <div className="grid gap-2"><Label htmlFor="contribution-description">Por que vale compartilhar? <span className="font-normal text-[#7b8881]">(opcional)</span></Label><Textarea id="contribution-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Conte em uma frase como este material pode ajudar na aula." className="min-h-24 resize-none" /></div>
                <div className="rounded-xl bg-[#f2f6f2] px-4 py-3 text-xs leading-relaxed text-[#68776f]">{persistence === "supabase" ? "O material será salvo no acervo da escola como “Em revisão” e ficará visível para a equipe pedagógica." : "Modo local: esta contribuição ficará salva somente neste navegador até a conexão com o banco estar disponível."}</div>
                {formError ? <p role="alert" className="text-xs font-medium text-[#9b422e]">{formError}</p> : null}
              </div>
              <DialogFooter className="m-0 rounded-none px-6 py-4"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancelar</Button><Button type="submit" className="bg-[#0b407e]" disabled={saving}>{saving ? "Salvando…" : "Adicionar à biblioteca"}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </section>

      <Card className="mt-7 border-[#dfe6df] bg-white py-0"><CardContent className="p-4 sm:p-5"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#7b8881]" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque por tema, aula, área ou tipo de material" className="h-11 rounded-xl bg-[#f8faf7] pl-10" /></div><Button variant="outline" className="h-11 rounded-xl"><SlidersHorizontal className="size-4" />Filtros</Button></div><div className="mt-4 flex flex-wrap gap-2">{filters.map((item) => <button key={item} type="button" onClick={() => setActiveFilter(item)} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${activeFilter === item ? "bg-[#08366f] text-white" : "bg-[#f1f4ef] text-[#69766f]"}`}>{item}</button>)}</div></CardContent></Card>

      {savedMessage ? <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#d9e8d0] bg-[#f2f7ec] px-4 py-3 text-xs text-[#55713c]"><Check className="size-4" />{savedMessage}<button type="button" className="ml-auto font-medium" onClick={() => setSavedMessage("")}>Fechar</button></div> : null}

      {visibleContributions.length > 0 ? (
        <section id="contribuicoes-professores" className="mt-8">
          <div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#17767a]">Construído em conjunto</p><h2 className="mt-1 font-serif text-2xl text-[#173657]">Contribuições dos professores</h2></div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {visibleContributions.map((contribution) => {
              const linkedLesson = lessons.find((lesson) => lesson.slug === contribution.lessonSlug);
              return <Card key={contribution.id} className="border-[#dfe6df] bg-white py-0"><CardContent className="p-5"><div className="flex items-start justify-between gap-3"><div className="grid size-11 place-items-center rounded-xl bg-[#e5f1ef] text-[#176f78]">{contribution.kind === "Vídeo" ? <Play className="size-5" /> : <Link2 className="size-5" />}</div><Badge variant="secondary" className="bg-[#f3f5f1] text-[10px] text-[#69766f]">Em revisão</Badge></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#76837c]">{contribution.kind}{linkedLesson ? ` · Aula ${linkedLesson.number}` : " · Biblioteca geral"}</p><h3 className="mt-1 font-serif text-xl leading-tight text-[#173657]">{contribution.title}</h3>{contribution.description ? <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[#6f7c75]">{contribution.description}</p> : null}<p className="mt-3 text-[10px] text-[#7b8881]">Sugerido por {contribution.authorName}{persistence === "local" ? " · salvo neste navegador" : ""}</p><div className="mt-5 flex items-center justify-between border-t border-[#edf0ec] pt-4">{linkedLesson ? <Button asChild variant="link" className="h-auto p-0 text-xs text-[#176f78]"><Link href={`/aulas/${linkedLesson.slug}/preparacao`}>Ver na aula</Link></Button> : <span className="text-[10px] text-[#7b8881]">Contribuição independente</span>}<Button asChild variant="ghost" size="icon" className="size-8 rounded-lg"><a href={contribution.url} target="_blank" rel="noreferrer"><ExternalLink className="size-4" /><span className="sr-only">Abrir {contribution.title}</span></a></Button></div></CardContent></Card>;
            })}
          </div>
        </section>
      ) : null}

      <div className="mt-8 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#75817b]">{totalVisible} {totalVisible === 1 ? "material encontrado" : "materiais encontrados"}</p><h2 className="mt-1 font-serif text-2xl text-[#173657]">{activeFilter === "Contribuições" || activeFilter === "Em revisão" ? "Contribuições da biblioteca" : "Materiais oficiais do 5º ano"}</h2></div><Button variant="ghost" size="sm" className="hidden rounded-xl sm:flex"><Filter className="size-4" />Mais recentes</Button></div>
      {visibleOfficial.length > 0 ? <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleOfficial.map((resource) => <Card key={`${resource.slug}-${resource.kind}`} className="group border-[#dfe6df] bg-white py-0 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(27,52,75,0.08)]"><CardContent className="p-5"><div className="flex items-start justify-between"><div className="grid size-11 place-items-center rounded-xl text-[#315c7c]" style={{ backgroundColor: resource.accent }}>{resource.kind === "Professor" ? <BookOpenText className="size-5" /> : <FileText className="size-5" />}</div><Badge variant="secondary" className="bg-[#f3f5f1] text-[10px] text-[#69766f]">{resource.kind}</Badge></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#76837c]">Aula {resource.number}</p><h3 className="mt-1 min-h-12 font-serif text-xl leading-tight text-[#173657]">{resource.title}</h3><p className="mt-3 text-xs text-[#7a8680]">Leitor Kinesis · {resource.pages} páginas</p><div className="mt-5 flex items-center justify-between border-t border-[#edf0ec] pt-4"><span className="text-[10px] text-[#7b8881]">Navegação por blocos</span><Button asChild variant="ghost" size="icon" className="size-8 rounded-lg"><Link href={getReaderHref(resource.href)}><ArrowUpRight className="size-4" /><span className="sr-only">Ler material na plataforma</span></Link></Button></div></CardContent></Card>)}</div> : null}
      {totalVisible === 0 ? <div className="mt-4 rounded-2xl border border-dashed border-[#d8e1db] bg-white px-6 py-12 text-center"><Search className="mx-auto size-6 text-[#7d8b84]" /><p className="mt-3 font-serif text-xl text-[#173657]">Nenhum material encontrado</p><p className="mt-1 text-xs text-[#748078]">Tente outro termo ou escolha uma categoria diferente.</p></div> : null}
    </>
  );
}
