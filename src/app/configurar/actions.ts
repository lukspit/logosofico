"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import {
  createAdminClient,
  isBootstrapAvailable,
} from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const ORGANIZATION_ID = "10000000-0000-4000-8000-000000000001";

const bootstrapSchema = z
  .object({
    fullName: z.string().trim().min(3).max(120),
    email: z.email(),
    password: z.string().min(12).max(128),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    path: ["passwordConfirmation"],
    message: "As senhas precisam ser iguais.",
  });

export async function bootstrapAdmin(formData: FormData) {
  const parsed = bootstrapSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirmation: formData.get("passwordConfirmation"),
  });

  if (!parsed.success) redirect("/configurar?erro=dados-invalidos");

  let bootstrapAvailable = false;
  try {
    bootstrapAvailable = await isBootstrapAvailable();
  } catch {
    redirect("/configurar?erro=conexao");
  }

  if (!bootstrapAvailable) redirect("/entrar?configurado=1");

  const admin = createAdminClient();
  const { data, error: userError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.fullName },
  });

  if (userError || !data.user) redirect("/configurar?erro=usuario");

  const { error: membershipError } = await admin.from("memberships").insert({
    organization_id: ORGANIZATION_ID,
    user_id: data.user.id,
    role: "admin",
    is_active: true,
  });

  if (membershipError) {
    await admin.auth.admin.deleteUser(data.user.id);
    redirect("/configurar?erro=vinculo");
  }

  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (signInError) redirect("/entrar?configurado=1");
  redirect("/");
}
