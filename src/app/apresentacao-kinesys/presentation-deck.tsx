"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Fullscreen, MessagesSquare } from "lucide-react";

import styles from "../apresentacao/presentation-deck.module.css";
import clean from "./presentation-deck.module.css";

const totalSlides = 7;

function SlideFrame({ children, label, dark = false, number }: {
  children: React.ReactNode;
  label: string;
  dark?: boolean;
  number: number;
}) {
  return (
    <section aria-label={`Slide ${number} de ${totalSlides}: ${label}`} className={clean.frame} data-dark={dark}>
      <header className={clean.header}>
        <div className={clean.brand}>
          <Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={44} height={44} className={clean.logo} priority />
          <span>Colégio<br /><span className={clean.brandName}>Logosófico</span></span>
        </div>
        <span className={clean.counter}>{String(number).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}</span>
      </header>
      <div className={clean.content}>{children}</div>
    </section>
  );
}

const slides = [
  <SlideFrame key="cover" number={1} dark label="Uma plataforma para ampliar as possibilidades do material Kinesys">
    <div className={clean.cover}>
      <h1>Uma plataforma para <span className={clean.accent}>ampliar as possibilidades</span> do material Kinesys</h1>
      <div className={clean.coverArtwork} aria-hidden="true">
        <Image src="/brand/monograma-cl-branco.jpeg" alt="" width={150} height={150} loading="eager" />
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="preparation" number={2} label="A preparação do professor">
    <div className={clean.fullWidth}>
      <h2>A preparação<br /><span className={clean.accent}>do professor</span></h2>
      <div className={clean.threeColumns}>
        <div><h3>Material oficial</h3><p>Conteúdo Kinesys e orientações pedagógicas disponíveis por aula.</p></div>
        <div><h3>Recursos complementares</h3><p>Vídeos, links e referências reunidos junto ao tema.</p></div>
        <div><h3>Mesa de Preparação</h3><p>Um espaço livre para organizar a abordagem e as atividades da turma.</p></div>
      </div>
      <p className={clean.note}>O conteúdo oficial permanece identificado, com recursos e contribuições associados a cada aula.</p>
    </div>
  </SlideFrame>,

  <SlideFrame key="possibilities" number={3} dark label="Mais possibilidades a partir do material Kinesys">
    <div className={clean.fullWidth}>
      <h2>Mais possibilidades a partir<br /><span className={clean.accent}>do material Kinesys</span></h2>
      <div className={clean.twoColumns}>
        <div><h3>Mais do material na prática</h3><p>Facilidade para explorar as orientações, referências e atividades que fazem parte da proposta pedagógica.</p></div>
        <div><h3>Uma experiência enriquecida para o aluno</h3><p>O professor pode conectar o conteúdo a outros recursos e às experiências da turma, mantendo o Kinesys como referência.</p></div>
      </div>
    </div>
  </SlideFrame>,

  <SlideFrame key="demo" number={4} label="Uma aula na plataforma">
    <div className={clean.demo}>
      <h2>Uma aula<br /><span className={clean.accent}>na plataforma</span></h2>
      <p>A consulta e a preparação de uma aula com o material do 5º ano.</p>
      <Link href="/" target="_blank" rel="noopener noreferrer" className={clean.demoLink}>
        Abrir demonstração <ExternalLink size={18} aria-hidden="true" />
      </Link>
    </div>
  </SlideFrame>,

  <SlideFrame key="continuity" number={5} dark label="O trabalho permanece para os próximos ciclos">
    <div className={clean.fullWidth}>
      <h2>O trabalho permanece<br /><span className={clean.accent}>para os próximos ciclos</span></h2>
      <p className={clean.example}>Ao preparar esse conteúdo novamente, o professor encontra os recursos, as anotações e as ideias que reuniu no ciclo anterior. Pode retomar esse trabalho e adaptá-lo à nova turma.</p>
    </div>
  </SlideFrame>,

  <SlideFrame key="implementation" number={6} label="Implantação em conjunto">
    <div className={clean.fullWidth}>
      <h2>Implantação<br /><span className={clean.accent}>em conjunto</span></h2>
      <div className={clean.threeColumns}>
        <div><h3>Kinesys</h3><p>Orienta o uso e a apresentação do material.</p></div>
        <div><h3>Colégio Logosófico</h3><p>Traz a realidade dos professores e valida a experiência.</p></div>
        <div><h3>Desenvolvimento</h3><p>Constrói a plataforma e conduz a implantação.</p></div>
      </div>
      <p className={clean.note}>Encontros semanais até a entrega da plataforma completa, publicada e pronta para uso no escopo acordado.</p>
    </div>
  </SlideFrame>,

  <SlideFrame key="investment" number={7} label="Investimento">
    <div className={clean.investment}>
      <div><h2>Investimento</h2><p className={clean.scope}>Implantação no Colégio Logosófico.</p></div>
      <div className={clean.priceCard}>
        <div className={clean.priceHeader}>
          <h3>Implantação completa</h3>
          <p className={clean.price}>R$ 17.500</p>
          <p>50% na contratação · 50% na entrega</p>
        </div>
        <div className={clean.terms}>
          <div><h3>Prazo</h3><p className={clean.termValue}>45 dias</p><p>A partir da reunião de início e dos materiais acordados.</p></div>
          <div><h3>Continuidade</h3><p className={clean.termValue}>R$ 1.290<span> / mês</span></p><p>Após a entrega da plataforma.</p></div>
        </div>
        <p className={clean.commercialNote}>A mensalidade inclui suporte, correções, monitoramento e pequenas melhorias. Novos módulos, infraestrutura e consumo de inteligência artificial serão alinhados separadamente.</p>
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
