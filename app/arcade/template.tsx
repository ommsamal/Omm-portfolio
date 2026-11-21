"use client";

import { motion } from "framer-motion";

// Fades each arcade page in when you move between the dashboard and a game.
export default function ArcadeTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.7, 0.2, 1] }}>
      {children}
    </motion.div>
  );
}
