import Image from "next/image";
import { redirect } from "next/navigation";
import { ArrowRight, KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  hasSupabaseAdminEnv,
  isBootstrapAvailable,
} from "@/lib/supabase/admin";
import { bootstrapAdmin } from "./actions";

export const dynamic = "force-dynamic";

type SetupPageProps = {
  searchParams: Promise<{ erro?: string }>;
};

const errorMessages: Record<string, string> = {
  "dados-invalidos":
    "Revise os dados. A senha precisa ter pelo menos 12 caracteres e as duas versões devem ser iguais.",
  conexao: "Não foi possível consultar o Supabase. Confira as chaves do arquivo .env.",
  usuario: "Não foi possível criar a conta. Confira o e-mail ou tente uma senha diferente.",
  vinculo: "A conta não foi vinculada e a operação foi desfeita com segurança. Tente novamente.",
};

export default async function SetupPage({ searchParams }: SetupPageProps) {
  const params = await searchParams;
  const hasAdminEnv = hasSupabaseAdminEnv();
  let available = false;

  if (hasAdminEnv) {
    try {
      available = await isBootstrapAvailable();
    } catch {
      // The page below explains that the connection needs attention.
    }
  }

  if (hasAdminEnv && available === false && !params.erro) {
    redirect("/entrar?configurado=1");
  }

  return (
    <main className="grid min-h-screen bg-[#f4f7f2] lg:grid-cols-[0.9fr_1.1fr]">
      <section className="relative hidden overflow-hidden bg-[#08366f] p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -top-32 -right-24 size-[430px] rounded-full border-[74px] border-[#15518d]" />
        <div className="absolute -bottom-40 -left-24 size-[360px] rounded-full bg-[#a8d62e]" />
        <div className="relative flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-xl bg-white">
            <Image src="/brand/monograma-cl-branco.jpeg" alt="Colégio Logosófico" width={40} height={40} className="size-9 object-contain" />
          </div>
          <div><p className="text-xs uppercase tracking-[0.22em] text-white/55">Colégio</p><p className="font-serif text-xl">Logosófico</p></div>
        </div>
        <div className="relative my-auto max-w-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8fdfdc]">Configuração inicial</p>
          <h1 className="mt-5 font-serif text-5xl leading-[1.03] tracking-[-0.03em]">O primeiro acesso abre as portas da plataforma.</h1>
          <p className="mt-6 text-base leading-relaxed text-white/65">Esta conta poderá convidar a equipe, organizar os papéis e acompanhar toda a experiência do colégio.</p>
          <div className="mt-9 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm leading-relaxed text-white/72">
            <ShieldCheck className="mb-3 size-5 text-[#bade55]" />
            O cadastro inicial funciona uma única vez. Assim que a conta for criada, esta página será bloqueada automaticamente.
          </div>
        </div>
        <p className="relative text-xs text-white/38">Colégio Logosófico González Pecotche · Chapecó</p>
      </section>

      <section className="flex items-center justify-center px-5 py-12 sm:px-10">
        <div className="w-full max-w-[470px]">
          <div className="mb-8 grid size-11 place-items-center rounded-2xl bg-[#e9f2e0] text-[#47751d]"><KeyRound className="size-5" /></div>
          <h2 className="font-serif text-4xl tracking-[-0.025em] text-[#12375c]">Criar administrador</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#6f7d75]">Use seus próprios dados. A senha será enviada diretamente ao Supabase e não aparecerá no projeto.</p>

          {!hasAdminEnv && (
            <div role="alert" className="mt-6 rounded-xl border border-[#efc9be] bg-[#fff5f1] px-4 py-3 text-sm text-[#9b422e]">A variável <code>SUPABASE_SECRET_KEY</code> não foi encontrada no servidor.</div>
          )}
          {params.erro && (
            <div role="alert" className="mt-6 rounded-xl border border-[#efc9be] bg-[#fff5f1] px-4 py-3 text-sm text-[#9b422e]">{errorMessages[params.erro] || "Não foi possível concluir a configuração."}</div>
          )}

          <form action={bootstrapAdmin} className="mt-7 space-y-4">
            <div className="space-y-2"><Label htmlFor="fullName">Nome completo</Label><Input id="fullName" name="fullName" autoComplete="name" required minLength={3} maxLength={120} className="h-12 rounded-xl bg-white" /></div>
            <div className="space-y-2"><Label htmlFor="email">E-mail de acesso</Label><Input id="email" name="email" type="email" autoComplete="email" required className="h-12 rounded-xl bg-white" /></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label htmlFor="password">Senha</Label><Input id="password" name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={128} className="h-12 rounded-xl bg-white" /></div>
              <div className="space-y-2"><Label htmlFor="passwordConfirmation">Repetir senha</Label><Input id="passwordConfirmation" name="passwordConfirmation" type="password" autoComplete="new-password" required minLength={12} maxLength={128} className="h-12 rounded-xl bg-white" /></div>
            </div>
            <p className="text-xs text-[#89938e]">Use pelo menos 12 caracteres. Esta conta terá permissão para administrar os acessos da escola.</p>
            <Button type="submit" disabled={!hasAdminEnv} className="h-12 w-full rounded-xl bg-[#08366f] text-sm hover:bg-[#0b447f]">Criar conta e entrar<ArrowRight className="size-4" /></Button>
          </form>
        </div>
      </section>
    </main>
  );
}
