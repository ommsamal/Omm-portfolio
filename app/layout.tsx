import type { Metadata, Viewport } from "next";
import "@fontsource-variable/sora";
import "./globals.css";
import { profile } from "@/data/content";

const description =
  "Portfolio of Omm Samal, a computer science engineering student at KIIT University building software in computer vision, machine learning and web development.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: "Omm Samal | Software Developer",
  description,
  keywords: ["Omm Samal", "Software Developer", "KIIT University", "Computer Vision", "Machine Learning", "Web Development", "Portfolio"],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: { title: "Omm Samal | Software Developer", description, type: "website", url: profile.siteUrl },
  twitter: { card: "summary", title: "Omm Samal | Software Developer", description },
};

export const viewport: Viewport = { themeColor: "#101216" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
