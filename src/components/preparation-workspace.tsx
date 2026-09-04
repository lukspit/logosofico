"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowUp,
  BookOpenText,
  Check,
  CheckSquare2,
  ExternalLink,
  FileText,
  Link2,
  List,
  LoaderCircle,
  Paperclip,
  Plus,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PreparationAttachment } from "@/lib/data/preparations";
import type { MaterialManifest } from "@/lib/material-reader";

type SaveState = "idle" | "saving" | "saved" | "error";

type AssistantMessage = {
  content: string;
  id: string;
  role: "assistant" | "user";
};

type PreparationWorkspaceProps = {
  preparationId: string;
  initialTitle: string;
  initialBody: string;
  initialAttachments: PreparationAttachment[];
  initialUpdatedAt: string;
  lesson: {
    slug: string;
    number: number;
    title: string;
    summary: string;
    essentialQuestion: string;
  };
  teacherMaterial: MaterialManifest;
  studentMaterial: MaterialManifest;
  persistence: "supabase" | "local";
};

const assistantSuggestions = [
  "Ajude-me a entender as conexões centrais desta aula.",
  "Sugira uma atividade concreta e sem tela.",
  "Que perguntas podem abrir uma boa conversa com a turma?",
];

export function PreparationWorkspace({
  preparationId,
  initialTitle,
  initialBody,
  initialAttachments,
  initialUpdatedAt,
  lesson,
  teacherMaterial,
  studentMaterial,
  persistence,
}: PreparationWorkspaceProps) {
  const localKey = `logosofico:preparacao:${lesson.slug}`;
  const [title, setTitle] = useState(initialTitle);
  const [body, setBody] = useState(initialBody);
  const [attachments, setAttachments] = useState(initialAttachments);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [updatedAt, setUpdatedAt] = useState(initialUpdatedAt);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>([]);
  const [assistantError, setAssistantError] = useState("");
  const [asking, setAsking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const assistantScrollRef = useRef<HTMLDivElement>(null);
  const didHydrateLocal = useRef(false);

  useEffect(() => {
    if (persistence !== "local" || didHydrateLocal.current) return;
    didHydrateLocal.current = true;
    const saved = window.localStorage.getItem(localKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as { title?: string; body?: string; updatedAt?: string };
      const timeout = window.setTimeout(() => {
        if (parsed.title) setTitle(parsed.title);
        if (typeof parsed.body === "string") setBody(parsed.body);
        if (parsed.updatedAt) setUpdatedAt(parsed.updatedAt);
      }, 0);
      return () => window.clearTimeout(timeout);
    } catch {
      window.localStorage.removeItem(localKey);
    }
  }, [localKey, persistence]);

  useEffect(() => {
    if (title.trim().length === 0) return;
    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setSaveState("saving");
      if (persistence === "local") {
        const savedAt = new Date().toISOString();
        window.localStorage.setItem(localKey, JSON.stringify({ title, body, updatedAt: savedAt }));
        setUpdatedAt(savedAt);
        setSaveState("saved");
        return;
      }

      try {
        const response = await fetch(`/api/preparacoes/${preparationId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, body }),
          signal: controller.signal,
        });
        const data = (await response.json()) as { updatedAt?: string; error?: string };
        if (!response.ok || !data.updatedAt) throw new Error(data.error || "Falha ao salvar");
        setUpdatedAt(data.updatedAt);
        setSaveState("saved");
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setSaveState("error");
      }
    }, 850);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [body, localKey, persistence, preparationId, title]);

  useEffect(() => {
    const scrollArea = assistantScrollRef.current;
    if (!scrollArea) return;
    scrollArea.scrollTo({
      behavior: assistantMessages.length > 1 ? "smooth" : "auto",
      top: scrollArea.scrollHeight,
    });
  }, [asking, assistantMessages]);

  function appendToPreparation(content: string) {
    const editor = editorRef.current;
    const start = editor?.selectionStart ?? body.length;
    const end = editor?.selectionEnd ?? body.length;
    const spacing = body.length > 0 && start > 0 ? "\n\n" : "";
    const next = `${body.slice(0, start)}${spacing}${content}${body.slice(end)}`;
    setBody(next);
    window.requestAnimationFrame(() => {
      editor?.focus();
      const caret = start + spacing.length + content.length;
      editor?.setSelectionRange(caret, caret);
    });
  }

  function addLink(event: FormEvent) {
    event.preventDefault();
    const label = linkTitle.trim() || "Referência";
    const url = linkUrl.trim();
    if (!/^https?:\/\//i.test(url)) return;
    appendToPreparation(`${label}\n${url}`);
    setLinkTitle("");
    setLinkUrl("");
    setLinkOpen(false);
  }

  async function askAssistant(event: FormEvent) {
    event.preventDefault();
    const submittedQuestion = question.trim();
    if (submittedQuestion.length < 3 || asking) return;
    const userMessage: AssistantMessage = {
      content: submittedQuestion,
      id: crypto.randomUUID(),
      role: "user",
    };
    setAssistantMessages((current) => [...current, userMessage]);
    setQuestion("");
    setAsking(true);
    setAssistantError("");
    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: submittedQuestion, lessonSlug: lesson.slug }),
      });
      const data = (await response.json()) as { answer?: string; error?: string };
      if (!response.ok || !data.answer) throw new Error(data.error || "Falha ao consultar o assistente.");
      setAssistantMessages((current) => [
        ...current,
        { content: data.answer!, id: crypto.randomUUID(), role: "assistant" },
      ]);
    } catch (error) {
      setAssistantError(error instanceof Error ? error.message : "Não foi possível consultar o assistente.");
    } finally {
      setAsking(false);
    }
  }

  async function uploadFile(file: File | undefined) {
    if (!file || uploading) return;
    if (persistence === "local") {
      setUploadError("A conexão do banco precisa ser concluída para salvar arquivos.");
      return;
    }
    setUploading(true);
    setUploadError("");
    const formData = new FormData();
    formData.set("file", file);
    try {
      const response = await fetch(`/api/preparacoes/${preparationId}/arquivos`, {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { attachment?: PreparationAttachment; error?: string };
      if (!response.ok || !data.attachment) throw new Error(data.error || "Falha ao anexar arquivo.");
      setAttachments((current) => [...current, data.attachment!]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Não foi possível anexar o arquivo.");
    } finally {
      setUploading(false);
    }
  }

  const saveLabel = saveState === "saving"
    ? "Salvando…"
    : saveState === "error"
      ? "Falha ao salvar"
      : `Salvo ${formatSavedAt(updatedAt)}`;

  return (
    <div className="min-h-screen bg-[#eef2ed] text-[#173657]">
      <header className="sticky top-0 z-30 border-b border-[#dbe2dc] bg-[#f8faf7]/95 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1800px] items-center gap-4 px-4 sm:px-6">
          <Button asChild variant="ghost" size="icon" className="rounded-xl text-[#51665d]"><Link href={`/aulas/${lesson.slug}`}><ArrowLeft className="size-4" /><span className="sr-only">Voltar para a aula</span></Link></Button>
          <div className="min-w-0"><p className="text-[10px] font-semibold uppercase tracking-[0.17em] text-[#18777b]">Mesa de preparação · Aula {lesson.number}</p><p className="truncate font-serif text-lg text-[#173657]">{lesson.title}</p></div>
          <div className={`ml-auto flex items-center gap-2 text-xs ${saveState === "error" ? "text-[#ad4b37]" : "text-[#718078]"}`}>{saveState === "saving" ? <LoaderCircle className="size-3.5 animate-spin" /> : <Check className="size-3.5" />}{saveLabel}</div>
        </div>
      </header>

      {persistence === "local" && <div className="border-b border-[#ead6a8] bg-[#fff7df] px-4 py-2 text-center text-xs text-[#775c21]">A Mesa está funcionando neste navegador. Assim que o MCP acessar o projeto correto, o salvamento passa para o Supabase.</div>}

      <main className="mx-auto grid max-w-[1800px] gap-5 p-4 sm:p-6 lg:grid-cols-[240px_minmax(420px,1fr)_300px] 2xl:grid-cols-[280px_minmax(480px,1fr)_340px]">
        <aside className="order-2 overflow-hidden rounded-[22px] border border-[#dbe3dc] bg-[#f8faf7] lg:order-1 lg:sticky lg:top-[96px] lg:h-[calc(100vh-120px)]">
          <div className="border-b border-[#e1e7e2] p-5"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#718078]">Materiais da aula</p><p className="mt-2 text-xs leading-relaxed text-[#718078]">Consulte os cadernos e leve o que importa para a sua mesa.</p></div>
          <div className="space-y-5 overflow-y-auto p-4 lg:h-[calc(100%-89px)]">
            <MaterialGroup manifest={teacherMaterial} onAdd={appendToPreparation} />
            <MaterialGroup manifest={studentMaterial} onAdd={appendToPreparation} />
          </div>
        </aside>

        <section className="order-1 min-h-[calc(100vh-120px)] rounded-[26px] border border-[#d9e1da] bg-white shadow-[0_18px_60px_rgba(24,55,70,0.07)] lg:order-2">
          <div className="border-b border-[#edf0ec] px-5 py-5 sm:px-8">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} aria-label="Título da preparação" className="h-auto border-0 bg-transparent px-0 font-serif text-2xl shadow-none focus-visible:ring-0 sm:text-3xl" />
            <p className="mt-2 text-xs text-[#859089]">Escreva e organize do seu jeito. Nada aqui é obrigatório.</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-b border-[#edf0ec] px-5 py-3 sm:px-8">
            <Button type="button" variant="ghost" size="sm" className="rounded-lg text-[#536b61]" onClick={() => appendToPreparation("• ")}><List className="size-4" />Lista</Button>
            <Button type="button" variant="ghost" size="sm" className="rounded-lg text-[#536b61]" onClick={() => appendToPreparation("☐ ")}><CheckSquare2 className="size-4" />Checklist</Button>
            <Button type="button" variant="ghost" size="sm" className="rounded-lg text-[#536b61]" onClick={() => setLinkOpen((open) => !open)}><Link2 className="size-4" />Link</Button>
            <label className="inline-flex h-8 cursor-pointer items-center gap-2 rounded-lg px-3 text-xs font-medium text-[#536b61] transition hover:bg-[#f2f5f1]">
              {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <Paperclip className="size-4" />}Anexar
              <input type="file" className="sr-only" disabled={uploading} accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.doc,.docx,.ppt,.pptx" onChange={(event) => void uploadFile(event.target.files?.[0])} />
            </label>
          </div>

          {linkOpen && <form onSubmit={addLink} className="grid gap-2 border-b border-[#e5ebe5] bg-[#f8faf7] p-4 sm:grid-cols-[0.8fr_1.4fr_auto] sm:px-8"><Input value={linkTitle} onChange={(event) => setLinkTitle(event.target.value)} placeholder="Nome da referência" className="rounded-xl bg-white" /><Input value={linkUrl} onChange={(event) => setLinkUrl(event.target.value)} type="url" required placeholder="https://…" className="rounded-xl bg-white" /><Button type="submit" className="rounded-xl bg-[#0a477f]">Adicionar</Button></form>}

          <div className="px-5 py-6 sm:px-8 sm:py-8">
            <Textarea ref={editorRef} value={body} onChange={(event) => setBody(event.target.value)} placeholder={"Comece a preparar aqui…\n\nPode ser uma ideia, uma sequência, uma lista de materiais ou qualquer coisa que ajude na aula."} className="min-h-[520px] resize-none border-0 bg-transparent p-0 text-[15px] leading-8 text-[#30495b] shadow-none placeholder:text-[#a1aaa5] focus-visible:ring-0" />

            {(attachments.length > 0 || uploadError) && <div className="mt-8 border-t border-[#e7ece7] pt-6"><p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#718078]">Anexos</p>{uploadError && <p role="alert" className="mt-3 rounded-xl bg-[#fff3ee] px-3 py-2 text-xs text-[#9d4937]">{uploadError}</p>}<div className="mt-3 grid gap-2 sm:grid-cols-2">{attachments.map((attachment) => <a key={attachment.id} href={attachment.url || undefined} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl border border-[#e0e7e1] p-3 transition hover:border-[#9fc9c5] hover:bg-[#f7faf7]"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf3ef] text-[#3d7272]"><FileText className="size-4" /></span><span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#385267]">{attachment.fileName}</span><span className="mt-0.5 block text-[10px] text-[#8a9690]">{formatBytes(attachment.sizeBytes)}</span></span></a>)}</div></div>}
          </div>
        </section>

        <aside className="order-3 flex min-h-[620px] flex-col overflow-hidden rounded-[22px] border border-[#d7e2df] bg-[#f5faf8] lg:sticky lg:top-[96px] lg:h-[calc(100vh-120px)] lg:min-h-0">
          <div className="shrink-0 border-b border-[#dfe9e5] p-5"><div className="grid size-10 place-items-center rounded-xl bg-[#08366f] text-[#79d4d1]"><Sparkles className="size-[18px]" /></div><h2 className="mt-4 font-serif text-xl text-[#173657]">Assistente da aula</h2><p className="mt-1 text-xs leading-relaxed text-[#718078]">Pergunte sobre o material e leve somente o que fizer sentido para a sua mesa.</p></div>
          <div className="flex min-h-0 flex-1 flex-col">
            <div ref={assistantScrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-4 py-5">
              {assistantMessages.length === 0 ? <div className="flex min-h-full flex-col"><div className="space-y-2">{assistantSuggestions.map((suggestion) => <button type="button" key={suggestion} onClick={() => setQuestion(suggestion)} className="w-full rounded-xl border border-[#dfe8e3] bg-white p-3 text-left text-[11px] leading-relaxed text-[#536b61] transition hover:border-[#9bc6c2]">{suggestion}</button>)}</div><div className="flex flex-1 items-center py-8"><div className="mx-auto max-w-[240px] text-center"><Sparkles className="mx-auto size-5 text-[#8bb8b2]" /><p className="mt-3 text-xs leading-relaxed text-[#829089]">A conversa aparecerá aqui. Você poderá voltar e reler todas as perguntas e respostas.</p></div></div></div> : assistantMessages.map((message) => message.role === "user" ? <div key={message.id} className="ml-8 rounded-2xl rounded-br-md bg-[#08366f] px-4 py-3 text-xs leading-5 text-white shadow-sm"><p>{message.content}</p></div> : <div key={message.id} className="mr-3 rounded-2xl rounded-bl-md border border-[#e1e9e5] bg-white p-4 shadow-sm"><div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2b7e7d]"><Sparkles className="size-3.5" />Assistente</div><AssistantMarkdown>{message.content}</AssistantMarkdown><Button type="button" size="sm" onClick={() => appendToPreparation(`Ideia do assistente\n${message.content}`)} className="mt-4 w-full rounded-xl bg-[#dff0e7] text-[#245e54] hover:bg-[#d2e9df]"><Plus className="size-3.5" />Adicionar à mesa</Button></div>)}
              {asking && <div className="mr-12 flex items-center gap-2 rounded-2xl rounded-bl-md border border-[#e1e9e5] bg-white px-4 py-3 text-[11px] text-[#718078] shadow-sm"><LoaderCircle className="size-4 animate-spin text-[#298d8e]" />Consultando o acervo…</div>}
            </div>
            <div className="shrink-0 border-t border-[#dfe9e5] bg-[#f5faf8]/95 p-4 backdrop-blur">
              {assistantError && <p role="alert" className="mb-3 rounded-xl bg-[#fff3ee] px-3 py-2 text-xs text-[#9d4937]">{assistantError}</p>}
              <form onSubmit={askAssistant} className="relative"><Textarea value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Pergunte sobre esta aula…" className="min-h-24 resize-none rounded-2xl border-[#d8e4df] bg-white pr-12 text-xs" /><Button type="submit" size="icon" disabled={asking || question.trim().length < 3} className="absolute right-2.5 bottom-2.5 size-8 rounded-xl bg-[#08366f]"><ArrowUp className="size-3.5" /><span className="sr-only">Enviar</span></Button></form>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

const assistantMarkdownComponents: Components = {
  a: ({ children, ...props }) => <a {...props} target="_blank" rel="noreferrer" className="font-medium text-[#126d73] underline decoration-[#8fc7c3] underline-offset-2">{children}</a>,
  blockquote: ({ children }) => <blockquote className="my-3 border-l-2 border-[#9bc6c2] pl-3 text-[#5d7068]">{children}</blockquote>,
  code: ({ children }) => <code className="rounded bg-[#eef3f0] px-1 py-0.5 font-mono text-[0.92em] text-[#315b5b]">{children}</code>,
  h1: ({ children }) => <h3 className="mb-2 mt-4 font-serif text-base font-semibold text-[#27485c] first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-2 mt-4 font-serif text-[15px] font-semibold text-[#27485c] first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-2 mt-3 text-xs font-semibold text-[#27485c] first:mt-0">{children}</h4>,
  li: ({ children }) => <li className="pl-0.5">{children}</li>,
  ol: ({ children }) => <ol className="my-3 list-decimal space-y-1.5 pl-5 marker:font-semibold marker:text-[#287b7c]">{children}</ol>,
  p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-[#284d60]">{children}</strong>,
  table: ({ children }) => <div className="my-3 overflow-x-auto"><table className="w-full border-collapse text-left text-[11px]">{children}</table></div>,
  td: ({ children }) => <td className="border border-[#dce6e1] p-2 align-top">{children}</td>,
  th: ({ children }) => <th className="border border-[#dce6e1] bg-[#eef5f1] p-2 font-semibold text-[#365b61]">{children}</th>,
  ul: ({ children }) => <ul className="my-3 list-disc space-y-1.5 pl-5 marker:text-[#287b7c]">{children}</ul>,
};

function AssistantMarkdown({ children }: { children: string }) {
  return <div className="text-xs leading-6 text-[#40596a]"><ReactMarkdown remarkPlugins={[remarkGfm]} components={assistantMarkdownComponents}>{children}</ReactMarkdown></div>;
}

function MaterialGroup({ manifest, onAdd }: { manifest: MaterialManifest; onAdd: (content: string) => void }) {
  const label = manifest.audience === "professor" ? "Guia do professor" : "Caderno do aluno";
  return <section><div className="flex items-start gap-3"><span className={`grid size-9 shrink-0 place-items-center rounded-xl ${manifest.audience === "professor" ? "bg-[#e4f1ee] text-[#176f72]" : "bg-[#edf2df] text-[#62822b]"}`}><BookOpenText className="size-4" /></span><div className="min-w-0"><p className="text-xs font-semibold text-[#355168]">{label}</p><p className="mt-0.5 text-[10px] text-[#89958f]">{manifest.pageCount} páginas</p></div><a href={`/leitor/${manifest.filename}`} target="_blank" rel="noreferrer" className="ml-auto rounded-lg p-2 text-[#6d8177] transition hover:bg-white hover:text-[#126d73]"><ExternalLink className="size-3.5" /><span className="sr-only">Abrir {label}</span></a></div><div className="mt-3 space-y-1">{manifest.sections.map((section) => <div key={section.id} className="group rounded-xl px-2 py-2 transition hover:bg-white"><a href={`/leitor/${manifest.filename}?pagina=${section.startPage}`} target="_blank" rel="noreferrer" className="block"><p className="text-[11px] font-medium text-[#4d655b]">{section.title}</p><p className="mt-0.5 text-[9px] text-[#929c97]">Páginas {section.startPage}–{section.endPage}</p></a><button type="button" onClick={() => onAdd(`${label} · ${section.title}\nPáginas ${section.startPage}–${section.endPage}\n/leitor/${manifest.filename}?pagina=${section.startPage}`)} className="mt-1.5 hidden text-[9px] font-semibold text-[#16767a] group-hover:block">+ Adicionar à mesa</button></div>)}</div></section>;
}

function formatSavedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "agora";
  return `às ${new Intl.DateTimeFormat("pt-BR", { hour: "2-digit", minute: "2-digit" }).format(date)}`;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
