# Portal Runtime Hardening 1.0

## Objetivo

Tornar o SiteRuneForged reproduzível, suportado e auditável sem alterar a autoridade do RuneForgedTCG.

Esta etapa nasceu de uma lacuna operacional simples: o portal não possuía `package-lock.json`, usava `npm install` nos runners e ainda executava Next.js 14.2.31. Durante a geração do primeiro lockfile, o metadata do registry sinalizou essa versão antiga do Next como deprecated por segurança. Em vez de congelar uma baseline obsoleta, o hardening migrou primeiro o runtime e só depois criou o lock definitivo.

## Baseline certificada

- Node: `22.23.2`
- package engine: `22.23.x`
- Next.js: `15.5.25`
- React: `19.2.8`
- ReactDOM: `19.2.8`
- Playwright: `1.63.0`
- TypeScript: `5.7.2`
- npm lockfile: version 3

A escolha da linha Next 15 foi deliberada: ela permite sair da antiga linha 14 e permanecer na linha de manutenção, evitando neste momento a superfície maior de migração para uma major adicional.

## Lockfile e instalação determinística

`package-lock.json` é parte do código de release.

O comando canônico de CI é:

```bash
npm run ci:install
```

que executa:

```bash
npm ci --no-audit --no-fund
```

Web CI, Full Stack Integration e Production Alpha Smoke usam o mesmo comando.

Isso significa que um SHA do portal não pode recalcular silenciosamente uma árvore transitiva diferente durante um gate. Alterações de dependência precisam aparecer no diff do lockfile.

## Node único

`.nvmrc` fixa `22.23.2`.

Os workflows Web CI, Full Stack Integration e Production Alpha Smoke também fixam `22.23.2`.

O `engines.node` do package é `22.23.x`, permitindo apenas patches dessa baseline para consumidores que respeitem engines, enquanto os gates oficiais continuam no patch exato.

## Migração App Router para Next 15

Next 15 trata request APIs dinâmicas como assíncronas.

Foram migrados para `Promise` + `await`:

- `/admin/[resource]`;
- proxy catch-all `/api/portal-admin/site/[...path]`;
- `/cards/[defId]`;
- `/cards` (`searchParams`);
- `/collections/[slug]`;
- `/events/[slug]`;
- `/keywords/[key]`;
- `/lore/[slug]`;
- `/news/[slug]`;
- `/regions/[region]`;
- `/roadmap/[slug]`;
- `/rules/[slug]`.

Os source-contract tests impedem regressão acidental para props síncronas incompatíveis com a baseline atual.

## Bootstrap do primeiro lock

O primeiro lock seguro foi gerado em runner GitHub limpo, no Node 22.23.2, e imediatamente validado com `npm ci`.

Um workflow temporário foi usado apenas para materializar o primeiro lock exato na branch. Esse workflow é removido antes do merge e os contratos exigem que ele não exista na árvore final.

## O que esta etapa não muda

Não altera:

- engine ou regras do game;
- cartas ou conteúdo jogável;
- autoridade do CMS;
- autenticação/RBAC;
- Ranked;
- pagamentos;
- Live Ops.

O RuneForgedTCG continua sendo a fonte de verdade do jogo.

## Critério de certificação

O hardening só pode entrar em `main` quando o head exato passar:

1. `npm ci` em runner limpo;
2. contratos;
3. typecheck;
4. `next build`;
5. visual E2E;
6. Full Stack Integration contra o SHA certificado do RuneForgedTCG;
7. Production Alpha Smoke auto-testado no ambiente efêmero full-stack.

Após o squash merge, Web CI e Full Stack Integration devem passar novamente no SHA definitivo de `main`.
