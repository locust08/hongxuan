# Hong Xuan — Astro migration

The migrated application uses Astro 7.4.4, the Cloudflare adapter 14.4.3, TypeScript 6.0.3, Workers, D1 and R2. TypeScript 6 is used because the current Astro checker supports TypeScript 5/6. Package versions are locked in `package-lock.json`.

The original website remains in the parent folder for comparison. **Running this application does not require IIS, Classic ASP, Microsoft Access, Java, FFDec, Flash, Ruffle, or the original server.** Original `.asp` URL suffixes are retained as routes handled by Astro/TypeScript.

## Local setup

Use Node.js 24 or a current version supported by Astro. From this directory:

```powershell
npm ci
npm run setup
npm run dev
```

Open http://127.0.0.1:4321. The admin login is http://127.0.0.1:4321/app/admin/login.asp. Existing account credentials are retained through an offline conversion to salted PBKDF2 hashes; credentials are not printed in these instructions.

On Windows, `./start-local.ps1` starts a hidden server, checks for an existing listener and preserves logs under `.local/`. The source comparison site at localhost:8080 is separate and is not required by Astro.

`npm run setup` applies local D1 migrations and imports `private-data/active-seed.sql` only into an empty catalogue. It retains an already populated database. Keep the private seed and archive safe: they contain personal business records and are deliberately Git-ignored. They are never copied into public assets or the deployment bundle. Normal development and production use D1, not an `.mdb` file.

## Preserved data

The supplied active database has 24 tables and 2,968 rows, including 379 products, 54 enquiries, 115 enquiry lines and 1,574 temporary-cart lines. Migration preserves nulls, empty strings, duplicate rows, identifiers, composite keys, suitable indexes, text prices and historical orphan references. Original passwords are the sole intentionally transformed stored field.

The older database is preserved separately in `private-data/archive-old.sqlite` and `private-data/archive-old.sql` (23 tables, 5,087 rows). It is not merged into the live database. The import and reconciliation scripts are under `scripts/`; source exports are only needed to repeat the one-time conversion or independently recheck against the original input.

Baseline local D1 reconciliation is recorded privately in `private-data/d1-reconciliation.json`. Successful admin logins subsequently add operational log rows as expected. Browser/HTTP tests use disposable fixtures; their cleanup is documented with the validation evidence.

## Application and routes

- Public pages retain the original content, metadata, image slices, small typography, yellow/orange palette, 1002-pixel table layout, search, categories, product ordering, pagination, details, enquiry cart and contact forms.
- Smaller screens preserve the original horizontal scrolling instead of introducing a redesigned mobile layout.
- The back office includes accounts, permissions, personal settings, catalogue/maintenance operations, uploads, enquiry processing and printing. All legacy source routes have an explicit coverage treatment. Alternate arbitrary paths must not dispatch privileged operations by filename alone.
- D1 stores sessions, CSRF/captcha state and the durable mail outbox. R2 supports editable images/documents using their original public asset paths. Original static images remain bundled assets, with case aliases for Windows filename differences.
- The main header and archive intro use native HTML5 Canvas drawing commands and original recovered artwork. No SWF or emulator is loaded. See `THIRD_PARTY.md` for conversion attribution and animation details.
- Arbitrary-code execution files, hosting diagnostics, raw source/includes, database files and private runtime artifacts are not public business routes.

## Email configuration

Default `MAIL_MODE=outbox` saves messages locally and does **not** send email. The UI states that an enquiry was queued. The original business recipient is the default; `MAIL_TO` can override it server-side. Customer copies are queued separately.

For provider delivery, configure an authorized sender and a Resend-compatible HTTPS API:

```text
MAIL_MODE=https
MAIL_API_URL=https://api.resend.com/emails
MAIL_FROM=an authorized sender on your domain
MAIL_TO=your business enquiry recipient
MAIL_API_TOKEN=your private provider secret
```

Use `.dev.vars` for local secrets and `wrangler secret put MAIL_API_TOKEN` for production. Do not put secrets into public files, source code or `wrangler.jsonc`. The transport records provider acceptance as `sent`; this does not establish recipient receipt. A Worker Cron Trigger checks pending/failed messages every five minutes, with bounded exponential retries (up to eight attempts). The drain does nothing in `outbox` mode. Failed messages remain in D1 for operator investigation after the retry limit. Real provider delivery has not been verified with this account.

## Checks

```powershell
npm test
npm run check
npm run build
npm run deploy:check
```

Optional live checks require the local server and D1 setup:

```powershell
$env:RUN_LIVE_CORE = '1'
$env:RUN_LIVE_ROUTER = '1'
npm test
```

`scripts/audit-routes.mjs` audits all 198 original ASP candidates without logging in. Its report distinguishes public endpoints, protected admin routes and intentionally excluded diagnostics/code-execution routes. An unauthenticated `303` is an authorization redirect, not evidence that the protected operation itself was tested. Authenticated operation tests and visual evidence are documented separately under `validation/`.

## Cloudflare deployment

The project is configured for Workers, not Pages. The development/preview servers use `workerd` with local D1/R2 simulation. A deployment dry run validates bundling and bindings without publishing.

`wrangler.jsonc` targets **Eason CF Main**, with production D1 `hongxuan`, R2 `hongxuan-uploads` and the dedicated `SESSION` KV namespace already provisioned. The initial D1 import reconciled all24 tables/2,968 rows against full-record hashes. Application sessions themselves use D1. Private exports and credentials are excluded from this public repository.

For subsequent deployments, authenticate to that account and run:

```powershell
npx wrangler d1 migrations apply hongxuan --remote
npm run build
npm run deploy:check
npm run deploy
```

Do not reimport the initial seed into an existing populated production database. Mail remains in outbox mode until a provider, verified sender and token are configured. No DNS/domain change or live email delivery is claimed. Keep a D1 export and R2 backup before future data changes. Roll back the Worker version through Wrangler and restore data separately if a migration changed it. Deployment verification is recorded separately under `validation/DEPLOYMENT.md`.

## Source limitations and measured differences

- `membership`, `company` and `newsgroup` tables are absent from both supplied databases. Their source-visible functionality uses an explicitly inferred, initially empty schema. Historical member records and exact missing schemas cannot be recovered from this backup.
- `aboutus_old.asp` references missing `video/video.wmv`. A same-sized accessible unavailable-media fallback replaces its obsolete ActiveX player; playback cannot be reproduced without the source media.
- Captcha is session-bound SVG instead of the original VBScript raster generator. Font/Canvas antialiasing may differ slightly from Flash. The obsolete preload scene is skipped while the original main animation loop is retained.
- The native rich-text editor has different controls from TinyMCE. Its advanced table/image-property dialogs and per-editor zoom are not reproduced; equivalent markup can be edited in HTML source. Some admin form spacing differs. Two absent archive spacer GIFs are reconstructed as transparent1x1 pixels.
- Random recommended products and current date/time naturally differ between captures. Visual checks stabilize these where possible. See the validation documents for measured page differences and unresolved items; do not infer full parity from a successful build alone.

Final local test, build, route, browser and deployment-bundle evidence is recorded in [validation/VALIDATION.md](validation/VALIDATION.md).
