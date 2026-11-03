# Clean Astro URLs — 3 November 2026

The user's revised URL requirement supersedes the initial decision to retain `.asp` public addresses.

| Previous address | Canonical Astro address |
| --- | --- |
| `/index.asp` | `/` |
| `/aboutus.asp` | `/aboutus` |
| `/our-products.asp` | `/our-products` |
| `/new-arrival.asp` | `/new-arrival` |
| `/contactus.asp` | `/contactus` |
| `/details.asp?prod_id=619` | `/details?prod_id=619` |
| `/app/admin/login.asp` | `/app/admin/login` |

All192audited migrated business endpoints have equivalent clean routes. Old addresses redirect with308, preserving query parameters and POST methods/bodies. Six excluded hosting/code-execution utilities remain404. The route audit now verifies both the legacy redirect and its clean destination.

Astro middleware canonicalizes navigation, forms, captcha URLs, redirects, hidden return addresses, popup links and scripted form actions. The existing TypeScript services retain their original internal identifiers to preserve source traceability; these do not load or execute `.asp` files. Public canonical metadata uses the clean URL. Authorization, CSRF, sessions and database operations remain enforced after route resolution.

Local verification:73tests passed,0failed,0skipped with both live flags; Astro check0errors/0warnings; production build and Workers deployment dry run passed. The198-route audit reported192permanent redirects,22clean200responses,167authentication redirects,6excluded404responses and3POST-only405responses, with no unexpected failures.

Browser checks on the five requested public pages, product detail and admin login found0broken images,0ASP navigation/form/captcha URLs and0uncaught JavaScript errors. Home retained height3115at desktop/tablet/mobile widths1440,768,390and original1002px narrow-screen layout. A real navigation click opened the clean `/aboutus` route. Contact draft recovery and compatibility POST-body preservation passed against the live local Worker.

Production verification is recorded below after deployment.
