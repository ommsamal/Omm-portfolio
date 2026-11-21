"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Download, Menu, X } from "lucide-react";
import { nav, profile } from "@/data/content";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isCurrent = (href: string) => !href.includes("#") && pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-ink/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-page items-center justify-between px-5 sm:px-8">
        <a href="/#home" className="text-base font-semibold tracking-tight" onClick={() => setOpen(false)}>
          Omm Samal<span className="text-accent">.</span>
        </a>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={`text-sm transition-colors hover:text-text ${isCurrent(item.href) ? "text-accent" : "text-muted"}`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={profile.resume} download className="btn btn-primary hidden sm:inline-flex">
            <Download className="h-4 w-4" aria-hidden="true" />
            Resume
          </a>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            className="overflow-hidden border-t border-line lg:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <ul className="mx-auto flex max-w-page flex-col px-5 py-3 sm:px-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={`block py-3 text-lg ${isCurrent(item.href) ? "text-accent" : "text-text"}`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li className="py-3">
                <a href={profile.resume} download className="btn btn-primary w-full">
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Download resume
                </a>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
