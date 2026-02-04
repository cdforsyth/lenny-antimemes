# Lenny Antimemes - Layer 2 Project Context

> Project-specific context for building antimeme extraction tool on Lenny's Podcast transcripts.

**Created**: 2026-01-18

---

## What This Is

A tool that applies the antimeme lens to Lenny Rachitsky's podcast transcripts (269 episodes). Surfaces counterintuitive insights that resist spreading - the stuff only 1-5% of listeners would notice.

**Differentiation**: Other Lenny tools summarize or make searchable. We filter for *surprising* insights.

---

## Source Data

**Repository**: https://github.com/ChatPRD/lennys-podcast-transcripts

- 269 episode transcripts
- YAML frontmatter (guest, title, youtube_url, publish_date, duration, etc.)
- Already indexed by 50+ topics
- MIT license for educational use

---

## Current State (2026-01-21)

**Status: SHIPPED** 🚀

**Live at:** https://lenny.antimeme.co

**Processing:** 299 episodes analyzed, 897 insights extracted (top 3 per episode)
- All transcripts from ChatPRD repo processed
- Duplicates cleaned up
- Repeat guests handled correctly (Elena Verna 4x, April Dunford 2x, etc.)

**Web App Features:**
- Static site with navy/cream palette (Lenny brand inspired)
- Hero explains what antimemes are
- Quote carousel with 9 featured quotes that shuffle
- Two-tier episode grid: Top 20 by YouTube views, then rest alphabetically
- Filters: 4 primary types (Cognitive, Social, Implementation, System) + guest dropdown
- Sub-type badges on cards
- Each insight shows: title, text, type badges, "why it resists spreading", source quote
- "Share on X" button on each insight with smart quote truncation
- OG meta tags for social sharing
- Footer links to Lenny's Podcast, GitHub transcripts repo, and @antimemetic_

**To preview locally:**
```bash
cd site && python3 -m http.server 8888
# Open http://localhost:8888
```

**Completed:**
- [x] All 299 episodes processed and converted to JSON
- [x] Hero copy explains antimemes to newcomers
- [x] Quote carousel with shuffle functionality
- [x] Type/sub-type filtering and badges
- [x] Episode grid (tiered by popularity) and detail views
- [x] Footer with proper attribution links
- [x] Deploy to Netlify
- [x] Custom domain lenny.antimeme.co
- [x] OG meta tags for social sharing
- [x] Tweet truncation (sentence/pause boundaries)
- [x] Launch tweet posted - Lenny commented!
- [x] PR submitted to ChatPRD repo: https://github.com/ChatPRD/lennys-podcast-transcripts/pull/36

**Future ideas (not urgent):**
- [ ] Guest thumbnails (would require scraping Substack)
- [ ] Any further UI polish based on feedback

---

## Next Phase: v2 Enhancement (2026-02-01)

### The Bigger Picture

This project (and the Every antimeme site) are **playgrounds for leveling up**. The goal isn't just to ship features — it's to build skills as a "full-stack AI-enhanced builder." These sites are evidence of capability.

### Two Tracks

**Track A: Frontend/Design**
- Make the sites look polished enough to proudly share (LinkedIn moment: tagging Lenny + Dan Shipper)
- Learn UI patterns, improve design sensibility
- Reference sites: TinyStakeholders.com, Vibe Code Academy

**Track B: Embeddings/Semantic Search**
- Add "search by meaning" — find antimemes about pricing even if they use different words
- Learn how embeddings, vectors, and similarity search actually work
- Transferable pattern for future projects

### Why Supabase + pgvector (not client-side)

We considered two paths:
- **Path A (chosen):** Supabase with pgvector — server-side embeddings and search
- **Path B (rejected):** Client-side vectors — pre-compute and ship with static site

Path A is more complex but teaches transferable skills:
- How embeddings work (API call, not magic)
- pgvector and vector similarity SQL
- Connecting frontend to real backend
- Pattern that scales to larger datasets

For 888 insights, client-side would work. But we're optimizing for learning, not just shipping.

### What v2 Involves

1. **Supabase setup**
   - Enable pgvector extension
   - Create `insights` table with existing fields + `embedding vector(1536)`
   - Import 888 insights from current JSON

2. **Embedding generation**
   - Script: read each insight → call OpenAI embedding API → store vector
   - One-time batch (~$0.01 for 888 insights)
   - Future: generate on insert

3. **Search endpoint**
   - Netlify function or Supabase Edge Function
   - Query → embed → pgvector similarity search → return top N

4. **Frontend**
   - Add search box to UI
   - Call endpoint on submit
   - Display results using existing insight card rendering

### Status

**Current:** Riffed on approach, captured context (this section). Ready for proper planning.

**Next:** Enter plan mode to map out implementation in detail.

---

## Tech Stack

- **Source**: GitHub repo transcripts (ChatPRD/lennys-podcast-transcripts)
- **Processing**: Claude Code CLI loop (covered by Claude Max) - generates markdown insight files
- **Storage**: Static JSON (no database - simpler for static site)
- **Frontend**: Vanilla HTML/CSS/JS
- **Hosting**: Netlify (lenny.antimeme.co)

---

## Antimeme Extraction Framework

**Stage 1: Popular vs. Rare**
- What 80-90% of listeners would notice (obvious takeaways)
- What 1-5% would catch (antimemetic insights)

**Stage 2: Antimemetic Properties**
- Cognitive: Understood but not internalized
- Social: Professionally inconvenient to discuss
- Implementation: Less effective when widely known
- System: Undermines foundations of fields

**Stage 3: Verification**
- Cite specific moments (timestamp, speaker, quote)
- Mark interpretive vs. explicit
- Flag uncertainty

---

## Database Schema

### episodes
- id (uuid)
- guest (text)
- title (text)
- youtube_url (text)
- publish_date (date)
- duration_seconds (int)
- transcript (text)
- processed (boolean)
- processed_at (timestamp)
- created_at (timestamp)

### insights
- id (uuid)
- episode_id (uuid, FK)
- insight_text (text)
- antimeme_type (text) -- cognitive/social/implementation/system
- reasoning (text)
- diagnostic_score (int, 1-10)
- transcript_quote (text)
- timestamp_ref (text)
- is_interpretive (boolean)
- created_at (timestamp)

---

## Build Plan

1. Set up Supabase tables
2. Build transcript importer (GitHub → Supabase)
3. Build extraction function (transcript → insights)
4. Build browse UI
5. Deploy to Netlify
6. Process initial batch (20-30 high-value episodes)
7. Let rest process over time

---

## Key Files

```
/Projects/Lenny-Antimemes/
├── CLAUDE.md              # This file (project context)
├── PRD.md                 # Product requirements
├── PLAN.md                # Build plan
│
├── /scripts/
│   ├── loop.sh            # Processing loop for transcript analysis
│   └── convert-insights.js # Markdown → JSON converter (run before deploy)
│
├── /prompts/
│   └── process-transcript.md  # Instructions for Claude extraction
│
├── /data/
│   ├── episodes.json      # All episode metadata from source repo
│   ├── progress.json      # Tracks what's been processed
│   └── /insights/         # Markdown files (one per episode)
│       ├── brian-chesky.md
│       ├── tobi-lutke.md
│       └── ... (299 total)
│
└── /site/                 # Static web app
    ├── index.html         # Main page with hero, quote carousel, filters
    ├── style.css          # Navy/cream styling, type badge colors
    ├── app.js             # Featured quotes, episode grid, detail view
    └── /data/
        └── insights.json  # Generated from markdown (299 episodes, 897 insights)
```

**Regenerate JSON after changes to insight markdown files:**
```bash
node scripts/convert-insights.js
```

---

## Antimeme Type Taxonomy

**4 Primary filters** (for UI):
| Filter | Includes |
|--------|----------|
| Cognitive | cognitive, epistemic, psychological |
| Social | social, organizational, identity, professional, status, role, career |
| Implementation | implementation, temporal, process, technical, practical, planning, decision |
| System | system, industry, market, business, structural, narrative |

**Top types by frequency:**
- Cognitive: 280, Social: 198, Implementation: 147, Epistemic: 92, System: 91, Psychological: 45

---

## ChatPRD PRD

Full PRD generated in ChatPRD on 2026-01-19:
- Document UUID: `c885f7c7-6c30-4f68-8d76-ceee02cd25c9`
- Chat: "Web App for Antimemetic Insights from Podcasts"

---

## Reference

**Other Lenny projects for design inspiration:**
- Lenny's Frameworks: lennys-frameworks.vercel.app (clean card grid)
- Refound Lenny Skills: refoundai.com/lenny-skills (polished, navy/cream)

**Antimeme prompts**: See `/Projects/Antimeme/EXTRACTION_PROMPTS.md`
