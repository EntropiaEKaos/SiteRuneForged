import type { PublicSentinelaSummary } from "@/lib/cards/public-catalog";

/**
 * Standalone presentation fallback for every public Vanilla Sentinela currently
 * present in the certified catalog: six base Sentinelas plus the twelve 2.96
 * Sentinelas. No executable effect payload is stored in the portal.
 */
export const SENTINELA_PUBLIC_SUMMARIES: Readonly<Record<string, PublicSentinelaSummary>> = {
  sent_vulkar: {
    startingLoyalty: 4,
    abilities: [
      { cost: 1, description: "+1: causa 2 de dano a uma criatura" },
      { cost: -2, description: "-2: causa 3 de dano ao Nexus inimigo" },
      { cost: -6, description: "-6: causa 5 de dano a todas as criaturas inimigas" },
    ],
  },
  sent_marinna: {
    startingLoyalty: 5,
    abilities: [
      { cost: 1, description: "+1: compra 1 carta" },
      { cost: -2, description: "-2: devolve uma criatura inimiga à mão" },
      { cost: -8, description: "-8: dá Barreira a todas as criaturas aliadas" },
    ],
  },
  sent_terrus: {
    startingLoyalty: 6,
    abilities: [
      { cost: 1, description: "+1: dá +0/+2 a todas as criaturas aliadas (aura de trincheira)" },
      { cost: -3, description: "-3: dá Resistente permanentemente a todas as criaturas aliadas no campo" },
      { cost: -8, description: "-8: invoca um Golem de Raiz 4/6 com Resistente" },
    ],
  },
  sent_xerath: {
    startingLoyalty: 4,
    abilities: [
      { cost: 1, description: "+1: dá 1 contador de veneno ao inimigo (10 contadores = derrota)" },
      { cost: -3, description: "-3: destrói uma criatura inimiga" },
      { cost: -7, description: "-7: cura 8 de vida do seu Nexus" },
    ],
  },
  sent_kaara: {
    startingLoyalty: 5,
    abilities: [
      { cost: 1, description: "+1: dá +1/+1 a todas as Bestas aliadas" },
      { cost: -2, description: "-2: invoca um Filhote 1/1" },
      { cost: -9, description: "-9: cura 5 e dá Barreira a uma criatura" },
    ],
  },
  sent_aurion: {
    startingLoyalty: 4,
    abilities: [
      { cost: 1, description: "+1: dá Ímpeto a uma criatura aliada" },
      { cost: -2, description: "-2: causa 2 de dano a todas as criaturas inimigas" },
      { cost: -7, description: "-7: dá +3/+3 a todas as criaturas aliadas" },
    ],
  },
  rf296_sent_ilyra: {
    startingLoyalty: 4,
    abilities: [
      { cost: 1, description: "+1: cause 1 de dano ao Nexus inimigo" },
      { cost: -2, description: "-2: conceda Ataque Rápido a uma unidade aliada" },
      { cost: -6, description: "-6: cause 4 de dano a todos os inimigos" },
    ],
  },
  rf296_sent_selene: {
    startingLoyalty: 5,
    abilities: [
      { cost: 1, description: "+1: compre 1 carta" },
      { cost: -2, description: "-2: congele uma unidade inimiga" },
      { cost: -7, description: "-7: devolva uma unidade inimiga e compre 2" },
    ],
  },
  rf296_sent_doran: {
    startingLoyalty: 6,
    abilities: [
      { cost: 1, description: "+1: cure 1 do seu Nexus" },
      { cost: -2, description: "-2: conceda Regeneração a uma unidade aliada" },
      { cost: -7, description: "-7: invoque dois Golens de Raiz" },
    ],
  },
  rf296_sent_morvane: {
    startingLoyalty: 4,
    abilities: [
      { cost: 1, description: "+1: descarte 2 cartas do topo do deck inimigo" },
      { cost: -2, description: "-2: cause 2 a uma unidade e cure 2 do seu Nexus" },
      { cost: -7, description: "-7: destrua uma unidade inimiga e cure 4" },
    ],
  },
  rf296_sent_rhaika: {
    startingLoyalty: 5,
    abilities: [
      { cost: 1, description: "+1: Bestas aliadas recebem +1/+0" },
      { cost: -2, description: "-2: invoque dois Filhotes" },
      { cost: -7, description: "-7: aliados recebem +2/+2" },
    ],
  },
  rf296_sent_elyon: {
    startingLoyalty: 4,
    abilities: [
      { cost: 1, description: "+1: cause 1 de dano ao Nexus inimigo" },
      { cost: -2, description: "-2: atordoe uma unidade inimiga" },
      { cost: -6, description: "-6: aliados recebem +2/+1" },
    ],
  },
  rf296_sent_kaelis: {
    startingLoyalty: 5,
    abilities: [
      { cost: 1, description: "+1: compre 1 carta" },
      { cost: -2, description: "-2: cause 2 a uma unidade e 1 ao Nexus" },
      { cost: -7, description: "-7: cause 3 a todos os inimigos e cure 3" },
    ],
  },
  rf296_sent_nymara: {
    startingLoyalty: 6,
    abilities: [
      { cost: 1, description: "+1: cure 1 do seu Nexus" },
      { cost: -2, description: "-2: conceda Barreira a uma unidade aliada" },
      { cost: -8, description: "-8: aliados ganham Barreira e você compra 2" },
    ],
  },
  rf296_sent_orun: {
    startingLoyalty: 6,
    abilities: [
      { cost: 1, description: "+1: cure 2 de uma unidade aliada" },
      { cost: -2, description: "-2: Bestas e Besta recebem +1/+1" },
      { cost: -8, description: "-8: invoque dois Golens de Raiz" },
    ],
  },
  rf296_sent_veyra: {
    startingLoyalty: 5,
    abilities: [
      { cost: 1, description: "+1: descarte 1 carta do topo do deck inimigo" },
      { cost: -2, description: "-2: cause 3 de dano a uma unidade inimiga" },
      { cost: -7, description: "-7: destrua uma unidade e cause 3 ao Nexus" },
    ],
  },
  rf296_sent_malakar: {
    startingLoyalty: 5,
    abilities: [
      { cost: 1, description: "+1: cause 1 de dano ao Nexus inimigo" },
      { cost: -3, description: "-3: cause 4 de dano a uma unidade inimiga" },
      { cost: -8, description: "-8: cause 4 de dano a todos os inimigos e 4 ao Nexus" },
    ],
  },
  rf296_sent_liora: {
    startingLoyalty: 6,
    abilities: [
      { cost: 1, description: "+1: cure 2 do seu Nexus" },
      { cost: -2, description: "-2: invoque dois Filhotes" },
      { cost: -8, description: "-8: aliados recebem +2/+2 e Barreira" },
    ],
  },
};
