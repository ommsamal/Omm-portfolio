import type { Metadata } from "next";
import GuessOutput from "@/components/arcade/quiz/GuessOutput";

export const metadata: Metadata = { title: "Guess the Output", description: "Predict what Python, JavaScript, Java and C++ snippets print." };

export default function GuessOutputPage() {
  return <GuessOutput />;
}
