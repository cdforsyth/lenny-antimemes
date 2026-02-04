// Lenny Antimemes - v3 Redesign

let data = null;
let currentFilter = 'all';
let currentGuest = 'all';
let currentQuote = 0;
let autoplayInterval = null;

// Featured quotes for carousel (curated from high-scoring insights)
const featuredQuotes = [
  { quote: "The more in the details I am, the more time I have on my hands. That's a paradox.", guest: "Brian Chesky", type: "Cognitive" },
  { quote: "If everybody agrees with the decision, then you didn't add any value because they would've done that without you.", guest: "Ben Horowitz", type: "Social" },
  { quote: "There is no such thing as a long feedback loop. You can make a decision about how long the feedback loop is.", guest: "Annie Duke", type: "Implementation" },
  { quote: "If you think the thing you've been doing your whole career is the way to fix your problem, it's at least 30% likely you've chosen that because of comfort, not truth.", guest: "Bret Taylor", type: "Cognitive" },
  { quote: "Most companies do product management theater—process without substance.", guest: "Marty Cagan", type: "System" },
  { quote: "Ruinous empathy is the most common mistake. Care without directness.", guest: "Kim Scott", type: "Social" },
  { quote: "90 out of 100 major company strategies lack merit.", guest: "Richard Rumelt", type: "System" },
  { quote: "It's always too early until it's too late.", guest: "Eric Ries", type: "Implementation" },
  { quote: "80% of the most valuable things you can do with a product aren't quantifiable.", guest: "Tobi Lutke", type: "Cognitive" }
];

// Initialize
async function init() {
  try {
    const response = await fetch('data/insights.json');
    data = await response.json();

    // Ensure episodes array exists
    if (!data.featuredEpisodes) data.featuredEpisodes = [];
    if (!data.episodes) data.episodes = [];

    // Initialize components
    initQuoteCarousel();
    populateGuestSelect();
    renderEpisodeGrid();
    setupEventListeners();

  } catch (error) {
    console.error('Failed to load data:', error);
  }
}

// Quote Carousel
function initQuoteCarousel() {
  const container = document.getElementById('quote-container');
  const dotsContainer = document.getElementById('quote-dots');

  // Create slides
  container.innerHTML = featuredQuotes.map((q, i) => `
    <div class="quote-slide${i === 0 ? ' active' : ''}" data-index="${i}">
      <blockquote>${q.quote}</blockquote>
      <div class="quote-attribution">
        <cite class="quote-author">${q.guest}</cite>
        <span class="quote-type">${q.type}</span>
      </div>
    </div>
  `).join('');

  // Create dots
  dotsContainer.innerHTML = featuredQuotes.map((_, i) => `
    <button class="quote-dot${i === 0 ? ' active' : ''}" data-index="${i}"></button>
  `).join('');

  // Start autoplay
  startAutoplay();
}

function showQuote(index) {
  currentQuote = index;
  document.querySelectorAll('.quote-slide').forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });
  document.querySelectorAll('.quote-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
}

function nextQuote() {
  showQuote((currentQuote + 1) % featuredQuotes.length);
}

function prevQuote() {
  showQuote((currentQuote - 1 + featuredQuotes.length) % featuredQuotes.length);
}

function startAutoplay() {
  autoplayInterval = setInterval(nextQuote, 6000);
}

function resetAutoplay() {
  clearInterval(autoplayInterval);
  startAutoplay();
}

// Guest Select
function populateGuestSelect() {
  const select = document.getElementById('guest-select');
  const allEpisodes = [...data.featuredEpisodes, ...(data.episodes || [])];
  const guests = [...new Set(allEpisodes.map(e => e.guest))].sort();

  guests.forEach(guest => {
    const option = document.createElement('option');
    option.value = guest;
    option.textContent = guest;
    select.appendChild(option);
  });
}

// Episode Grid
function renderEpisodeGrid() {
  const grid = document.getElementById('episode-grid');
  const allEpisodes = [...data.featuredEpisodes, ...(data.episodes || [])];

  // Filter episodes
  let filtered = allEpisodes;

  if (currentFilter !== 'all') {
    filtered = filtered.filter(ep => {
      return ep.insights && ep.insights.some(insight => {
        const types = insight.types || [];
        return types.some(t => mapTypeToFilter(t) === currentFilter);
      });
    });
  }

  if (currentGuest !== 'all') {
    filtered = filtered.filter(ep => ep.guest === currentGuest);
  }

  // Sort: featured/high views first, then alphabetically
  filtered.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    if ((a.views || 0) > 100000 && (b.views || 0) <= 100000) return -1;
    if ((a.views || 0) <= 100000 && (b.views || 0) > 100000) return 1;
    return a.guest.localeCompare(b.guest);
  });

  // Render cards
  grid.innerHTML = filtered.map(ep => {
    const types = getEpisodeTypes(ep);
    const firstInsight = ep.insights?.[0];
    const description = firstInsight?.title || ep.source || '';

    return `
      <article class="card" data-guest="${ep.guest}">
        <div class="card-meta">
          <span>${ep.insightCount || ep.insights?.length || 0} insights</span>
        </div>
        <h3 class="card-title">${ep.guest}</h3>
        <p class="card-description">${description}</p>
        <div class="card-badges">
          ${types.slice(0, 2).map(t => `<span class="badge badge-${t}">${t}</span>`).join('')}
        </div>
      </article>
    `;
  }).join('');

  // Add click listeners to cards
  grid.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', () => {
      const guest = card.dataset.guest;
      showEpisodeDetail(guest);
    });
  });
}

function getEpisodeTypes(episode) {
  const types = new Set();
  if (episode.insights) {
    episode.insights.forEach(insight => {
      (insight.types || []).forEach(t => {
        types.add(mapTypeToFilter(t));
      });
    });
  }
  return Array.from(types);
}

function mapTypeToFilter(type) {
  const typeMap = {
    'cognitive': 'cognitive',
    'epistemic': 'cognitive',
    'psychological': 'cognitive',
    'social': 'social',
    'organizational': 'social',
    'identity': 'social',
    'professional': 'social',
    'status': 'social',
    'role': 'social',
    'career': 'social',
    'implementation': 'implementation',
    'temporal': 'implementation',
    'process': 'implementation',
    'technical': 'implementation',
    'practical': 'implementation',
    'planning': 'implementation',
    'decision': 'implementation',
    'system': 'system',
    'industry': 'system',
    'market': 'system',
    'business': 'system',
    'structural': 'system',
    'narrative': 'system'
  };
  return typeMap[type?.toLowerCase()] || 'cognitive';
}

// Episode Detail View
function showEpisodeDetail(guest) {
  const allEpisodes = [...data.featuredEpisodes, ...(data.episodes || [])];
  const episode = allEpisodes.find(ep => ep.guest === guest);

  if (!episode) return;

  // Hide grid sections, show detail
  document.querySelector('.hero').classList.add('hidden');
  document.querySelector('.quote-section').classList.add('hidden');
  document.querySelector('.filter-bar').classList.add('hidden');
  document.querySelector('.episodes-section').classList.add('hidden');
  document.getElementById('episode-detail').classList.remove('hidden');

  // Render header
  document.getElementById('episode-header').innerHTML = `
    <h2>${episode.guest}</h2>
    <p>${episode.source || ''}</p>
  `;

  // Render insights
  document.getElementById('insight-list').innerHTML = episode.insights.map(insight => `
    <article class="insight-card">
      <h3>${insight.title}</h3>
      <p class="insight-text">${insight.insight}</p>
      ${insight.quote ? `<p class="insight-quote">"${insight.quote}"</p>` : ''}
      ${insight.whyResists ? `<p class="insight-why"><strong>Why it resists spreading:</strong> ${insight.whyResists}</p>` : ''}
      <div class="insight-badges">
        ${(insight.types || []).map(t => `<span class="badge badge-${mapTypeToFilter(t)}">${t}</span>`).join('')}
      </div>
    </article>
  `).join('');

  // Scroll to top
  window.scrollTo(0, 0);
}

function showGrid() {
  document.querySelector('.hero').classList.remove('hidden');
  document.querySelector('.quote-section').classList.remove('hidden');
  document.querySelector('.filter-bar').classList.remove('hidden');
  document.querySelector('.episodes-section').classList.remove('hidden');
  document.getElementById('episode-detail').classList.add('hidden');
}

// Event Listeners
function setupEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });

  // Quote carousel nav
  document.getElementById('quote-prev').addEventListener('click', () => {
    prevQuote();
    resetAutoplay();
  });
  document.getElementById('quote-next').addEventListener('click', () => {
    nextQuote();
    resetAutoplay();
  });

  // Quote dots
  document.getElementById('quote-dots').addEventListener('click', (e) => {
    if (e.target.classList.contains('quote-dot')) {
      showQuote(parseInt(e.target.dataset.index));
      resetAutoplay();
    }
  });

  // Pause autoplay on hover
  document.querySelector('.quote-section').addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  document.querySelector('.quote-section').addEventListener('mouseleave', () => {
    startAutoplay();
  });

  // Filter pills
  document.querySelectorAll('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderEpisodeGrid();
    });
  });

  // Guest dropdown
  document.getElementById('guest-select').addEventListener('change', (e) => {
    currentGuest = e.target.value;
    renderEpisodeGrid();
  });

  // Back button
  document.getElementById('back-btn').addEventListener('click', showGrid);
}

// Start the app
document.addEventListener('DOMContentLoaded', init);
