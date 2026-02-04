#!/usr/bin/env node

/**
 * Convert markdown insight files to JSON for the web app.
 * Extracts top 3 insights per episode sorted by diagnostic score.
 */

const fs = require('fs');
const path = require('path');

const INSIGHTS_DIR = path.join(__dirname, '..', 'data', 'insights');
const OUTPUT_FILE = path.join(__dirname, '..', 'site', 'data', 'insights.json');
const VIEW_COUNTS_FILE = path.join(__dirname, '..', 'data', 'view-counts.json');

function parseInsightFile(content, filename) {
  const guest = filename.replace('.md', '').split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  // Extract source info
  const sourceMatch = content.match(/\*\*Source:\*\* (.+)/);
  const source = sourceMatch ? sourceMatch[1] : `Lenny's Podcast - ${guest}`;

  // Find Stage 2 section (where detailed insights live)
  const stage2Start = content.indexOf('## Stage 2:');
  if (stage2Start === -1) return null;

  const stage2Content = content.slice(stage2Start);

  // Split by insight headers (### 1., ### 2., etc.)
  const insightBlocks = stage2Content.split(/\n### \d+\.\s+/).slice(1);

  const insights = [];

  for (const block of insightBlocks) {
    const lines = block.split('\n');

    // Get title from first line
    const title = lines[0].trim();
    if (!title) continue;

    // Extract INSIGHT text
    const insightMatch = block.match(/\*\*INSIGHT:\*\*\s*([^\n]+(?:\n(?!\*\*)[^\n]+)*)/);
    const insightText = insightMatch ? insightMatch[1].trim() : '';

    // Extract DIAGNOSTIC VALUE
    const diagnosticMatch = block.match(/\*\*DIAGNOSTIC VALUE:\*\*\s*(\d+)/);
    const diagnosticScore = diagnosticMatch ? parseInt(diagnosticMatch[1]) : 0;

    // Extract RESISTANCE TYPE for antimeme classification
    const resistanceMatch = block.match(/\*\*RESISTANCE TYPE:\*\*\s*([^\n]+)/);
    const resistanceType = resistanceMatch ? resistanceMatch[1].trim() : '';

    // Extract antimeme types from the Antimemetic Properties section
    const antimemeTypes = [];
    const cognitiveMatch = block.match(/\*\*Cognitive Antimeme:\*\*/i);
    const socialMatch = block.match(/\*\*Social Antimeme:\*\*/i);
    const implementationMatch = block.match(/\*\*Implementation Antimeme:\*\*/i);
    const systemMatch = block.match(/\*\*System Antimeme:\*\*/i);
    const psychologicalMatch = block.match(/\*\*Psychological Antimeme:\*\*/i);
    const epistemicMatch = block.match(/\*\*Epistemic Antimeme:\*\*/i);
    const organizationalMatch = block.match(/\*\*Organizational Antimeme:\*\*/i);

    // Extract ALL antimeme types from the block
    const antimemeTypeRegex = /\*\*([A-Za-z]+) Antimeme:\*\*/g;
    let typeMatch;
    while ((typeMatch = antimemeTypeRegex.exec(block)) !== null) {
      antimemeTypes.push(typeMatch[1].toLowerCase());
    }

    // Map sub-types to 4 core categories
    const typeMapping = {
      // Cognitive category
      cognitive: 'cognitive',
      epistemic: 'cognitive',
      psychological: 'cognitive',

      // Social category
      social: 'social',
      organizational: 'social',
      identity: 'social',
      professional: 'social',
      status: 'social',
      role: 'social',
      career: 'social',

      // Implementation category
      implementation: 'implementation',
      temporal: 'implementation',
      process: 'implementation',
      technical: 'implementation',
      practical: 'implementation',
      planning: 'implementation',
      decision: 'implementation',

      // System category
      system: 'system',
      industry: 'system',
      market: 'system',
      business: 'system',
      structural: 'system',
      narrative: 'system'
    };

    const subTypes = [...new Set(antimemeTypes)]; // unique sub-types
    const coreTypes = [...new Set(
      antimemeTypes.map(t => typeMapping[t] || 'cognitive')
    )]; // unique core types

    // Extract "Why it resists spreading" section
    const resistsMatch = block.match(/\*\*Why it resists spreading:\*\*\s*([\s\S]*?)(?=\n\*\*What's lost|$)/);
    let whyResists = '';
    if (resistsMatch) {
      whyResists = resistsMatch[1]
        .split('\n')
        .filter(line => line.trim().startsWith('-'))
        .map(line => line.replace(/^-\s*/, '').trim())
        .join(' ');
    }

    // Extract verification quote
    const quoteMatch = block.match(/\*\*Verification:\*\*\s*>\s*"?([^"]+)"?/s);
    let quote = '';
    if (quoteMatch) {
      quote = quoteMatch[1].trim().replace(/\n/g, ' ').replace(/\s+/g, ' ');
    }

    if (insightText && diagnosticScore > 0) {
      insights.push({
        title,
        insight: insightText,
        diagnosticScore,
        types: coreTypes.length > 0 ? coreTypes : ['cognitive'], // primary filter categories
        subTypes: subTypes.length > 0 ? subTypes : ['cognitive'], // detailed sub-types
        whyResists,
        quote
      });
    }
  }

  // Sort by diagnostic score and take top 3
  insights.sort((a, b) => b.diagnosticScore - a.diagnosticScore);
  const top3 = insights.slice(0, 3);

  return {
    guest,
    source,
    insightCount: top3.length,
    insights: top3
  };
}

function main() {
  // Ensure output directory exists
  const outputDir = path.dirname(OUTPUT_FILE);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load view counts if available
  let viewCountsMap = {};
  if (fs.existsSync(VIEW_COUNTS_FILE)) {
    const viewCounts = JSON.parse(fs.readFileSync(VIEW_COUNTS_FILE, 'utf-8'));
    viewCounts.forEach(vc => {
      viewCountsMap[vc.guest] = vc.views;
    });
    console.log(`Loaded view counts for ${viewCounts.length} episodes`);
  }

  // Read all insight files
  const files = fs.readdirSync(INSIGHTS_DIR).filter(f => f.endsWith('.md'));

  const episodes = [];
  let totalInsights = 0;

  for (const file of files) {
    const content = fs.readFileSync(path.join(INSIGHTS_DIR, file), 'utf-8');
    const parsed = parseInsightFile(content, file);

    if (parsed && parsed.insights.length > 0) {
      // Add view count
      const guestSlug = file.replace('.md', '');
      parsed.views = viewCountsMap[guestSlug] || 0;
      episodes.push(parsed);
      totalInsights += parsed.insights.length;
    }
  }

  // Sort by views to determine top 20
  const sortedByViews = [...episodes].sort((a, b) => b.views - a.views);
  const top20Guests = new Set(sortedByViews.slice(0, 20).map(e => e.guest));

  // Mark featured episodes
  episodes.forEach(ep => {
    ep.featured = top20Guests.has(ep.guest);
  });

  // Sort: featured by views desc, then rest alphabetically
  const featured = episodes.filter(e => e.featured).sort((a, b) => b.views - a.views);
  const rest = episodes.filter(e => !e.featured).sort((a, b) => a.guest.localeCompare(b.guest));

  const output = {
    generated: new Date().toISOString(),
    episodeCount: episodes.length,
    totalInsights,
    featuredEpisodes: featured,
    episodes: rest
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  console.log(`Converted ${episodes.length} episodes with ${totalInsights} insights`);
  console.log(`Featured: ${featured.length}, Regular: ${rest.length}`);
  console.log(`Output: ${OUTPUT_FILE}`);
}

main();
