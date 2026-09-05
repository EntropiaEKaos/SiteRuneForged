import type { CardShowcaseContent, HomeContent, NavigationContent, RegionShowcaseContent } from "./content-model";

export const defaultNavigation: NavigationContent = {
  brandSubtitle: "Tactical Card Game",
  links: [
    { label: "Cartas", href: "#cards" },
    { label: "Regiões", href: "#regions" },
    { label: "Regras", href: "/rules" },
    { label: "Lore", href: "/lore" },
    { label: "Notícias", href: "/news" },
  ],
  cta: { label: "Entrar na forja", href: "#alpha" },
  footerLabel: "Portal oficial • Conteúdo v0.3",
  footerTagline: "Forge your legend.",
  copyright: "© 2026 RuneForge",
};

export const defaultHome: HomeContent = {
  hero: {
    eyebrow: "O CAMPO RESPONDE À SUA VONTADE",
    title: "Forje sua lenda.",
    accentTitle: "Quebre o destino.",
    description: "RuneForge é um card game tático onde timing, construção de deck e leitura do adversário importam tanto quanto poder bruto.",
    primaryCta: { label: "Descobrir RuneForge", href: "#cards" },
    secondaryCta: { label: "Aprender a jogar", href: "/rules" },
    stats: [
      { value: "6", label: "regiões" },
      { value: "7", label: "tipos de carta" },
      { value: "1", label: "campo para dominar" },
    ],
  },
  arsenal: {
    kicker: "ARSENAL DA FORJA",
    title: "Cada carta é uma decisão.\nCada decisão, uma ameaça.",
    description: "Construa estratégias que combinam permanentes, respostas, pressão de campo e janelas de reação. O seu deck não é só uma coleção: é a sua doutrina.",
  },
  battle: {
    kicker: "NÃO É SÓ BAIXAR CARTAS",
    titleLines: ["Leia o campo.", "Controle o tempo."],
    accentLine: "Force o erro.",
    description: "Mana, spell mana, permanentes, stack, reação, negação e timing criam partidas onde cada janela pode definir o duelo.",
    points: [
      { number: "01", label: "Planeje sua curva" },
      { number: "02", label: "Ameace respostas" },
      { number: "03", label: "Domine a prioridade" },
    ],
    cta: { label: "Explorar as regras", href: "/rules" },
  },
  alpha: {
    label: "ALPHA EM CONSTRUÇÃO",
    title: "A forja já está acesa.",
    description: "O portal público acompanhará o jogo com cartas, regras, coleções, novidades e acesso à experiência RuneForge.",
    cta: { label: "Voltar ao topo", href: "#top" },
  },
};

export const defaultCardsHome: CardShowcaseContent = {
  certifiedTypesLabel: "TIPOS CERTIFICADOS",
  cardTypes: ["Unidade", "Sentinela", "Estrutura", "Artefato", "Encantamento", "Ritual", "Armadilha"],
  featured: [
    { mana: "4", region: "EMBERHOLD", meta: "UNIDADE • GUERREIRO", title: "Campeão da Forja", description: "Quando entra em combate, transforme pressão em vantagem.", stats: ["5", "4"], variant: "a" },
    { mana: "3", region: "VOIDBORN", meta: "ARMADILHA • REAÇÃO", title: "Eclipse do Vazio", description: "Espere o instante perfeito. Então mude o resultado inteiro.", stats: ["✦", "∞"], variant: "b" },
  ],
};

export const defaultRegionsHome: RegionShowcaseContent = {
  kicker: "ESCOLHA SUA ORIGEM",
  title: "Seis regiões.\nSeis formas de vencer.",
  description: "Cada região carrega uma filosofia própria de combate, identidade visual e linguagem estratégica.",
  items: [
    { name: "Emberhold", description: "Chamas, aço e ambição moldam cada confronto.", icon: "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/emberhold.svg", href: "#rules" },
    { name: "Florestia", description: "Vida ancestral, crescimento e força que nunca cessa.", icon: "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/florestia.svg", href: "#rules" },
    { name: "Ironwood", description: "Disciplina, máquinas e resistência acima de tudo.", icon: "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/ironwood.svg", href: "#rules" },
    { name: "Tempestade", description: "Velocidade, relâmpagos e domínio do ritmo da batalha.", icon: "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/tempestade.svg", href: "#rules" },
    { name: "Tidecall", description: "Marés, controle e poder que cresce como o oceano.", icon: "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/tidecall.svg", href: "#rules" },
    { name: "Voidborn", description: "O vazio responde a quem ousa pagar o preço.", icon: "https://raw.githubusercontent.com/EntropiaEKaos/RuneForgedTCG/main/public/art/regions/voidborn.svg", href: "#rules" },
  ],
};
