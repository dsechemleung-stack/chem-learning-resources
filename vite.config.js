import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';

const __dir = path.dirname(fileURLToPath(import.meta.url));
const JSON_PATH = path.resolve(__dir, 'src/generatedPages.json');
const LOCAL_CSV_PATH = path.resolve(__dir, 'pages.csv'); // optional local fallback
const PUBLIC_DIR = path.resolve(__dir, 'public');

// ── SETTINGS ──────────────────────────────────────────
const SHEET_ID = '1u_ZDPGNs-wsQh_GHbQttEiyrVk_EKGgLB1qf5EDV-dE'; // between /d/ and /edit in the sheet URL
const GID = '0';                              // the number after "#gid=" in the sheet URL

// Back button that is injected into EVERY page listed in the sheet.
// Change these once and all pages update.
const BACK_BUTTON = {
  position: 'bottom-left', // 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size: 40,                // button diameter in px
  gap: 14,                 // distance from the screen edge in px
  label: 'Back to index',  // tooltip + screen-reader text (not shown on screen)
};
// ──────────────────────────────────────────────────────

const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID}`;

// Columns: file, level, title, subtitle, topic, image, chapter,
//          icon, color, topic_label   (the last three are optional)
function parseCsv(text) {
  const clean = text.replace(/^\uFEFF/, ''); // strip Excel BOM
  const { data } = Papa.parse(clean, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
    transform: (v) => (typeof v === 'string' ? v.trim() : v),
  });

  return data
    .filter((p) => p.file && p.level)
    .map((p) => ({
      ...p,
      level: p.level.toUpperCase(),
      icon: p.icon || '',
      color: p.color || '',
      topic_label: p.topic_label || '',
      chapter: p.chapter || '',
    }));
}

function warnMissingImages(pages) {
  pages.forEach((p) => {
    if (p.image && !fs.existsSync(path.join(PUBLIC_DIR, p.image))) {
      console.warn(`⚠ Thumbnail "${p.image}" (${p.file}) not found in /public. A topic icon will be shown instead.`);
    }
  });
}

async function loadPages() {
  // Source 1: Google Sheets
  if (!SHEET_ID.includes('PASTE_YOUR')) {
    try {
      const res = await fetch(CSV_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      if (text.trim().startsWith('<')) {
        throw new Error('Received HTML instead of CSV (sheet not shared as "Anyone with the link"?)');
      }
      const pages = parseCsv(text);
      fs.writeFileSync(JSON_PATH, JSON.stringify(pages, null, 2));
      console.log(`✔ Loaded ${pages.length} pages from Google Sheets`);
      return pages;
    } catch (err) {
      console.warn('✖ Google Sheets fetch failed:', err.message);
    }
  } else {
    console.warn('⚠ SHEET_ID is not set yet.');
  }

  // Source 2: local pages.csv
  if (fs.existsSync(LOCAL_CSV_PATH)) {
    const pages = parseCsv(fs.readFileSync(LOCAL_CSV_PATH, 'utf-8'));
    fs.writeFileSync(JSON_PATH, JSON.stringify(pages, null, 2));
    console.log(`✔ Loaded ${pages.length} pages from local pages.csv`);
    return pages;
  }

  // Source 3: last saved JSON
  try {
    const pages = JSON.parse(fs.readFileSync(JSON_PATH, 'utf-8'));
    console.warn(`↺ Using last saved generatedPages.json (${pages.length} pages)`);
    return pages;
  } catch {
    fs.writeFileSync(JSON_PATH, '[]');
    console.warn('↺ No data found. Created empty generatedPages.json');
    return [];
  }
}

/* ───────────── Back button (injected into every listed page) ───────────── */

// "bottom-left" -> CSS that pins the button to that corner (respects phone safe areas)
const place = (pos) => {
  const [v, h] = pos.split('-');
  return (
    'top:auto;bottom:auto;left:auto;right:auto;' +
    `${v}:calc(${BACK_BUTTON.gap}px + env(safe-area-inset-${v},0px));` +
    `${h}:calc(${BACK_BUTTON.gap}px + env(safe-area-inset-${h},0px));`
  );
};

const BACK_CSS = `
.hub-back{
  position:fixed;${place(BACK_BUTTON.position)}
  z-index:2147483000;
  width:${BACK_BUTTON.size}px;height:${BACK_BUTTON.size}px;
  display:flex;align-items:center;justify-content:center;
  border-radius:50%;text-decoration:none;color:#fff;
  background:rgba(10,26,24,.82);
  border:1.5px solid rgba(197,215,181,.75);
  box-shadow:0 4px 14px rgba(0,0,0,.35);
  -webkit-backdrop-filter:blur(8px);backdrop-filter:blur(8px);
  opacity:.88;cursor:pointer;-webkit-tap-highlight-color:transparent;
  transition:opacity .15s ease,transform .15s ease,background .15s ease;
}
.hub-back:hover{opacity:1;transform:scale(1.08);background:rgba(118,168,165,.92)}
.hub-back:focus-visible{outline:3px solid #C5D7B5;outline-offset:2px;opacity:1}
.hub-back svg{width:${Math.round(BACK_BUTTON.size * 0.5)}px;height:${Math.round(BACK_BUTTON.size * 0.5)}px;display:block}

/* Optional per-page override: <body data-back-pos="top-right"> or "none" */
body[data-back-pos="top-left"] .hub-back{${place('top-left')}}
body[data-back-pos="top-right"] .hub-back{${place('top-right')}}
body[data-back-pos="bottom-left"] .hub-back{${place('bottom-left')}}
body[data-back-pos="bottom-right"] .hub-back{${place('bottom-right')}}
body[data-back-pos="none"] .hub-back{display:none}

/* Best effort: hide old hand-made "back to index" links so only one button shows */
a[href="index.html"]:not(.hub-back),
a[href="./index.html"]:not(.hub-back),
a[href="/index.html"]:not(.hub-back),
a[href="./"]:not(.hub-back),
a[href="/"]:not(.hub-back){display:none !important}

@media print{.hub-back{display:none !important}}
`;

const BACK_ICON =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
  'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
  '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/></svg>';

function backButtonPlugin(getPageFiles) {
  return {
    name: 'hub-back-button',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        const name = path.basename(ctx.filename || ctx.path || '').toLowerCase();
        if (!getPageFiles().has(name)) return; // only pages listed in the sheet (not index.html)
        return [
          { tag: 'style', attrs: { id: 'hub-back-style' }, children: BACK_CSS, injectTo: 'head' },
          {
            tag: 'a',
            attrs: {
              class: 'hub-back',
              href: './',
              'aria-label': BACK_BUTTON.label,
              title: BACK_BUTTON.label,
            },
            children: BACK_ICON,
            injectTo: 'body',
          },
        ];
      },
    },
  };
}

export default defineConfig(async () => {
  const pages = await loadPages();
  warnMissingImages(pages);

  const pageFiles = new Set(pages.map((p) => path.basename(p.file).toLowerCase()));

  const input = { main: path.resolve(__dir, 'index.html') };

  pages.forEach((p) => {
    const filePath = path.resolve(__dir, p.file);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠ "${p.file}" is listed in the sheet but not found in the project root. Skipped in build.`);
      return;
    }
    const key = p.file
      .replace(/\.html$/i, '')
      .replace(/[^a-zA-Z0-9]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));
    input[key] = filePath;
  });

  return {
    plugins: [react(), backButtonPlugin(() => pageFiles)],
    build: {
      rollupOptions: { input },
    },
  };
});