// ── PAGES CONFIGURATION ──
// Add new pages here. The system will automatically create buttons and handle routing.
//
// Fields:
// - file: HTML filename (must match the file in project root)
// - level: 'F3' | 'F4' | 'F5' | 'F6'
// - title: Button title (shown on the widget)
// - subtitle: Brief description shown below title
// - topic: Topic category for filtering (e.g., 'bonding', 'acids-bases', 'salts', 'titration', 'hot')
// - image: Image filename for the widget thumbnail (optional, in public folder)

export const PAGES_CONFIG = [
  // ── F3 PAGES ──
  {
    file: 'chemical-bonding.html',
    level: 'F3',
    title: 'Chemical Bonding',
    subtitle: 'Interactive learning page',
    topic: 'MW1',
    image: 'chemical-bonding-thumb.png',
  },

  // ── F4 PAGES ──
  {
    file: 'electron-diagram.html',
    level: 'F4',
    title: 'Electron Diagrams of Molecules',
    subtitle: 'Dot & cross lab · covalent bonding',
    topic: 'MW1',
    image: 'electron-diagram-thumb.png',
  },
  {
    file: 'ion-forge.html',
    level: 'F4',
    title: 'IonForge',
    subtitle: 'Chemistry Ion Trainer',
    topic: 'MW1',
    image: 'ion-forge-thumb.png',
  },
  {
    file: 'insoluble-layer.html',
    level: 'F4',
    title: 'Insoluble Layer Preventing Further Reaction',
    subtitle: 'Animations and comparison',
    topic: 'Metals',
    image: 'insolubler-layer-thumb.png',
  },
  {
    file: 'neutralization-exothermic.html',
    level: 'F4',
    title: 'Neutralization: Exothermic nature',
    subtitle: 'Interactive notes / explanation page',
    topic: 'Acids&Bases',
    image: 'neutralization-thumb.png',
  },
  {
    file: 'titration.html',
    level: 'F4',
    title: 'Acid–Base Titration',
    subtitle: 'Interactive titration simulation',
    topic: 'Acids&Bases',
    image: 'titration-thumb.png',
  },
  {
    file: 'salt-page.html',
    level: 'F4',
    title: 'Salt Quiz',
    subtitle: 'Salt solubility rules + preparation method practice',
    topic: 'Acids&Bases',
    image: 'salt-quiz-thumb.png',
  },
  {
    file: 'HOT_guiding_saltprep_reactingmass.html',
    level: 'F4',
    title: 'HOT questions: salt preparation and reacting masses',
    subtitle: 'Guiding questions + scaffolded hints',
    topic: 'Acids&Bases',
    image: 'hot-questions-thumb.png',
  },

  // ── F5 PAGES ──
  {
    file: 'collision-theory.html',
    level: 'F5',
    title: 'Collision Theory Lab',
    subtitle: 'Interactive simulation of collision theory',
    topic: 'Rate',
    image: 'collision-theory-thumb.png',
  },
  {
    file: 'rate-reaction-with-syringe.html',
    level: 'F5',
    title: 'Rate of Reaction Lab',
    subtitle: 'Virtual lab with gas syringe',
    topic: 'Rate',
    image: 'rate-reaction-with-syringe-thumb.png',
  },

  // ── F6 PAGES ──
  // Add F6 pages here when needed
  // Example:
  // {
  //   file: 'your-page.html',
  //   level: 'F6',
  //   title: 'Your Page Title',
  //   subtitle: 'Brief description',
  //   topic: 'your-topic',
  // },
];

// ── TOPIC LABELS (for filter buttons) ──
export const TOPIC_LABELS = {
  bonding: 'Bonding',
  'acids-bases': 'Acids & Bases',
  salts: 'Salts',
  titration: 'Titration',
  hot: 'HOT Questions',
  rate: 'Rate of Reaction',
  // Add more topic labels as needed
};
