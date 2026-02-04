// Fetch view counts from ChatPRD/lennys-podcast-transcripts repo
// Extracts view_count from YAML frontmatter of each transcript

const fs = require('fs');
const path = require('path');

const REPO_RAW_URL = 'https://raw.githubusercontent.com/ChatPRD/lennys-podcast-transcripts/main/episodes';

async function fetchTranscriptMetadata(guest) {
  const url = `${REPO_RAW_URL}/${guest}/transcript.md`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${guest}: ${response.status}`);
      return null;
    }
    const text = await response.text();

    // Extract YAML frontmatter
    const match = text.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      console.error(`No frontmatter found for ${guest}`);
      return null;
    }

    const frontmatter = match[1];

    // Extract view_count
    const viewMatch = frontmatter.match(/view_count:\s*(\d+)/);
    const views = viewMatch ? parseInt(viewMatch[1], 10) : 0;

    // Extract title
    const titleMatch = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/);
    const title = titleMatch ? titleMatch[1].trim() : guest;

    // Extract publish_date
    const dateMatch = frontmatter.match(/publish_date:\s*["']?([^"'\n]+)["']?/);
    const publishDate = dateMatch ? dateMatch[1].trim() : null;

    return { guest, title, views, publishDate };
  } catch (error) {
    console.error(`Error fetching ${guest}:`, error.message);
    return null;
  }
}

async function main() {
  // Read episode list from our local data
  const insightsDir = path.join(__dirname, '..', 'data', 'insights');
  const files = fs.readdirSync(insightsDir).filter(f => f.endsWith('.md'));
  const guests = files.map(f => f.replace('.md', ''));

  console.log(`Fetching view counts for ${guests.length} episodes...`);

  const results = [];
  const batchSize = 10; // Fetch 10 at a time to be nice to GitHub

  for (let i = 0; i < guests.length; i += batchSize) {
    const batch = guests.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fetchTranscriptMetadata));
    results.push(...batchResults.filter(r => r !== null));

    console.log(`Progress: ${Math.min(i + batchSize, guests.length)}/${guests.length}`);

    // Small delay between batches
    if (i + batchSize < guests.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  // Sort by views descending
  results.sort((a, b) => b.views - a.views);

  // Save results
  const outputPath = path.join(__dirname, '..', 'data', 'view-counts.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

  console.log(`\nSaved ${results.length} episodes to ${outputPath}`);
  console.log(`\nTop 20 by views:`);
  results.slice(0, 20).forEach((ep, i) => {
    console.log(`${i + 1}. ${ep.guest}: ${ep.views.toLocaleString()} views`);
  });
}

main();
