<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Quest growth uses lifetime completed days, with pure normalization/merge rules and per-account local backups; sign-out keeps the visible device copy to prevent resets without mixing plant data between accounts.
- Public news comes from fixed RSS sources through a server function with a two-hour query cache; external-feed failures return labeled background reading rather than invented headlines.
- EcoSort rules live in a browser-safe data module; production offline caching covers only public game/quest pages and bundled assets, never auth or account requests.
- Sitemap inventory derives from required route staticData decisions so future public pages cannot silently be omitted.

- Classic-inspired action games share a dynamically imported Phaser engine; keep browser-only engine imports out of SSR and puzzle rules in a browser-safe module so all arcade games remain offline-capable.
- Intelligence Centre modules share one evidence service (OpenAlex/Crossref, server-only) and label every output as published record vs AI reasoning; claims get no rating beyond 'Not enough evidence' without records.
