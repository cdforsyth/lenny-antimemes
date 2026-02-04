# Lenny Antimemes - Product Requirements

## Overview

**Product**: Antimeme extraction tool for Lenny's Podcast
**Goal**: Surface counterintuitive insights from 269 podcast transcripts that resist spreading despite their value

## Problem

Lenny's Podcast has 269 episodes of conversations with world-class product leaders. Most listeners catch the obvious takeaways. But embedded in these conversations are "antimemetic insights" - important ideas that only 1-5% of listeners notice or retain.

Existing tools (summaries, chat interfaces, skills databases) make content more accessible. None filter for *surprising* insights that challenge conventional thinking.

## Solution

A tool that:
1. Processes all 269 transcripts through antimeme extraction
2. Identifies insights that resist spreading (counterintuitive, uncomfortable, context-dependent)
3. Presents them in a browsable interface
4. Lets users discover insights by guest, topic, or antimeme type

## User Stories

1. **As a product person**, I want to find the non-obvious insights from Lenny's interviews so I can learn things my peers missed
2. **As a founder**, I want counterintuitive advice that challenges conventional startup wisdom
3. **As a curious person**, I want to explore surprising ideas organized by type (cognitive, social, implementation, system)

## Features

### MVP (Build Today)

- [ ] Import all 269 transcripts to database
- [ ] Extract antimemes from transcripts (batch process)
- [ ] Simple browse page showing insights
- [ ] Filter by guest name
- [ ] Filter by antimeme type
- [ ] Link back to original episode

### Future

- [ ] Search across all insights
- [ ] Topic-based filtering
- [ ] "Surprise me" random insight
- [ ] Newsletter signup
- [ ] Twitter bot posting daily insights

## Technical Approach

**Source**: ChatPRD/lennys-podcast-transcripts GitHub repo
**Processing**: Claude API (Haiku for speed/cost)
**Storage**: Supabase
**Frontend**: Static HTML/JS
**Hosting**: Netlify

## Success Metrics

- Tool deployed and functional
- All 269 episodes processed
- Listed on the ChatPRD repo's "Projects Built" section
- Generates interest/shares on Twitter

## Timeline

**Day 1 (Today)**:
- Database setup
- Transcript importer
- Extraction function
- Basic UI
- Deploy

**Week 1**:
- Process all episodes
- Polish UI
- Share publicly
