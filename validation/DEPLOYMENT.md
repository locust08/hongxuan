# Cloudflare deployment — 2 November 2026

**5November2026 update:** About Us gallery and responsive public/admin layouts are live in version `c3f6c34c-e350-4c21-a116-3876cc1928a2`. Local490-case and production175-case viewport matrices pass; see [RESPONSIVE.md](RESPONSIVE.md). No database import or migration was required.

**3November2026 update:** clean Astro URLs are deployed in version `4472013a-285d-43a0-a0df-2cb113f703e6`. The five requested pages and admin/forms no longer use `.asp` addresses. See [CLEAN-URLS.md](CLEAN-URLS.md) for production routing/browser/POST/upload verification; the original deployment evidence below remains historical.

Repository: https://github.com/locust08/hongxuan

Account: **Eason CF Main**. Worker: `hongxuan-astro`.

Provisioned resources:

- D1: `hongxuan` (APAC),24 original tables and2,968 imported records; every full-record hash reconciled before public deployment.
- R2: `hongxuan-uploads`, for mutable admin uploads. Original assets are bundled with the Worker.
- KV: dedicated `hongxuan-session`, bound as `SESSION` for the Astro adapter.
- Mail: outbox mode; external delivery remains unconfigured.

The public repository uses a clean application snapshot without local browser history, private database seeds/exports, credentials or local storage. The source MDBs are retained locally and are not needed by the deployed runtime.

Live URL: **https://hongxuan-astro.easondev.workers.dev**

Deployed version: `ca38c585-4929-4487-a1b2-ee3c42d701f7`. Worker startup measured16ms. The five-minute outbox retry schedule is deployed; outbox mode does not send external email.

## Production verification

- All198original ASP candidates audited over HTTPS:22x200,167x303 authentication redirects,6excluded404,3POST-only405; zero unexpected failures.
- Browser checks for home, catalogue, product619, contact, cart, admin login and archive:200responses, zero broken images and zero uncaught JavaScript errors.
- Source account login succeeded against production D1.
- Actual production D1/R2 fixture flow passed: product creation, GIF upload, automatic attachment, image serving, delete confirmation, object deletion and product cleanup. Fixture records/objects were removed.
- Production contact-draft router regression passed, confirming session-bound form recovery after invalid input.
- Original business totals remain379products,54enquiries and115enquiry lines after fixture cleanup. Successful validation logins add normal audit log records; product autoincrement values may advance after temporary fixtures.
- Production build and Astro check passed with0errors/0warnings before publishing. The preceding complete local suite passed65/65.

The site uses the Workers-provided hostname. No custom domain/DNS or automatic GitHub deployment workflow was configured. Future code updates require the documented build/deploy commands. Missing source membership data/video and editor differences remain as documented in the migration validation report. Real email delivery remains unconfigured.
