let settings = { theme: 'light', size: 'medium', font: 'sans', ceHighlight: true };

async function loadSettings() {
  const data = await chrome.storage.local.get({ ppSettings: settings });
  settings = { ...settings, ...data.ppSettings };
  applySettings();
}

function applySettings() {
  document.querySelectorAll('.pill[data-theme]').forEach(p => p.classList.toggle('active', p.dataset.theme === settings.theme));
  document.querySelectorAll('.pill[data-font]').forEach(p => p.classList.toggle('active', p.dataset.font === settings.font));
  document.querySelectorAll('.size-btn').forEach(b => b.classList.toggle('active', b.dataset.size === settings.size));
  document.getElementById('toggle-ce').classList.toggle('on', settings.ceHighlight);
}

async function saveSettings() {
  await chrome.storage.local.set({ ppSettings: settings });
}

document.querySelectorAll('.pill[data-theme]').forEach(pill => {
  pill.addEventListener('click', () => { settings.theme = pill.dataset.theme; applySettings(); saveSettings(); });
});

document.querySelectorAll('.pill[data-font]').forEach(pill => {
  pill.addEventListener('click', () => { settings.font = pill.dataset.font; applySettings(); saveSettings(); });
});

document.querySelectorAll('.size-btn').forEach(btn => {
  btn.addEventListener('click', () => { settings.size = btn.dataset.size; applySettings(); saveSettings(); });
});

document.getElementById('toggle-ce').addEventListener('click', () => {
  settings.ceHighlight = !settings.ceHighlight;
  applySettings(); saveSettings();
});

document.getElementById('btn-read').addEventListener('click', async () => {
  const statusEl = document.getElementById('status');
  statusEl.textContent = 'Opening reader…';
  statusEl.classList.add('visible');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['lib/Readability.js']
  });

  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => {
      const doc   = document.cloneNode(true);
      const art   = new Readability(doc).parse();
      return art ? { title: art.title, content: art.content, siteName: art.siteName, byline: art.byline, url: window.location.href } : null;
    }
  });

  const article = results[0]?.result;
  if (!article) {
    statusEl.textContent = 'Could not extract article content.';
    return;
  }

  await chrome.storage.local.set({ ppArticle: article, ppSettings: settings });

  const readerUrl = chrome.runtime.getURL('reader.html');
  await chrome.tabs.create({ url: readerUrl });
  window.close();
});

loadSettings();
