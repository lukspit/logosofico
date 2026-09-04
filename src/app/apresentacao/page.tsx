import type { Metadata } from "next";

import { PresentationDeck } from "./presentation-deck";

export const metadata: Metadata = {
  title: "Plataforma Pedagógica Logosófica",
  description: "Apresentação da visão e proposta de implantação da plataforma pedagógica.",
};

export default function PresentationPage() {
  return <PresentationDeck />;
}
