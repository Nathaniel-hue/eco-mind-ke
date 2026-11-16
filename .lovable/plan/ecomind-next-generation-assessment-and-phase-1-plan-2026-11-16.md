# EcoMind Next Generation — Assessment and Phase 1 Plan

## What EcoMind already has (reused, not rebuilt)
- AI answer service with sustainability scores, verdicts, alternatives and sources
- Offline knowledge base, history, dashboard, settings, accent themes
- Accounts (email + Google) with private per-user cloud storage
- Live Eco News, Daily Quests, Sprout forest, ten offline games

## Feasibility of the 12 modules

| Module | Fit | Complexity | External data / services | Depends on |
|---|---|---|---|---|
| EcoFactCheck | High | Medium | Built-in AI; optional free scholarly search (OpenAlex, Crossref) | Shared evidence service |
| EcoEvidence | High | Medium | OpenAlex, Crossref, Retraction Watch data (free) | Shared evidence service |
| EcoTrade-offs | High | Low–Medium | Built-in AI + existing scoring | Existing scores |
| EcoSim | Medium | Medium–High | Public datasets (Our World in Data, IPCC factors) | Trade-offs, calculation library |
| EcoTrace | Medium | High | Lifecycle factors (open LCA summaries; full databases are paid) | EcoSim calculations |
| EcoKnowledge | Medium | High | Wikidata (free) | Evidence + saved investigations |
| EcoWatch | Low–Medium | High | NASA / Copernicus imagery (free, heavy, slow) | Maps, Intelligence Centre |
| EcoBenchmark | Medium | Medium | User-entered data | Organisation accounts |
| EcoAudit | Medium | High | File uploads, reports | Organisations, private document storage |
| EcoProjects | High | Medium | None | Organisations, roles |
| EcoRisk | Medium | High | Climate hazard datasets (World Bank, NASA) | EcoWatch data |
| EcoCompliance | Low–Medium | High | Kenyan law sources (NEMA, Kenya Law); needs human-reviewed content | Audit, documents |

No paid services are needed for Phase 1. Full lifecycle databases and some satellite services cost money; I will flag costs before using any.

## Recommended sequence
1. **Phase 1 (now):** shared evidence service + EcoFactCheck, EcoEvidence, EcoTrade-offs, and a first Intelligence Centre that saves investigations.
2. **Phase 2:** EcoSim and EcoTrace (transparent calculations).
3. **Phase 3:** organisation accounts with roles, then EcoProjects, EcoBenchmark, EcoAudit.
4. **Phase 4:** EcoKnowledge, EcoWatch, EcoRisk, EcoCompliance (Kenya focus).

## Phase 1 — what you will see
- A new **Intelligence** section in the menu, with three tools:
  - **EcoFactCheck:** paste a claim or article text; get a rating (Supported / Mixed / Unsupported / Not enough evidence), the reasoning, and the real studies found.
  - **EcoEvidence:** paste a study title, DOI or link; see publication details, citation count, whether it was retracted, plus an AI review of methods, limitations and possible conflicts of interest.
  - **EcoTrade-offs:** describe a decision and 2–4 options; get a side-by-side of environmental, economic and social effects with sliders to change what matters most to you.
- Every result clearly labels what is **found in real records** versus **AI reasoning** (never shown as verified science).
- Signed-in users can **save investigations** to their account and reopen them in the Intelligence Centre.
- Existing pages, branding and features stay unchanged.

## Technical details
- Shared server function module for evidence lookup: OpenAlex + Crossref (free, no key), results tagged with source type `record` vs `ai`.
- AI calls reuse the existing gateway provider with structured outputs.
- New table `investigations` (id, user_id, kind, title, input, result jsonb, created_at) with owner-only RLS and grants; organisation tables deferred to Phase 3.
- Uploaded documents deferred to Phase 3 (private storage); Phase 1 accepts pasted text.
- Trade-off weighting is calculated in the browser from AI scores, with the formula shown.
- Routes: /intelligence, /intelligence/factcheck, /intelligence/evidence, /intelligence/tradeoffs; added to sitemap; tests for rating/weighting rules.
