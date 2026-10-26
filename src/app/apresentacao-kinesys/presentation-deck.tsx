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
  Fullscreen,
  Layers3,
  LibraryBig,
  MessagesSquare,
  NotebookPen,
} from "lucide-react";

import styles from "../apresentacao/presentation-deck.module.css";

const totalSlides = 7;

function Brand({ inverse = false }: { inverse?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-3">
      <div className={`grid size-11 shrink-0 place-items-center rounded-[14px] ${inverse ? "bg-white" : "bg-[#08366f]"}`}>
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
    <section aria-label={`Slide ${number} de ${totalSlides}: ${eyebrow}`} className={`${styles.frame} ${dark ? styles.dark : ""} relative w-full overflow-hidden ${dark ? "bg-[#07366f] text-white" : "bg-[#f5f7f3] text-[#143657]"}`}>
      <div className={`absolute inset-x-0 top-0 h-1 ${dark ? "bg-[#a8d62e]" : "bg-gradient-to-r from-[#08366f] via-[#35b8bd] to-[#a8d62e]"}`} />
      <div aria-hidden="true" className={`pointer-events-none absolute -right-36 -top-36 size-[440px] rounded-full border-[72px] ${dark ? "border-[#15528f]/70" : "border-[#e4ede7]"}`} />
      <div aria-hidden="true" className={`${styles.bottomDecoration} pointer-events-none absolute -bottom-44 -left-44 size-[360px] rounded-full ${dark ? "bg-[#a8d62e]/15" : "bg-[#dff0dc]"}`} />
      <div className={`${styles.frameInner} relative z-10 flex flex-col`}>
        <header className="flex shrink-0 items-center justify-between gap-4">
          <Brand inverse={dark} />
          <div className="flex min-w-0 items-center gap-4 text-right">
            {eyebrow && <span className={`hidden text-[10px] font-bold uppercase tracking-[0.2em] lg:block ${dark ? "text-[#7ed8d9]" : "text-[#17767a]"}`}>{eyebrow}</span>}
            <span className={`shrink-0 text-[11px] font-semibold tabular-nums ${dark ? "text-white/40" : "text-[#84928b]"}`}>{String(number).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}</span>
          </div>
        </header>
        <div className={`${styles.content} flex flex-1 items-center`}>{children}</div>
      </div>
    </section>
  );
}

function Tag({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return <span className={`inline-flex rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] ${dark ? "bg-white/10 text-[#b9eeee]" : "bg-[#e7f2ef] text-[#146d72]"}`}>{children}</span>;
}

const slides = [
  <SlideFrame key="cover" number={1} dark eyebrow="Kinesys e Colégio Logosófico">
    <div className="grid w-full items-center gap-12 lg:grid-cols-[1.35fr_0.65fr]">
      <div className="max-w-[850px]">
        <Tag dark>Plataforma pedagógica</Tag>
        <h1 className="mt-7 font-serif text-[clamp(48px,6.5vw,92px)] leading-[0.98] tracking-[-0.045em]">
          O material <span className="text-[#b8e441]">Kinesys</span><br />no cotidiano<br />da escola
        </h1>
        <p className="mt-7 max-w-2xl text-[clamp(15px,1.45vw,21px)] leading-relaxed text-white/75">
          Uma plataforma para apoiar a preparação dos professores e ampliar as possibilidades de uso do material.
        </p>
        <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">Colégio Logosófico González Pecotche · Chapecó</p>
      </div>
      <div className="hidden justify-self-end lg:block">
        <div className="relative grid size-[250px] place-items-center rounded-[54px] border border-white/12 bg-white/8 shadow-[0_35px_90px_rgba(0,0,0,0.2)] backdrop-blur-sm">
          <div aria-hidden="true" className="absolute -left-7 top-10 size-14 rounded-2xl bg-[#45bec2]" />
          <div aria-hidden="true" className="absolute -bottom-5 right-10 size-20 rounded-full bg-[#a8d62e]" />
          <Image src="/brand/monograma-cl-branco.jpeg" alt="Monograma do Colégio Logosófico" width={150} height={150} loading="eager" className="size-[150px] rounded-[34px] object-cover" />
        </div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="teacher" number={2} eyebrow="O trabalho do professor">
    <div className="w-full">
      <Tag>A preparação de cada aula</Tag>
      <div className="mt-6 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <h2 className="font-serif text-[clamp(40px,5vw,70px)] leading-[1.02] tracking-[-0.04em]">O material como base.<br /><span className="text-[#178187]">A turma como contexto.</span></h2>
          <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#5b6d64]">A plataforma reúne o que o professor precisa para preparar a aula, com o material Kinesys como referência.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {[
            { icon: BookOpenText, title: "Consultar", text: "Explorar o conteúdo e as orientações pedagógicas do material." },
            { icon: LibraryBig, title: "Relacionar", text: "Reunir referências e recursos que ajudem a trabalhar o tema." },
            { icon: NotebookPen, title: "Preparar", text: "Organizar a abordagem e as atividades para aquela turma." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-[26px] border border-[#dae5df] bg-white p-5 shadow-[0_18px_55px_rgba(24,57,43,0.06)]">
              <div className="grid size-11 place-items-center rounded-2xl bg-[#e8f3ef] text-[#17777b]"><Icon className="size-5" strokeWidth={1.8} /></div>
              <h3 className="mt-5 font-serif text-[24px]">{title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-[#5b6d64]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="experience" number={3} dark eyebrow="A proposta da plataforma">
    <div className="w-full">
      <Tag dark>Organização por aula</Tag>
      <h2 className="mt-7 max-w-6xl font-serif text-[clamp(42px,5vw,72px)] leading-[1.02] tracking-[-0.04em]">O conteúdo e a preparação<br /><span className="text-[#b8e441]">no mesmo ambiente</span></h2>
      <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: BookOpenText, title: "Material oficial", text: "Conteúdo Kinesys e orientações do professor disponíveis por aula." },
          { icon: LibraryBig, title: "Recursos reunidos", text: "Vídeos, links e referências associados ao tema em preparação." },
          { icon: NotebookPen, title: "Mesa de Preparação", text: "Um espaço livre para o professor organizar ideias, anotações e atividades." },
          { icon: Layers3, title: "Acesso por perfil", text: "Professores e alunos encontram os materiais adequados ao seu papel." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-[24px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
            <Icon className="size-5 text-[#79d6d8]" strokeWidth={1.7} />
            <h3 className="mt-5 font-serif text-[24px]">{title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-white/75">{text}</p>
          </div>
        ))}
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="demo" number={4} eyebrow="Demonstração da plataforma">
    <div className="grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div>
        <Tag>O percurso do professor</Tag>
        <h2 className="mt-7 font-serif text-[clamp(42px,5.5vw,76px)] leading-[1] tracking-[-0.04em]">Uma aula<br /><span className="text-[#178187]">na plataforma</span></h2>
        <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[#5b6d64]">Uma demonstração com o material do 5º ano, acompanhando a consulta e a preparação de uma aula.</p>
        <Link href="/" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-2xl bg-[#08366f] px-5 text-sm font-semibold text-white shadow-[0_14px_35px_rgba(8,54,111,0.2)] transition hover:-translate-y-0.5 hover:bg-[#0b447f] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#178187] sm:w-auto">
          Abrir demonstração <ExternalLink className="size-4" />
        </Link>
      </div>
      <div className="rounded-[30px] border border-[#d5e1db] bg-white p-6 shadow-[0_25px_70px_rgba(15,57,50,0.09)] sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#17777b]">Uma aula do 5º ano</p>
        <ol className="mt-6 space-y-6">
          {[
            ["Consultar o material", "Conteúdo e orientações Kinesys."],
            ["Preparar a aula", "Referências e ideias na Mesa de Preparação."],
            ["Conhecer o acesso do aluno", "O material disponível para acompanhar a aula."],
          ].map(([title, text], index) => (
            <li key={title} className="flex items-start gap-4">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e8f3ef] text-xs font-semibold text-[#17777b]">{String(index + 1).padStart(2, "0")}</span>
              <div><h3 className="font-serif text-[25px]">{title}</h3><p className="mt-2 text-[14px] leading-relaxed text-[#5b6d64]">{text}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="continuity" number={5} dark eyebrow="Ao longo dos ciclos">
    <div className="w-full">
      <Tag dark>Continuidade do trabalho docente</Tag>
      <h2 className="mt-7 max-w-5xl font-serif text-[clamp(42px,5vw,72px)] leading-[1.02] tracking-[-0.04em]">O trabalho permanece<br /><span className="text-[#b8e441]">para as próximas aulas</span></h2>
      <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-white/75">Preparações, referências e observações podem ser retomadas e aprimoradas ao longo dos ciclos.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ["Na preparação", "O professor organiza a abordagem e reúne os recursos que pretende utilizar."],
          ["Depois da experiência", "Registra observações e ideias para desenvolver em uma próxima oportunidade."],
          ["No próximo ciclo", "Retoma o que construiu e adapta a preparação à nova turma."],
        ].map(([title, text]) => (
          <div key={title} className="rounded-[24px] border border-white/12 bg-white/[0.07] p-5 backdrop-blur-sm">
            <h3 className="font-serif text-[25px]">{title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-white/75">{text}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-4xl text-[14px] leading-relaxed text-[#b9eeee]">Mais apoio à preparação do professor, com possibilidades de enriquecer a experiência dos alunos a partir do material Kinesys.</p>
    </div>
  </SlideFrame>,

  <SlideFrame key="implementation" number={6} eyebrow="Construção conjunta">
    <div className="w-full">
      <Tag>45 dias de implantação</Tag>
      <h2 className="mt-6 max-w-5xl font-serif text-[clamp(40px,5vw,70px)] leading-[1.02] tracking-[-0.04em]">A implantação no<br /><span className="text-[#178187]">Colégio Logosófico</span></h2>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          { icon: BookOpenText, title: "Kinesys", text: "Orienta o uso e a apresentação do material, preservando sua identidade pedagógica." },
          { icon: MessagesSquare, title: "Colégio Logosófico", text: "Traz a realidade dos professores e valida a experiência no cotidiano da escola." },
          { icon: Layers3, title: "Desenvolvimento", text: "Constrói a plataforma e conduz a implantação conforme o escopo combinado." },
        ].map(({ icon: Icon, title, text }) => (
          <div key={title} className="rounded-[26px] border border-[#dae4de] bg-white p-5 shadow-[0_18px_55px_rgba(24,57,43,0.05)]">
            <Icon className="size-5 text-[#17777b]" strokeWidth={1.8} />
            <h3 className="mt-4 font-serif text-[26px]">{title}</h3>
            <p className="mt-3 text-[14px] leading-relaxed text-[#5b6d64]">{text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 flex items-start gap-3 rounded-2xl border border-[#cddfc2] bg-[#eaf2e2] px-5 py-4 text-[14px] leading-relaxed text-[#405b4e]">
        <CalendarRange className="mt-0.5 size-5 shrink-0 text-[#537b31]" />
        <p><strong>Encontros semanais</strong> para validar e ajustar a experiência. Ao final, a plataforma completa, publicada e pronta para uso no escopo acordado.</p>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="investment" number={7} eyebrow="Proposta de implantação">
    <div className="grid w-full items-center gap-10 lg:grid-cols-[0.82fr_1.18fr]">
      <div className="max-w-2xl">
        <Tag>Investimento e próximos passos</Tag>
        <h2 className="mt-7 font-serif text-[clamp(42px,5.5vw,76px)] leading-[1] tracking-[-0.04em]">Plataforma completa<br /><span className="text-[#178187]">em 45 dias</span></h2>
        <p className="mt-6 max-w-lg text-[15px] leading-relaxed text-[#5b6d64]">Implantação no Colégio Logosófico, com o material Kinesys como base e acompanhamento durante a construção.</p>
        <p className="mt-5 max-w-lg text-[14px] leading-relaxed text-[#5b6d64]">Com o escopo e as responsabilidades alinhados, seguimos para a formalização e a reunião de início.</p>
      </div>
      <div className={`${styles.priceCard} overflow-hidden rounded-[32px] bg-[#08366f] text-white shadow-[0_30px_90px_rgba(8,54,111,0.22)]`}>
        <div className="border-b border-white/10 p-7">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#79d6d8]">Implantação completa</p>
          <p className="mt-3 font-serif text-[clamp(44px,6vw,76px)] leading-none tracking-[-0.04em]">R$ 17.500</p>
          <p className="mt-4 text-[14px] text-white/75">50% na contratação · 50% na entrega</p>
        </div>
        <div className="grid gap-6 p-7 sm:grid-cols-2">
          <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#79d6d8]">Prazo</p><p className="mt-2 font-serif text-3xl">45 dias</p><p className="mt-2 text-[13px] leading-relaxed text-white/75">a partir da reunião de início e dos materiais acordados</p></div>
          <div><p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#79d6d8]">Continuidade</p><p className="mt-2 font-serif text-3xl">R$ 1.290<span className="text-sm text-white/75"> / mês</span></p><p className="mt-2 text-[13px] leading-relaxed text-white/75">após a entrega da plataforma</p></div>
        </div>
        <div className={`${styles.commercialNote} mx-7 mb-7 flex items-start gap-3 rounded-2xl bg-white/8 px-4 py-3 text-[13px] leading-relaxed text-white/75`}><Check className="mt-0.5 size-4 shrink-0 text-[#b8e441]" />A mensalidade inclui suporte, correções, monitoramento e pequenas melhorias. Novos módulos, infraestrutura e consumo de inteligência artificial serão alinhados separadamente.</div>
      </div>
    </div>
  </SlideFrame>,
];

export function KinesysPresentationDeck() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index: number) => {
    setCurrent(Math.max(0, Math.min(totalSlides - 1, index)));
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      if (
        event.altKey || event.ctrlKey || event.metaKey ||
        (target instanceof HTMLElement && target.closest("button, a, input, textarea, select, [contenteditable]"))
      ) return;

      // Up/down, space and Page Up/Down retain native scrolling on long slides.
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setCurrent((value) => Math.min(totalSlides - 1, value + 1));
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setCurrent((value) => Math.max(0, value - 1));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const enterFullscreen = async () => {
    if (!document.fullscreenEnabled) return;
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
      else await document.exitFullscreen();
    } catch {
      // Some mobile browsers disallow fullscreen; the regular deck stays usable.
    }
  };

  return (
    <main className={`${styles.deck} bg-[#e8eee9] antialiased`}>
      <div key={current} className={styles.slideViewport} tabIndex={0} aria-label="Conteúdo do slide. Role para ler.">
        {slides[current]}
      </div>

      <footer className={styles.footer}>
        <p className={styles.mobileHint}>Role para ler · Use as setas para mudar de slide</p>
        <div className={styles.controlsRow}>
          <div className={styles.keyboardHint}><MessagesSquare className="size-3.5" />Use ← → para navegar</div>
          <nav aria-label="Navegação da apresentação" className={styles.navigation}>
            <button onClick={() => goTo(current - 1)} disabled={current === 0} className={styles.arrow} aria-label="Slide anterior"><ArrowLeft className="size-5" /></button>
            <div className="flex items-center">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button key={index} onClick={() => goTo(index)} className={styles.dotButton} aria-label={`Ir para o slide ${index + 1}`} aria-current={index === current ? "step" : undefined}>
                  <span className={`${styles.dot} ${index === current ? styles.activeDot : ""}`} />
                </button>
              ))}
            </div>
            <button onClick={() => goTo(current + 1)} disabled={current === totalSlides - 1} className={styles.arrow} aria-label="Próximo slide"><ArrowRight className="size-5" /></button>
          </nav>
          <button onClick={enterFullscreen} className={styles.fullscreen} aria-label="Alternar tela cheia"><Fullscreen className="size-4" /></button>
        </div>
        <p className="sr-only" aria-live="polite" aria-atomic="true">Slide {current + 1} de {totalSlides}</p>
      </footer>
    </main>
  );
}
