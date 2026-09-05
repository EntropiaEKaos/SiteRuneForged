import type { PortalPublishedItem } from "./public-content";

export type PublicSectionKey = "news" | "lore" | "rules" | "collections" | "events" | "roadmap";

export type EditorialPayload = {
  kicker?: string;
  title: string;
  summary: string;
  body?: string[];
  meta?: string;
  badge?: string;
};

export type PublicSectionConfig = {
  resource: PublicSectionKey;
  kicker: string;
  title: string;
  description: string;
  fallback: PortalPublishedItem<EditorialPayload>[];
};

function fallbackItem(resource: PublicSectionKey, slug: string, payload: EditorialPayload): PortalPublishedItem<EditorialPayload> {
  return { slug, locale: "pt-BR", payload, version: 0, publishedAt: null };
}

export const publicSections: Record<PublicSectionKey, PublicSectionConfig> = {
  news: {
    resource: "news",
    kicker: "CRÔNICAS DA FORJA",
    title: "Novidades da Forja",
    description: "Atualizações do Alpha, devlogs, anúncios e mudanças importantes no mundo de RuneForge.",
    fallback: [
      fallbackItem("news", "a-forja-esta-acesa", {
        kicker: "DEVLOG",
        title: "A forja está acesa",
        summary: "O Alpha de RuneForge avança com engine, conteúdo, PvP e ferramentas de criação sendo certificados em conjunto.",
        body: [
          "RuneForge está sendo construído como um card game tático onde engine, conteúdo e ferramentas administrativas evoluem sob os mesmos contratos.",
          "Esta página passa a receber notícias publicadas diretamente pelo Portal CMS. Enquanto nenhum conteúdo editorial estiver publicado, este texto funciona como fallback seguro.",
        ],
        badge: "ALPHA",
      }),
      fallbackItem("news", "portal-cms-2-1", {
        kicker: "PORTAL",
        title: "Portal CMS 2.1 integrado",
        summary: "O portal público agora pode continuar exibindo a última publicação enquanto uma nova revisão está em andamento.",
        body: [
          "Edição e publicação são estados separados. Uma revisão em rascunho não remove do ar a versão pública anterior.",
          "Arquivamento permanece como tombstone até uma nova publicação explícita.",
        ],
        badge: "CMS 2.1",
      }),
    ],
  },
  lore: {
    resource: "lore",
    kicker: "ARQUIVOS DO NEXUS",
    title: "Lore & Crônicas",
    description: "Regiões, personagens, conflitos e histórias que dão identidade ao universo de RuneForge.",
    fallback: [
      fallbackItem("lore", "o-nexus", {
        kicker: "ORIGENS",
        title: "O Nexus",
        summary: "No centro de cada confronto existe uma força que responde à doutrina, à memória e ao preço que cada região aceita pagar.",
        body: [
          "O Nexus é mais do que um marcador de vida: ele representa a permanência da vontade de cada jogador no campo.",
          "As seis regiões interpretam essa força de maneiras distintas, criando filosofias de combate e identidades próprias.",
        ],
      }),
      fallbackItem("lore", "seis-doutrinas", {
        kicker: "REGIÕES",
        title: "Seis doutrinas, um campo",
        summary: "Emberhold, Florestia, Ironwood, Tempestade, Tidecall e Voidborn disputam o mesmo campo com princípios radicalmente diferentes.",
        body: [
          "Cada região foi desenhada para comunicar sua filosofia tanto no gameplay quanto na direção visual.",
          "As páginas de lore serão expandidas diretamente pelo CMS conforme o universo público for sendo revelado.",
        ],
      }),
    ],
  },
  rules: {
    resource: "rules",
    kicker: "CÓDICE DE BATALHA",
    title: "Regras & Como Jogar",
    description: "Fundamentos, timing, prioridade, tipos de carta e conceitos para entrar no campo entendendo cada decisão.",
    fallback: [
      fallbackItem("rules", "fundamentos", {
        kicker: "COMECE AQUI",
        title: "Fundamentos do duelo",
        summary: "Construa seu deck, administre mana e Nexus, desenvolva o campo e escolha quando transformar recursos em pressão.",
        body: [
          "RuneForge recompensa planejamento de curva, leitura do adversário e uso correto das janelas de ação.",
          "Unidades e permanentes constroem presença; Rituals operam em main phase; Traps e outras respostas disputam janelas de reação.",
        ],
        badge: "ESSENCIAL",
      }),
      fallbackItem("rules", "prioridade-e-stack", {
        kicker: "TIMING",
        title: "Prioridade e stack",
        summary: "Nem toda ação resolve imediatamente. Respostas e negações criam uma disputa de timing antes da resolução final.",
        body: [
          "Quando uma ação abre uma janela de resposta, o oponente pode reagir com ferramentas legalmente disponíveis.",
          "Entender quando manter mana aberta é parte central da estratégia.",
        ],
      }),
      fallbackItem("rules", "tipos-de-carta", {
        kicker: "ARSENAL",
        title: "Sete tipos de carta certificados",
        summary: "Unidade, Sentinela, Estrutura, Artefato, Encantamento, Ritual e Armadilha ocupam papéis diferentes na construção de estratégia.",
        body: [
          "Cada tipo possui contratos próprios de timing, permanência, custo e interação.",
          "O Codex completo crescerá junto das regras publicadas no CMS.",
        ],
      }),
    ],
  },
  collections: {
    resource: "collections",
    kicker: "ARQUIVO DE COLEÇÕES",
    title: "Coleções",
    description: "Sets, símbolos, identidades visuais e o histórico das cartas lançadas em RuneForge.",
    fallback: [
      fallbackItem("collections", "vanilla", {
        kicker: "PRIMEIRA COLEÇÃO",
        title: "Vanilla",
        summary: "A coleção-base que estabelece regiões, tipos de carta, arquétipos e linguagem mecânica do primeiro ciclo de RuneForge.",
        body: [
          "Vanilla é a fundação de conteúdo usada para certificar o Alpha e a evolução do Card Studio.",
          "Novas coleções poderão ser publicadas e apresentadas aqui sem duplicar dados administrativos.",
        ],
        badge: "FOUNDATION SET",
      }),
    ],
  },
  events: {
    resource: "events",
    kicker: "LIVE OPS",
    title: "Eventos",
    description: "Ativações públicas, temporadas especiais e experiências temporárias planejadas para a comunidade.",
    fallback: [
      fallbackItem("events", "alpha-forge", {
        kicker: "EM PREPARAÇÃO",
        title: "Alpha Forge",
        summary: "O primeiro ciclo público será usado para observar onboarding, partidas, progressão e comportamento real dos decks.",
        body: [
          "Eventos só aparecem como ativos quando publicados pelo control plane.",
          "O calendário público será alimentado pela mesma autoridade usada por Live Ops no RuneForge.",
        ],
        badge: "ALPHA",
      }),
    ],
  },
  roadmap: {
    resource: "roadmap",
    kicker: "CAMINHO DA FORJA",
    title: "Roadmap público",
    description: "Marcos de desenvolvimento apresentados sem expor detalhes internos, segredos operacionais ou estados não publicados.",
    fallback: [
      fallbackItem("roadmap", "alpha-jogavel", {
        kicker: "MARCO 01",
        title: "Alpha jogável",
        summary: "Jornada completa do jogador, PvE, PvP casual, decks, progressão, Codex e apresentação visual certificados.",
        body: ["O Alpha é o primeiro marco em que jogadores externos podem avaliar a experiência completa e não apenas sistemas isolados."],
        badge: "EM EVOLUÇÃO",
      }),
      fallbackItem("roadmap", "portal-publico", {
        kicker: "MARCO 02",
        title: "Portal público administrável",
        summary: "Site independente consumindo APIs públicas e conteúdo editorial versionado pelo RuneForge.",
        body: ["O portal permanece separado do runtime do jogo, reduzindo risco de deploy e permitindo evolução editorial independente."],
        badge: "ATIVO",
      }),
      fallbackItem("roadmap", "ranked", {
        kicker: "MARCO 03",
        title: "Ranked público",
        summary: "Abertura competitiva somente depois dos gates de integridade, balanceamento e operação serem suficientes para produção.",
        body: ["Ranked permanece fail-closed até sua certificação específica de lançamento."],
        badge: "FUTURO",
      }),
    ],
  },
};

export function fallbackArticle(section: PublicSectionKey, slug: string): PortalPublishedItem<EditorialPayload> {
  const config = publicSections[section];
  return config.fallback.find((item) => item.slug === slug) ?? {
    slug,
    locale: "pt-BR",
    payload: {
      kicker: config.kicker,
      title: slug.replace(/[-_]+/g, " "),
      summary: "Este conteúdo ainda não possui uma publicação pública no Portal CMS.",
      body: ["Assim que uma versão for publicada pelo control plane, esta página será atualizada automaticamente."],
    },
    version: 0,
    publishedAt: null,
  };
}
