# Process One Lenny's Podcast Transcript

You are analyzing Lenny's Podcast transcripts to extract antimemetic insights - important ideas that resist spreading despite their value.

## Your Task

1. Find the next unprocessed episode from `data/episodes.json`
2. Fetch its transcript from GitHub
3. Analyze it using the 3-stage framework below
4. Save the output as markdown
5. Update progress tracking

---

## Step 1: Find Next Unprocessed Episode

Read `data/episodes.json` and find the first episode where `processed: false`.

If all episodes are processed, output `<done>ALL_COMPLETE</done>` and stop.

---

## Step 2: Fetch Transcript

Use the GitHub MCP to fetch the transcript:
- Owner: `ChatPRD`
- Repo: `lennys-podcast-transcripts`
- Path: The `path` field from the episode (e.g., `episodes/brian-chesky/transcript.md`)

Parse the YAML frontmatter to extract: guest, title, youtube_url, publish_date, keywords.

---

## Step 3: Analyze Using the 3-Stage Framework

### Stage 1: Popular vs. Rare Concepts

**Popular Takeaways (80-90% of listeners would mention):**
List 6-8 key ideas or quotes that are memorable, headline-worthy, or directly stated as main points.

**Rare/Antimemetic Insights (1-5% would notice):**
List 6-8 subtle patterns, implicit assumptions, or deeper frameworks that operate beneath the surface. These are the insights that slip away.

### Stage 2: Antimemetic Properties Analysis

For each rare insight, provide:

```
### [Number]. [Insight Title]

**INSIGHT:** [One-sentence summary of the insight]

**CLASSIFICATION:** Diagnostic / Frontier / Hybrid

**QUICK TEST:**
- Behavior change possible? Y/N
- Missing vs. ignoring? Missing/Ignoring
- Recognition vs. vertigo? Recognition/Vertigo

**SCORES:**
- Actionability: [1-5]
- Recognition: [1-5]
- Implication: [1-5]
- Specificity: [1-5]

**RESISTANCE TYPE:** [Psychological / Social / Epistemic / Implementation]

**DIAGNOSTIC VALUE:** [1-10]

**Antimemetic Properties:**
- **Cognitive Antimeme:** [If applicable - understood but not internalized]
- **Social Antimeme:** [If applicable - professionally inconvenient]
- **Implementation Antimeme:** [If applicable - less effective when explicit]
- **System Antimeme:** [If applicable - undermines foundations]

**Why it resists spreading:**
- [Bullet points explaining the mental resistance]

**What's lost by accepting it:**
- [What you have to give up to truly internalize this]

**Verification:**
> "[Direct quote from transcript that supports this insight]"
```

### Stage 3: Summary

**Most Actionable Antimemes:**
1. [Title] - [One-line description of action]
2. [Title] - [One-line description of action]
3. [Title] - [One-line description of action]

**Most Paradigm-Shifting Antimemes:**
1. [Title] - [Why it shifts thinking]
2. [Title] - [Why it shifts thinking]
3. [Title] - [Why it shifts thinking]

**Pattern Across Antimemes:**
[2-3 sentences describing what structure or theme connects this speaker's antimemes]

---

## Classification Guide

**Diagnostic:** Currently actionable, high value if retained, resists spreading
**Frontier:** Cutting-edge, only experts know, not yet actionable for most
**Hybrid:** Has elements of both

**Quick Test Definitions:**
- **Missing vs Ignoring:** Do people not know this (missing) or know but not act on it (ignoring)?
- **Recognition vs Vertigo:** Does hearing it feel like "yes, I knew that" (recognition) or destabilizing (vertigo)?

---

## Step 4: Save Output

Save the analysis as markdown to `data/insights/{guest-name}.md`

Use the guest slug from the episode (e.g., `brian-chesky.md`).

Format the file header:
```markdown
# Antimeme Analysis: {Guest Name} on Lenny's Podcast

**Source:** Lenny's Podcast - {Episode Title}
**YouTube:** {youtube_url}
**Analyzed:** {today's date}

---
```

---

## Step 5: Update Progress

After saving the analysis:

1. Update `data/episodes.json`:
   - Set `processed: true` for this episode

2. Update `data/progress.json`:
   - Increment `processed_count`
   - Update `last_updated` timestamp

---

## Output

When you've successfully processed one transcript:
1. Confirm which episode was processed
2. List the 6-8 antimemetic insights you found (titles only)
3. Output `<done>COMPLETE</done>`

If there's an error, explain the issue and output `<done>COMPLETE</done>` so the loop continues.

---

## Quality Checklist

Before saving, verify:
- [ ] 6-8 popular takeaways identified
- [ ] 6-8 rare/antimemetic insights identified
- [ ] Each rare insight has full Stage 2 analysis
- [ ] Each has a direct quote for verification
- [ ] Summary includes actionable, paradigm-shifting, and pattern
- [ ] File saved to correct location
- [ ] Progress tracking updated
