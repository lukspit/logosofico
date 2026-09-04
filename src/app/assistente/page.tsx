import { AssistantPanel } from "@/components/assistant-panel";
import { PlatformShell } from "@/components/platform-shell";

export default function AssistantPage() {
  return <PlatformShell><div className="mb-6"><p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#17767a]">Inteligência do acervo</p><h1 className="mt-1 font-serif text-4xl text-[#173657] sm:text-5xl">Pensar com o conteúdo</h1><p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6f7c75]">Uma camada de apoio para transformar referências aprovadas em perguntas, conexões e possibilidades pedagógicas.</p></div><AssistantPanel /></PlatformShell>;
}
