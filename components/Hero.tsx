"use client";

import { motion } from "framer-motion";
import { Download, Mail } from "lucide-react";
import { profile } from "@/data/content";
import { GithubIcon, LinkedinIcon } from "./icons";
import PoseCanvas from "./PoseCanvas";

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.2, 0.7, 0.2, 1] } },
};

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[560px] w-[560px] rounded-full opacity-60 blur-3xl"
        style={{ background: "radial-gradient(circle, rgba(61,224,255,0.16), rgba(61,224,255,0) 65%)" }}
      />
      <div className="relative mx-auto grid max-w-page items-center gap-12 px-5 pb-20 pt-32 sm:px-8 sm:pt-40 lg:grid-cols-[1.15fr_0.85fr] lg:pb-28">
        <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.08 }}>
          <motion.h1 variants={item} className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">
            Hi, I&rsquo;m Omm Samal
          </motion.h1>
          <motion.p variants={item} className="mt-4 text-base font-medium text-accent sm:text-lg">
            {profile.headline}
          </motion.p>
          <motion.p variants={item} className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            {profile.intro}
          </motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
            <a href="#projects" className="btn btn-primary">View projects</a>
            <a href={profile.resume} download className="btn btn-ghost">
              <Download className="h-4 w-4" aria-hidden="true" />
              Download resume
            </a>
            <a href="#contact" className="btn btn-ghost">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Contact me
            </a>
          </motion.div>
          <motion.div variants={item} className="mt-6 flex gap-3">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub profile"
               className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent">
              <GithubIcon className="h-5 w-5" />
            </a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile"
               className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent">
              <LinkedinIcon className="h-5 w-5" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.25 }}>
          <PoseCanvas />
          <p className="mx-auto mt-3 max-w-[420px] text-sm text-muted">
            A sketch of my flagship project: pose tracking that checks each repetition.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
