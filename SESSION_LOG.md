# Lenny Antimemes - Session Log

## Session: 2026-01-19

### What We Achieved

**Processed 70 episodes total** (from ~48 at session start to 70 by end)

Created antimeme analysis files for 22 new episodes this session:

1. bob-moesta - Jobs-to-be-Done (context vs pain, churned customers reveal competition)
2. brandon-chu - Shopify (external writing → internal influence, 40+ hours per post)
3. brendan-foody - Mercor (evals are PRDs, AI needs experts to define success)
4. brian-balfour - Reforge (ChatGPT as platform, "it always feels too late", exit misaligned people)
5. brian-tolkin - Opendoor (ops teaches business, trust intuition at low volume)
6. boz - Meta CTO (doing-yourself ≠ competence, identity threat causes worst behavior)
7. cam-adams - Canva (one year before launch, coaching replaces management)
8. camille-fournier - PM-Engineering (creative exclusion → over-engineering)
9. carole-robin - Stanford (anger is secondary emotion, vulnerability increases influence)
10. camille-hearst - Creator economy (cap community growth, slower preserves quality)
11. casey-winters - Eventbrite (hire executors over innovators, surface constraints)
12. chip-conley - Modern Elder (Despair = Suffering - Meaning)
13. christina-wodtke - OKRs (reveal problems don't fix them, business model before product sense)
14. claire-hughes-johnson - Stripe COO (lightweight processes early, if unclear who decides it's you)
15. camille-ricketts - Notion (cap growth deliberately, member businesses $35k/month)
16. carilu-dietrich - Atlassian (PLG fails with bundles, consistency beats volume)
17. chip-huyen - AI Engineering (why keep up with AI news?, top performers gain most)
18. dalton-caldwell - YC (growth hacking premature pre-product, conviction from execution)
19. dan-hockenmaier - Marketplaces (unbundling over-hyped, gardener not builder)
20. ami-vora - Already existed from previous session
21. bob-baxley - Already existed from previous session
22. Plus several others from earlier in session

### Current State

- **70 insight files exist** in `/data/insights/`
- **~233 episodes remaining** to process
- **303 total episodes** in the source repository

### Files Location

- Insight files: `/Users/calum/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude Projects/Projects/Lenny-Antimemes/data/insights/`
- Episode list: `/tmp/all_sorted.txt` (303 episodes)
- Done tracking: `/tmp/actual_done.txt` (regenerate from insights folder)

---

## Picking Up Next Time

### Quick Start Command

To see what's remaining:
```bash
# Regenerate done list from actual files
ls "/Users/calum/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude Projects/Projects/Lenny-Antimemes/data/insights/" | sed 's/\.md$//' | sort > /tmp/actual_done.txt

# Find remaining episodes (excluding variants like -20, -30, _)
comm -23 <(sed 's/^[[:space:]]*[0-9]*→//' /tmp/all_sorted.txt | sed 's/^[[:space:]]*//' | grep -v '^$' | sort) /tmp/actual_done.txt | grep -v '_$' | grep -v '\-20$' | grep -v '\-30$' | grep -v '\-40$' | head -20
```

### Process for Each Episode

1. Fetch transcript from GitHub: `https://raw.githubusercontent.com/ChatPRD/lennys-podcast-transcripts/main/episodes/{guest-name}/transcript.md`
2. Analyze for antimemes using the established format (see any existing file like `bob-baxley.md` for template)
3. Write to `/data/insights/{guest-name}.md`

### Priority Episodes to Consider

Some high-profile guests that may still be unprocessed:
- gibson-biddle (Netflix PM)
- gokul-rajaram (Square, Coinbase)
- guillermo-rauch (Vercel)
- hamilton-helmer (7 Powers)
- julie-zhuo (ex-Facebook VP Design)
- ken-norton (ex-Google PM)
- marty-cagan (SVPG)
- shreyas-doshi (ex-Stripe, Twitter)
- teresa-torres (Continuous Discovery)

### What's Left After Processing

- Build static site UI (pending task)
- Consider Supabase integration for searchability
- Deploy to Netlify

---

## Notes

- Some episode names have variants (e.g., `april-dunford` and `april-dunford-20`) - skip the numbered variants as they're likely repeat appearances
- Some names differ slightly between all_sorted.txt and actual files (e.g., `aishwarya-naresh-reganti-kiriti-badam` vs `aishwarya-kiriti`) - check actual insight files before processing
- The antimeme format is well-established - Stage 1 (Popular vs Rare), Stage 2 (Deep analysis with scores), Stage 3 (Summary with patterns)
