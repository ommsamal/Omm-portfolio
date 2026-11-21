import type { Metadata } from "next";
import ArcadeDashboard from "@/components/arcade/ArcadeDashboard";

export const metadata: Metadata = { title: { absolute: "Omm's Dev Arcade | Omm Samal" } };

export default function ArcadePage() {
  return <ArcadeDashboard />;
}
