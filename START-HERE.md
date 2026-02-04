# Lenny Antimemes - Instructions for Claude Code

## Quick Context

Building a tool that extracts antimemetic insights from Lenny's Podcast transcripts. Goal: ship a web app, get listed on the ChatPRD repo's "Projects Built" section.

**Source data:** https://github.com/ChatPRD/lennys-podcast-transcripts (269 episodes)

---

## Read These First

1. `/Projects/Lenny-Antimemes/PLAN.md` - Full build plan
2. `/Projects/Lenny-Antimemes/CLAUDE.md` - Project context
3. `/Projects/Antimeme/EXTRACTION_PROMPTS.md` - Antimeme extraction framework

---

## The Approach: Ralph-Style Processing

We're using Claude Code CLI in a loop (covered by Claude Max) to process transcripts:

```
loop.sh runs N times → Claude reads transcript → Extracts antimemes → Saves JSON
```

Not using direct API calls - using Claude Code sessions instead.

---

## What Needs Built

### 1. Fetch Episode List
Get all 269 episode paths from GitHub API, save to `data/episodes.json`

### 2. Processing Prompt
Create `prompts/process-transcript.md` that tells Claude to:
- Find next unprocessed episode from episodes.json
- Fetch transcript from GitHub
- Extract antimemes using the framework in EXTRACTION_PROMPTS.md
- Save output to `data/insights/{guest-name}.json`
- Update progress tracking

### 3. Loop Script
Create `scripts/loop.sh` that runs Claude CLI in a loop

### 4. Static Site
Simple HTML/JS in `/site/` that:
- Loads all insight JSON files
- Filters by guest, topic, antimeme type
- Displays insights with episode links

---

## Project Location

`/Users/calum/Library/Mobile Documents/iCloud~md~obsidian/Documents/Claude Projects/Projects/Lenny-Antimemes/`

---

## First Task

Start with: **Fetch the episode list from GitHub**

Use GitHub MCP to get all episode directories from `ChatPRD/lennys-podcast-transcripts/episodes/`, then save as `data/episodes.json`.
