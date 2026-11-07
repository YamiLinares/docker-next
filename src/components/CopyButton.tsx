"use client";

import { useState } from "react";
import styles from "./CommandList.module.css";

export default function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // El portapapeles puede no estar disponible (por ejemplo, fuera de HTTPS o localhost).
      setCopied(false);
    }
  }

  return (
    <button type="button" className={styles.copy} onClick={handleCopy} aria-live="polite">
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}
