"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  CalendarRange,
  Check,
  ExternalLink,
  FileText,
  Fullscreen,
  GraduationCap,
  Layers3,
  LibraryBig,
  MessagesSquare,
  NotebookPen,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";

const totalSlides = 8;

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`grid size-11 place-items-center rounded-[14px] ${inverse ? "bg-white" : "bg-[#08366f]"}`}>
        <Image
          src="/brand/monograma-cl-branco.jpeg"
          alt="Colégio Logosófico"
          width={36}
          height={36}
          className="size-8 rounded-lg object-cover"
          priority
        />
      </div>
      <div>
        <p className={`text-[9px] font-bold uppercase tracking-[0.24em] ${inverse ? "text-white/52" : "text-[#668076]"}`}>Colégio</p>
        <p className={`font-serif text-[17px] leading-tight ${inverse ? "text-white" : "text-[#11345b]"}`}>Logosófico</p>
      </div>
    </div>
  );
}

function SlideFrame({
  children,
  eyebrow,
  dark = false,
  number,
}: {
  children: React.ReactNode;
  eyebrow?: string;
  dark?: boolean;
  number: number;
}) {
  return (
    <section className={`relative h-full w-full overflow-hidden ${dark ? "bg-[#07366f] text-white" : "bg-[#f5f7f3] text-[#143657]"}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${dark ? "bg-[#a8d62e]" : "bg-gradient-to-r from-[#08366f] via-[#35b8bd] to-[#a8d62e]"}`} />
      <div className={`absolute -right-36 -top-36 size-[440px] rounded-full border-[72px] ${dark ? "border-[#15528f]/70" : "border-[#e4ede7]"}`} />
      <div className={`absolute -bottom-44 -left-44 size-[360px] rounded-full ${dark ? "bg-[#a8d62e]/90" : "bg-[#dff0dc]"}`} />
      <div className="relative z-10 flex h-full flex-col px-[clamp(28px,6vw,92px)] py-[clamp(24px,5vh,54px)]">
        <header className="flex items-center justify-between">
          <Brand inverse={dark} />
          <div className="flex items-center gap-4">
            {eyebrow && <span className={`hidden text-[10px] font-bold uppercase tracking-[0.2em] sm:block ${dark ? "text-[#7ed8d9]" : "text-[#17767a]"}`}>{eyebrow}</span>}
            <span className={`text-[11px] font-semibold tabular-nums ${dark ? "text-white/40" : "text-[#84928b]"}`}>{String(number).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}</span>
          </div>
        </header>
        <div className="flex min-h-0 flex-1 items-center">{children}</div>
      </div>
    </section>
  );
}

function Tag({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${dark ? "bg-white/10 text-[#b9eeee]" : "bg-[#e7f2ef] text-[#146d72]"}`}>{children}</span>;
}

const slides = [
  <SlideFrame key="cover" number={1} dark eyebrow="Proposta de implantação">
    <div className="grid w-full items-center gap-12 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="max-w-[850px]">
        <Tag dark>Uma visão para o colégio</Tag>
        <h1 className="mt-7 font-serif text-[clamp(48px,7vw,98px)] leading-[0.94] tracking-[-0.045em]">
          Plataforma<br />Pedagógica <span className="text-[#b8e441]">Logosófica</span>
        </h1>
        <p className="mt-7 max-w-2xl text-[clamp(15px,1.45vw,21px)] leading-relaxed text-white/62">
          Um ambiente próprio para reunir conteúdos, apoiar o trabalho docente e transformar experiências em memória pedagógica.
        </p>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/38">Colégio Logosófico González Pecotche · Chapecó · Setembro de 2026</p>
      </div>
      <div className="hidden justify-self-end lg:block">
        <div className="relative grid size-[270px] place-items-center rounded-[54px] border border-white/12 bg-white/8 shadow-[0_35px_90px_rgba(0,0,0,0.2)] backdrop-blur-sm">
          <div className="absolute -left-7 top-10 size-14 rounded-2xl bg-[#45bec2]" />
          <div className="absolute -bottom-5 right-10 size-20 rounded-full bg-[#a8d62e]" />
          <Image src="/brand/monograma-cl-branco.jpeg" alt="Monograma do Colégio Logosófico" width={150} height={150} className="size-[150px] rounded-[34px] object-cover" />
        </div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="understanding" number={2} eyebrow="Nosso ponto de partida">
    <div className="w-full">
      <Tag>O que compreendemos</Tag>
      <div className="mt-6 grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
        <div>
          <h2 className="font-serif text-[clamp(40px,5vw,72px)] leading-[1.02] tracking-[-0.04em]">O conteúdo já existe.<br /><span className="text-[#178187]">O potencial está nas conexões.</span></h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            [FileText, "Muitos formatos", "Materiais ricos, extensos e distribuídos em diferentes lugares."],
            [UsersRound, "Diferentes olhares", "Professor, aluno, família e direção precisam acessar o que faz sentido para cada um."],
            [Sparkles, "Conhecimento vivo", "O que nasce na preparação e na sala de aula pode permanecer e inspirar novos ciclos."],
          ].map(([Icon, title, text]) => {
            const ItemIcon = Icon as typeof FileText;
            return (
              <div key={String(title)} className="rounded-[26px] border border-[#dae5df] bg-white p-5 shadow-[0_18px_55px_rgba(24,57,43,0.06)]">
                <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f3ef] text-[#17777b]"><ItemIcon className="size-5" strokeWidth={1.8} /></div>
                <h3 className="mt-5 font-serif text-[22px]">{String(title)}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-[#6d7b74]">{String(text)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="vision" number={3} dark eyebrow="A visão">
    <div className="w-full">
      <div className="max-w-4xl">
        <Tag dark>Mais do que um repositório</Tag>
        <h2 className="mt-7 font-serif text-[clamp(42px,6vw,82px)] leading-[0.98] tracking-[-0.04em]">A aula como um<br /><span className="text-[#b8e441]">ambiente vivo.</span></h2>
      </div>
      <div className="mt-10 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4">
        {[
          [LibraryBig, "Reunir", "Conteúdos com contexto"],
          [BookOpenText, "Compreender", "Navegação mais amigável"],
          [NotebookPen, "Preparar", "Um espaço livre para o professor"],
          [Layers3, "Preservar", "Memória pedagógica coletiva"],
        ].map(([Icon, title, text], index) => {
          const ItemIcon = Icon as typeof LibraryBig;
          return (
            <div key={String(title)} className="rounded-[24px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between"><ItemIcon className="size-5 text-[#79d6d8]" strokeWidth={1.7} /><span className="text-[10px] text-white/32">0{index + 1}</span></div>
              <h3 className="mt-8 font-serif text-[24px]">{String(title)}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-white/52">{String(text)}</p>
            </div>
          );
        })}
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="demo" number={4} eyebrow="Demonstração da plataforma">
    <div className="grid w-full items-center gap-12 lg:grid-cols-[1fr_1fr]">
      <div className="max-w-2xl">
        <Tag>A proposta em funcionamento</Tag>
        <h2 className="mt-7 font-serif text-[clamp(42px,5.5vw,76px)] leading-[1] tracking-[-0.04em]">A plataforma em <span className="text-[#178187]">funcionamento.</span></h2>
        <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-[#6a7971]">A demonstração apresenta os principais conceitos da experiência e permite visualizar como conteúdos, pessoas e trabalho pedagógico estarão conectados.</p>
        <Link href="/" target="_blank" className="mt-8 inline-flex h-12 items-center gap-3 rounded-2xl bg-[#08366f] px-5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(8,54,111,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0b447f]">
          Abrir demonstração <ExternalLink className="size-4" />
        </Link>
      </div>
      <div className="relative hidden lg:block">
        <div className="absolute -inset-6 rounded-[42px] bg-[#dfeee8]" />
        <div className="relative overflow-hidden rounded-[30px] border border-[#d5e1db] bg-white p-4 shadow-[0_30px_80px_rgba(15,57,50,0.16)]">
          <div className="mb-4 flex items-center gap-1.5 px-1"><span className="size-2.5 rounded-full bg-[#ef8a72]" /><span className="size-2.5 rounded-full bg-[#e7bd5d]" /><span className="size-2.5 rounded-full bg-[#83c98f]" /><span className="ml-3 h-5 flex-1 rounded-md bg-[#f0f3f0]" /></div>
          <div className="grid aspect-[16/9] grid-cols-[23%_1fr] overflow-hidden rounded-2xl bg-[#f5f7f3]">
            <div className="bg-[#08366f] p-4"><div className="h-7 w-24 rounded-lg bg-white/15" /><div className="mt-8 space-y-3">{[1,2,3,4].map((item) => <div key={item} className={`h-7 rounded-lg ${item === 1 ? "bg-white" : "bg-white/8"}`} />)}</div></div>
            <div className="p-5"><div className="h-3 w-28 rounded bg-[#65b9b7]/50" /><div className="mt-3 h-7 w-64 rounded bg-[#173657]/80" /><div className="mt-5 grid grid-cols-[1.6fr_0.7fr] gap-4"><div className="h-36 rounded-2xl bg-[#08366f]" /><div className="h-36 rounded-2xl bg-white shadow-sm" /></div><div className="mt-4 grid grid-cols-3 gap-3">{[1,2,3].map((item) => <div key={item} className="h-20 rounded-xl bg-white shadow-sm" />)}</div></div>
          </div>
        </div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="journey" number={5} dark eyebrow="Como vamos construir">
    <div className="w-full">
      <div className="grid items-end gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="max-w-xl"><Tag dark>45 dias de implantação</Tag><h2 className="mt-7 font-serif text-[clamp(42px,5.5vw,76px)] leading-[1] tracking-[-0.04em]">Um caminho feito<br /><span className="text-[#b8e441]">em conjunto.</span></h2><p className="mt-6 text-[14px] leading-relaxed text-white/58">Reuniões semanais permitem validar decisões e manter a implantação conectada à realidade pedagógica do colégio.</p></div>
        <div>
          <div className="relative grid gap-4 sm:grid-cols-3">
            <div className="absolute left-[16%] right-[16%] top-7 hidden h-px bg-gradient-to-r from-[#45bec2] via-white/25 to-[#a8d62e] sm:block" />
            {[
              ["01", "Alinhar", "Escopo, acessos, materiais e critérios de sucesso."],
              ["02", "Construir e validar", "Ciclos semanais de demonstração, escuta e ajuste."],
              ["03", "Colocar em uso", "Publicação, orientação e primeiros usuários."],
            ].map(([number, title, text]) => <div key={number} className="relative rounded-[25px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur"><span className="relative z-10 grid size-14 place-items-center rounded-2xl bg-[#0e4a87] text-xs font-bold text-[#aee2e3] ring-8 ring-[#07366f]">{number}</span><h3 className="mt-7 font-serif text-[23px]">{title}</h3><p className="mt-2 text-[12px] leading-relaxed text-white/50">{text}</p></div>)}
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#a8d62e]/25 bg-[#a8d62e]/10 px-5 py-4 text-[12px] text-white/70"><CalendarRange className="size-5 shrink-0 text-[#b8e441]" /><strong className="text-white">Encontro semanal:</strong> acompanhamento próximo para compreender, decidir e ajustar o caminho.</div>
        </div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="delivery" number={6} eyebrow="O que será entregue">
    <div className="w-full">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl"><Tag>Entrega completa</Tag><h2 className="mt-6 font-serif text-[clamp(40px,5vw,70px)] leading-[1] tracking-[-0.04em]">Pronta para funcionar<br /><span className="text-[#178187]">no colégio.</span></h2></div>
        <p className="max-w-md text-[14px] leading-relaxed text-[#697870]">Em 45 dias, a plataforma será entregue configurada, validada e publicada, com o escopo acordado pronto para uso.</p>
      </div>
      <div className="mt-9 grid grid-cols-2 gap-3 lg:grid-cols-5">
        {[
          [ShieldCheck, "Acessos e estrutura", "Perfis, permissões e dados configurados"],
          [BookOpenText, "Conteúdos organizados", "Materiais previstos no escopo, prontos para consulta"],
          [NotebookPen, "Experiência docente", "Leitura, organização e preparação de aulas"],
          [Sparkles, "Assistente contextual", "Inteligência conectada ao acervo aprovado pelo colégio"],
          [GraduationCap, "Entrada em operação", "Publicação, configuração e orientação inicial"],
        ].map(([Icon, title, text]) => {
          const ItemIcon = Icon as typeof ShieldCheck;
          return <div key={String(title)} className="min-h-[170px] rounded-[23px] border border-[#dae4de] bg-white p-5"><ItemIcon className="size-5 text-[#17777b]" strokeWidth={1.8} /><h3 className="mt-7 font-serif text-[20px] leading-tight">{String(title)}</h3><p className="mt-2 text-[11px] leading-relaxed text-[#718078]">{String(text)}</p></div>;
        })}
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="responsibilities" number={7} eyebrow="Responsabilidades">
    <div className="grid w-full items-center gap-12 lg:grid-cols-[0.78fr_1.22fr]">
      <div className="max-w-2xl">
        <Tag>Execução do projeto</Tag>
        <h2 className="mt-7 font-serif text-[clamp(42px,5.5vw,76px)] leading-[1] tracking-[-0.04em]">Responsabilidades durante a <span className="text-[#178187]">implantação.</span></h2>
        <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-[#6a7971]">A divisão clara das responsabilidades mantém o cronograma objetivo e as decisões conectadas ao funcionamento do colégio.</p>
      </div>
      <div className="grid gap-9 sm:grid-cols-2">
        <div className="border-l-2 border-[#178187] pl-6">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#e5f1ee] text-[#17777b]"><ShieldCheck className="size-5" strokeWidth={1.8} /></div>
          <h3 className="mt-5 font-serif text-[26px]">Desenvolvimento e implantação</h3>
          <div className="mt-5 space-y-3">
            {["Construção e configuração da plataforma", "Apresentações semanais da evolução", "Publicação e preparação dos acessos", "Orientação para a entrada em uso"].map((item) => <p key={item} className="flex items-start gap-3 text-[12px] leading-relaxed text-[#65766d]"><Check className="mt-0.5 size-4 shrink-0 text-[#178187]" />{item}</p>)}
          </div>
        </div>
        <div className="border-l-2 border-[#a8d62e] pl-6">
          <div className="grid size-12 place-items-center rounded-2xl bg-[#edf4df] text-[#5f8423]"><MessagesSquare className="size-5" strokeWidth={1.8} /></div>
          <h3 className="mt-5 font-serif text-[26px]">Participação do colégio</h3>
          <div className="mt-5 space-y-3">
            {["Definição de uma pessoa responsável", "Disponibilização dos materiais acordados", "Validação das decisões nos encontros", "Informações dos usuários para configuração"].map((item) => <p key={item} className="flex items-start gap-3 text-[12px] leading-relaxed text-[#65766d]"><Check className="mt-0.5 size-4 shrink-0 text-[#6f9729]" />{item}</p>)}
          </div>
        </div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="investment" number={8} eyebrow="Proposta comercial">
    <div className="grid w-full items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="max-w-2xl">
        <Tag>Investimento e condições</Tag>
        <h2 className="mt-7 font-serif text-[clamp(42px,5.5vw,76px)] leading-[1] tracking-[-0.04em]">Plataforma completa em <span className="text-[#178187]">45 dias.</span></h2>
        <p className="mt-6 max-w-lg text-[14px] leading-relaxed text-[#6a7971]">A aprovação da proposta abre a formalização do projeto e a reunião de início da implantação.</p>
      </div>
      <div className="overflow-hidden rounded-[32px] bg-[#08366f] text-white shadow-[0_30px_90px_rgba(8,54,111,0.22)]">
        <div className="border-b border-white/10 p-7">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#79d6d8]">Implantação completa</p>
          <div className="mt-3 flex items-end gap-3"><span className="font-serif text-[clamp(48px,6vw,76px)] leading-none tracking-[-0.04em]">R$ 17.500</span></div>
          <p className="mt-3 text-xs text-white/46">50% na contratação · 50% na entrega</p>
        </div>
        <div className="grid gap-6 p-7 sm:grid-cols-2">
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">Prazo</p><p className="mt-2 font-serif text-3xl">45 dias</p><p className="mt-1 text-[11px] text-white/45">a partir da reunião de início e dos materiais acordados</p></div>
          <div><p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/42">Continuidade</p><p className="mt-2 font-serif text-3xl">R$ 1.290<span className="text-sm text-white/50"> / mês</span></p><p className="mt-1 text-[11px] text-white/45">após a entrega da plataforma</p></div>
        </div>
        <div className="mx-7 mb-7 flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3 text-[11px] leading-relaxed text-white/52"><Check className="mt-0.5 size-4 shrink-0 text-[#b8e441]" />A mensalidade inclui suporte, correções, monitoramento e pequenas melhorias. Novos módulos, infraestrutura e consumo de inteligência artificial serão alinhados separadamente.</div>
      </div>
    </div>
  </SlideFrame>,
];

export function PresentationDeck() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(totalSlides - 1, index)));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        setCurrent((value) => Math.min(totalSlides - 1, value + 1));
      }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        setCurrent((value) => Math.max(0, value - 1));
      }
      if (event.key === "Home") goTo(0);
      if (event.key === "End") goTo(totalSlides - 1);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goTo]);

  const enterFullscreen = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  };

  return (
    <main className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#e8eee9] antialiased">
      <div className="absolute inset-0">
        {slides.map((slide, index) => (
          <div key={index} aria-hidden={index !== current} className={`absolute inset-0 transition-all duration-500 ease-out ${index === current ? "translate-x-0 opacity-100" : index < current ? "-translate-x-8 opacity-0 pointer-events-none" : "translate-x-8 opacity-0 pointer-events-none"}`}>
            {slide}
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-2xl border border-white/40 bg-[#0a2d53]/90 p-1.5 text-white shadow-[0_12px_35px_rgba(4,32,65,0.24)] backdrop-blur-xl">
        <button onClick={() => goTo(current - 1)} disabled={current === 0} className="grid size-9 place-items-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-25" aria-label="Slide anterior"><ArrowLeft className="size-4" /></button>
        <div className="flex items-center gap-1.5 px-1">
          {Array.from({ length: totalSlides }).map((_, index) => <button key={index} onClick={() => goTo(index)} className={`h-1.5 rounded-full transition-all ${index === current ? "w-6 bg-[#b8e441]" : "w-1.5 bg-white/30 hover:bg-white/55"}`} aria-label={`Ir para o slide ${index + 1}`} />)}
        </div>
        <button onClick={() => goTo(current + 1)} disabled={current === totalSlides - 1} className="grid size-9 place-items-center rounded-xl text-white/70 transition hover:bg-white/10 hover:text-white disabled:opacity-25" aria-label="Próximo slide"><ArrowRight className="size-4" /></button>
      </div>

      <button onClick={enterFullscreen} className="absolute bottom-5 right-5 z-30 grid size-10 place-items-center rounded-xl border border-white/50 bg-white/80 text-[#24435e] shadow-lg backdrop-blur transition hover:bg-white" aria-label="Ativar tela cheia"><Fullscreen className="size-4" /></button>
      <div className="absolute bottom-6 left-6 z-30 hidden items-center gap-2 text-[10px] font-medium text-[#61766c] md:flex"><MessagesSquare className="size-3.5" />Use as setas do teclado para navegar</div>
    </main>
  );
}
