// Generated automatically by vite.config.js from your Google Sheet / pages.csv
import generatedPages from './generatedPages.json';

export const PAGES_CONFIG = generatedPages;

// Built-in defaults for existing topics.
// The sheet columns (icon / color / topic_label) override these.
const BUILT_IN = {
  MW1: { label: 'Microscopic World I', icon: 'atom', color: '#76A8A5' },
  'Ecology-BIO': { label: 'Ecology', icon: 'leaf', color: '#8FD694' },
  Calculation: { label: 'Calculations', icon: 'calculator', color: '#E8C872' },
  Metals: { label: 'Metals', icon: 'metal', color: '#B7C3D6' },
  'Acids&Bases': { label: 'Acids & Bases', icon: 'flask', color: '#F29B8C' },
  Rate: { label: 'Rate of Reaction', icon: 'gauge', color: '#8DB8F2' },
};

// New topics without a colour get one from here (stable per topic name)
const PALETTE = [
  '#76A8A5', '#8FD694', '#E8C872', '#B7C3D6', '#F29B8C',
  '#8DB8F2', '#C9A3E8', '#F2B684', '#7ED6D0', '#E89BB5',
];

const hash = (s) => {
  let h = 0;
  for (const ch of String(s)) h = (h * 31 + ch.codePointAt(0)) >>> 0;
  return h;
};

const prettify = (t) =>
  String(t || 'Other')
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s*&\s*/g, ' & ')
    .replace(/\s+/g, ' ')
    .trim();

// Build one meta record per topic:
// first non-empty sheet value wins -> built-in default -> automatic fallback
export const TOPIC_META = (() => {
  const meta = {};

  PAGES_CONFIG.forEach((p) => {
    const t = p.topic;
    if (!t) return;
    if (!meta[t]) meta[t] = { label: '', icon: '', color: '' };
    const m = meta[t];
    if (!m.label && p.topic_label) m.label = p.topic_label;
    if (!m.icon && p.icon) m.icon = p.icon;
    if (!m.color && p.color) m.color = p.color;
  });

  Object.keys(meta).forEach((t) => {
    const b = BUILT_IN[t] || {};
    const m = meta[t];
    m.label = m.label || b.label || prettify(t);
    m.icon = m.icon || b.icon || '';
    m.color = m.color || b.color || PALETTE[hash(t) % PALETTE.length];
  });

  return meta;
})();

export function getTopicMeta(topic) {
  return (
    TOPIC_META[topic] || {
      label: prettify(topic),
      icon: '',
      color: PALETTE[hash(topic) % PALETTE.length],
    }
  );
}

// Kept for backward compatibility
export const TOPIC_LABELS = Object.fromEntries(
  Object.entries(TOPIC_META).map(([k, v]) => [k, v.label])
);