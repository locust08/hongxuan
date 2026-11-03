# Migration validation — 2 November 2026

The Astro application runs locally at http://127.0.0.1:4321. Production output was also exercised with Astro's Workers preview at port4322. The original source remains outside this application, unchanged.

**Deployment follow-up:** the application has since been pushed to GitHub and deployed on Cloudflare Workers. See [DEPLOYMENT.md](DEPLOYMENT.md) for the public URL, production D1 reconciliation and live verification. The evidence below records the earlier migration acceptance checks.

**Clean URL follow-up,3November2026:** all migrated business endpoints now use extensionless Astro URLs, with permanent redirects from old addresses. The expanded73-test suite and production checks pass; see [CLEAN-URLS.md](CLEAN-URLS.md).

## Verified results

| Check | Result |
| --- | --- |
| Complete test suite, including both live flags | **65 passed, 0 failed, 0 skipped** |
| `npm run check` | **0 errors, 0 warnings**, 3 unused legacy event-handler hints |
| `npm run build` | Passed |
| `npm run deploy:check` | Passed; Workers bundle includes D1, R2, assets, SESSION KV and scheduled handler |
| Original ASP route inventory | **198 accounted for, 0 unmapped** |
| Unauthenticated HTTP audit against built Worker | 22x200, 167x303, 6x404 excluded routes, 3x405 POST actions; no unexpected errors |
| Authenticated root admin HTTP audit | 171 paths:109x200,48x405,14 expected404 for absent record fixtures; no unexpected results |
| Local scheduled mail handler | 200, outcome `ok` |
| Actual local R2 HTTP flow | Product creation, upload, automatic attachment, image serving, confirmation, deletion and cleanup passed |
| Source database reconciliation | Active24 tables/2,968 rows preserved; separate old archive23 tables/5,087 rows |

Run the complete live suite using the environment flags documented in [README](../README.md). The final run targeted the built Worker using `CORE_HTTP_BASE` and `LIVE_ORIGIN` at port4322, avoiding development reloads. Live tests clean up their disposable business records; successful admin logins intentionally create operational login logs. Passwords are intentionally converted to salted hashes. The baseline full-record reconciliation is private because the source contains personal records.

Original active MDB SHA-256: `C1C8DC2930D724AA93CBAE992A4B6CECB1932F5CE754F50EFCDF0C49B231D4A3`.

## Scope of functional checks

Tests cover source/data reconciliation; public catalogue filters, sorting, paging, content and metadata; authentication, active permissions and direct action authorization; CSRF, session isolation and private form drafts; admin CRUD, account/group/module operations, enquiry statuses and historical lines; R2 upload replacement/deletion; captcha; cart mutations, concurrent edits, atomic enquiry submission, numbering and retry idempotency; frozen email/order snapshots; mail leases, backoff and scheduled retries; Malaysia wall-clock timestamps; and native animation packaging.

Independent review found three consequential issues: arbitrary-path admin dispatch, a cart/email snapshot race, and missing operational email retries. Each was fixed with regression coverage. Failed-contact draft preservation also has a live Astro-router regression test. No real email was sent during testing.

## Visual and browser evidence

See [public validation](PUBLIC-VALIDATION.md), [admin validation](ADMIN-VALIDATION.md), and [route coverage](ROUTE-COVERAGE.md). Home source/migration screenshot pairs are `home-{original,modern}-{desktop,tablet,mobile}.png`. Public screenshots cover catalogue, detail, about, contact and cart. Admin comparisons were captured privately because they contain account/business information.

Public comparisons used1440x1000,768x1024 and390x844. Actual mobile browser contexts were also checked. Both versions retain the original1002px table layout and horizontal scrolling. Home page height3115/footer3060 and measured catalogue/detail/contact anchors match the source. Original HTML3.2 document mode and mobile scaling are retained. Fonts and Canvas antialiasing can vary by renderer.

Native Canvas retains the exported header artwork,546-frame timeline and original main loop, plus the archive145-frame intro. Browser checks found no uncaught JavaScript errors on home, catalogue, detail, contact, admin login or archive. Missing1x1 archive spacer GIFs were reconstructed as transparent pixels at both original paths; archive pages were checked separately. No Flash emulator or runtime is included.

## Explicit limits and external blockers

- Both supplied MDBs lack the membership/company/newsgroup tables referenced by source. Their reconstructed schema is initially empty; unavailable historical records and exact absent schemas cannot be recovered.
- `video/video.wmv` is absent. `aboutus_old.asp` preserves its400x400 area with an accessible unavailable-media fallback; video playback is unavailable.
- The native rich-text editor preserves formatting and HTML editing functionality, but its controls differ from the old TinyMCE toolbar. Advanced table/image-property dialogs and per-editor zoom are not reproduced; equivalent markup is editable through HTML source. Some admin form/table spacing differs. Captcha is session SVG. The obsolete Flash loading scene is skipped; the main animation is retained. Exact pixel parity for every animation frame and every admin record state is not claimed.
- External mail delivery requires a configured provider, verified sender and token. Default mode safely retains messages in the outbox. Scheduling/retry behavior is locally tested; provider acceptance and final delivery remain unverified.
- Cloudflare deployment was initially an external blocker; it is now provisioned and live as recorded in [DEPLOYMENT.md](DEPLOYMENT.md). Email provider configuration and any custom domain routing remain separate.

The six intentionally excluded ASP candidates are legacy hosting diagnostics and malicious code-execution utilities, explicitly listed in the route ledger. They are not business pages. Private source/configuration/database files are not shipped as public assets.
