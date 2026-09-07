# RuneForge Web Portal

Portal público oficial do RuneForge, mantido em repositório e deploy separados do runtime do jogo.

## Arquitetura

- **SiteRuneForged** — apresentação pública, páginas editoriais e fachada opcional do Portal Control.
- **RuneForgedTCG** — autoridade de jogo, cartas, coleções, CMS, operadores, MFA, RBAC, publicação e auditoria.
- O site não mantém uma segunda base de cartas, usuários administrativos ou conteúdo publicado.

## Runtime reprodutível

O portal usa uma baseline única de runtime e dependências:

- **Node 22.23.2**, fixado em `.nvmrc` e nos workflows;
- **Next.js 15.5.25**, na linha de manutenção usada por este Alpha;
- **React / ReactDOM 19.2.8**;
- **Playwright 1.63.0** para certificação de navegador;
- `package-lock.json` lockfileVersion 3 versionado;
- `npm run ci:install` → `npm ci --no-audit --no-fund` em todos os gates.

A migração aposentou o antigo Next 14.2.31 depois que a auditoria de dependências identificou que aquela linha não era mais uma baseline aceitável para segurança em 2026. As rotas App Router foram migradas para os request props assíncronos do Next 15 (`params` / `searchParams` como Promises).

Não use `npm install` em CI ou em gates de release. Mudanças de dependência devem alterar `package.json` e `package-lock.json` de forma explícita e passar novamente Web CI + Full Stack Integration.

Veja `docs/PORTAL_RUNTIME_HARDENING.md`.

## Variáveis de ambiente

Configure no ambiente do servidor/hosting:

```bash
RUNEFORGE_PORTAL_DEPLOY_SHA=<sha-exato-site-runeforged>
RUNEFORGE_PORTAL_DEPLOY_ENV=<alpha|production>
RUNEFORGE_API_URL=https://<backend-publico-runeforge>
RUNEFORGE_GAME_URL=https://<frontend-jogavel-runeforge>
RUNEFORGE_EXPECTED_DEPLOY_SHA=<sha-git-certificado-de-40-caracteres>
RUNEFORGE_ADMIN_API_URL=https://<backend-admin-runeforge>
```

`RUNEFORGE_GAME_URL` é opcional e define a origem navegável do jogo usada pelos CTAs do Alpha; quando omitida, o portal usa a origem de `RUNEFORGE_API_URL`. `RUNEFORGE_EXPECTED_DEPLOY_SHA` é opcional, mas recomendado no Alpha/Production: quando configurado, o portal só mantém os CTAs do jogo ativos se o backend ao vivo reportar exatamente esse SHA em sua provenance pública. `RUNEFORGE_ADMIN_API_URL` é opcional quando a API administrativa usa a mesma origem de `RUNEFORGE_API_URL`.

`RUNEFORGE_PORTAL_DEPLOY_SHA` e `RUNEFORGE_PORTAL_DEPLOY_ENV` identificam o próprio build do portal. Deploys certificados devem usar `npm run production:build`, que falha se essa identidade estiver ausente/inválida e, no GitHub Actions, exige igualdade exata com `GITHUB_SHA`.

Essas variáveis são **server-side**. Não use prefixo `NEXT_PUBLIC_` e não exponha credenciais administrativas no browser.

### Vercel

O repositório inclui `vercel.json` com Framework `nextjs`, Install Command `npm run ci:install` e Build Command `npm run production:build`.

Com **System Environment Variables** habilitadas no projeto Vercel, o portal usa automaticamente `VERCEL_GIT_COMMIT_SHA` como identidade Git e `VERCEL_ENV` para `preview`/`production`. Assim, não é necessário copiar manualmente `RUNEFORGE_PORTAL_DEPLOY_SHA` para cada deployment Git. Variáveis RuneForge explícitas continuam tendo precedência e divergências entre fontes de SHA falham fechadas.

Em **Project Settings → Environment Variables**, defina `RUNEFORGE_API_URL` para Preview e Production. Se o frontend jogável estiver em outra origem, defina `RUNEFORGE_GAME_URL`. Para um deploy Alpha/Production rastreável, defina também `RUNEFORGE_EXPECTED_DEPLOY_SHA` com o commit exato já certificado do RuneForgedTCG. Se a origem administrativa for diferente, defina `RUNEFORGE_ADMIN_API_URL`.

Depois de alterar variáveis, faça um novo deployment para que Server Components e BFF usem a configuração atual. Veja `docs/VERCEL_ALPHA_DEPLOYMENT.md` para o checklist completo.

## Conteúdo público

O portal consome APIs publicadas do RuneForgedTCG:

- Portal CMS: `/api/public/site/*`
- Catálogo de cartas: `/api/public/game/cards`
- Detalhe de carta: `/api/public/game/cards/{defId}`
- Keyword Codex: `/api/public/game/keywords`
- Rules Contracts: `/api/public/game/rules/contracts`
- Alpha readiness: `/api/public/game/alpha/readiness`
- Game deployment provenance: `/api/public/game/deployment/provenance`
- Portal deployment provenance: `/api/public/portal/deployment/provenance`

Quando a API pública está tecnicamente indisponível, páginas editoriais podem usar fallback editorial explicitamente definido. O catálogo de cartas **não** usa uma cópia fallback: ele mostra indisponibilidade para preservar a fonte de verdade única.

## Portal Control

As rotas em `/admin` usam BFF same-origin. O cookie `rf_admin_session` continua HttpOnly e a autoridade de sessão permanece no RuneForgedTCG.

O site apenas encaminha sessão e mutations; `expectedVersion`, RBAC, MFA, locks, histórico, publish/archive/rollback e auditoria são validados pelo backend.

## Qualidade

O GitHub Actions executa:

1. instalação determinística via `npm ci` no Node 22.23.2;
2. contratos de integração e de runtime/lockfile;
3. TypeScript typecheck;
4. build de produção;
5. Chromium visual E2E em desktop e mobile;
6. upload das evidências visuais;
7. certificação full-stack contra um SHA exato do RuneForgedTCG, incluindo comparação da provenance ao vivo com o SHA esperado pelo portal;
8. um **Production Alpha Smoke** manual para validar os origins HTTPS já implantados contra o SHA certificado do game.

O Launch Hub mostra o SHA completo e o ambiente do runtime. Quando `RUNEFORGE_EXPECTED_DEPLOY_SHA` está configurado, divergência, provenance indisponível ou pin inválido bloqueiam os CTAs do jogo. Veja `docs/ALPHA_BUILD_PROVENANCE.md`.

### Production Alpha Smoke

Depois que site e game estiverem publicados, execute manualmente o workflow **Production Alpha Smoke** informando os dois origins HTTPS, o SHA exato certificado do SiteRuneForged, o SHA exato certificado do RuneForgedTCG e os ambientes esperados (`alpha` ou `production`). O gate valida readiness, provenance, 7/7 capacidades, Ranked desligado, consistência de versões, `BUILD CERTIFICADO` no portal e o CTA `/play`, gerando manifesto + screenshot.

O mesmo script é exercitado pelo Full Stack Integration com uma exceção HTTP estritamente local; o workflow de produção nunca habilita essa exceção. Veja `docs/PRODUCTION_ALPHA_SMOKE.md`.

Documentação adicional está em `docs/`.
