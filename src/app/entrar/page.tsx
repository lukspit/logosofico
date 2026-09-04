import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, LockKeyhole } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{ erro?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const hasError = Boolean(params.erro);

  return (
    <main className="grid min-h-screen bg-[#f4f7f2] lg:grid-cols-[1.05fr_0.95fr]">
      <section className="relative hidden overflow-hidden bg-[#08366f] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -top-32 -right-24 size-[430px] rounded-full border-[74px] border-[#15518d]" />
        <div className="absolute -bottom-40 -left-24 size-[360px] rounded-full bg-[#a8d62e]" />
        <div className="relative flex items-center gap-3"><div className="grid size-12 place-items-center rounded-xl bg-white"><Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={40} height={40} className="size-9 object-contain" /></div><div><p className="text-xs uppercase tracking-[0.22em] text-white/55">Colégio</p><p className="font-serif text-xl">Logosófico</p></div></div>
        <div className="relative my-auto max-w-[620px]"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fdfdc]">Plataforma Kinesis</p><h1 className="mt-5 font-serif text-5xl leading-[1.02] tracking-[-0.03em] xl:text-6xl">Conhecimento que cresce quando é compartilhado.</h1><p className="mt-6 max-w-lg text-base leading-relaxed text-white/65">Aulas, referências e experiências pedagógicas reunidas para apoiar cada professor, aluno e família.</p><div className="mt-9 space-y-3 text-sm text-white/78">{["Todo o percurso do 5º ano em um só lugar", "Experiências próprias para professor e aluno", "Memória pedagógica construída pelo colégio"].map((item) => <p key={item} className="flex items-center gap-3"><CheckCircle2 className="size-4 text-[#bade55]" />{item}</p>)}</div></div>
        <p className="relative text-xs text-white/38">Colégio Logosófico González Pecotche · Chapecó</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex items-center gap-3 lg:hidden"><Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={44} height={44} className="size-11 rounded-xl bg-white object-contain p-1 shadow-sm" /><span className="font-serif text-xl text-[#173657]">Colégio Logosófico</span></div>
          <div className="mb-8"><div className="mb-5 grid size-11 place-items-center rounded-2xl bg-[#e9f2e0] text-[#47751d]"><LockKeyhole className="size-5" /></div><h2 className="font-serif text-4xl tracking-[-0.025em] text-[#12375c]">Bem-vindo de volta</h2><p className="mt-2 text-sm leading-relaxed text-[#6f7d75]">Entre com seu acesso institucional para continuar.</p></div>
          {hasError && <div role="alert" className="mb-5 rounded-xl border border-[#efc9be] bg-[#fff5f1] px-4 py-3 text-sm text-[#9b422e]">Não conseguimos entrar com esses dados. Confira seu e-mail e sua senha.</div>}
          <form action={signIn} className="space-y-5">
            <input type="hidden" name="next" value={params.next || "/"} />
            <div className="space-y-2"><Label htmlFor="email">E-mail institucional</Label><Input id="email" name="email" type="email" autoComplete="email" required placeholder="nome@colegio.com.br" className="h-12 rounded-xl bg-white" /></div>
            <div className="space-y-2"><div className="flex items-center justify-between"><Label htmlFor="password">Senha</Label><button type="button" className="text-xs font-semibold text-[#126b73]">Esqueci minha senha</button></div><Input id="password" name="password" type="password" autoComplete="current-password" minLength={8} required className="h-12 rounded-xl bg-white" /></div>
            <Button type="submit" className="h-12 w-full rounded-xl bg-[#08366f] text-sm hover:bg-[#0b447f]">Entrar na plataforma<ArrowRight className="size-4" /></Button>
          </form>
          <p className="mt-7 text-center text-xs leading-relaxed text-[#89938e]">Os acessos são criados pela equipe do colégio.<br />Se precisar de ajuda, fale com a coordenação.</p>
          <p className="mt-4 text-center text-xs"><Link href="/configurar" className="font-semibold text-[#126b73] hover:underline">Configurar o primeiro administrador</Link></p>
        </div>
      </section>
    </main>
  );
}
