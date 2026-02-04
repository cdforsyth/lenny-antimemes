// Lenny Antimemes - App Logic

let data = null;
let currentFilter = 'all';
let currentGuest = 'all';

// Featured quotes for carousel
const featuredQuotes = [
  { quote: "The more in the details I am, the more time I have on my hands. That's a paradox.", guest: "Brian Chesky", type: "Organizational", context: "Contradicts the delegation gospel that leaders should stay high-level" },
  { quote: "If everybody agrees with the decision, then you didn't add any value because they would've done that without you.", guest: "Ben Horowitz", type: "Decision", context: "Makes consensus-seeking feel like failure rather than success" },
  { quote: "There is no such thing as a long feedback loop. You can make a decision about how long the feedback loop is.", guest: "Annie Duke", type: "Temporal", context: "Reframes patience as a choice, not a constraint" },
  { quote: "If you think the thing you've been doing your whole career is the way to fix your problem, it's at least 30% likely you've chosen that because of comfort, not truth.", guest: "Bret Taylor", type: "Psychological", context: "Your greatest strength becomes a blind spot" },
  { quote: "Most companies do product management theater—process without substance.", guest: "Marty Cagan", type: "Organizational", context: "Implicates the very processes people use to feel productive" },
  { quote: "Ruinous empathy is the most common mistake. Care without directness.", guest: "Kim Scott", type: "Social", context: "Reframes kindness as potentially harmful" },
  { quote: "90 out of 100 major company strategies lack merit.", guest: "Richard Rumelt", type: "System", context: "Most strategic planning is theater, not strategy" },
  { quote: "It's always too early until it's too late.", guest: "Eric Ries", type: "Temporal", context: "The 'right time' doesn't announce itself" },
  { quote: "80% of the most valuable things you can do with a product aren't quantifiable.", guest: "Tobi Lutke", type: "Epistemic", context: "Data-driven culture systematically ignores most value" }
];
let currentQuoteIndex = 0;

// Load data and initialize
async function init() {
  try {
    const response = await fetch('data/insights.json');
    data = await response.json();

    // Update stats (hidden but needed for JS)
    document.getElementById('episode-count').textContent = data.episodeCount;
    document.getElementById('insight-count').textContent = data.totalInsights;

    // Ensure featuredEpisodes exists
    if (!data.featuredEpisodes) data.featuredEpisodes = [];

    // Populate guest dropdown
    populateGuestSelect();

    // Render initial view
    renderEpisodeGrid();

    // Set up event listeners
    setupEventListeners();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

function populateGuestSelect() {
  const select = document.getElementById('guest-select');
  const allEpisodes = [...data.featuredEpisodes, ...data.episodes];
  const guests = allEpisodes.map(e => e.guest).sort();

  guests.forEach(guest => {
    const option = document.createElement('option');
    option.value = guest;
    option.textContent = guest;
    select.appendChild(option);
  });
}

function displayQuote() {
  const q = featuredQuotes[currentQuoteIndex];
  document.getElementById('featured-quote').textContent = q.quote;
  document.getElementById('featured-guest').textContent = '— ' + q.guest;
  document.getElementById('featured-type').textContent = q.type + ' Antimeme';
  document.getElementById('featured-type').className = 'quote-type type-badge ' + q.type.toLowerCase();
  document.getElementById('featured-context').textContent = q.context;
}

function shuffleQuote() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * featuredQuotes.length);
  } while (newIndex === currentQuoteIndex && featuredQuotes.length > 1);
  currentQuoteIndex = newIndex;
  displayQuote();
}

function setupEventListeners() {
  // Type filter buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderEpisodeGrid();
    });
  });

  // Guest dropdown
  document.getElementById('guest-select').addEventListener('change', (e) => {
    currentGuest = e.target.value;
    renderEpisodeGrid();
  });

  // Back button
  document.getElementById('back-to-grid').addEventListener('click', showGrid);
}

function getFilteredEpisodes(episodeList) {
  let episodes = episodeList;

  // Filter by guest
  if (currentGuest !== 'all') {
    episodes = episodes.filter(e => e.guest === currentGuest);
  }

  // Filter by type
  if (currentFilter !== 'all') {
    episodes = episodes.filter(e =>
      e.insights.some(insight =>
        insight.types.includes(currentFilter)
      )
    );
  }

  return episodes;
}

function getTypeBadgesForEpisode(episode) {
  const allTypes = new Set();
  episode.insights.forEach(insight => {
    insight.types.forEach(type => allTypes.add(type));
  });
  return Array.from(allTypes);
}

function getSubTypesForEpisode(episode) {
  const allSubTypes = new Set();
  episode.insights.forEach(insight => {
    insight.subTypes.forEach(type => allSubTypes.add(type));
  });
  return Array.from(allSubTypes);
}

function renderEpisodeCard(episode) {
  const subTypes = getSubTypesForEpisode(episode);
  const firstInsight = episode.insights[0];

  return `
    <article class="episode-card" data-guest="${episode.guest}">
      <h3>${episode.guest}</h3>
      <p class="insight-count">${episode.insightCount} antimemetic insights</p>
      <p class="insight-preview">${firstInsight.title}: ${firstInsight.insight.slice(0, 120)}...</p>
      <div class="type-badges">
        ${subTypes.slice(0, 3).map(type => `<span class="type-badge ${type}">${type}</span>`).join('')}
      </div>
    </article>
  `;
}

function renderEpisodeGrid() {
  const container = document.getElementById('episode-grid');
  const featured = getFilteredEpisodes(data.featuredEpisodes);
  const regular = getFilteredEpisodes(data.episodes);

  if (featured.length === 0 && regular.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 4rem 2rem; color: var(--text-muted);">
        No episodes match your filters. Try a different combination.
      </div>
    `;
    return;
  }

  let html = '';

  // Featured section (top 20 by views)
  if (featured.length > 0) {
    html += `
      <section class="episode-section">
        <h2 class="section-title">Most Popular Episodes</h2>
        <div class="episode-grid-inner">
          ${featured.map(renderEpisodeCard).join('')}
        </div>
      </section>
    `;
  }

  // Divider and rest
  if (regular.length > 0) {
    if (featured.length > 0) {
      html += `<div class="section-divider"></div>`;
    }
    html += `
      <section class="episode-section">
        <h2 class="section-title">All Episodes</h2>
        <div class="episode-grid-inner">
          ${regular.map(renderEpisodeCard).join('')}
        </div>
      </section>
    `;
  }

  container.innerHTML = html;

  // Add click handlers
  document.querySelectorAll('.episode-card').forEach(card => {
    card.addEventListener('click', () => {
      const guest = card.dataset.guest;
      showEpisode(guest);
    });
  });
}

function showEpisode(guest) {
  // Look in both featured and regular episodes
  const allEpisodes = [...data.featuredEpisodes, ...data.episodes];
  const episode = allEpisodes.find(e => e.guest === guest);
  if (!episode) return;

  // Update header
  document.getElementById('episode-guest').textContent = episode.guest;
  document.getElementById('episode-source').textContent = episode.source;

  // Render insight cards
  const container = document.getElementById('insight-cards');

  // Filter insights if type filter is active
  let insights = episode.insights;
  if (currentFilter !== 'all') {
    insights = insights.filter(i => i.types.includes(currentFilter));
  }

  container.innerHTML = insights.map((insight, index) => {
    // Build tweet text - use quote if available, otherwise insight title
    let tweetQuote = insight.quote || insight.title;
    if (tweetQuote.length > 140) {
      const truncated = tweetQuote.slice(0, 200);

      // Priority 1: Sentence boundaries (. ? !)
      const lastPeriod = truncated.lastIndexOf('. ');
      const lastQuestion = truncated.lastIndexOf('? ');
      const lastExclaim = truncated.lastIndexOf('! ');
      const sentenceEnd = Math.max(lastPeriod, lastQuestion, lastExclaim);

      if (sentenceEnd > 60) {
        tweetQuote = tweetQuote.slice(0, sentenceEnd + 1);
      } else {
        // Priority 2: Natural pause points (comma, semicolon, em dash, colon)
        const lastComma = truncated.lastIndexOf(', ');
        const lastSemi = truncated.lastIndexOf('; ');
        const lastEmDash = truncated.lastIndexOf('—');
        const lastColon = truncated.lastIndexOf(': ');
        const pauseEnd = Math.max(lastComma, lastSemi, lastEmDash, lastColon);

        if (pauseEnd > 80) {
          tweetQuote = tweetQuote.slice(0, pauseEnd) + '...';
        } else {
          // Priority 3: Word boundary
          tweetQuote = tweetQuote.slice(0, 140);
          const lastSpace = tweetQuote.lastIndexOf(' ');
          if (lastSpace > 80) {
            tweetQuote = tweetQuote.slice(0, lastSpace) + '...';
          } else {
            tweetQuote = tweetQuote + '...';
          }
        }
      }
    }
    const tweetText = `"${tweetQuote}" — ${episode.guest} on @lennysan's podcast | via @antimemetic_`;
    const tweetIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    return `
      <article class="insight-card">
        <div class="insight-header">
          <h4>${insight.title}</h4>
        </div>
        <p class="insight-text">${insight.insight}</p>
        <div class="type-badges">
          ${insight.subTypes.map(type => `<span class="type-badge ${type}">${type}</span>`).join('')}
        </div>
        ${insight.whyResists ? `
          <div class="why-resists">
            <p class="why-resists-label">Why this resists spreading</p>
            <p class="why-resists-text">${insight.whyResists}</p>
          </div>
        ` : ''}
        ${insight.quote ? `
          <blockquote class="quote">${insight.quote}</blockquote>
        ` : ''}
        <a href="${tweetIntent}" target="_blank" class="tweet-btn">Share on X</a>
      </article>
    `;
  }).join('');

  // Show episode view, hide grid
  document.getElementById('episode-grid').classList.add('hidden');
  document.getElementById('episode-view').classList.remove('hidden');

  // Scroll to the episode view
  document.getElementById('episode-view').scrollIntoView({ behavior: 'smooth' });
}

function showGrid() {
  document.getElementById('episode-view').classList.add('hidden');
  document.getElementById('episode-grid').classList.remove('hidden');
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  // Display quote immediately (doesn't depend on data)
  displayQuote();
  document.getElementById('shuffle-quote').addEventListener('click', shuffleQuote);

  // Then load data for episodes
  init();
});
