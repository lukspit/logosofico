"use client";

import { useActionState } from "react";
import { CheckCircle2, LoaderCircle, MessageSquareText } from "lucide-react";

import {
  addPedagogicalNote,
  type NoteActionState,
} from "@/app/aulas/[slug]/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialState: NoteActionState = { ok: false, message: "" };

export function ContributionDialog({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(
    addPedagogicalNote,
    initialState,
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="rounded-xl">
          <MessageSquareText className="size-4" />
          Contribuir
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-lg">
        {state.ok ? (
          <div className="py-6 text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e7f2dd] text-[#588027]">
              <CheckCircle2 className="size-5" />
            </div>
            <DialogTitle className="mt-5 font-serif text-2xl text-[#173657]">
              Contribuição registrada
            </DialogTitle>
            <DialogDescription className="mx-auto mt-2 max-w-sm">
              {state.message}
            </DialogDescription>
            <DialogClose asChild>
              <Button className="mt-6 rounded-xl bg-[#08366f]">Concluir</Button>
            </DialogClose>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-[#173657]">
                Registrar uma descoberta
              </DialogTitle>
              <DialogDescription>
                Compartilhe algo que funcionou, uma dificuldade percebida ou
                uma adaptação que pode ajudar os próximos professores.
              </DialogDescription>
            </DialogHeader>
            <form action={action} className="space-y-4">
              <input type="hidden" name="slug" value={slug} />
              <div className="space-y-2">
                <Label htmlFor="note-title">Título</Label>
                <Input
                  id="note-title"
                  name="title"
                  required
                  minLength={4}
                  maxLength={120}
                  placeholder="Ex.: Começar pela memória da cidade"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="note-body">O que você descobriu?</Label>
                <Textarea
                  id="note-body"
                  name="body"
                  required
                  minLength={12}
                  maxLength={2400}
                  className="min-h-32 resize-none"
                  placeholder="Conte o contexto, o que aconteceu e o que você recomenda…"
                />
              </div>
              {state.message && (
                <p
                  role="alert"
                  className="rounded-xl bg-[#fff4ef] px-3 py-2 text-xs text-[#9b422e]"
                >
                  {state.message}
                </p>
              )}
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancelar
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={pending}
                  className="rounded-xl bg-[#08366f]"
                >
                  {pending ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <MessageSquareText className="size-4" />
                  )}
                  Salvar contribuição
                </Button>
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
