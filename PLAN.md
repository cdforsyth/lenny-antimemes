# Lenny Antimemes - Build Plan

## Goal

Ship a web app that surfaces antimemetic insights from Lenny's Podcast transcripts. Get listed on the ChatPRD repo's "Projects Built" section.

---

## Approach: Ralph-Style Processing

Use Claude Code CLI in a loop (covered by Claude Max) rather than direct API calls.

```
[Loop Script]                    [Claude Code]                    [Output]
loop.sh runs N times  →  Claude reads transcript  →  Saves insight JSON
                              ↓
                     Marks progress in tracker
```

---

## Architecture

```
/Projects/Lenny-Antimemes/
├── CLAUDE.md                    # Project context (done)
├── PLAN.md                      # This file
├── PRD.md                       # Requirements (done)
│
├── /scripts/
│   ├── fetch-transcripts.js    # One-time: get episode list from GitHub
│   └── loop.sh                  # Main processing loop
│
├── /prompts/
│   └── process-transcript.md    # Instructions for Claude
│
├── /data/
│   ├── episodes.json            # List of all 269 episodes
│   ├── progress.json            # Track what's processed
│   └── /insights/               # Output: one JSON per episode
│       ├── brian-chesky.json
│       ├── julie-zhuo.json
│       └── ...
│
└── /site/                       # Static web app
    ├── index.html
    ├── style.css
    └── app.js
```

---

## Phase 1: Setup

### 1.1 Fetch Episode List

Get all 269 episode paths from GitHub repo.

**Input:** GitHub API call to `ChatPRD/lennys-podcast-transcripts/episodes/`
**Output:** `data/episodes.json`

```json
[
  {
    "guest": "brian-chesky",
    "path": "episodes/brian-chesky/transcript.md",
    "processed": false
  },
  ...
]
```

### 1.2 Create Processing Prompt

`prompts/process-transcript.md` tells Claude how to:

1. Read `data/episodes.json` to find next unprocessed episode
2. Fetch transcript from GitHub
3. Apply antimeme extraction framework
4. Save output to `data/insights/{guest}.json`
5. Update `data/progress.json`
6. Output `<done>COMPLETE</done>` when one is done, `<done>ALL_COMPLETE</done>` when none left

### 1.3 Create Loop Script

```bash
#!/bin/bash
set -e

ITERATIONS=${1:-1}

echo "Starting Lenny Antimemes processing ($ITERATIONS iterations)"

for ((i=1; i<=$ITERATIONS; i++)); do
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "Iteration $i of $ITERATIONS"
  echo "$(date)"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  result=$(claude -p "@prompts/process-transcript.md")

  echo "$result"

  if [[ "$result" == *"<done>ALL_COMPLETE</done>"* ]]; then
    echo "✅ All transcripts processed!"
    exit 0
  fi
done

echo "⏰ Reached iteration limit ($ITERATIONS)"
```

---

## Phase 2: Processing

### 2.1 Test Run (2-3 episodes)

Before running all 269:
- Run `./loop.sh 3`
- Check output quality
- Verify JSON structure
- Confirm progress tracking works

### 2.2 Full Run

```bash
# Run in background, process all 269
nohup ./loop.sh 300 > processing.log 2>&1 &

# Monitor progress
tail -f processing.log
cat data/progress.json | jq '. | length'  # Count processed
```

**Estimated time:**
- ~2-3 minutes per transcript (reading, extraction, saving)
- ~269 transcripts = 9-13 hours total
- Can run overnight

---

## Phase 3: Static Site

### 3.1 Data Structure

Each insight file (`data/insights/{guest}.json`):

```json
{
  "guest": "Brian Chesky",
  "title": "Full episode title",
  "youtube_url": "https://youtube.com/...",
  "publish_date": "2024-01-15",
  "topics": ["leadership", "product-market-fit"],
  "insights": [
    {
      "text": "The counterintuitive insight in tweetable form",
      "type": "cognitive",
      "reasoning": "Why this resists spreading",
      "diagnostic_score": 8,
      "quote": "Direct quote from transcript",
      "is_interpretive": false
    }
  ]
}
```

### 3.2 UI Features

**Filters:**
- By guest (dropdown)
- By topic (dropdown, use existing topic index)
- By antimeme type (cognitive/social/implementation/system)

**Display:**
- Card per insight
- Shows: insight text, type badge, guest name, episode link
- Click to expand: full reasoning, source quote

### 3.3 Build

Simple vanilla HTML/CSS/JS:
- Load all JSON files at startup (they're small)
- Client-side filtering
- No build step needed

---

## Phase 4: Ship

### 4.1 Deploy

Option A: **Netlify** (familiar)
- Drag and drop `/site/` folder
- Or connect to GitHub repo

Option B: **GitHub Pages** (even simpler)
- Push to repo
- Enable Pages in settings

### 4.2 Get Listed

Submit PR to `ChatPRD/lennys-podcast-transcripts`:

```markdown
**[Lenny Antimemes](https://your-url.netlify.app)** by [@your-handle](https://x.com/your-handle) -
Surfaces counterintuitive insights from Lenny's Podcast that resist spreading.
Filter by guest, topic, or antimeme type (cognitive, social, implementation, system).
```

### 4.3 Share

- Tweet about it
- Tag Lenny, ChatPRD
- Post in relevant communities

---

## Antimeme Extraction Prompt (Core Logic)

Based on your existing framework:

```markdown
## Task

Process one Lenny's Podcast transcript to extract antimemetic insights.

## Antimeme Framework

**Stage 1: Popular vs. Rare**
- What would 80-90% of listeners notice? (Skip these)
- What would only 1-5% catch? (Extract these)

**Stage 2: Antimemetic Properties**

For each rare insight, classify:

- **Cognitive**: Understood but not internalized
- **Social**: Professionally inconvenient to discuss
- **Implementation**: Less effective when widely known
- **System**: Undermines foundations of entire fields

**Stage 3: Verification**
- Cite specific quote from transcript
- Mark if interpretive vs. explicit
- Score diagnostic value (1-10)

## Output Format

Extract 4-6 insights per episode. Save as JSON.
```

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Loop crashes mid-way | Progress tracked in JSON, can resume |
| Poor extraction quality | Test on 3 episodes first |
| Takes too long | Can run overnight, check morning |
| Claude Code session limits | Break into smaller batches if needed |

---

## Success Criteria

- [ ] All 269 episodes processed
- [ ] Static site deployed and working
- [ ] Filters work (guest, topic, type)
- [ ] Listed on ChatPRD repo
- [ ] Shared on Twitter

---

## Next Steps

1. **Now:** Fetch episode list from GitHub
2. **Now:** Write the processing prompt
3. **Now:** Create loop script
4. **Test:** Run on 2-3 episodes
5. **Run:** Let it process overnight
6. **Tomorrow:** Build UI, deploy, ship
