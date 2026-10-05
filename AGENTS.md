# Agent rules
- Project files live in the private `project-assets` bucket at `owner/project/asset_id`; only the `studio-assets` edge function may mark files ready, delete files or delete projects — keeps storage and database consistent and stops the browser from validating its own uploads.
- File type is decided server-side from the first bytes of the stored object, never from extension or declared MIME — prevents disguised files.
- Briefs reference files only through `brief_asset_refs`; a deleted file that a validated brief references is kept as a `removed` record with no stored file — preserves brief history without keeping copies.
- Brief file references store label/category/name snapshots, frozen at validation; new brief versions are created by the `create_brief_version` database function, which inserts the draft and copies references to ready files in one transaction (never stored files) — keeps validated history faithful.
