import type { Metadata } from "next";
import TechWordle from "@/components/arcade/wordle/TechWordle";

export const metadata: Metadata = { title: "Tech Wordle", description: "Guess the five-letter tech word in six tries. A new daily puzzle every day." };

export default function WordlePage() {
  return <TechWordle />;
}
