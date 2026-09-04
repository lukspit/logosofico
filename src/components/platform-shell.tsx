import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  Bell,
  BookOpenText,
  CalendarDays,
  HeartHandshake,
  Layers3,
  Library,
  NotebookPen,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Início", icon: Layers3 },
  { href: "/aulas/fenomenos-urbanos", label: "Aulas", icon: BookOpenText },
  { href: "/aulas/fenomenos-urbanos/preparacao", label: "Minha mesa", icon: NotebookPen },
  { href: "/biblioteca", label: "Biblioteca", icon: Library },
  { href: "/turmas", label: "Turmas", icon: UsersRound },
  { href: "/familia", label: "Família", icon: HeartHandshake },
  { href: "/diretoria", label: "Diretoria", icon: BarChart3 },
  { href: "/agenda", label: "Agenda", icon: CalendarDays },
];

type PlatformShellProps = {
  children: React.ReactNode;
  activeHref?: string;
  roleLabel?: string;
};

export function PlatformShell({
  children,
  activeHref = "/",
  roleLabel = "Professora · 5º ano",
}: PlatformShellProps) {
  return (
    <div className="min-h-screen bg-[#f5f7f3] text-[#132238]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] flex-col bg-[#08366f] text-white lg:flex">
        <Link href="/" className="flex h-[92px] items-center gap-3 px-7">
          <div className="grid size-11 place-items-center rounded-xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)]">
            <Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={38} height={38} className="size-8 object-contain" />
          </div>
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/55">Colégio</p><p className="font-serif text-[18px] leading-tight tracking-wide">Logosófico</p></div>
        </Link>
        <nav className="mt-5 space-y-1 px-4" aria-label="Navegação principal">
          {navigation.map((item) => {
            const active = item.href === activeHref;
            return <Link key={item.href} href={item.href} className={cn("flex h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition", active ? "bg-white text-[#08366f] shadow-sm" : "text-white/72 hover:bg-white/8 hover:text-white")}><item.icon className="size-[18px]" strokeWidth={1.8} />{item.label}{active && <span className="ml-auto size-1.5 rounded-full bg-[#a8d62e]" />}</Link>;
          })}
        </nav>
        <div className="mx-4 mt-auto mb-5 rounded-2xl bg-[#0c4487] p-4">
          <div className="mb-3 grid size-9 place-items-center rounded-xl bg-[#a8d62e] text-[#08366f]"><Sparkles className="size-[18px]" /></div>
          <p className="text-sm font-semibold">Inteligência do acervo</p>
          <p className="mt-1 text-xs leading-relaxed text-white/60">Explore relações entre aulas usando somente conteúdos aprovados.</p>
          <Link href="/assistente" className="mt-3 block text-xs font-semibold text-[#c8ef5d]">Abrir assistente →</Link>
        </div>
      </aside>

      <div className="lg:pl-[248px]">
        <header className="sticky top-0 z-20 border-b border-[#dce3dc] bg-[#f5f7f3]/92 backdrop-blur-xl">
          <div className="flex h-[76px] items-center gap-3 px-4 sm:px-7 xl:px-10">
            <Link href="/" className="flex items-center gap-2 lg:hidden"><div className="grid size-9 place-items-center rounded-lg bg-white shadow-sm"><Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={32} height={32} className="size-7 object-contain" /></div><span className="hidden font-serif text-lg sm:inline">Logosófico</span></Link>
            <div className="relative ml-auto hidden w-full max-w-[390px] md:block lg:ml-0"><Search className="absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-[#6c7b73]" /><Input className="h-10 rounded-xl border-[#dce3dc] bg-white pl-10 text-sm shadow-none" placeholder="Buscar aulas, temas ou materiais" /></div>
            <div className="ml-auto flex items-center gap-2 sm:gap-3"><Button variant="ghost" size="icon" className="relative rounded-xl text-[#536259]"><Bell className="size-[18px]" /><span className="absolute top-2 right-2 size-1.5 rounded-full bg-[#e1714b] ring-2 ring-[#f5f7f3]" /><span className="sr-only">Notificações</span></Button><div className="hidden h-7 w-px bg-[#dce3dc] sm:block" /><div className="flex items-center gap-2.5 rounded-xl p-1.5"><Avatar className="size-9 border border-white shadow-sm"><AvatarFallback className="bg-[#d9edeb] text-xs font-bold text-[#17676d]">MC</AvatarFallback></Avatar><span className="hidden sm:block"><span className="block text-xs font-semibold">Marina Costa</span><span className="block text-[10px] text-[#728079]">{roleLabel}</span></span></div></div>
          </div>
          <nav className="flex gap-1 overflow-x-auto border-t border-[#e5e9e4] px-3 py-2 lg:hidden" aria-label="Navegação móvel">{navigation.slice(0, 6).map((item) => <Link key={item.href} href={item.href} className={cn("whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium", item.href === activeHref ? "bg-[#08366f] text-white" : "text-[#68766f]")}>{item.label}</Link>)}</nav>
        </header>
        <main className="mx-auto max-w-[1450px] px-4 py-7 sm:px-7 lg:py-9 xl:px-10">{children}</main>
      </div>
    </div>
  );
}
