# Public migration validation

Verified 2026-11-02 against the running original at localhost:8080 and Astro at 127.0.0.1:4321. Original source files remain untouched.

## Coverage

Public pages: `/`, `index.asp`, `aboutus.asp`, `aboutus_old.asp`, `terms.asp`, `contactus.asp`, `211212contactus.asp`, `our-products.asp`, `new-arrival.asp`, `our-brands.asp`, `our-brands1.asp`, `our-category.asp`, `details.asp`, `cart_summary.asp`, `cartsum.asp`.

Compatibility fragments: `mouseout.asp`, `right.asp`, `right2.asp`, `top_category.asp`, `others.asp`. Core owns add_cart_action.asp, captcha and contact/cart mutations. Static archive routes/assets are handled by the controller.

The public renderer supplies the 620px main content. PublicLayout supplies the original 1002px table, 191px native header, 39px sliced navigation, optional160px category strip, 54/620/45/269/14 columns, sidebar and footer. Raw original HTML3.2 doctype is emitted because Astro normalizes literal doctypes; the browser must report BackCompat to reproduce image/table geometry.

## Automated evidence

`node --experimental-strip-types --test tests/public.test.ts` passes16 tests: all routes/fragments render, legacy variants remain distinct, literal parameterized search, configurable ordering allowlist, four-column16-product pagination and boundary clamping, escaped text, missing-product404, metadata, original contact/cart field names and CSRF, cart empty/populated states, missing-brand images.

Static template image paths resolve. A source database audit found37 filename-case differences and no absent product thumbnail/enlarged references; controller asset aliases handle these paths.

## Browser comparison

Playwright measured both applications at1280x1000:

| Page | Evidence |
|---|---|
| Catalogue | Both heading x193/y404; thumbnail columns x212/365/518/671 and rows y517/669/821/973; sidebar top390 and HX logo592; pagination y464/h28 and y1138/h43; footer image y1218. |
| About, terms, category, empty cart | Both heading x193/y244 and footer y945; outer table1002x1000. |
| Brands index | Both heading x193/y404 and footer y945. |
| Contact | Every input/textarea/button coordinate matched. Removed a form-margin reset to retain the original12px gap after the form. |
| Detail619 | Both enlarged image x193/y523, divider y1103 and footer y1368 after correcting inline enquiry form and recommended-product spacing. |
| Home | Both table width1002, full height3115 and footer3060. Latest cards are centered; first thumbnail x293.375/y595 at1440px, x74.375/y595 at768px and390px. Original plain names and thumbnail catid/subcatid/prod_id links match. The original trailing empty table row contributes1px and is retained. |

All eight compared page titles match source output. Home retains original description/keywords; other pages retain emitted empty metadata rather than using previously unused stored metadata. Product date example matches `10/3/2009 7:56:50 AM`; ISO wall-clock values are formatted day/month/year without timezone conversion.

Screenshots `public-*-desktop.png`, `public-*-tablet.png`, `public-*-mobile.png` cover home/about/catalogue/details/contact/cart at1440x1000,768x1024,390x844. Narrow pages retain1002px width and horizontal overflow. Screenshots were visually inspected for catalogue/contact/detail and mobile contact. Dynamic native-header animation phase is not stabilized by these captures; root owns matched-phase header validation.

## Explicit limitations

- `aboutus_old.asp` references absent `video/video.wmv`. The original media cannot be recovered from the source folder. A400x400 accessible unavailable-video placeholder replaces the obsolete ActiveX object; no playback parity is claimed.
- Captcha uses a session SVG rather than the original VBScript raster generator.
- Enquiry/contact success reports locally queued delivery; real external mail verification belongs to core/integration.
- The original recommendations are random. Recommended-product content can vary between captures; geometry is preserved.
- No public-page claim covers unsupported missing historical membership data or external deployment.

## Home follow-up regression

A dedicated source-extracted home-card template preserves `<td><div align="center"><table width="123">`, plain product names and original thumbnail query fields. Catalogue/detail card behavior was not changed. The regression test failed before implementation and passes afterward. Full-page screenshot pairs `home-original-{desktop,tablet,mobile}.png` and `home-modern-{desktop,tablet,mobile}.png` show both origins at matching viewport sizes. All three migrated captures have height3115/footer3060, exact original thumbnail positions, and no broken images. Earlier `public-index-*.png` captures precede this correction; use the `home-*` pairs for current home evidence.
