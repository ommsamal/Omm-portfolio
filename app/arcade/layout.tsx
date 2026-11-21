import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import MotionProvider from "@/components/MotionProvider";
import ArcadeProvider from "@/components/arcade/ArcadeProvider";
import { Footer } from "@/components/Sections";

export const metadata: Metadata = {
  title: { default: "Omm's Dev Arcade | Omm Samal", template: "%s | Omm's Dev Arcade" },
  description: "Think. Code. Play. Repeat. Tech Wordle, Guess the Output, Debug It and Snake, built into Omm Samal's portfolio.",
};

export default function ArcadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <MotionProvider>
      <ArcadeProvider>
        <Navbar />
        <main id="arcade-main" className="min-h-screen">{children}</main>
        <Footer />
      </ArcadeProvider>
    </MotionProvider>
  );
}
