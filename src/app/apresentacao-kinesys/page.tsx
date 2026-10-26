import type { Metadata } from "next";

import { KinesysPresentationDeck } from "./presentation-deck";

export const metadata: Metadata = {
  title: "Kinesys | Plataforma Pedagógica Logosófica",
  description:
    "Uma plataforma para apoiar a preparação dos professores e ampliar as possibilidades de uso do material Kinesys no Colégio Logosófico.",
};

export default function KinesysPresentationPage() {
  return <KinesysPresentationDeck />;
}
