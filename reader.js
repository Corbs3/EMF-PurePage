// CE terms (subset of CEChecker list)
const CE_TERMS = [
  'circular economy','circular design','circular model','circular business model',
  'regenerative','restorative','take-make-waste','linear economy','waste prevention',
  'waste reduction','waste hierarchy','extended producer responsibility','eco-design',
  'design for disassembly','design for longevity','planned obsolescence','biomimicry',
  'biosphere','biological cycle','technical cycle','cradle to cradle','cradle-to-cradle',
  'upcycling','downcycling','recycling','recyclability','material recovery','closed loop',
  'closed-loop','resource efficiency','resource recovery','product as a service',
  'servitisation','sharing economy','collaborative consumption','remanufacturing',
  'refurbishment','repair','reuse','second life','take-back scheme','reverse logistics',
  'materials passport','digital product passport','urban mining','industrial symbiosis',
  'carbon footprint','carbon neutral','net zero','scope 1','scope 2','scope 3',
  'life cycle assessment','lifecycle assessment','lca','sustainable materials',
  'bio-based','biodegradable','compostable',
];

function highlightCETerms(html) {
  let result = html;
  const sorted = [...CE_TERMS].sort((a,b) => b.length - a.length);
  sorted.forEach(term => {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-z])(${escaped})(?![a-z])`, 'gi');
    result = result.replace(regex, `<mark class="ce-term">$1</mark>`);
  });
  return result;
}

async function init() {
  const data = await chrome.storage.local.get({ ppArticle: null, ppSettings: { theme:'light', size:'medium', ceHighlight:true } });
  const { ppArticle: article, ppSettings: settings } = data;

  if (!article) {
    document.getElementById('article-title').textContent = 'Could not load article.';
    document.getElementById('article-body').textContent = 'Please close this tab and try again from a page with article content.';
    return;
  }

  // Apply settings
  document.body.className = `theme-${settings.theme} size-${settings.size} font-${settings.font || 'sans'}${settings.ceHighlight ? ' ce-on' : ''}`;

  // Fill content
  const domain = new URL(article.url).hostname.replace(/^www\./,'');
  document.getElementById('article-meta').textContent   = domain;
  document.getElementById('article-title').textContent  = article.title || 'Untitled';
  document.getElementById('toolbar-url').textContent    = domain;
  document.title = article.title || 'PurePage';

  if (article.byline) document.getElementById('article-byline').textContent = article.byline;

  const body = settings.ceHighlight ? highlightCETerms(article.content) : article.content;
  document.getElementById('article-body').innerHTML = body;

  // Set active states in toolbar
  document.querySelectorAll('.theme-pill').forEach(p => p.classList.toggle('active', p.dataset.theme === settings.theme));
  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === settings.size));
  document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.dataset.font === (settings.font || 'sans')));
  document.getElementById('btn-ce').classList.toggle('active', settings.ceHighlight);

  // Font buttons
  document.querySelectorAll('.font-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.font = btn.dataset.font;
      document.body.className = `theme-${settings.theme} size-${settings.size} font-${settings.font}${settings.ceHighlight ? ' ce-on' : ''}`;
      document.querySelectorAll('.font-btn').forEach(b => b.classList.toggle('active', b.dataset.font === settings.font));
      chrome.storage.local.set({ ppSettings: settings });
    });
  });

  // Theme pills
  document.querySelectorAll('.theme-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      settings.theme = pill.dataset.theme;
      document.body.className = `theme-${settings.theme} size-${settings.size} font-${settings.font || 'sans'}${settings.ceHighlight ? ' ce-on' : ''}`;
      document.querySelectorAll('.theme-pill').forEach(p => p.classList.toggle('active', p.dataset.theme === settings.theme));
      chrome.storage.local.set({ ppSettings: settings });
    });
  });

  // Size buttons
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      settings.size = btn.dataset.size;
      document.body.className = `theme-${settings.theme} size-${settings.size} font-${settings.font || 'sans'}${settings.ceHighlight ? ' ce-on' : ''}`;
      document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === settings.size));
      chrome.storage.local.set({ ppSettings: settings });
    });
  });

  // CE toggle
  document.getElementById('btn-ce').addEventListener('click', () => {
    settings.ceHighlight = !settings.ceHighlight;
    document.getElementById('btn-ce').classList.toggle('active', settings.ceHighlight);
    document.body.className = `theme-${settings.theme} size-${settings.size} font-${settings.font || 'sans'}${settings.ceHighlight ? ' ce-on' : ''}`;
    if (settings.ceHighlight) {
      document.getElementById('article-body').innerHTML = highlightCETerms(article.content);
    } else {
      document.getElementById('article-body').innerHTML = article.content;
    }
    chrome.storage.local.set({ ppSettings: settings });
  });

  // Exit
  document.getElementById('btn-close').addEventListener('click', () => window.close());
}

init();
