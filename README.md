# RuneForge Web Portal

Portal público oficial do RuneForge, mantido em repositório e deploy separados do runtime do jogo.

## Arquitetura

- **SiteRuneForged** — apresentação pública, páginas editoriais e fachada opcional do Portal Control.
- **RuneForgedTCG** — autoridade de jogo, cartas, coleções, CMS, operadores, MFA, RBAC, publicação e auditoria.
- O site não mantém uma segunda base de cartas, usuários administrativos ou conteúdo publicado.

## Variáveis de ambiente

Configure no ambiente do servidor/hosting:

```bash
RUNEFORGE_API_URL=https://<backend-publico-runeforge>
RUNEFORGE_ADMIN_API_URL=https://<backend-admin-runeforge>
```

`RUNEFORGE_ADMIN_API_URL` é opcional quando a API administrativa usa a mesma origem de `RUNEFORGE_API_URL`.

Essas variáveis são **server-side**. Não use prefixo `NEXT_PUBLIC_` e não exponha credenciais administrativas no browser.

### Vercel

Em **Project Settings → Environment Variables**, defina `RUNEFORGE_API_URL` para Preview e Production. Se a origem administrativa for diferente, defina também `RUNEFORGE_ADMIN_API_URL`.

Depois de alterar variáveis, faça um novo deployment para que Server Components e BFF usem a configuração atual.

## Conteúdo público

O portal consome APIs publicadas do RuneForgedTCG:

- Portal CMS: `/api/public/site/*`
- Catálogo de cartas: `/api/public/game/cards`
- Detalhe de carta: `/api/public/game/cards/{defId}`

Quando a API pública está tecnicamente indisponível, páginas editoriais podem usar fallback editorial explicitamente definido. O catálogo de cartas **não** usa uma cópia fallback: ele mostra indisponibilidade para preservar a fonte de verdade única.

## Portal Control

As rotas em `/admin` usam BFF same-origin. O cookie `rf_admin_session` continua HttpOnly e a autoridade de sessão permanece no RuneForgedTCG.

O site apenas encaminha sessão e mutations; `expectedVersion`, RBAC, MFA, locks, histórico, publish/archive/rollback e auditoria são validados pelo backend.

## Qualidade

O GitHub Actions executa:

1. contratos de integração;
2. TypeScript typecheck;
3. build de produção;
4. Chromium visual E2E em desktop e mobile;
5. upload das evidências visuais.

Documentação adicional está em `docs/`.
