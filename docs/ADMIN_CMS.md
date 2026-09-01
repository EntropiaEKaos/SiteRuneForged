# RuneForge Portal Control — Admin/CMS

## Objetivo

O portal público deve ser totalmente administrável sem duplicar a engine, o Card Studio ou a base de operadores. O painel `/admin` funciona como interface editorial do site e delega persistência, autenticação, versionamento e auditoria ao control plane do RuneForge.

## Estado da implementação

- UI administrativa e catálogo de recursos: `SiteRuneForged`.
- Persistência/API administrativa e pública: `RuneForgedTCG`, PR #86 (`feat/site-cms-api`).
- Evidência visual: Playwright desktop + mobile em GitHub Actions.
- Próxima ligação: BFF de sessão/editor para tornar os botões do painel operacionais contra a API certificada.

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

O frontend possui um bridge server-side alinhado à sessão HttpOnly `rf_admin_session`. O backend do PR #86 implementa persistência, versionamento, RBAC e auditoria.

## Matriz de responsabilidade

- `admin`: acesso total, configuração e publicação.
- `publisher`: aprovação, publicação, SEO e governança editorial.
- `designer`: Home, páginas, navegação, mídia, lore, regiões e apresentação.
- `qa`: revisão de conteúdo dependente de regras/gameplay e preview; sem publicação de produção.
- `liveops`: notícias, eventos, promoções, roadmap e estado do Alpha.

## Persistência

Não existe uma base paralela de usuários no site. O conteúdo editorial vive em `site_content`; cada alteração cria snapshot em `site_content_versions`, e operações administrativas registram `adminAuditLogs`. O público só recebe registros em estado `published`.

## Segurança

- cookies administrativos não são convertidos em tokens expostos no browser;
- mutations validam a sessão e o role no backend;
- nenhuma rota `/api/public/site/*` retorna conteúdo draft ou histórico;
- edição e publicação têm gates independentes;
- toda mutation relevante gera auditoria.

## Evidência visual

Toda mudança relevante no painel gera screenshots reais em Chromium por GitHub Actions. A suíte Playwright cobre desktop (1440x1100) e mobile (390x844), armazenados no artifact `rune-forge-visual-evidence` junto das evidências da Home pública.

## Sequência para administração total

1. certificar e integrar o PR #86 do backend;
2. conectar login/logout e sessão via BFF do SiteRuneForged;
3. ativar editor real de Home/SEO/Navegação;
4. migrar a Home pública de hardcoded para conteúdo publicado;
5. ativar editores de páginas, lore, notícias, mídia, eventos e roadmap;
6. adicionar preview de draft, aprovação e histórico/rollback na UI;
7. certificar E2E: login -> editar -> preview -> publicar -> portal público atualizado.
