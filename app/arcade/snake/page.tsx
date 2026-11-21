import type { Metadata } from "next";
import SnakeGame from "@/components/arcade/snake/SnakeGame";

export const metadata: Metadata = { title: "Snake", description: "Classic Snake with keyboard and touch controls." };

export default function SnakePage() {
  return <SnakeGame />;
}
