import Link from "next/link";
import { ArrowUpRight, BookOpenText, FileText, Filter, Search, SlidersHorizontal } from "lucide-react";

import { PlatformShell } from "@/components/platform-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { lessonDetails } from "@/lib/lesson-details";
import { getReaderHref } from "@/lib/material-reader";

export default function LibraryPage() {
  return (
    <PlatformShell activeHref="/biblioteca">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#17767a]">Acervo vivo</p><h1 className="mt-1 font-serif text-4xl tracking-[-0.025em] text-[#173657] sm:text-5xl">Biblioteca pedagógica</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6f7c75]">Encontre materiais oficiais, referências curadas e contribuições construídas pelos professores.</p></div>
        <Button className="self-start rounded-xl bg-[#0b407e]"><FileText className="size-4" />Sugerir um material</Button>
      </section>
      <Card className="mt-7 border-[#dfe6df] bg-white py-0"><CardContent className="p-4 sm:p-5"><div className="flex flex-col gap-3 md:flex-row"><div className="relative flex-1"><Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#7b8881]" /><Input placeholder="Busque por tema, aula, área ou tipo de material" className="h-11 rounded-xl bg-[#f8faf7] pl-10" /></div><Button variant="outline" className="h-11 rounded-xl"><SlidersHorizontal className="size-4" />Filtros</Button></div><div className="mt-4 flex flex-wrap gap-2">{["Todos", "Cadernos", "Vídeos", "Para imprimir", "Contribuições", "Em revisão"].map((item, index) => <button key={item} className={`rounded-lg px-3 py-1.5 text-xs font-medium ${index === 0 ? "bg-[#08366f] text-white" : "bg-[#f1f4ef] text-[#69766f]"}`}>{item}</button>)}</div></CardContent></Card>
      <div className="mt-8 flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#75817b]">12 materiais encontrados</p><h2 className="mt-1 font-serif text-2xl text-[#173657]">Materiais oficiais do 5º ano</h2></div><Button variant="ghost" size="sm" className="hidden rounded-xl sm:flex"><Filter className="size-4" />Mais recentes</Button></div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {lessonDetails.flatMap((lesson) => [
          { kind: "Professor", pages: lesson.teacherPages, href: lesson.teacherPdf, accent: "#e5eff7" },
          { kind: "Aluno", pages: lesson.studentPages, href: lesson.studentPdf, accent: "#ebf3df" },
        ].map((resource) => (
          <Card key={`${lesson.slug}-${resource.kind}`} className="group border-[#dfe6df] bg-white py-0 transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(27,52,75,0.08)]">
            <CardContent className="p-5">
              <div className="flex items-start justify-between"><div className="grid size-11 place-items-center rounded-xl text-[#315c7c]" style={{ backgroundColor: resource.accent }}>{resource.kind === "Professor" ? <BookOpenText className="size-5" /> : <FileText className="size-5" />}</div><Badge variant="secondary" className="bg-[#f3f5f1] text-[10px] text-[#69766f]">{resource.kind}</Badge></div>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[#76837c]">Aula {lesson.number}</p>
              <h3 className="mt-1 min-h-12 font-serif text-xl leading-tight text-[#173657]">{lesson.title}</h3>
              <p className="mt-3 text-xs text-[#7a8680]">Leitor Kinesis · {resource.pages} páginas</p>
              <div className="mt-5 flex items-center justify-between border-t border-[#edf0ec] pt-4"><span className="text-[10px] text-[#7b8881]">Navegação por blocos</span><Button asChild variant="ghost" size="icon" className="size-8 rounded-lg"><Link href={getReaderHref(resource.href)}><ArrowUpRight className="size-4" /><span className="sr-only">Ler material na plataforma</span></Link></Button></div>
            </CardContent>
          </Card>
        )))}
      </div>
    </PlatformShell>
  );
}
