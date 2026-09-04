"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, BookOpenCheck, LoaderCircle, RotateCcw, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const suggestions = [
  "Crie três perguntas para abrir a conversa sobre fenômenos urbanos.",
  "Como adaptar esta aula para um aluno que precisa de mais apoio na leitura?",
  "Sugira uma atividade concreta, sem tela, para envolver as famílias.",
];

export function AssistantPanel() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function ask(event: FormEvent) {
    event.preventDefault();
    if (question.trim().length < 3 || loading) return;
    setLoading(true);
    setError("");
    setAnswer("");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error || "Falha ao consultar o assistente.");
      setAnswer(data.answer);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Falha ao consultar o assistente.");
    } finally {
      setLoading(false);
    }
  }

  return <div className="grid min-h-[620px] overflow-hidden rounded-[26px] border border-[#dfe6df] bg-white shadow-[0_16px_48px_rgba(27,52,75,0.06)] lg:grid-cols-[310px_1fr]">
    <aside className="border-b border-[#e7ece7] bg-[#f3f7f3] p-6 lg:border-r lg:border-b-0"><div className="grid size-11 place-items-center rounded-2xl bg-[#08366f] text-[#8fdfdc]"><Sparkles className="size-5" /></div><h2 className="mt-5 font-serif text-2xl text-[#173657]">Comece com uma intenção</h2><p className="mt-2 text-xs leading-relaxed text-[#6f7c75]">O assistente trabalha somente com o acervo aprovado e sinaliza quando a curadoria humana é necessária.</p><div className="mt-6 space-y-2">{suggestions.map((suggestion) => <button key={suggestion} onClick={() => setQuestion(suggestion)} className="w-full rounded-xl border border-[#dfe6df] bg-white p-3 text-left text-xs leading-relaxed text-[#4e665d] transition hover:border-[#9ac9c5] hover:bg-[#f9fbf8]">{suggestion}</button>)}</div><div className="mt-7 rounded-xl bg-[#e7f0dd] p-4"><p className="flex items-center gap-2 text-xs font-semibold text-[#456923]"><BookOpenCheck className="size-4" />Fontes controladas</p><p className="mt-2 text-[10px] leading-relaxed text-[#66775e]">6 aulas · 8 áreas do conhecimento · conteúdo oficial Kinesis</p></div></aside>
    <section className="flex flex-col p-5 sm:p-7"><div className="flex items-center justify-between"><div><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#17767a]">Assistente pedagógico</p><h1 className="mt-1 font-serif text-3xl text-[#173657]">Como posso apoiar sua preparação?</h1></div>{answer && <Button variant="ghost" size="icon" onClick={() => { setAnswer(""); setQuestion(""); }} className="rounded-xl"><RotateCcw className="size-4" /><span className="sr-only">Nova conversa</span></Button>}</div>
      <div className="flex flex-1 items-center justify-center py-8">{loading ? <div className="text-center"><LoaderCircle className="mx-auto size-7 animate-spin text-[#3e9797]" /><p className="mt-3 text-xs text-[#7b8881]">Consultando o acervo aprovado…</p></div> : answer ? <div className="w-full max-w-3xl rounded-2xl bg-[#f5f8f4] p-6"><div className="mb-4 flex items-center gap-2 text-xs font-semibold text-[#176f78]"><Sparkles className="size-4" />Resposta fundamentada no acervo</div><p className="whitespace-pre-wrap text-sm leading-7 text-[#40566a]">{answer}</p><p className="mt-5 border-t border-[#e2e8e2] pt-4 text-[10px] leading-relaxed text-[#89938e]">Revise esta sugestão antes de usá-la. A decisão pedagógica continua sendo do professor e da equipe do colégio.</p></div> : <div className="max-w-md text-center"><Sparkles className="mx-auto size-7 text-[#79aaa8]" /><p className="mt-4 font-serif text-xl text-[#365267]">Pergunte sobre conexões, abordagens, adaptações ou atividades para uma aula.</p></div>}</div>
      {error && <p role="alert" className="mb-3 rounded-xl border border-[#efc9be] bg-[#fff5f1] px-4 py-3 text-xs text-[#9b422e]">{error}</p>}
      <form onSubmit={ask} className="relative"><Textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Ex.: Como conectar cidadania e fenômenos urbanos em uma atividade de discussão?" className="min-h-24 resize-none rounded-2xl border-[#d9e1da] bg-[#fbfcfa] pr-14 pb-11 text-sm" /><div className="absolute right-3 bottom-3 flex items-center gap-2"><span className="hidden text-[9px] text-[#9aa39e] sm:inline">O conteúdo não é publicado automaticamente</span><Button type="submit" size="icon" disabled={loading || question.trim().length < 3} className="size-9 rounded-xl bg-[#08366f]"><ArrowUp className="size-4" /><span className="sr-only">Enviar pergunta</span></Button></div></form>
    </section>
  </div>;
}
