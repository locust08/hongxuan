# Migration route coverage

All 198 original ASP source candidates are accounted for below. Original URL suffixes are served by Astro/TypeScript; no ASP source is deployed.

An unauthenticated 303 is a protected-route redirect, not a functional sign-off on every operation. Domain tests and authenticated route audits provide the additional evidence listed in the validation reports. Invalid or absent record IDs can correctly produce 400/404 on otherwise supported routes.

| Original route | Implementation | Unauthenticated HTTP |
|---|---|---:|
| `/211212contactus.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/aboutus.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/aboutus_old.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/add_cart_action.asp` | Typed core endpoint | 405 |
| `/aspcaptcha.asp` | Typed core endpoint | 200 |
| `/cartsum.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/cart_summary.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/contactus.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/details.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/index.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/mouseout.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/new-arrival.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/others.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/our-brands.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/our-brands1.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/our-category.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/our-products.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/right.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/right2.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/terms.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/top_category.asp` | Public Astro layout / typed page or fragment renderer | 200 |
| `/app/NieLq77.asp` | Excluded arbitrary-code execution endpoint (404) | 404 |
| `/app/ZmaPiga.asp` | Excluded arbitrary-code execution endpoint (404) | 404 |
| `/app/admin/index.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/login.asp` | Admin service / source-compatible helper or action | 200 |
| `/app/admin/login_action.asp` | Admin service / source-compatible helper or action | 405 |
| `/app/admin/logout.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/field/assign_field.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/field/assign_field_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/all_groups.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/assign_profile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/assign_profile_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/create_group.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/create_group_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/group_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/modify_group.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/group/modify_group_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/all_modules.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/create_module.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/create_module_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/delete_module.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/delete_module_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/modify_module.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/modify_module_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/module_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/module/view_order.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/all_submodules.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/create_submodule.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/create_submodule_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/delete_submodule_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/modify_submodule.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/modify_submodule_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/submodule_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/submodule/view_order.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/all_log.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/all_users.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/create_user.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/create_user_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/modify_user.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/modify_user_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/purge_log.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/resetPwd_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/reset_pwd.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/user_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/admin/user/view_log.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/index.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/login.asp` | Admin service / source-compatible helper or action | 200 |
| `/app/module/login_action.asp` | Admin service / source-compatible helper or action | 405 |
| `/app/module/logout.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/all_catalog.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/catalog_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/change_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/Copy of modify_catalog_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/create_catalog.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/create_catalog_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/create_catalog_action1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/create_catalog_action2.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/create_catalog_action3.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/create_catalog_action4.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/create_catalog_action5.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/delete_catalog.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/delete_catalog_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/display.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/modify_catalog.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/modify_catalog_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/modify_catalog_action1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/modify_catalog_action2.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/modify_catalog_action3.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/modify_catalog_action4.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/modify_catalog_action5.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/upload_arc.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/upload_arc1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/upload_arc2.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/upload_arc3.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/upload_arc4.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/view_catalog.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/view_logo.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/view_picture.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/view_picture1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/view_picture2.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc/config.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc/upload.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc/uploadfile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc/uploadform.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc1/config.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc1/upload.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc1/uploadfile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc1/uploadform.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc2/config.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc2/upload.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc2/uploadfile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc2/uploadform.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc3/config.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc3/upload.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc3/uploadfile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc3/uploadform.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc4/config.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc4/upload.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc4/uploadfile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/catalog/uploadc4/uploadform.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/all_brand.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/all_cat.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/all_status.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/all_subcat.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/brand_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/brand_form_old.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/cat_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_brand.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_brand_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_brand_action1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_brand_action1_old.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_brand_action_old.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_cat.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_cat_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_status.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_status_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_status_action1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_subcat.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/create_subcat_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/delete_brand_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/delete_cat_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/delete_status_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/delete_subcat_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/heading_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_brand.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_brand_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_brand_action1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_cat.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_cat_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_heading.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_heading_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_status.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_status_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_status_action1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_subcat.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/modify_subcat_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/status_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/subcat_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload_ar1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload_ar2.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/view_picture.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/view_picture1.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload1/config.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload1/upload.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload1/uploadfile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload1/uploadform.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload2/config.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload2/upload.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload2/uploadfile.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/maintenance/upload2/uploadform.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/all_online_clients.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/client_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/delete_online_client.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/delete_online_client_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/modify_client.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/modify_client_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/resetPwd_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/reset_pwd.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/verify_online_client.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/verify_online_client_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/members/view_online_client.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/all_orders.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/list_all_labels.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/order_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/printable_format.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/print_enquiry.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/update_order.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/update_order_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/module/webstore/view_order.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/personal/changePwd_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/personal/change_pwd.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/personal/modify_data.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/personal/modify_data_action.asp` | Admin service / source-compatible helper or action | 303 |
| `/app/personal/personal_user_form.asp` | Admin service / source-compatible helper or action | 303 |
| `/test/asp/test_mail.asp` | Excluded legacy hosting diagnostic (404) | 404 |
| `/test/asp/test_msaccess.asp` | Excluded legacy hosting diagnostic (404) | 404 |
| `/test/asp/test_mssql.asp` | Excluded legacy hosting diagnostic (404) | 404 |
| `/test/asp/test_mysql.asp` | Excluded legacy hosting diagnostic (404) | 404 |

## Static archive and fragments

All 12 HTML archive pages and their assets are retained under `/backup/`. The archive intro is native Canvas. Root HTML footer/category/rollover/map fragments remain available; `/flash.html` now renders the native header. Static source/configuration files, databases, FrontPage metadata and hosting diagnostics are excluded from public assets.

Unmapped ASP source candidates: **0**.
