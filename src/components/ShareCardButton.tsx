"use client";

import { useState } from "react";

export default function ShareCardButton({ title }: { title: string }) {
  const [label, setLabel] = useState("Compartilhar carta");

  async function share() {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${title} · RuneForge`, text: `Veja ${title} no Card Explorer de RuneForge.`, url });
        setLabel("Compartilhado");
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setLabel("Link copiado");
      }
    } catch {
      setLabel("Compartilhar carta");
    }
    window.setTimeout(() => setLabel("Compartilhar carta"), 2200);
  }

  return <button type="button" className="card-share-button" onClick={share} data-analytics="card-share">{label}</button>;
}
