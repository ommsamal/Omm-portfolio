import type { Metadata } from "next";
import DebugChallenge from "@/components/arcade/debug/DebugChallenge";

export const metadata: Metadata = { title: "Debug It", description: "Find the bug, then choose the fix. Python, JavaScript, Java and C++." };

export default function DebugItPage() {
  return <DebugChallenge />;
}
