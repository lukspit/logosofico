import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BookOpenText,
  CalendarDays,
  ChevronDown,
  Clock3,
  FileText,
  GraduationCap,
  Layers3,
  Library,
  NotebookPen,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PlatformShell } from "@/components/platform-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getLessons } from "@/lib/data/lessons";

const navigation = [
  { label: "Início", href: "/", icon: Layers3, active: true },
  { label: "Aulas", href: "/aulas/fenomenos-urbanos", icon: BookOpenText },
  { label: "Minha mesa", href: "/aulas/fenomenos-urbanos/preparacao", icon: NotebookPen },
  { label: "Biblioteca", href: "/biblioteca", icon: Library },
  { label: "Turmas", href: "/turmas", icon: UsersRound },
  { label: "Agenda", href: "/agenda", icon: CalendarDays },
];

export const dynamic = "force-dynamic";

export default async function Home() {
  const lessons = await getLessons();
  const featured = lessons[3];

  if (!featured) {
    return (
      <PlatformShell>
        <div className="mx-auto mt-20 max-w-xl rounded-3xl border border-[#dfe6df] bg-white p-8 text-center shadow-sm">
          <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e8f2df] text-[#5c812b]">
            <GraduationCap className="size-5" />
          </div>
          <h1 className="mt-5 font-serif text-3xl text-[#173657]">Seu acesso está quase pronto</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#6f7c75]">
            Sua conta foi reconhecida, mas ainda precisa ser vinculada a uma turma ou papel pela equipe do colégio.
          </p>
          <Button variant="outline" className="mt-6 rounded-xl">Falar com a coordenação</Button>
        </div>
      </PlatformShell>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#f5f7f3] text-[#132238]">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-[#08366f] text-white lg:flex">
          <div className="flex h-[92px] items-center gap-3 px-7">
            <div className="grid size-11 place-items-center rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
              <Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={38} height={38} className="size-8 object-contain" priority />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">Colégio</p>
              <p className="font-serif text-[18px] leading-tight tracking-wide">Logosófico</p>
            </div>
          </div>

          <nav className="mt-5 space-y-1 px-4" aria-label="Navegação principal">
            {navigation.map((item) => (
              <Link key={item.label} href={item.href} className={`group flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition ${item.active ? "bg-white text-[#08366f] shadow-sm" : "text-white/72 hover:bg-white/8 hover:text-white"}`}>
                <item.icon className="size-[18px]" strokeWidth={1.8} />
                {item.label}
                {item.active && <span className="ml-auto size-1.5 rounded-full bg-[#a8d62e]" />}
              </Link>
            ))}
          </nav>

          <div className="mx-4 mt-auto mb-5 overflow-hidden rounded-2xl bg-[#0c4487] p-4">
            <div className="mb-3 grid size-9 place-items-center rounded-xl bg-[#a8d62e] text-[#08366f]"><Sparkles className="size-[18px]" /></div>
            <p className="text-sm font-semibold">Memória pedagógica</p>
            <p className="mt-1 text-xs leading-relaxed text-white/60">Registre uma descoberta desta aula para os próximos professores.</p>
            <button className="mt-3 text-xs font-semibold text-[#c8ef5d]">Adicionar contribuição →</button>
          </div>
        </aside>

        <div className="lg:pl-[248px]">
          <header className="sticky top-0 z-20 border-b border-[#dce3dc] bg-[#f5f7f3]/92 backdrop-blur-xl">
            <div className="flex h-[76px] items-center gap-3 px-4 sm:px-7 xl:px-10">
              <div className="flex items-center gap-2 lg:hidden">
                <div className="grid size-9 place-items-center rounded-lg bg-white shadow-sm">
                  <Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={32} height={32} className="size-7 object-contain" />
                </div>
                <span className="hidden font-serif text-lg sm:inline">Logosófico</span>
              </div>
              <div className="relative ml-auto hidden w-full max-w-[390px] md:block lg:ml-0">
                <Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#6c7b73]" />
                <Input className="h-10 rounded-xl border-[#dce3dc] bg-white pl-10 text-sm shadow-none placeholder:text-[#8a958f]" placeholder="Buscar aulas, temas ou materiais" aria-label="Buscar na plataforma" />
              </div>
              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <Button variant="ghost" size="icon" className="relative rounded-xl text-[#536259]">
                  <Bell className="size-[18px]" /><span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#e1714b] ring-2 ring-[#f5f7f3]" /><span className="sr-only">Notificações</span>
                </Button>
                <Separator orientation="vertical" className="mx-1 hidden h-7 sm:block" />
                <button className="flex items-center gap-2.5 rounded-xl p-1.5 text-left transition hover:bg-white">
                  <Avatar className="size-9 border border-white shadow-sm"><AvatarFallback className="bg-[#d9edeb] text-xs font-bold text-[#17676d]">MC</AvatarFallback></Avatar>
                  <span className="hidden sm:block"><span className="block text-xs font-semibold">Marina Costa</span><span className="block text-[10px] text-[#728079]">Professora · 5º ano</span></span>
                  <ChevronDown className="hidden size-3.5 text-[#7b8881] sm:block" />
                </button>
              </div>
            </div>
          </header>

          <main className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:py-9 xl:px-10">
            <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#17767a]"><span className="h-px w-5 bg-[#47b9bd]" />Quinta-feira, 28 de agosto</p>
                <h1 className="font-serif text-[34px] leading-tight tracking-[-0.025em] text-[#0d2d53] sm:text-[42px]">Bom dia, Marina.</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#69766f]">Continue de onde sua turma parou e prepare o próximo encontro com tudo reunido em um só lugar.</p>
              </div>
              <Button className="h-10 self-start rounded-xl bg-[#0b407e] px-4 shadow-[0_8px_24px_rgba(11,64,126,0.16)] hover:bg-[#0a376c] sm:self-auto"><BookOpenText className="size-4" />Explorar todas as aulas</Button>
            </section>

            <section className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(300px,0.72fr)]">
              <Card className="relative overflow-hidden border-0 bg-[#08366f] py-0 text-white shadow-[0_18px_55px_rgba(8,54,111,0.18)]">
                <div className="absolute -top-24 -right-16 size-72 rounded-full border-[46px] border-[#1b5793] opacity-65" />
                <div className="absolute right-36 -bottom-28 size-48 rounded-full bg-[#a8d62e]/90" />
                <CardContent className="relative grid min-h-[330px] gap-8 p-6 sm:p-8 md:grid-cols-[1fr_220px]">
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-2"><Badge className="border-0 bg-[#a8d62e] text-[#173b42] hover:bg-[#a8d62e]">Aula em andamento</Badge><span className="text-xs text-white/58">Aula {featured.number} de 6</span></div>
                    <div className="mt-8"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7dd7d6]">5º ano · Kinesis</p><h2 className="mt-2 max-w-xl font-serif text-[32px] leading-[1.05] tracking-[-0.02em] sm:text-[40px]">{featured.title}</h2><p className="mt-4 max-w-xl text-sm leading-relaxed text-white/66">{featured.summary}</p></div>
                    <div className="mt-auto flex flex-wrap items-center gap-3 pt-7"><Button asChild className="rounded-xl bg-white text-[#08366f] hover:bg-white/90"><Link href={`/aulas/${featured.slug}/preparacao`}>Continuar preparando<ArrowRight className="size-4" /></Link></Button><span className="flex items-center gap-1.5 text-xs text-white/55"><Clock3 className="size-3.5" />Salvamento automático</span></div>
                  </div>
                  <div className="flex flex-col justify-end rounded-2xl border border-white/12 bg-white/8 p-5 backdrop-blur-sm">
                    <div className="mb-5 grid size-11 place-items-center rounded-2xl bg-[#46bec1] text-[#07366f]"><NotebookPen className="size-5" /></div>
                    <p className="text-xs text-white/55">Sua mesa de preparação</p><strong className="mt-1 block font-serif text-2xl font-normal">Um espaço livre para pensar.</strong>
                    <Separator className="my-5 bg-white/12" />
                    <p className="text-xs leading-relaxed text-white/62">Materiais, anotações, links, anexos e assistente reunidos sem etapas obrigatórias.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#dfe6df] bg-white py-0 shadow-[0_12px_40px_rgba(30,58,44,0.06)]">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#76837c]">Hoje</p><h3 className="mt-1 font-serif text-2xl text-[#173657]">Sua agenda</h3></div><div className="grid size-10 place-items-center rounded-xl bg-[#eef5df] text-[#648b18]"><CalendarDays className="size-[18px]" /></div></div>
                  <div className="mt-7 space-y-5">
                    {[["08:00", "5º ano A", "Sociedade e tecnologia", "#47b9bd"], ["10:15", "5º ano B", "Cidadania", "#a8d62e"], ["14:00", "Planejamento", "Encontro pedagógico", "#e4a35c"]].map(([time, group, title, color]) => (
                      <div key={`${time}-${group}`} className="grid grid-cols-[46px_10px_1fr] items-start gap-3"><span className="pt-0.5 text-xs font-semibold text-[#36536c]">{time}</span><span className="mt-1.5 size-2 rounded-full" style={{ backgroundColor: color }} /><div><p className="text-sm font-semibold text-[#1b344b]">{group}</p><p className="mt-0.5 text-xs text-[#7b8881]">{title}</p></div></div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-7 w-full rounded-xl border-[#dfe6df] text-[#345169]">Ver agenda completa</Button>
                </CardContent>
              </Card>
            </section>

            <section id="aulas" className="mt-9 scroll-mt-24">
              <div className="mb-4 flex items-end justify-between gap-4"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#17767a]">Percurso do 5º ano</p><h2 className="mt-1 font-serif text-[28px] text-[#173657]">Aulas Kinesis</h2></div><button className="hidden text-xs font-semibold text-[#0b4a84] sm:block">Ver percurso completo →</button></div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {lessons.map((lesson) => (
                  <Link href={`/aulas/${lesson.slug}`} key={lesson.number} className="group relative overflow-hidden rounded-2xl border border-[#dfe6df] bg-white p-5 shadow-[0_10px_32px_rgba(27,52,75,0.045)] transition duration-300 hover:-translate-y-0.5 hover:border-[#b9d5d1] hover:shadow-[0_18px_45px_rgba(27,52,75,0.09)]">
                    <div className="flex items-start justify-between gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#eff5f2] text-xs font-bold text-[#17666b]">{String(lesson.number).padStart(2, "0")}</span><Badge variant="secondary" className="bg-[#f1f4ee] text-[10px] font-medium text-[#65736c]">{lesson.status}</Badge></div>
                    <h3 className="mt-5 min-h-12 font-serif text-xl leading-tight text-[#173657] transition group-hover:text-[#0a5487]">{lesson.title}</h3><p className="mt-2 line-clamp-2 text-xs leading-relaxed text-[#75817b]">{lesson.short}</p>
                    <div className="mt-5 flex flex-wrap gap-1.5">{lesson.areas.slice(0, 3).map((area) => <span key={area} className="rounded-md bg-[#f5f7f3] px-2 py-1 text-[10px] font-medium text-[#5f6e66]">{area}</span>)}<span className="rounded-md bg-[#eef7f7] px-2 py-1 text-[10px] font-medium text-[#24777a]">+{lesson.areas.length - 3}</span></div>
                    <div className="mt-5 flex items-center justify-between border-t border-[#edf0ec] pt-4"><span className="flex items-center gap-1.5 text-[11px] text-[#7c8882]"><FileText className="size-3.5" />Professor + aluno</span><ArrowRight className="size-4 text-[#78a5a4] transition group-hover:translate-x-1 group-hover:text-[#17666b]" /></div>
                  </Link>
                ))}
              </div>
            </section>
          </main>
        </div>
      </div>
    </TooltipProvider>
  );
}
