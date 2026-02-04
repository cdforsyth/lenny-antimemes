# Continue Processing Lenny's Podcast Transcripts

**Use this prompt to resume batch processing antimeme analysis files.**

---

## Quick Start Prompt

> Continue processing Lenny's Podcast transcripts into antimeme analysis files.
>
> **Source:** `https://raw.githubusercontent.com/ChatPRD/lennys-podcast-transcripts/main/`
> **Output:** `/Users/calum/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude Projects/Projects/Lenny-Antimemes/data/insights/`
>
> 1. First, check which files already exist in the output folder
> 2. Read `episodes.json` from the GitHub repo to get the full list
> 3. Process unprocessed episodes in batches of 5 (fetch transcript → create antimeme analysis markdown)
> 4. Use the standard 3-stage antimeme format (see existing files for reference)

---

## Key Details

### Source Repository
- **Repo:** ChatPRD/lennys-podcast-transcripts
- **Episodes list:** `https://raw.githubusercontent.com/ChatPRD/lennys-podcast-transcripts/main/episodes.json`
- **Transcript pattern:** `https://raw.githubusercontent.com/ChatPRD/lennys-podcast-transcripts/main/episodes/{guest-slug}/transcript.md`

### Output Location
```
/Users/calum/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude Projects/Projects/Lenny-Antimemes/data/insights/{guest-slug}.md
```

### Processing Pattern
1. **Glob** existing files to see what's done
2. **Read** episodes.json to get full list (303 episodes total)
3. **WebFetch** 5 transcripts in parallel
4. **Write** 5 antimeme analysis files
5. Repeat until done

### File Format
Each antimeme analysis file follows this structure:

```markdown
# Antimeme Analysis: [Guest Name] on Lenny's Podcast

**Source:** Lenny's Podcast - [Guest] Interview ([Role/Company])
**Analyzed:** [Date]

---

## Stage 1: Popular vs. Rare Concepts

### Popular Takeaways (80-90% of listeners would mention)
1-6 items

### Rare/Antimemetic Insights (1-5% would notice)
1-6 items

---

## Stage 2: Antimemetic Properties Analysis

4 detailed antimeme analyses, each with:
- INSIGHT (quote or description)
- CLASSIFICATION (Diagnostic or Paradigm)
- QUICK TEST (behavior change, missing vs ignoring, recognition vs vertigo)
- SCORES (Actionability, Recognition, Implication, Specificity 1-5)
- RESISTANCE TYPE
- DIAGNOSTIC VALUE (1-10)
- Antimemetic Properties
- Why it resists spreading
- What's lost by accepting it
- Verification (direct quote)

---

## Stage 3: Summary

- Most Actionable Antimemes (3 items)
- Most Paradigm-Shifting Antimemes (3 items)
- Pattern Across Antimemes (synthesis paragraph)
```

---

## Progress Tracking

As of 2026-01-20:
- ~95 episodes processed
- ~208 remaining
- Next step: Build static site UI once processing complete

To check current progress:
```
ls /Users/calum/Library/Mobile\ Documents/iCloud~md~obsidian/Documents/Claude\ Projects/Projects/Lenny-Antimemes/data/insights/ | wc -l
```

---

## Reference Files

- **Existing antimeme files:** Check any file in `/data/insights/` for format reference
- **Full episode list:** `episodes.json` in the GitHub repo
- **Project CLAUDE.md:** Contains project-specific context if needed
