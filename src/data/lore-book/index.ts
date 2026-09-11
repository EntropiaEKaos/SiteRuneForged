import prologue from "./prologo-a-palavra-morta.json";
import chapter1 from "./capitulo-i-dezessete-anos-depois.json";
import chapter2 from "./capitulo-ii-a-mulher-que-comprava-guerras.json";
import chapter3 from "./capitulo-iii-o-preco-de-uma-palavra.json";
import chapter4 from "./capitulo-iv-a-cidade-onde-deuses-tem-preco.json";
import interlude1 from "./interludio-i-as-nove-familias.json";
import chapter5 from "./capitulo-v-o-deus-debaixo-da-cidade.json";
import chapter6 from "./capitulo-vi-a-estrada-dos-enforcados.json";
import interlude2 from "./interludio-ii-codice-de-edran.json";

export type LoreSnapshotEntry = {
  slug: string;
  order: number;
  section: string;
  title: string;
  summary: string;
  body: string[];
};

export const loreBookSnapshot = {
  schemaVersion: 1,
  book: {
    series: "RuneForge",
    book: "Livro I",
    title: "Quando as Runas Sangraram",
    subtitle: "Crônicas da Era da Fratura",
    version: "v0.3",
    locale: "pt-BR",
    sourceFile: "RuneForge_Livro_I_Quando_as_Runas_Sangraram_v0.3.docx",
    snapshotDate: "2026-09-11",
    entries: 9,
  },
  entries: [prologue, chapter1, chapter2, chapter3, chapter4, interlude1, chapter5, chapter6, interlude2] as LoreSnapshotEntry[],
} as const;
