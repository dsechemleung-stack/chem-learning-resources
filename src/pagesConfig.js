// Generated automatically by vite.config.js from your Google Sheet / pages.csv
import generatedPages from './generatedPages.json';

/* ───────────────────────── Topic list ─────────────────────────
   number : shown in dropdown ("1. Planet Earth"); null = no number (general)
   order  : sort position (calculation sits between 3 and 4 but has no number)
   aliases: any spelling you might type in the sheet's "topic" column
            (matching ignores capitals, spaces and symbols)
------------------------------------------------------------------ */
const TOPIC_DEFS = [
  { key: 'earth',       number: 1,    order: 1,    label: 'Planet Earth',         icon: 'globe',      color: '#6FCF97', aliases: ['earth', 'planet earth'] },
  { key: 'MW1',         number: 2,    order: 2,    label: 'Microscopic World I',  icon: 'atom',       color: '#76A8A5', aliases: ['mw1', 'microscopic world 1', 'microscopic world i'] },
  { key: 'Metals',      number: 3,    order: 3,    label: 'Metals',               icon: 'metal',      color: '#B7C3D6', aliases: ['metal'] },
  { key: 'Calculation', number: null, order: 3.5,  label: 'Calculations',         icon: 'calculator', color: '#E8C872', aliases: ['calculation', 'calculations', 'calc', 'general'] },
  { key: 'Acids&Bases', number: 4,    order: 4,    label: 'Acids & Bases',        icon: 'flask',      color: '#F29B8C', aliases: ['acids and bases', 'acid and base', 'acids bases', 'acid base'] },
  { key: 'organic1',    number: 5,    order: 5,    label: 'Organic I',            icon: 'organic',    color: '#C9A3E8', aliases: ['organic 1', 'organic i', 'organic'] },
  { key: 'MW2',         number: 6,    order: 6,    label: 'Microscopic World II', icon: 'molecule',   color: '#7ED6D0', aliases: ['mw2', 'microscopic world 2', 'microscopic world ii'] },
  { key: 'redox',       number: 7,    order: 7,    label: 'Redox',                icon: 'redox',      color: '#F2B684', aliases: ['redox reactions'] },
  { key: 'enthalpy',    number: 8,    order: 8,    label: 'Enthalpy',             icon: 'flame',      color: '#FF9F7A', aliases: ['enthalpy changes', 'energetics'] },
  { key: 'Rate',        number: 9,    order: 9,    label: 'Rate',                 icon: 'gauge',      color: '#8DB8F2', aliases: ['rate of reaction', 'reaction rate'] },
  { key: 'equilibrium', number: 10,   order: 10,   label: 'Equilibrium',          icon: 'equilibrium',color: '#9FA8F2', aliases: ['chemical equilibrium'] },
  { key: 'organic2',    number: 11,   order: 11,   label: 'Organic II',           icon: 'organic',    color: '#E89BB5', aliases: ['organic 2', 'organic ii'] },
  { key: 'pattern',     number: 12,   order: 12,   label: 'Pattern',              icon: 'pattern',    color: '#D6E08A', aliases: ['periodic table', 'patterns'] },
  { key: 'industrial',  number: 13,   order: 13,   label: 'Industrial Chemistry', icon: 'industry',   color: '#D2B48C', aliases: ['industrial', 'industrial chem'] },
  { key: 'analytical',  number: 15,   order: 15,   label: 'Analytical Chemistry', icon: 'analytical', color: '#6FC7E8', aliases: ['analytical', 'analytical chem'] },
  { key: 'Ecology-BIO', number: null, order: 90,   label: 'Ecology',              icon: 'leaf',       color: '#8FD694', aliases: ['ecology'] },
];

const PALETTE = [
  '#76A8A5', '#8FD694', '#E8C872', '#B7C3D6', '#F29B8C',
  '#8DB8F2', '#C9A3E8', '#F2B684', '#7ED6D0', '#E89BB5',
];

const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '');

const hash = (s) => {
  let h = 0;
  for (const ch of String(s)) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return h;
};

// "acids&bases" / "planet_earth" -> "Acids & Bases" / "Planet Earth"
const prettify = (t) =>
  String(t || 'Other')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s*&\s*/g, ' & ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/(^|\s)([a-z])/g, (_, s, c) => s + c.toUpperCase());

/* ───────────────────────── Registry ───────────────────────── */
const REGISTRY = new Map();
const BY_ALIAS = new Map();

TOPIC_DEFS.forEach((d) => {
  REGISTRY.set(d.key, { ...d });
  [d.key, d.label, ...d.aliases].forEach((a) => BY_ALIAS.set(norm(a), d.key));
});

// Raw sheet text -> canonical topic key (unknown topics are added automatically)
function resolveTopic(raw) {
  const n = norm(raw);
  if (BY_ALIAS.has(n)) return BY_ALIAS.get(n);
  const key = `x-${n || 'other'}`;
  if (!REGISTRY.has(key)) {
    REGISTRY.set(key, {
      key,
      number: null,
      order: 100 + REGISTRY.size,
      label: prettify(raw),
      icon: '',
      color: PALETTE[hash(n) % PALETTE.length],
    });
    BY_ALIAS.set(n, key);
  }
  return key;
}

// "Planet Earth, Microscopic World I"  ->  ['Planet Earth', 'Microscopic World I']
const splitTopics = (value) =>
  String(value || '')
    .split(/[,;，、|\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

/* ───────────────────────── Pages ───────────────────────── */
const overridden = {}; // sheet columns icon / color / topic_label win over defaults

export const PAGES_CONFIG = generatedPages.map((p) => {
  const keys = Array.from(new Set(splitTopics(p.topic).map(resolveTopic)));
  const topics = keys.length ? keys : [resolveTopic('Other')];

  // Sheet overrides apply to single-topic apps only (unambiguous)
  if (topics.length === 1) {
    const m = REGISTRY.get(topics[0]);
    const o = (overridden[topics[0]] = overridden[topics[0]] || {});
    if (p.topic_label && !o.label) { m.label = p.topic_label; o.label = true; }
    if (p.icon && !o.icon) { m.icon = p.icon; o.icon = true; }
    if (p.color && !o.color) { m.color = p.color; o.color = true; }
  }

  return { ...p, topic: topics[0], topics };
});

/* ───────────────────────── Public API ───────────────────────── */
export function getTopicMeta(topic) {
  return REGISTRY.get(topic) || REGISTRY.get(resolveTopic(topic));
}

// Every known topic, sorted by topic number / order
export const TOPICS_SORTED = Array.from(REGISTRY.values()).sort((a, b) => a.order - b.order);

export const TOPIC_META = Object.fromEntries(Array.from(REGISTRY.entries()));

// Kept for backward compatibility
export const TOPIC_LABELS = Object.fromEntries(
  Array.from(REGISTRY.entries()).map(([k, v]) => [k, v.label])
);