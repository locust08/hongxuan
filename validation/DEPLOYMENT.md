# Cloudflare deployment — 2 November 2026

Repository: https://github.com/locust08/hongxuan

Account: **Eason CF Main**. Worker: `hongxuan-astro`.

Provisioned resources:

- D1: `hongxuan` (APAC),24 original tables and2,968 imported records; every full-record hash reconciled before public deployment.
- R2: `hongxuan-uploads`, for mutable admin uploads. Original assets are bundled with the Worker.
- KV: dedicated `hongxuan-session`, bound as `SESSION` for the Astro adapter.
- Mail: outbox mode; external delivery remains unconfigured.

The public repository uses a clean application snapshot without local browser history, private database seeds/exports, credentials or local storage. The source MDBs are retained locally and are not needed by the deployed runtime.

Production deployment and public URL verification results will be recorded here after deployment.
