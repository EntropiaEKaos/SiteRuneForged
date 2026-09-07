# Portal Admin Hardening 1.0

## Scope

This release hardens the SiteRuneForged browser/BFF boundary without moving any authority out of RuneForgedTCG.

RuneForgedTCG remains authoritative for:

- administrator authentication and MFA;
- RBAC;
- CMS validation;
- optimistic versioning;
- publish/archive/rollback;
- audit history.

The portal only forwards the HttpOnly admin session through a same-origin BFF.

## Same-origin mutation boundary

All Portal Control mutations are checked before privileged cookies or payloads are forwarded.

The BFF:

- rejects cross-origin `Origin` values;
- uses Fetch Metadata when `Origin` is absent;
- accepts missing `Origin` only for explicitly `same-origin` or `none` fetch contexts;
- returns HTTP 403 before contacting the backend on cross-origin mutation attempts.

Safe GET/HEAD/OPTIONS requests are not affected.

## Streamed request body ceilings

Portal mutation bodies are measured on the actual request stream. `Content-Length` is only an early-rejection optimization.

Limits:

- admin login: 16 KiB;
- CMS/site mutations: 512 KiB.

Oversized payloads return HTTP 413 before backend forwarding.

This prevents chunked/unknown-length requests from bypassing the portal memory boundary.

## Browser security policy

Every dynamic portal request receives a request-specific CSP nonce.

The policy includes:

- `default-src 'self'`;
- nonce-based `script-src` with `strict-dynamic`;
- `frame-ancestors 'none'`;
- `object-src 'none'`;
- `base-uri 'self'`;
- `form-action 'self'`;
- same-origin network connections.

The portal also returns:

- `Strict-Transport-Security`;
- `X-Content-Type-Options: nosniff`;
- `X-Frame-Options: DENY`;
- strict referrer policy;
- restrictive Permissions Policy;
- COOP and CORP.

## Cache behavior

Portal admin BFF responses are `Cache-Control: no-store`.

Admin credentials are never stored by the portal frontend. The backend-issued `rf_admin_session` remains HttpOnly.

## CI supply chain

The three portal workflows pin GitHub Actions to immutable commit SHAs:

- checkout;
- setup-node;
- upload-artifact.

Tags such as `@v4` are rejected by the source contract.

## Certification

Web CI behaviorally verifies:

- CSP/security response headers;
- cross-origin admin mutation rejection;
- login body overflow rejection;
- CMS body overflow rejection.

Full Stack Integration must still pass against the exact certified RuneForgedTCG backend SHA and Production Alpha Smoke 1.1.

## Boundaries

This hardening does not change:

- game engine or gameplay;
- card definitions;
- public content schemas;
- CMS ownership;
- Ranked;
- payments;
- Live Ops.
