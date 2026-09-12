import type { PublicSentinelaSummary } from "@/lib/cards/public-catalog";

/**
 * Standalone fallback for the 12 Vanilla Sentinelas introduced in RuneForged 2.96.
 * Presentation-only projection copied from the authoritative public card source.
 * No executable effect payload is stored in the portal.
 */
export const SENTINELA_PUBLIC_SUMMARIES: Readonly<Record<string, PublicSentinelaSummary>> = {
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
