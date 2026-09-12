# RuneForge Portal Experience 3.0

## Objetivo

Portal Experience 3.0 transforma o SiteRuneForged de uma vitrine funcional em um portal oficial de produto, mantendo o runtime do jogo separado e consumindo apenas superfícies públicas certificadas.

O ciclo reúne seis frentes:

1. Portal Admin UX 2.0;
2. Homepage 3.0;
3. Card Explorer 2.0;
4. identidade de Coleções e Regiões;
5. SEO e compartilhamento;
6. observabilidade pública.

## 1. Portal Admin UX 2.0

O dashboard `/admin` mantém os 16 domínios do CMS 2.1, mas passa a organizá-los por objetivo: Experiência, Conhecimento, Live Ops e Operação.

A central oferece busca de recurso e atalhos para Home, Notícias, Lore, SEO e portal público.

O editor preserva o modelo seguro já existente:

- `expectedVersion` em mutações;
- conflito `409` fail-safe;
- rascunho, revisão, publicação e arquivamento explícitos;
- histórico e rollback;
- autenticação e sessão no BFF administrativo.

UX adicionada:

- autosave **local** no navegador para evitar criar versões de CMS a cada tecla;
- indicador `SINCRONIZADO` / `NÃO SALVO`;
- proteção `beforeunload`;
- `Ctrl/Cmd+S` para salvar rascunho no CMS;
- restauração/descartar rascunho local;
- preview editorial genérico;
- link para a superfície pública correspondente;
- confirmação antes de publicar ou arquivar.

Nenhuma credencial administrativa é armazenada no rascunho local. Apenas payload/SEO/nota que o operador já está editando.

## 2. Homepage 3.0

A Home continua CMS-first para hero, navegação e blocos editoriais, mas passa a combinar isso com dados reais públicos:

- Card Explorer com cartas reais;
- coleção pública ativa/snapshot;
- notícias publicadas;
- atalhos claros para arsenal, regiões e como jogar;
- bloco da coleção foundation;
- JSON-LD `VideoGame`.

A indisponibilidade da API não derruba a descoberta: o snapshot certificado continua servindo catálogo e conteúdo essencial.

## 3. Card Explorer 2.0

O Explorer preserva filtros na URL e usa GET, permitindo compartilhar qualquer pesquisa.

Filtros:

- texto;
- região;
- tipo;
- raridade;
- coleção;
- keyword;
- raça;
- classe;
- custo mínimo/máximo;
- ordenação por nome, custo ou poder.

Também há grade/lista, chips para remover filtros individuais, breakdown do resultado e provenance API/snapshot.

O contrato avançado é implementado no RuneForgedTCG sem expor grafos de efeitos, triggers, ASTs mecânicas ou estado administrativo.

## 4. Coleções e Regiões

Detalhes de coleção usam o breakdown filtrado para mostrar:

- distribuição por região;
- distribuição por raridade;
- curva de mana.

Detalhes de região mostram:

- tamanho do arsenal;
- tipos presentes;
- raridades;
- raças;
- curva de mana e composição mecânica.

Essas superfícies usam dados do catálogo público; a identidade editorial continua vindo do CMS.

## 5. SEO e compartilhamento

O portal inclui:

- metadata global com template de título;
- canonical por rota;
- Open Graph e Twitter cards;
- imagem social RuneForge gerada pelo próprio Next.js;
- metadata dinâmica de cartas, coleções, regiões e artigos;
- `robots.txt` bloqueando `/admin` e BFF administrativo;
- `sitemap.xml` incluindo rotas principais, regiões, artigos fallback e todas as 446 cartas do snapshot;
- JSON-LD na Home;
- compartilhamento nativo de cartas com fallback para copiar URL.

`NEXT_PUBLIC_SITE_URL` pode fixar o canonical. Em Vercel, `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` são usados como fallback seguro.

## 6. Observabilidade

`PortalAnalytics` é first-party e não usa pacote externo.

Eventos aceitos:

- `page_view`;
- `interaction`;
- `web_vital`.

O endpoint `/api/public/portal/analytics`:

- limita payload a 2 KiB;
- aceita somente tipos conhecidos;
- não aceita `/admin`;
- valida path/nome/rating;
- limita métricas numéricas;
- responde `204 no-store`;
- grava somente evento estruturado no log da aplicação.

Privacidade:

- sem cookie de analytics;
- sem user/player ID;
- sem credencial;
- sem query string de busca;
- sem conteúdo de formulários;
- sem fingerprinting.

Pode ser desativado por `NEXT_PUBLIC_PORTAL_ANALYTICS=false`.

## Gates

Antes do merge:

- contract tests;
- knowledge snapshot;
- TypeScript;
- production build;
- Playwright desktop/mobile;
- SEO/robots/sitemap/analytics smoke;
- Vercel preview;
- Full Stack Integration contra o SHA exato do RuneForgedTCG que contém Public Card Catalog 1.1.

Depois do merge, os mesmos gates devem ser repetidos no SHA definitivo da `main`.
