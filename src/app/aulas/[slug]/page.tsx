import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Clock3,
  FileText,
  Lightbulb,
  MoreHorizontal,
  NotebookPen,
  Printer,
  UsersRound,
} from "lucide-react";

import { PlatformShell } from "@/components/platform-shell";
import { ContributionDialog } from "@/components/contribution-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getLessonDetail, getPedagogicalNotes } from "@/lib/data/lessons";
import { getReaderHref } from "@/lib/material-reader";

type LessonPageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const [lesson, notes] = await Promise.all([
    getLessonDetail(slug),
    getPedagogicalNotes(slug),
  ]);
  if (!lesson) notFound();

  return (
    <PlatformShell activeHref="/aulas/fenomenos-urbanos">
      <div className="mb-6 flex items-center justify-between gap-4">
        <Button asChild variant="ghost" className="-ml-3 rounded-xl text-[#5f7068]"><Link href="/"><ArrowLeft className="size-4" />Voltar ao percurso</Link></Button>
        <div className="flex gap-2"><Button variant="outline" size="icon" className="rounded-xl bg-white"><Printer className="size-4" /><span className="sr-only">Imprimir</span></Button><Button variant="outline" size="icon" className="rounded-xl bg-white"><MoreHorizontal className="size-4" /><span className="sr-only">Mais opções</span></Button></div>
      </div>

      <section className="relative overflow-hidden rounded-[28px] bg-[#08366f] px-6 py-8 text-white shadow-[0_18px_55px_rgba(8,54,111,0.18)] sm:px-9 sm:py-10">
        <div className="absolute -top-28 -right-12 size-80 rounded-full border-[54px] border-[#17538e] opacity-70" />
        <div className="absolute -right-10 -bottom-36 size-64 rounded-full bg-[#a8d62e]" />
        <div className="relative max-w-4xl">
          <div className="flex flex-wrap items-center gap-2"><Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">Aula {lesson.number}</Badge><Badge className="border-0 bg-[#a8d62e] text-[#173b42] hover:bg-[#a8d62e]">{lesson.status}</Badge><span className="ml-1 flex items-center gap-1.5 text-xs text-white/55"><Clock3 className="size-3.5" />Percurso estimado: 11 encontros</span></div>
          <h1 className="mt-6 max-w-3xl font-serif text-[38px] leading-[1.03] tracking-[-0.025em] sm:text-[52px]">{lesson.title}</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-white/68">{lesson.summary}</p>
          <div className="mt-7 flex flex-wrap gap-2">{lesson.areas.map((area) => <span key={area} className="rounded-lg border border-white/12 bg-white/8 px-2.5 py-1.5 text-[11px] text-white/72">{area}</span>)}</div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_340px]">
        <div className="space-y-6">
          <Card className="border-[#dfe6df] bg-white py-0 shadow-[0_10px_36px_rgba(27,52,75,0.05)]">
            <CardContent className="p-6 sm:p-7">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#17767a]">Pergunta essencial</p>
              <p className="mt-3 font-serif text-2xl leading-snug text-[#173657] sm:text-[28px]">“{lesson.essentialQuestion}”</p>
            </CardContent>
          </Card>

          <Tabs defaultValue="professor" className="gap-5">
            <TabsList className="h-11 rounded-xl bg-[#e9eeea] p-1"><TabsTrigger value="professor" className="rounded-lg px-4">Visão do professor</TabsTrigger><TabsTrigger value="aluno" className="rounded-lg px-4">Experiência do aluno</TabsTrigger></TabsList>
            <TabsContent value="professor" className="space-y-5">
              <Card className="overflow-hidden border-0 bg-[#0a437c] py-0 text-white shadow-[0_16px_44px_rgba(8,54,111,0.16)]"><CardContent className="relative grid gap-6 p-6 sm:p-7 md:grid-cols-[1fr_auto] md:items-center"><div className="absolute -right-10 -bottom-20 size-44 rounded-full bg-[#a8d62e]/90" /><div className="relative"><div className="grid size-10 place-items-center rounded-xl bg-white/12 text-[#82dcda]"><NotebookPen className="size-[18px]" /></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#8fdfdc]">Sua mesa</p><CardTitle className="mt-1 font-serif text-3xl text-white">Prepare do seu jeito</CardTitle><p className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">Escreva livremente, consulte os dois cadernos, reúna links e anexos ou converse com o assistente — tudo em um único lugar.</p></div><Button asChild className="relative self-end rounded-xl bg-white text-[#08366f] hover:bg-white/90"><Link href={`/aulas/${lesson.slug}/preparacao`}>Abrir mesa de preparação<ArrowRight className="size-4" /></Link></Button></CardContent></Card>

              <div className="grid gap-4 md:grid-cols-2">
                <ResourceCard icon={FileText} eyebrow="Material-base" title="Guia do professor" description={`${lesson.teacherPages} páginas · encaminhamentos e referências`} href={getReaderHref(lesson.teacherPdf)} action="Ler na plataforma" />
                <ResourceCard icon={BookOpenCheck} eyebrow="Experiência do aluno" title="Caderno do aluno" description={`${lesson.studentPages} páginas · textos, pesquisas e atividades integradas`} href={getReaderHref(lesson.studentPdf)} action="Explorar caderno" accent />
              </div>

              <Card className="border-[#dfe6df] bg-white py-0"><CardHeader className="px-6 pt-6 pb-4"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#17767a]">Memória pedagógica</p><CardTitle className="mt-1 font-serif text-2xl text-[#173657]">O que outros professores descobriram</CardTitle></div><ContributionDialog slug={lesson.slug} /></div></CardHeader><CardContent className="space-y-3 px-6 pb-6">{notes.length ? notes.map((note) => <div key={note.id} className="rounded-2xl bg-[#f4f7f2] p-5"><div className="flex items-center gap-2 text-xs font-semibold text-[#37556a]"><span className="grid size-7 place-items-center rounded-full bg-[#d8ece8] text-[10px] text-[#17666b]">{note.author.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>{note.author}</div><p className="mt-3 text-xs font-semibold text-[#3f596b]">{note.title}</p><p className="mt-2 text-sm leading-relaxed text-[#617068]">“{note.body}”</p><p className="mt-3 text-[10px] text-[#929b96]">Registrado em {new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(note.createdAt))}</p></div>) : <div className="rounded-2xl border border-dashed border-[#d5ddd6] p-6 text-center"><p className="text-sm font-medium text-[#516960]">Esta aula ainda não tem contribuições.</p><p className="mt-1 text-xs text-[#839089]">Seja a primeira pessoa a registrar uma descoberta.</p></div>}</CardContent></Card>
            </TabsContent>

            <TabsContent value="aluno" className="space-y-5">
              <Card className="overflow-hidden border-[#dfe6df] bg-white py-0"><CardContent className="grid gap-6 p-6 sm:p-7 md:grid-cols-[1fr_210px]"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#17767a]">Sua investigação</p><h2 className="mt-2 font-serif text-3xl text-[#173657]">A cidade também conta histórias</h2><p className="mt-3 text-sm leading-relaxed text-[#6c7972]">Observe os lugares por onde você passa. O que mudou? O que permaneceu? Quem participa dessas transformações?</p><Button asChild className="mt-6 rounded-xl bg-[#0b4a84]"><Link href={getReaderHref(lesson.studentPdf)}>Explorar caderno do aluno<ArrowRight className="size-4" /></Link></Button></div><div className="rounded-2xl bg-[#e7f3ef] p-5"><BookOpenCheck className="size-6 text-[#176f78]" /><p className="mt-5 text-xs text-[#5e7168]">Seu material</p><strong className="mt-1 block text-2xl text-[#173657]">{lesson.studentPages}</strong><span className="text-xs text-[#7b8982]">páginas de exploração</span><Progress value={24} className="mt-5 h-1.5 [&>div]:bg-[#2b999a]" /><p className="mt-2 text-[10px] text-[#738078]">24% explorado</p></div></CardContent></Card>
            </TabsContent>
          </Tabs>
        </div>

        <aside className="space-y-5">
          <Card className="border-0 bg-[#eaf1dd] py-0"><CardContent className="p-6"><div className="grid size-10 place-items-center rounded-xl bg-[#a8d62e] text-[#355514]"><Lightbulb className="size-[18px]" /></div><h3 className="mt-5 font-serif text-xl text-[#25445a]">Uma ideia para esta aula</h3><p className="mt-2 text-xs leading-relaxed text-[#627166]">Convide as famílias a fotografar um lugar do bairro que mudou. O material pode abrir a conversa sobre memória e transformação urbana.</p><Button asChild variant="link" className="mt-3 h-auto p-0 text-xs text-[#426d24]"><Link href={`/aulas/${lesson.slug}/preparacao`}>Levar para a mesa →</Link></Button></CardContent></Card>
          <Card className="border-[#dfe6df] bg-white py-0"><CardContent className="p-6"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#748078]">Turmas vinculadas</p><div className="mt-4 space-y-3">{["5º ano A", "5º ano B"].map((group) => <div key={group} className="flex items-center justify-between rounded-xl bg-[#f5f7f3] px-3 py-3"><span className="flex items-center gap-2 text-sm font-medium text-[#355067]"><UsersRound className="size-4 text-[#40898a]" />{group}</span><span className="text-[10px] text-[#7c8882]">24 alunos</span></div>)}</div></CardContent></Card>
        </aside>
      </section>
    </PlatformShell>
  );
}

type ResourceCardProps = { icon: typeof FileText; eyebrow: string; title: string; description: string; href: string; action: string; accent?: boolean };

function ResourceCard({ icon: Icon, eyebrow, title, description, href, action, accent }: ResourceCardProps) {
  return <Card className={`border-[#dfe6df] py-0 ${accent ? "bg-[#eef7f7]" : "bg-white"}`}><CardContent className="p-5"><div className={`grid size-10 place-items-center rounded-xl ${accent ? "bg-[#4ab9bb] text-[#093d68]" : "bg-[#edf2ed] text-[#496477]"}`}><Icon className="size-[18px]" /></div><p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#75817b]">{eyebrow}</p><h3 className="mt-1 font-serif text-xl text-[#173657]">{title}</h3><p className="mt-2 min-h-9 text-xs leading-relaxed text-[#75817b]">{description}</p><Button asChild variant="ghost" className="mt-3 -ml-3 rounded-xl text-[#0b5480]"><Link href={href}>{action}<ArrowRight className="size-4" /></Link></Button></CardContent></Card>;
}
