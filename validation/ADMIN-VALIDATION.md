# Admin migration validation

Validated 2026-11-02. Original ASP files and the database used by localhost:8080 were not changed. Authenticated ASP comparisons used the separate reference copy on localhost:8081. Credentials were decoded offline in memory and passed through a one-request loopback helper; no credentials were written into application source or test fixtures.

## Automated evidence

`node --experimental-strip-types --test tests/admin.test.ts`: **20 tests passed, zero failed**.

Coverage includes:

- A checked-in exact allowlist of all **171** original admin/module/personal ASP source paths, including source form fragments, multipart library aliases, old variants and the `Copy of` action alias. Fixture GET coverage supplies valid identifiers. Mutation-only action GETs return 405; GET deletion links display a CSRF-protected confirmation.
- Login verification, inactive-account rejection, session rotation, unauthenticated direct action requests, CSRF rejection, menu/module/submodule/data permission boundaries and privileged user/group protections.
- Negative regression for invented sensitive routes such as `/app/module/members/assign_profile_action.asp`. The handler rejects the entire wrong-directory path before dispatch; tests assert no user or permission records change.
- Product action aliases, parameterized quoted content, HTML sanitization, original category/name prefix-or-contains filtering, category/name/date ordering, bounded 25-record paging with retained filters, and original lowercase `delete` selections.
- User creation, duplicate case-insensitive login rejection, password hashing, status/group filters and the corresponding log-user listing. Other entity lists retain bounded pagination using the source include's default 20-record page size.
- Category rename/delete cascades, profile replacement and module/submodule permission cascades.
- All five catalogue upload aliases attach to `prod_pict`, `prod_pice`, `prod_download`, `prod_picl` and `prod_download2`; brand/status uploads attach to `brand_logo`/`status_pic`. Intermediate create/modify action aliases retain the source upload redirect.
- File signatures and original size/type limits, scoped R2 keys, upload metadata, AskDelete confirmation and preservation of shared files. PDF previews use native PDF embedding or document links.
- Enquiry source type/order/page controls, validated status updates, quoted reasons and readable historical product references. Inferred membership approval queues one outbox message when transitioning from non-approved to active.
- Rich-text round trips retain safe image dimensions, alt/title and query-string links while rejecting event handlers, active embedded content and unsafe image sources.

`npx astro check`: **zero errors** after final functional changes. The controller owns the final whole-project test/build/deployment checks.

## Actual HTTP and R2 evidence

An existing active group-0 account was used against localhost:4321 to request every allowlisted source route. Results:

| Result | Count | Meaning |
| --- | ---: | --- |
| 200 | 109 | Pages, compatible forms/library views and deletion confirmations |
| 405 | 48 | Mutation endpoints requested with GET |
| 404 | 14 | Record-dependent views with no corresponding source brand/member/company record |
| Unexpected | 0 | No server failures or omitted source paths |

Detailed result: `../../.local/migration-audit/admin-http-root-route-audit.txt`.

A separate HTTP test exercised the actual local D1/R2 bindings, rather than mocks:

1. Created a uniquely named temporary product using the source create-and-upload action.
2. Uploaded a valid GIF through `uploadc/uploadfile.asp` with its CSRF token and product ID.
3. Followed the modify redirect and verified the product's hidden thumbnail field was populated automatically.
4. Retrieved the uploaded asset successfully with `image/gif` content type.
5. Exercised AskDelete confirmation, then deletion.
6. Verified the asset returned 404, and deleted the temporary product through the original lowercase bulk-delete field.

All seven recorded flags are true, including cleanup: `../../.local/migration-audit/admin-r2-http-check.json`. The temporary product and R2 object were removed before the controller resumed full-suite validation.

## Browser and presentation evidence

Authenticated reference and Astro screenshots cover dashboard, catalogue list, create-product form, heading form, user list and create-user form at 1440×1000, 768×1024 and 390×844. Private artifacts use these filename prefixes under `../../.local/migration-audit/`:

- `admin-reference-…`
- `admin-astro-final-…`
- `admin-astro-login-stable.png`

Screenshots were inspected, not only generated. Corrections following comparison restored the original body margins, logo/header placement, company document title, source CSS/table palette, original input sizing, selected-module/personal navigation expansion, catalogue field order, list controls and alternating table rows. The controller also removed the added viewport meta tag to preserve the original mobile browser scaling. Some screenshots precede the final small typography/filter-row corrections; they are comparison evidence, not a claim of exact final pixel equality.

Browser editor checks confirmed that typing synchronizes the original `myTextarea` field. Editing HTML source and blurring renders headings, images and query-string links as formatting rather than literal HTML text. Those checks did not submit or alter a source product.

## Explicit limitations and differences

- Membership/company/news-group records and authoritative schemas were absent from both supplied databases. Their routes and forms operate against the documented inferred empty schema. Empty lists show a normal client-facing empty state; historical membership parity cannot be verified. Record-dependent requests correctly return 404 until a record exists.
- The native rich-text editor replaces TinyMCE's old JavaScript/plugins. It provides format/font/size, alignment, lists, indent, undo/redo, link/unlink, safe images, table insertion, colors, horizontal rules, date, find/replace, HTML source, preview and print. Its buttons/dialog layout differs from TinyMCE. TinyMCE-specific advanced table/image-property dialogs and per-editor zoom UI are not reproduced; attributes and table markup can be edited through HTML source. Flash insertion and obsolete external spellchecker integrations are not retained.
- Source HTML quirks and some individual form spacing/border/control details differ. This evidence does **not** establish pixel-identical rendering for every admin screen or state.
- Source deletion links now require an explicit CSRF-protected POST confirmation. Physical deletion applies only to tracked uploaded R2 objects after checking shared references; immutable migrated source assets are not removed from the static deployment.
- Member approval queues an inspectable outbox entry. Real external email delivery is not established by these tests.
- D1/R2 validation used local Workers bindings. Production infrastructure and externally delivered email remain controller-level deployment/service checks.

No legitimate source path is intentionally dropped or replaced with a generic 410. Route acceptance, authorization, available records, visual parity and complete feature equivalence are separate claims; the evidence above states the limits of each.
