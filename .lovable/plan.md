# EcoMind: fresh news, quests, growth, and offline play

## What will change
- Replace handpicked Eco News with a current feed fetched from reputable public environmental news sources, with dates, source links, category filters, refresh, and clear fallback/error states.
- Replace the small quest pool with 14 curated daily sets of five quests, repeating on a two-week cycle; retain daily completion and streak tracking.
- Extend Sprout's visual journey from seedling through tree, grove, and forest as completed-quest blooms accumulate.
- Add a self-contained, internet-free sustainability sorting mini-game with scoring and replay.
- Add public crawler rules and a sitemap for discoverable pages, keeping account and personal pages out.

## Implementation notes
- Use an app-owned read-only server endpoint to retrieve and normalize RSS/Atom stories; the browser never trusts arbitrary feed URLs.
- Keep quest data and game rules local so both work without internet. Preserve existing local progress and the current visual design tokens.
- Use the known public site URL for crawler files; use existing page metadata and exclude sign-in, dashboard, and settings pages.

## Verification
- Run existing focused tests if present, inspect preview/build diagnostics, and verify news, daily rotation, game scoring/replay, and crawler URLs in the running app.
