# RuneForge Portal Control — Admin/CMS

## Objetivo

O portal público deve ser totalmente administrável sem duplicar a engine, o Card Studio ou a base de operadores. O painel `/admin` funciona como interface editorial do site e delega persistência, autenticação, versionamento e auditoria ao control plane do RuneForge.

## Princípios

1. **Uma única identidade administrativa** — reutilizar os operadores e roles já existentes no RuneForge (`admin`, `designer`, `qa`, `liveops`, `publisher`).
2. **Nenhum segredo no browser** — chamadas privilegiadas passam pelo servidor Next.js ou pelo backend RuneForge; `admin-client.ts` é `server-only`.
3. **Publicação separada de edição** — conteúdo segue `draft -> review -> published -> archived`.
4. **Fonte de verdade única** — cartas, coleções, regiões, keywords e regras continuam pertencendo ao RuneForge; o portal apenas decide apresentação e visibilidade pública.
5. **Auditabilidade** — publicação deve registrar operador, timestamp, versão, diff lógico e permitir rollback.

## Recursos administráveis

O catálogo central em `src/lib/cms/content-model.ts` define 16 domínios: Home, Navegação, Páginas, Cartas, Coleções, Regiões, Keywords, Regras, Lore, Notícias, Mídia, SEO, Alpha, Eventos, Promoções e Roadmap.

## Contrato de API planejado

Leitura pública:

- `GET /api/public/site/home`
- `GET /api/public/site/navigation`
- `GET /api/public/site/pages/:slug`
- `GET /api/public/site/news`
- `GET /api/public/site/seo/:route`

Administração autenticada:

- `GET /api/admin/site/:resource`
- `GET /api/admin/site/:resource/:slug`
- `PUT /api/admin/site/:resource/:slug`
- `POST /api/admin/site/:resource/:slug/review`
- `POST /api/admin/site/:resource/:slug/publish`
- `POST /api/admin/site/:resource/:slug/archive`
- `POST /api/admin/site/:resource/:slug/rollback/:version`

O frontend já possui o bridge server-only para esses endpoints. Eles devem ser implementados no `RuneForgedTCG` em PR próprio, usando a autenticação/MFA/step-up e os mecanismos de versionamento/auditoria já existentes.

## Matriz de responsabilidade

- `admin`: acesso total, configuração e publicação.
- `publisher`: aprovação, publicação, SEO e governança editorial.
- `designer`: Home, páginas, navegação, mídia, lore, regiões e apresentação.
- `qa`: revisão de conteúdo dependente de regras/gameplay e preview; sem publicação de produção.
- `liveops`: notícias, eventos, promoções, roadmap e estado do Alpha.

## Persistência

Não será criada uma base paralela de usuários no site. A persistência final do CMS deve residir no backend/control plane do RuneForge. O site pode manter fallbacks somente durante bootstrap/desenvolvimento; produção consumirá conteúdo publicado via API pública.

## Segurança

- cookies/tokens administrativos não devem ser expostos em bundles públicos;
- mutations devem validar origem/CSRF e role no backend;
- operações críticas de publicação podem exigir step-up/MFA;
- nenhuma rota `/api/public/*` deve retornar conteúdo draft, dados de operador ou metadados sensíveis;
- toda mutation deve gerar auditoria.

## Evidência visual

Toda mudança relevante no painel deve gerar screenshots reais em Chromium por GitHub Actions. A suíte Playwright cobre desktop (1440x1100) e mobile (390x844), armazenados no artifact `rune-forge-visual-evidence` junto das evidências da Home pública.

## Próximas etapas

1. implementar persistência `site content` no backend RuneForge;
2. conectar sessão administrativa ao Portal Control;
3. ativar editores reais começando por Home/SEO/Navegação;
4. migrar textos hardcoded da Home para conteúdo publicado;
5. adicionar preview de draft, aprovação, agendamento, histórico e rollback;
6. conectar Media Library e assets do Card Studio;
7. certificar E2E: login -> editar -> preview -> publicar -> portal público atualizado.
