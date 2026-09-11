import cardSnapshotJson from "@/data/card-catalog-snapshot.json";

export type SnapshotSource = "api" | "snapshot";

type SnapshotCard = {
  type: string;
  structuralType: string;
  archetypeKey?: string;
  archetypeName?: string;
  keywords: string[];
  customKeywords: string[];
  collection: {
    key: string;
    code: string;
    name: string;
    symbol?: string | null;
  };
};

type CardSnapshot = {
  schemaVersion: number;
  source: {
    repository: string;
    commitSha: string;
    commitShort: string;
    environment: string;
    release: string;
    engineVersion: string;
    rulesetVersion: string;
    contentVersion: string;
    catalogRevision: string;
    total: number;
  };
  cards: SnapshotCard[];
};

const cardSnapshot = cardSnapshotJson as CardSnapshot;
const cards = cardSnapshot.cards;

export const standaloneKnowledgeSource = {
  schemaVersion: 1,
  game: { ...cardSnapshot.source },
  cards: cards.length,
  keywords: 20,
  ruleContracts: 9,
} as const;

export type SnapshotKeyword = {
  key: string;
  name: string;
  description: string;
  icon: string;
  source: "canonical" | "custom";
  engineKeyword?: string;
  runtimeDomains: string[];
  grantable: boolean;
  requiresTrigger?: string;
  timing?: string;
  cardCount: number;
};

type KeywordDefinition = Omit<SnapshotKeyword, "source" | "cardCount">;

const keywordDefinitions: KeywordDefinition[] = [
  { key: "Overwhelm", name: "Overwhelm", description: "Excess damage to a blocker spills onto the enemy Nexus.", icon: "💢", engineKeyword: "Overwhelm", runtimeDomains: ["strike", "damage"], grantable: true },
  { key: "QuickAttack", name: "Quick Attack", description: "Strikes first — kill the blocker before it hits back.", icon: "⚡", engineKeyword: "QuickAttack", runtimeDomains: ["strike"], grantable: true },
  { key: "DoubleStrike", name: "Double Strike", description: "Strikes twice: once fast, then again if both survive.", icon: "⚔️", engineKeyword: "DoubleStrike", runtimeDomains: ["strike"], grantable: true },
  { key: "Elusive", name: "Elusive", description: "Can only be blocked by units with Elusive or Reach.", icon: "🌀", engineKeyword: "Elusive", runtimeDomains: ["blocking"], grantable: true },
  { key: "Lifesteal", name: "Lifesteal", description: "Heals your Nexus for the damage it deals.", icon: "🩸", engineKeyword: "Lifesteal", runtimeDomains: ["damage"], grantable: true },
  { key: "Barrier", name: "Barrier", description: "Negates the next damage it would take.", icon: "🛡️", engineKeyword: "Barrier", runtimeDomains: ["damage"], grantable: true },
  { key: "Fearsome", name: "Fearsome", description: "Can only be blocked by units with 3+ power.", icon: "😱", engineKeyword: "Fearsome", runtimeDomains: ["blocking"], grantable: true },
  { key: "Tough", name: "Tough", description: "Takes 1 less damage from every source.", icon: "🪨", engineKeyword: "Tough", runtimeDomains: ["damage"], grantable: true },
  { key: "Regeneration", name: "Regeneration", description: "Heals to full health at the end of each round.", icon: "🌱", engineKeyword: "Regeneration", runtimeDomains: ["round"], grantable: true },
  { key: "Challenger", name: "Challenger", description: "While attacking, you may force a chosen enemy to block it.", icon: "🎯", engineKeyword: "Challenger", runtimeDomains: ["attack", "blocking"], grantable: true },
  { key: "Unblockable", name: "Unblockable", description: "Can only be blocked by units with Unblockable.", icon: "🚫", engineKeyword: "Unblockable", runtimeDomains: ["blocking"], grantable: true },
  { key: "Ephemeral", name: "Ephemeral", description: "Dies at the end of the round or after striking.", icon: "💨", engineKeyword: "Ephemeral", runtimeDomains: ["strike", "round"], grantable: true },
  { key: "LastBreath", name: "Last Breath", description: "Triggers the card's death effect when this unit dies.", icon: "💀", engineKeyword: "LastBreath", runtimeDomains: ["death"], grantable: false, requiresTrigger: "onDeath", timing: "onDeath" },
  { key: "Deathtouch", name: "Deathtouch", description: "Any damage this deals to a unit destroys it.", icon: "☠️", engineKeyword: "Deathtouch", runtimeDomains: ["damage"], grantable: true },
  { key: "Poisonous", name: "Poisonous", description: "Damage this unit deals to the enemy Nexus also gives that player poison counters. 10 poison counters cause defeat.", icon: "🧪", engineKeyword: "Poisonous", runtimeDomains: ["damage"], grantable: true },
  { key: "Haste", name: "Haste", description: "Can attack the same turn it is summoned.", icon: "⚡", engineKeyword: "Haste", runtimeDomains: ["attack"], grantable: true },
  { key: "Wither", name: "Wither", description: "Damage it deals permanently reduces the target's max health.", icon: "🥀", engineKeyword: "Wither", runtimeDomains: ["damage"], grantable: true },
  { key: "Hexproof", name: "Hexproof", description: "Can't be targeted by enemy spells or abilities.", icon: "🔮", engineKeyword: "Hexproof", runtimeDomains: ["targeting"], grantable: true },
  { key: "Reach", name: "Reach", description: "Can block units with Elusive and units with Flying.", icon: "🕸️", engineKeyword: "Reach", runtimeDomains: ["blocking"], grantable: true },
  { key: "Flying", name: "Flying", description: "Can only be blocked by units with Flying or Reach.", icon: "🦅", engineKeyword: "Flying", runtimeDomains: ["blocking"], grantable: true },
];

function keywordUsage() {
  const counts = new Map<string, number>();
  for (const card of cards) {
    for (const key of new Set([...(card.keywords ?? []), ...(card.customKeywords ?? [])])) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return counts;
}

export function standaloneKeywords(): SnapshotKeyword[] {
  const usage = keywordUsage();
  return keywordDefinitions.map((keyword) => ({
    ...keyword,
    source: "canonical" as const,
    cardCount: usage.get(keyword.key) ?? 0,
  }));
}

export type SnapshotRuleContract = {
  key: string;
  name: string;
  kind: "structural" | "semantic";
  baseType: string;
  icon: string;
  zone: "battlefield" | "stack" | "equipment";
  timing: "battlefield" | "main-only" | "reaction-only" | "speed-based";
  mana: "regular" | "spell";
  persistent: boolean;
  countsAsSpellCast: boolean;
  description: string;
  cardCount: number;
};

type RuleDefinition = Omit<SnapshotRuleContract, "cardCount">;

const structuralRules: RuleDefinition[] = [
  { key: "Unit", name: "Unit", kind: "structural", baseType: "Unit", icon: "⚔️", zone: "battlefield", timing: "battlefield", mana: "regular", persistent: true, countsAsSpellCast: false, description: "Unidade de combate persistente. Entra no campo, pode atacar e bloquear conforme as regras de combate." },
  { key: "Spell", name: "Spell", kind: "structural", baseType: "Spell", icon: "✦", zone: "stack", timing: "speed-based", mana: "spell", persistent: false, countsAsSpellCast: true, description: "Feitiço resolvido pela stack. Sua velocidade define as janelas legais de uso e reação." },
  { key: "Enchantment", name: "Enchantment", kind: "structural", baseType: "Enchantment", icon: "🔮", zone: "battlefield", timing: "battlefield", mana: "spell", persistent: true, countsAsSpellCast: true, description: "Permanente mágico que permanece no campo e pode aplicar efeitos contínuos." },
  { key: "Artifact", name: "Artifact", kind: "structural", baseType: "Artifact", icon: "⚙️", zone: "battlefield", timing: "battlefield", mana: "spell", persistent: true, countsAsSpellCast: true, description: "Permanente de campo com identidade de artefato. Pode carregar efeitos contínuos ou habilidades." },
  { key: "Equipment", name: "Equipment", kind: "structural", baseType: "Equipment", icon: "🗡️", zone: "equipment", timing: "battlefield", mana: "spell", persistent: true, countsAsSpellCast: true, description: "Permanente anexável a uma unidade, preservando vínculo e bônus enquanto permanecer equipado." },
  { key: "Sentinela", name: "Sentinela", kind: "structural", baseType: "Sentinela", icon: "♜", zone: "battlefield", timing: "battlefield", mana: "regular", persistent: true, countsAsSpellCast: false, description: "Permanente de comando com lealdade e habilidades próprias; não é conjurado como feitiço comum." },
];

const semanticRules: RuleDefinition[] = [
  { key: "structure", name: "Estrutura", kind: "semantic", baseType: "Artifact", icon: "🏰", zone: "battlefield", timing: "battlefield", mana: "regular", persistent: true, countsAsSpellCast: false, description: "Permanente de campo com integridade. Usa mana regular e não conta como feitiço conjurado." },
  { key: "ritual", name: "Ritual", kind: "semantic", baseType: "Spell", icon: "🜂", zone: "stack", timing: "main-only", mana: "spell", persistent: false, countsAsSpellCast: true, description: "Carta de mana deliberada. Só pode ser iniciada na fase principal, nunca é uma resposta e toda versão coletável deve manipular mana." },
  { key: "trap", name: "Armadilha", kind: "semantic", baseType: "Spell", icon: "🪤", zone: "stack", timing: "reaction-only", mana: "spell", persistent: false, countsAsSpellCast: true, description: "Resposta de mão. Só pode ser usada dentro de uma janela de reação legal." },
];

export function standaloneRules() {
  const structural = structuralRules.map((rule) => ({
    ...rule,
    cardCount: cards.filter((card) => card.structuralType === rule.key && card.type === rule.key).length,
  }));
  const semantic = semanticRules.map((rule) => ({
    ...rule,
    cardCount: cards.filter((card) => card.type === rule.name).length,
  }));
  return { version: 1 as const, structural, semantic, all: [...structural, ...semantic] };
}

export type SnapshotCollection = {
  key: string;
  code: string;
  name: string;
  description?: string | null;
  symbol?: string | null;
  banner?: string | null;
  releaseDate?: string | null;
  rotationDate?: string | null;
  lifecycle: string;
  cardCount: number;
  metadata?: Record<string, unknown> | null;
};

export function standaloneCollections(): SnapshotCollection[] {
  const grouped = new Map<string, SnapshotCollection>();
  for (const card of cards) {
    const current = grouped.get(card.collection.key);
    grouped.set(card.collection.key, {
      key: card.collection.key,
      code: card.collection.code,
      name: card.collection.name,
      description: card.collection.key === "vanilla"
        ? "A coleção-base que estabelece regiões, tipos de carta, arquétipos e a linguagem mecânica do primeiro ciclo de RuneForge."
        : `Coleção ${card.collection.name} preservada no snapshot certificado.`,
      symbol: card.collection.symbol ?? null,
      banner: null,
      releaseDate: null,
      rotationDate: null,
      lifecycle: "active",
      cardCount: (current?.cardCount ?? 0) + 1,
      metadata: { snapshot: true, gameCommitSha: cardSnapshot.source.commitSha },
    });
  }
  return [...grouped.values()].sort((a, b) => a.name.localeCompare(b.name));
}
