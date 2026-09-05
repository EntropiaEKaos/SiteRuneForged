# RuneForge Portal Control — Admin/CMS

## Objetivo

O portal público deve ser totalmente administrável sem duplicar a engine, o Card Studio ou a base de operadores. O painel `/admin` funciona como interface editorial do site e delega persistência, autenticação, versionamento e auditoria ao control plane do RuneForge.

## Estado da implementação

- UI administrativa e catálogo de recursos: `SiteRuneForged`.
- Persistência/API administrativa e pública: `RuneForgedTCG`, Portal CMS 2.0 + Portal CMS Studio 2.1, integrados pelo PR #137.
- Evidência visual: Playwright desktop + mobile em GitHub Actions.
- BFF de sessão/editor: operacional e alinhado ao contrato versionado do backend.

## Princípios

1. **Uma única identidade administrativa** — reutilizar os operadores e roles já existentes no RuneForge (`admin`, `designer`, `qa`, `liveops`, `publisher`).
2. **Nenhum segredo no browser** — chamadas privilegiadas passam pelo servidor Next.js ou pelo backend RuneForge; o bridge administrativo é exclusivamente de servidor.
3. **Publicação separada de edição** — conteúdo segue `draft -> review -> published -> archived`.
4. **Fonte de verdade única** — cartas, coleções, regiões, keywords e regras continuam pertencendo ao RuneForge; o portal apenas decide apresentação e visibilidade pública.
5. **Auditabilidade** — publicação registra operador, timestamp, versão e permite rollback.

## Recursos administráveis

O catálogo central em `src/lib/cms/content-model.ts` define 16 domínios: Home, Navegação, Páginas, Cartas, Coleções, Regiões, Keywords, Regras, Lore, Notícias, Mídia, SEO, Alpha, Eventos, Promoções e Roadmap.

## Contrato de API

Leitura pública:

- `GET /api/public/site/:resource`
- `GET /api/public/site/:resource/:slug`

Administração autenticada:

- `GET /api/admin/site/:resource`
- `GET /api/admin/site/:resource/:slug`
- `PUT /api/admin/site/:resource/:slug`
- `POST /api/admin/site/:resource/:slug/publish`
- `POST /api/admin/site/:resource/:slug/archive`
- `POST /api/admin/site/:resource/:slug/rollback/:version`

O frontend possui um bridge server-side alinhado à sessão HttpOnly `rf_admin_session`. O RuneForgedTCG implementa persistência, versionamento, RBAC, auditoria e o workspace administrativo central em `/admin/studio/site`.

## Matriz de responsabilidade

- `admin`: acesso total, configuração e publicação.
- `publisher`: aprovação, publicação, SEO e governança editorial.
- `designer`: Home, páginas, navegação, mídia, lore, regiões e apresentação.
- `qa`: revisão de conteúdo dependente de regras/gameplay e preview; sem publicação de produção.
- `liveops`: notícias, eventos, promoções, roadmap e estado do Alpha.

## Persistência

Não existe uma base paralela de usuários no site. O conteúdo editorial vive em `site_content`; cada alteração cria snapshot em `site_content_versions`, e operações administrativas registram `adminAuditLogs`. A API pública expõe somente a publicação efetiva: a versão publicada atual ou, durante edição draft/review, o último snapshot publicado válido; um archive funciona como tombstone até um novo publish explícito.

## Segurança

- cookies administrativos não são convertidos em tokens expostos no browser;
- mutations validam a sessão e o role no backend;
- nenhuma rota `/api/public/site/*` retorna draft/review, identidade de operador, notas de alteração ou histórico administrativo;
- edição e publicação têm gates independentes;
- toda mutation relevante gera auditoria.

## Evidência visual

Toda mudança relevante no painel gera screenshots reais em Chromium por GitHub Actions. A suíte Playwright cobre desktop (1440x1100) e mobile (390x844), armazenados no artifact `rune-forge-visual-evidence` junto das evidências da Home pública.

## Contrato de concorrência

Toda mutation administrativa carrega `expectedVersion`:

- criação inicial usa `0`;
- edições, publish, archive e rollback usam a versão corrente carregada;
- HTTP `409` preserva o JSON local e exige recarregar a versão do servidor;
- o Portal Control nunca força sobrescrita silenciosa.

## Estado atual e próximos gates

1. backend CMS 2.1 integrado no RuneForgedTCG;
2. login/logout e sessão BFF do SiteRuneForged implementados;
3. Home pública já consome Home, Navegação, Cartas e Regiões publicados com fallback seguro;
4. editor universal cobre os 16 recursos;
5. histórico, publish, archive e rollback estão ligados ao backend;
6. contrato `expectedVersion`/409 é bloqueado por CI;
7. próximo incremento: páginas públicas especializadas para Notícias, Lore, Regras, Coleções, Eventos e Roadmap, seguidas por E2E real contra um backend RuneForge de teste.
