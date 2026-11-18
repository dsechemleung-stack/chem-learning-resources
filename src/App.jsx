import React from 'react';
import { PAGES_CONFIG, TOPICS_SORTED, getTopicMeta } from './pagesConfig';
import { TopicIcon } from './TopicIcons';

const DEFAULT_LEVELS = ['F3', 'F4', 'F5', 'F6'];
const DEFAULT_LEVEL = 'F4'; // change to 'all' to open on "All levels"

const labelOf = (topic) => getTopicMeta(topic).label;
const colorOf = (topic) => getTopicMeta(topic).color;

const parseChapters = (value) =>
  String(value || '')
    .split(/[,;，、\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

const sortChapters = (a, b) => {
  const na = parseFloat(a);
  const nb = parseFloat(b);
  if (!isNaN(na) && !isNaN(nb)) return na - nb;
  return a.localeCompare(b);
};

const assetUrl = (p) => `${import.meta.env.BASE_URL}${String(p).replace(/^\/+/, '')}`;

const topicId = (topic) => `topic-${String(topic).replace(/[^a-zA-Z0-9]+/g, '-')}`;

const appWord = (n) => (n === 1 ? 'app' : 'apps');

/* ───────────── small inline icons ───────────── */
const sv = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};
const SearchIcon = () => (
  <svg {...sv} width="18" height="18"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
);
const CloseIcon = () => (
  <svg {...sv} width="16" height="16"><path d="M6 6l12 12M18 6L6 18" /></svg>
);
const ArrowRight = () => (
  <svg {...sv} width="16" height="16"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
const ChevronLeft = () => (
  <svg {...sv} width="20" height="20"><path d="M15 5l-7 7 7 7" /></svg>
);
const ChevronRight = () => (
  <svg {...sv} width="20" height="20"><path d="M9 5l7 7-7 7" /></svg>
);
const ChevronDown = () => (
  <svg {...sv} width="16" height="16"><path d="M6 9l6 6 6-6" /></svg>
);
const CheckIcon = () => (
  <svg {...sv} width="16" height="16"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
);
const BookIcon = ({ size = 14 }) => (
  <svg {...sv} width={size} height={size}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" /><path d="M4 19V5" /></svg>
);
const GridIcon = ({ size = 18 }) => (
  <svg {...sv} width={size} height={size}>
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
  </svg>
);

/* ───────────── Dropdown (multi-select, icons, numbers, counts, keyboard) ───────────── */
// selected = array of chosen values; [] means "everything" (the first option, value 'all')
function Dropdown({ caption, selected, options, onChange, unit = 'items', align = 'left', className = '' }) {
  const [open, setOpen] = React.useState(false);
  const [hi, setHi] = React.useState(0);
  const wrap = React.useRef(null);
  const list = React.useRef(null);
  const uid = React.useId();

  const count = selected.length;
  const isOn = (o) => (o.value === 'all' ? count === 0 : selected.includes(o.value));
  const idx = Math.max(0, options.findIndex(isOn));
  const sel = options.find((o) => o.value === selected[0]) || options[0];
  const many = count > 1;
  const btnLabel = many ? `${count} ${unit}` : sel.label;

  React.useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (!wrap.current?.contains(e.target)) setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [open]);

  React.useEffect(() => {
    if (open) list.current?.querySelector(`[data-i="${hi}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [open, hi]);

  // Toggle one option; the list stays open so several can be ticked. "All" clears the selection.
  const choose = (o) => {
    if (o.value === 'all') {
      onChange([]);
      return;
    }
    onChange(selected.includes(o.value) ? selected.filter((v) => v !== o.value) : [...selected, o.value]);
  };

  const onKeyDown = (e) => {
    const last = options.length - 1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) {
        setHi(idx);
        setOpen(true);
        return;
      }
      setHi((h) => Math.min(last, Math.max(0, h + (e.key === 'ArrowDown' ? 1 : -1))));
    } else if (open && e.key === 'Home') {
      e.preventDefault();
      setHi(0);
    } else if (open && e.key === 'End') {
      e.preventDefault();
      setHi(last);
    } else if (open && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      choose(options[hi] || options[0]);
    } else if (open && e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === 'Tab') {
      setOpen(false);
    }
  };

  return (
    <div className={`dd ${open ? 'open' : ''} ${className}`} ref={wrap}>
      <button
        type="button"
        className="dd-btn"
        style={{ '--ic': many ? '#C5D7B5' : sel.color || '#C5D7B5' }}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${uid}-list`}
        aria-label={`${caption}: ${btnLabel}`}
        onClick={() => {
          if (!open) setHi(idx);
          setOpen((o) => !o);
        }}
        onKeyDown={onKeyDown}
      >
        <span className="dd-ico">{many ? options[0].icon : sel.icon}</span>
        <span className="dd-txt">
          <span className="dd-cap">{caption}</span>
          <span className="dd-val">
            {!many && sel.number != null && <span className="dd-val-num">{sel.number}.</span>}
            {btnLabel}
          </span>
        </span>
        {many && <span className="dd-badge">{count}</span>}
        <span className="dd-caret"><ChevronDown /></span>
      </button>

      {open && (
        <ul
          className={`dd-pop ${align === 'right' ? 'right' : ''}`}
          role="listbox"
          aria-multiselectable="true"
          id={`${uid}-list`}
          ref={list}
          aria-label={caption}
        >
          {options.map((o, i) => {
            const on = isOn(o);
            return (
              <li
                key={o.value}
                data-i={i}
                role="option"
                aria-selected={on}
                className={`dd-opt ${i === hi ? 'hi' : ''} ${on ? 'sel' : ''}`}
                style={{ '--ic': o.color || '#C5D7B5' }}
                onMouseEnter={() => setHi(i)}
                onClick={() => choose(o)}
              >
                <span className={`dd-box ${on ? 'on' : ''}`}>{on ? <CheckIcon /> : null}</span>
                <span className="dd-num">{o.number != null ? `${o.number}.` : ''}</span>
                <span className="dd-ico">{o.icon}</span>
                <span className="dd-optlabel">{o.label}</span>
                {o.count != null && <span className="dd-count">{o.count}</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* ───────────── App card (square thumbnail) ───────────── */
function AppCard({ app, topic, showLevel }) {
  const [imgFailed, setImgFailed] = React.useState(false);
  const color = colorOf(topic);
  const chapters = parseChapters(app.chapter);

  return (
    <a
      className="card"
      href={app.file}
      draggable={false}
      style={{ '--accent': color }}
      aria-label={`Open ${app.title}`}
    >
      <div className="card-media">
        {app.image && !imgFailed ? (
          <img
            src={assetUrl(app.image)}
            alt=""
            loading="lazy"
            draggable={false}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="card-media-fallback">
            <TopicIcon topic={topic} size={44} />
          </div>
        )}
      </div>

      <div className="card-body">
        <h3 className="card-title">{app.title}</h3>
        <p className="card-subtitle">{app.subtitle}</p>

        <div className="card-foot">
          <div className="chapter-list">
            {showLevel && <span className="chapter-chip level">{app.level}</span>}
            {chapters.length > 0 ? (
              chapters.map((c) => (
                <span key={c} className="chapter-chip">
                  <BookIcon size={12} /> Ch {c}
                </span>
              ))
            ) : (
              <span className="chapter-chip muted">General</span>
            )}
          </div>
          <span className="card-open" aria-hidden="true">
            <ArrowRight />
          </span>
        </div>
      </div>
    </a>
  );
}

/* ───────────── Carousel: swipe (touch), drag (mouse), arrows ───────────── */
function Carousel({ count, children }) {
  const ref = React.useRef(null);
  const drag = React.useRef({ down: false, startX: 0, startLeft: 0, moved: false });
  const [dragging, setDragging] = React.useState(false);
  const [edge, setEdge] = React.useState({ start: true, end: false, overflow: false });

  const update = React.useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const start = el.scrollLeft <= 4;
    const end = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    const overflow = el.scrollWidth > el.clientWidth + 4;
    setEdge((p) =>
      p.start === start && p.end === end && p.overflow === overflow ? p : { start, end, overflow }
    );
  }, []);

  React.useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update, count]);

  const scrollByDir = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(el.clientWidth * 0.8, 260), behavior: 'smooth' });
  };

  // Mouse drag (touch screens and trackpads already scroll natively)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0 || !edge.overflow) return;
    const d = drag.current;
    d.down = true;
    d.moved = false;
    d.startX = e.clientX;
    d.startLeft = ref.current.scrollLeft;

    const move = (ev) => {
      const dx = ev.clientX - d.startX;
      if (!d.moved && Math.abs(dx) > 5) {
        d.moved = true;
        setDragging(true);
      }
      if (d.moved) ref.current.scrollLeft = d.startLeft - dx;
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      d.down = false;
      setDragging(false);
      setTimeout(() => { d.moved = false; }, 0); // lets the click handler see "moved"
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  };

  // A drag must not open the app under the cursor
  const onClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div className="carousel">
      {edge.overflow && (
        <button
          type="button"
          className="carousel-btn left"
          onClick={() => scrollByDir(-1)}
          disabled={edge.start}
          aria-label="Scroll left"
        >
          <ChevronLeft />
        </button>
      )}
      <div
        className={`track ${dragging ? 'dragging' : ''}`}
        ref={ref}
        onScroll={update}
        onPointerDown={onPointerDown}
        onClickCapture={onClickCapture}
      >
        {children}
      </div>
      {edge.overflow && (
        <button
          type="button"
          className="carousel-btn right"
          onClick={() => scrollByDir(1)}
          disabled={edge.end}
          aria-label="Scroll right"
        >
          <ChevronRight />
        </button>
      )}
    </div>
  );
}

/* ───────────── Quick topic rail (right edge) ───────────── */
function TopicRail({ topics, activeTopic, onPick }) {
  return (
    <nav className="rail" aria-label="Jump to topic">
      {topics.map((t) => {
        const m = getTopicMeta(t);
        const name = m.number != null ? `${m.number}. ${m.label}` : m.label;
        return (
          <button
            key={t}
            type="button"
            className={`rail-btn ${activeTopic === t ? 'active' : ''}`}
            style={{ '--accent': m.color }}
            onClick={() => onPick(t)}
            aria-label={`Jump to ${name}`}
            aria-current={activeTopic === t ? 'true' : undefined}
          >
            <TopicIcon topic={t} size={20} />
            <span className="rail-tip">{name}</span>
          </button>
        );
      })}
    </nav>
  );
}

/* ───────────── App ───────────── */
export default function App() {
  // Levels come from the sheet automatically (F3, F4, ... or anything new)
  const levels = React.useMemo(() => {
    const set = new Set(PAGES_CONFIG.map((p) => p.level).filter(Boolean));
    const arr = Array.from(set).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    return arr.length ? arr : DEFAULT_LEVELS;
  }, []);

  const [levelChoice, setLevelChoice] = React.useState(DEFAULT_LEVEL);
  const activeLevel =
    levelChoice === 'all' || levels.includes(levelChoice) ? levelChoice : levels[0];
  const allLevels = activeLevel === 'all';

  const [topicChoices, setTopicChoices] = React.useState([]); // [] = all topics
  const [chapterChoices, setChapterChoices] = React.useState([]); // [] = all chapters
  const [query, setQuery] = React.useState('');
  const [activeTopic, setActiveTopic] = React.useState(null);
  const searchRef = React.useRef(null);

  // Press "/" to jump to search
  React.useEffect(() => {
    const onKey = (e) => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && tag !== 'select') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const levelPages = React.useMemo(
    () => (allLevels ? PAGES_CONFIG : PAGES_CONFIG.filter((p) => p.level === activeLevel)),
    [activeLevel, allLevels]
  );

  const levelCounts = React.useMemo(() => {
    const counts = {};
    levels.forEach((l) => (counts[l] = PAGES_CONFIG.filter((p) => p.level === l).length));
    return counts;
  }, [levels]);

  // Topics that exist in this level, in topic-number order, with app counts
  const topics = React.useMemo(
    () =>
      TOPICS_SORTED.map((t) => ({
        ...t,
        count: levelPages.filter((p) => p.topics.includes(t.key)).length,
      })).filter((t) => t.count > 0),
    [levelPages]
  );

  // Keep only choices that still exist in this level
  const topicValues = topicChoices.filter((k) => topics.some((t) => t.key === k));

  // Chapters available for this level (and topic, if one is selected), with counts
  const chapters = React.useMemo(() => {
    const counts = new Map();
    levelPages
      .filter((p) => !topicValues.length || p.topics.some((t) => topicValues.includes(t)))
      .forEach((p) =>
        parseChapters(p.chapter).forEach((c) => counts.set(c, (counts.get(c) || 0) + 1))
      );
    return Array.from(counts.entries())
      .sort((a, b) => sortChapters(a[0], b[0]))
      .map(([value, count]) => ({ value, count }));
  }, [levelPages, topicValues]);

  const chapterValues = chapterChoices.filter((v) => chapters.some((c) => c.value === v));

  const filtered = React.useMemo(() => {
    const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
    return levelPages.filter((p) => {
      if (topicValues.length && !p.topics.some((t) => topicValues.includes(t))) return false;
      if (chapterValues.length && !parseChapters(p.chapter).some((c) => chapterValues.includes(c))) return false;
      if (tokens.length) {
        const hay = [
          p.title,
          p.subtitle,
          p.file,
          p.level,
          p.topics.map(labelOf).join(' '),
          parseChapters(p.chapter).map((c) => `ch${c} chapter ${c}`).join(' '),
        ]
          .join(' ')
          .toLowerCase();
        if (!tokens.every((t) => hay.includes(t))) return false;
      }
      return true;
    });
  }, [levelPages, topicValues, chapterValues, query]);

  // Group by topic (sorted by topic number). An app with 2+ topics appears in each.
  const groups = React.useMemo(() => {
    const map = new Map();
    filtered.forEach((p) =>
      p.topics.forEach((t) => {
        if (topicValues.length && !topicValues.includes(t)) return;
        if (!map.has(t)) map.set(t, []);
        map.get(t).push(p);
      })
    );
    return Array.from(map.entries()).sort(
      (a, b) => getTopicMeta(a[0]).order - getTopicMeta(b[0]).order
    );
  }, [filtered, topicValues]);

  // One section only -> show every app in a wrapping grid. Several -> one swipeable row each.
  const gridMode = groups.length === 1;
  const showRail = groups.length > 1;

  // Highlight the topic currently in view on the quick rail
  React.useEffect(() => {
    const els = groups.map(([t]) => document.getElementById(topicId(t))).filter(Boolean);
    if (!els.length) {
      setActiveTopic(null);
      return undefined;
    }
    setActiveTopic((prev) => (groups.some(([t]) => t === prev) ? prev : groups[0][0]));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveTopic(e.target.dataset.topic);
        });
      },
      { rootMargin: '-20% 0px -65% 0px' }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [groups]);

  const jumpToTopic = (topic) => {
    setActiveTopic(topic);
    document.getElementById(topicId(topic))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const hasFilters = topicValues.length > 0 || chapterValues.length > 0 || query.trim() !== '';

  const clearFilters = () => {
    setTopicChoices([]);
    setChapterChoices([]);
    setQuery('');
  };

  const changeLevel = (level) => {
    setLevelChoice(level);
    setTopicChoices([]);
    setChapterChoices([]);
  };

  const topicOptions = [
    { value: 'all', label: 'All topics', icon: <GridIcon />, count: levelPages.length },
    ...topics.map((t) => ({
      value: t.key,
      label: t.label,
      number: t.number,
      color: t.color,
      count: t.count,
      icon: <TopicIcon topic={t.key} size={18} />,
    })),
  ];

  const chapterOptions = [
    { value: 'all', label: 'All chapters', icon: <BookIcon size={18} />, count: null },
    ...chapters.map((c) => ({
      value: c.value,
      label: `Chapter ${c.value}`,
      count: c.count,
      icon: <BookIcon size={18} />,
    })),
  ];

  const levelLabel = allLevels ? 'all levels' : activeLevel;

  return (
    <div className="app">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700;800&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; background: #0a1a18; }

        .app {
          min-height: 100vh;
          position: relative;
          overflow-x: hidden;
          color: #fff;
          font-family: 'Quicksand', sans-serif;
          background: #0a1a18;
        }
        .bg-glow {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(600px 400px at 15% 10%, rgba(118,168,165,0.22), transparent 70%),
            radial-gradient(700px 500px at 90% 30%, rgba(197,215,181,0.12), transparent 70%),
            radial-gradient(800px 600px at 50% 110%, rgba(118,168,165,0.18), transparent 70%);
        }

        /* NAV */
        .nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          display: flex; align-items: center; gap: 12px;
          padding: 14px 20px;
          background: rgba(10,26,24,0.92);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(197,215,181,0.1);
        }
        .nav-title { font-weight: 800; font-size: 18px; letter-spacing: -0.01em; line-height: 1.15; }
        .nav-sub {
          font-weight: 700; font-size: 11px; color: rgba(255,255,255,0.7);
          letter-spacing: 0.12em; text-transform: uppercase; margin-top: 4px;
        }

        /* HERO (compact) */
        .main { position: relative; z-index: 10; padding: 100px 20px 60px; }
        .hero { text-align: center; }
        .brand-script {
          font-size: clamp(1.9rem, 5vw, 3.1rem);
          line-height: 1.1; margin: 0; font-weight: 800;
          background: linear-gradient(135deg, #C5D7B5 0%, #76A8A5 50%, #ffffff 100%);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent;
          -webkit-text-stroke: 1.5px rgba(255,255,255,0.98);
          paint-order: stroke fill;
        }
        .hero-sub {
          margin: 8px auto 0; max-width: 560px;
          color: rgba(255,255,255,0.65); font-weight: 600; font-size: 14px; line-height: 1.5;
        }

        .level-toggle {
          display: inline-flex; flex-wrap: wrap; justify-content: center; gap: 4px; padding: 4px; margin-top: 16px;
          border-radius: 999px; border: 1.5px solid rgba(197,215,181,0.55);
          background: rgba(118,168,165,0.12); backdrop-filter: blur(10px);
          box-shadow: 0 10px 34px rgba(0,0,0,0.4);
        }
        .level-btn {
          appearance: none; border: 0; cursor: pointer; border-radius: 999px;
          padding: 7px 14px; font-family: inherit; font-weight: 800; font-size: 12px;
          letter-spacing: 0.12em; text-transform: uppercase;
          color: rgba(255,255,255,0.85); background: transparent;
          display: inline-flex; align-items: center; gap: 8px;
          transition: background 140ms ease, color 140ms ease, transform 140ms ease;
        }
        .level-btn:hover { transform: translateY(-1px); color: #fff; }
        .level-btn:focus-visible { outline: 3px solid rgba(197,215,181,0.8); outline-offset: 2px; }
        .level-btn.active {
          background: linear-gradient(135deg, rgba(197,215,181,0.95), rgba(118,168,165,0.9));
          color: rgba(10,26,24,0.95);
        }
        .level-count {
          font-size: 10px; min-width: 18px; height: 18px; padding: 0 5px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 999px; background: rgba(255,255,255,0.14); letter-spacing: 0;
        }
        .level-btn.active .level-count { background: rgba(10,26,24,0.18); }

        /* TOOLBAR: one row (search + two dropdowns) */
        .toolbar {
          position: relative; z-index: 30;
          max-width: 1200px; margin: 20px auto 0; padding: 10px;
          border-radius: 18px; border: 1px solid rgba(197,215,181,0.22);
          background: rgba(118,168,165,0.07);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.3);
          text-align: left;
        }
        .toolbar-row { display: flex; gap: 10px; align-items: stretch; }

        .search { position: relative; flex: 1 1 auto; min-width: 0; }
        .search input {
          width: 100%; height: 48px; border-radius: 12px;
          padding: 0 56px 0 42px; font-family: inherit; font-weight: 600; font-size: 14px;
          color: #fff; background: rgba(10,26,24,0.6);
          border: 1.5px solid rgba(197,215,181,0.3); outline: none;
          transition: border-color 140ms ease, box-shadow 140ms ease;
        }
        .search input::placeholder { color: rgba(255,255,255,0.45); }
        .search input:focus {
          border-color: rgba(197,215,181,0.85);
          box-shadow: 0 0 0 4px rgba(118,168,165,0.25);
        }
        .search-icon {
          position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
          color: rgba(197,215,181,0.85); display: flex; pointer-events: none;
        }
        .search-clear {
          position: absolute; right: 9px; top: 50%; transform: translateY(-50%);
          appearance: none; border: 0; cursor: pointer; display: flex; align-items: center; justify-content: center;
          width: 26px; height: 26px; border-radius: 999px;
          background: rgba(255,255,255,0.1); color: #fff;
        }
        .search-clear:hover { background: rgba(255,255,255,0.2); }
        .search-hint {
          position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
          font-size: 11px; font-weight: 800; color: rgba(255,255,255,0.45);
          border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; padding: 1px 7px;
          pointer-events: none;
        }

        /* DROPDOWN */
        .dd { position: relative; flex: 0 0 auto; }
        .dd.topic { width: 270px; }
        .dd.chapter { width: 190px; }
        .dd-btn {
          appearance: none; width: 100%; height: 48px; cursor: pointer;
          display: flex; align-items: center; gap: 10px; padding: 0 12px;
          border-radius: 12px; font-family: inherit; text-align: left; color: #fff;
          background: rgba(10,26,24,0.6);
          border: 1.5px solid rgba(197,215,181,0.3);
          transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
        }
        .dd-btn:hover, .dd.open .dd-btn { border-color: rgba(197,215,181,0.85); }
        .dd-btn:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(118,168,165,0.25); border-color: rgba(197,215,181,0.85); }
        .dd-ico { display: flex; flex-shrink: 0; color: var(--ic, #C5D7B5); }
        .dd-txt { display: flex; flex-direction: column; min-width: 0; flex: 1; line-height: 1.15; }
        .dd-cap { font-size: 10px; font-weight: 700; letter-spacing: 0.04em; color: rgba(255,255,255,0.5); }
        .dd-val { font-size: 14px; font-weight: 700; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dd-val-num { color: rgba(255,255,255,0.55); margin-right: 5px; font-variant-numeric: tabular-nums; }
        .dd-caret { display: flex; color: rgba(197,215,181,0.85); transition: transform 160ms ease; }
        .dd.open .dd-caret { transform: rotate(180deg); }

        .dd-pop {
          position: absolute; top: calc(100% + 8px); left: 0; z-index: 200;
          min-width: 100%; width: max-content; max-width: min(380px, calc(100vw - 28px));
          max-height: min(400px, 62vh); overflow-y: auto; overscroll-behavior: contain;
          margin: 0; padding: 6px; list-style: none;
          border-radius: 14px; background: rgba(12,30,28,0.98);
          border: 1px solid rgba(197,215,181,0.35);
          box-shadow: 0 22px 54px rgba(0,0,0,0.65);
          scrollbar-width: thin; scrollbar-color: rgba(197,215,181,0.3) transparent;
        }
        .dd-pop.right { left: auto; right: 0; }
        .dd-opt {
          display: flex; align-items: center; gap: 10px;
          padding: 9px 10px; border-radius: 9px; cursor: pointer;
          font-weight: 700; font-size: 14px; color: rgba(255,255,255,0.88);
        }
        .dd-opt.hi { background: rgba(118,168,165,0.2); }
        .dd-opt.sel { color: #fff; background: color-mix(in srgb, var(--ic, #C5D7B5) 18%, transparent); }
        .dd-num {
          width: 24px; flex-shrink: 0; text-align: right;
          font-size: 13px; font-weight: 800; color: rgba(255,255,255,0.5);
          font-variant-numeric: tabular-nums;
        }
        .dd-optlabel { flex: 1; min-width: 0; white-space: nowrap; }
        .dd-count {
          font-size: 11px; font-weight: 800; padding: 1px 8px; border-radius: 999px;
          background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.7);
        }
        .dd-box {
          width: 18px; height: 18px; flex-shrink: 0; border-radius: 5px;
          display: flex; align-items: center; justify-content: center;
          border: 1.5px solid rgba(197,215,181,0.5); color: #0a1a18;
          transition: background 120ms ease, border-color 120ms ease;
        }
        .dd-box.on { background: var(--ic, #C5D7B5); border-color: var(--ic, #C5D7B5); }
        .dd-box svg { width: 13px; height: 13px; stroke-width: 3; }
        .dd-badge {
          flex-shrink: 0; min-width: 20px; height: 20px; padding: 0 6px;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 999px; font-size: 11px; font-weight: 800;
          color: #0a1a18; background: #C5D7B5;
        }

        .status-row {
          margin-top: 8px; padding: 0 4px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
          font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.6);
        }
        .status-row strong { color: #C5D7B5; }
        .clear-btn {
          appearance: none; border: 1px solid rgba(197,215,181,0.4); cursor: pointer;
          background: transparent; color: #C5D7B5; font-family: inherit;
          font-weight: 800; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase;
          border-radius: 999px; padding: 4px 12px;
        }
        .clear-btn:hover { background: rgba(197,215,181,0.12); }

        /* SECTIONS  (--card-w = width of every app card; thumbnail stays square) */
        .sections { position: relative; z-index: 10; max-width: 1200px; margin: 24px auto 0; }
        .section { margin-bottom: 28px; scroll-margin-top: 96px; --accent: #C5D7B5; --card-w: 190px; }
        .section-head { display: flex; align-items: center; gap: 12px; margin: 0 4px 2px; }
        .section-icon {
          width: 40px; height: 40px; border-radius: 12px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 16%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
        }
        .section-title { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
        .section-title .num { color: rgba(255,255,255,0.5); margin-right: 6px; }
        .section-count { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.55); margin-top: 2px; }

        /* CAROUSEL: fixed-size cards, swipe / drag / arrows */
        .carousel { position: relative; }
        .track {
          display: flex; gap: 14px; overflow-x: auto; padding: 12px 4px 18px;
          scroll-snap-type: x mandatory; scroll-padding-left: 4px;
          overscroll-behavior-x: contain; -webkit-overflow-scrolling: touch;
          scrollbar-width: none; -ms-overflow-style: none;
        }
        .track::-webkit-scrollbar { display: none; }
        .track.dragging { scroll-snap-type: none; cursor: grabbing; user-select: none; }
        .track.dragging .card { pointer-events: none; }
        .track .card { flex: 0 0 var(--card-w); }

        .carousel-btn {
          position: absolute; top: 34%; z-index: 5; width: 42px; height: 42px;
          border-radius: 999px; border: 1px solid rgba(197,215,181,0.5); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: #fff; background: rgba(10,26,24,0.85);
          backdrop-filter: blur(8px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.5);
          transition: opacity 160ms ease, transform 160ms ease, background 160ms ease;
        }
        .carousel-btn:hover:not(:disabled) { background: rgba(118,168,165,0.7); transform: scale(1.06); }
        .carousel-btn:disabled { opacity: 0; pointer-events: none; }
        .carousel-btn.left { left: -14px; }
        .carousel-btn.right { right: -14px; }

        /* GRID: used when only one topic is on screen, so every app is visible */
        .grid {
          display: grid; gap: 14px; padding: 12px 4px 18px;
          grid-template-columns: repeat(auto-fill, var(--card-w));
          justify-content: start;
        }

        /* CARD: square thumbnail, never cropped */
        .card {
          scroll-snap-align: start; text-decoration: none; color: inherit;
          display: flex; flex-direction: column; overflow: hidden;
          border-radius: 14px;
          background: linear-gradient(180deg, rgba(118,168,165,0.14), rgba(118,168,165,0.06));
          border: 1.5px solid rgba(197,215,181,0.28);
          box-shadow: 0 12px 32px rgba(0,0,0,0.4);
          transition: transform 160ms ease, border-color 160ms ease, box-shadow 160ms ease;
          --accent: #C5D7B5;
        }
        .card:hover {
          transform: translateY(-4px);
          border-color: var(--accent);
          box-shadow: 0 18px 48px rgba(0,0,0,0.55), 0 0 0 1px color-mix(in srgb, var(--accent) 40%, transparent);
        }
        .card:focus-visible { outline: none; box-shadow: 0 0 0 4px rgba(118,168,165,0.6); }
        .card-media {
          position: relative; aspect-ratio: 1 / 1; overflow: hidden;
          background: #f3f6f4;
          border-bottom: 3px solid var(--accent);
        }
        .card-media img {
          width: 100%; height: 100%; object-fit: contain; display: block;
          padding: 6px; user-select: none; -webkit-user-drag: none;
          transition: transform 300ms ease;
        }
        .card:hover .card-media img { transform: scale(1.04); }
        .card-media-fallback {
          width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;
          color: var(--accent);
          background: color-mix(in srgb, var(--accent) 12%, #0d1f1e);
        }
        .card-body { padding: 10px 12px; display: flex; flex-direction: column; flex: 1; }
        .card-title { margin: 0; font-size: 13.5px; font-weight: 800; line-height: 1.25; letter-spacing: -0.01em; }
        .card-subtitle {
          margin: 4px 0 0; font-size: 11.5px; font-weight: 600; line-height: 1.35;
          color: rgba(230,245,230,0.75);
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .card-foot {
          margin-top: auto; padding-top: 8px;
          display: flex; align-items: center; justify-content: space-between; gap: 6px;
        }
        .chapter-list { display: flex; flex-wrap: wrap; gap: 5px; }
        .chapter-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 7px; border-radius: 7px;
          font-size: 10px; font-weight: 800; letter-spacing: 0.04em;
          color: #0a1a18; background: var(--accent);
        }
        .chapter-chip.muted { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.08); }
        .chapter-chip.level {
          color: var(--accent); background: transparent;
          border: 1px solid color-mix(in srgb, var(--accent) 60%, transparent);
        }
        .card-open {
          display: inline-flex; align-items: center; flex-shrink: 0;
          color: var(--accent); transition: transform 140ms ease;
        }
        .card:hover .card-open { transform: translateX(3px); }

        /* QUICK TOPIC RAIL */
        .rail {
          position: fixed; right: 10px; top: 50%; transform: translateY(-50%); z-index: 90;
          display: flex; flex-direction: column; gap: 6px; padding: 8px 6px;
          border-radius: 999px;
          background: rgba(10,26,24,0.85);
          border: 1px solid rgba(197,215,181,0.28);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          box-shadow: 0 12px 36px rgba(0,0,0,0.5);
        }
        .rail-btn {
          position: relative; width: 38px; height: 38px; padding: 0;
          border-radius: 50%; cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          color: var(--accent); background: transparent;
          border: 1.5px solid transparent;
          transition: background 140ms ease, color 140ms ease, transform 140ms ease;
        }
        .rail-btn:hover { background: color-mix(in srgb, var(--accent) 22%, transparent); transform: scale(1.06); }
        .rail-btn:focus-visible { outline: none; border-color: var(--accent); }
        .rail-btn.active { background: var(--accent); color: #0a1a18; }
        .rail-tip {
          position: absolute; right: calc(100% + 12px); top: 50%; transform: translateY(-50%);
          white-space: nowrap; pointer-events: none; opacity: 0;
          padding: 5px 10px; border-radius: 8px;
          font-size: 12px; font-weight: 800; color: #fff;
          background: rgba(10,26,24,0.95); border: 1px solid rgba(197,215,181,0.35);
          transition: opacity 120ms ease;
        }
        .rail-btn:hover .rail-tip, .rail-btn:focus-visible .rail-tip { opacity: 1; }

        .main.has-rail { padding-right: 68px; }

        /* EMPTY */
        .empty {
          text-align: center; padding: 48px 20px; color: rgba(255,255,255,0.6);
          font-weight: 700; font-size: 15px;
        }
        .empty svg { color: rgba(197,215,181,0.6); margin-bottom: 10px; }

        @media (min-width: 1500px) {
          .main.has-rail { padding-right: 20px; }
        }

        /* Short screens: shrink the rail so 15 topics still fit */
        @media (max-height: 820px) {
          .rail { gap: 2px; padding: 6px 5px; }
          .rail-btn { width: 32px; height: 32px; }
          .rail-btn svg { width: 18px; height: 18px; }
        }
        @media (max-height: 640px) {
          .rail-btn { width: 26px; height: 26px; }
          .rail-btn svg { width: 15px; height: 15px; }
        }

        @media (max-width: 760px) {
          .toolbar-row { flex-wrap: wrap; gap: 8px; }
          .search { flex: 1 1 100%; }
          .dd.topic, .dd.chapter { flex: 1 1 0; width: auto; min-width: 0; }
          .dd-cap { display: none; }
          .dd-btn { height: 46px; }
        }

        @media (max-width: 640px) {
          .main { padding: 92px 14px 48px; }
          .main.has-rail { padding-right: 54px; }
          .toolbar { padding: 10px; border-radius: 16px; }
          .section { --card-w: 150px; }
          .track { gap: 10px; }
          .grid { gap: 10px; }
          .carousel-btn { display: none; }
          .search-hint { display: none; }
          .nav-title { font-size: 16px; }
          .rail { right: 5px; padding: 6px 4px; gap: 4px; }
          .rail-btn { width: 34px; height: 34px; }
          .rail-tip { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          * { transition: none !important; scroll-behavior: auto !important; }
        }
      `}</style>

      <div className="bg-glow" />

      {/* NAV */}
      <nav className="nav">
        <div style={{ filter: 'drop-shadow(0 0 10px rgba(118,168,165,0.5))' }}>
          <div
            style={{
              clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
              background: 'linear-gradient(135deg, #76A8A5, #C5D7B5)',
              width: 52, height: 52,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div
              style={{
                clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
                background: '#0d1f1e', width: 46, height: 46,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <img
                src={assetUrl('ChemistreeIcon_square.png')}
                alt="ChemLeung"
                draggable={false}
                style={{ width: 32, height: 32, objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="nav-title">Chemistry Learning Tools</div>
          <div className="nav-sub">by Mr Hugo Leung</div>
        </div>
      </nav>

      {showRail && (
        <TopicRail topics={groups.map(([t]) => t)} activeTopic={activeTopic} onPick={jumpToTopic} />
      )}

      <main className={`main ${showRail ? 'has-rail' : ''}`}>
        {/* HERO */}
        <header className="hero">
          <h1 className="brand-script">{allLevels ? 'Chemistry' : `${activeLevel} Chemistry`}</h1>
          <p className="hero-sub">Interactive simulations, quizzes and practice apps.</p>

          <div className="level-toggle" role="group" aria-label="Select level">
            <button
              type="button"
              className={`level-btn ${allLevels ? 'active' : ''}`}
              onClick={() => changeLevel('all')}
              aria-pressed={allLevels}
            >
              All
              <span className="level-count">{PAGES_CONFIG.length}</span>
            </button>
            {levels.map((level) => (
              <button
                key={level}
                type="button"
                className={`level-btn ${activeLevel === level ? 'active' : ''}`}
                onClick={() => changeLevel(level)}
                aria-pressed={activeLevel === level}
              >
                {level}
                <span className="level-count">{levelCounts[level] || 0}</span>
              </button>
            ))}
          </div>
        </header>

        {/* TOOLBAR */}
        <section className="toolbar" aria-label="Search and filters">
          <div className="toolbar-row">
            <div className="search">
              <span className="search-icon"><SearchIcon /></span>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search apps (e.g. titration)"
                aria-label="Search apps"
              />
              {query ? (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setQuery('')}
                  aria-label="Clear search"
                >
                  <CloseIcon />
                </button>
              ) : (
                <span className="search-hint">/</span>
              )}
            </div>

            <Dropdown
              className="topic"
              caption="Topic"
              unit="topics"
              selected={topicValues}
              options={topicOptions}
              onChange={setTopicChoices}
            />

            <Dropdown
              className="chapter"
              caption="Chapter"
              unit="chapters"
              align="right"
              selected={chapterValues}
              options={chapterOptions}
              onChange={setChapterChoices}
            />
          </div>

          <div className="status-row">
            <span>
              Showing <strong>{filtered.length}</strong> of {levelPages.length} apps in {levelLabel}
            </span>
            {hasFilters && (
              <button type="button" className="clear-btn" onClick={clearFilters}>
                Clear filters
              </button>
            )}
          </div>
        </section>

        {/* RESULTS */}
        <div className="sections">
          {groups.length > 0 ? (
            groups.map(([topic, apps]) => {
              const m = getTopicMeta(topic);
              const cards = apps.map((app) => (
                <AppCard key={`${topic}-${app.file}`} app={app} topic={topic} showLevel={allLevels} />
              ));
              return (
                <section
                  key={topic}
                  id={topicId(topic)}
                  data-topic={topic}
                  className="section"
                  style={{ '--accent': m.color }}
                >
                  <div className="section-head">
                    <div className="section-icon">
                      <TopicIcon topic={topic} size={22} />
                    </div>
                    <div>
                      <h2 className="section-title">
                        {m.number != null && <span className="num">{m.number}.</span>}
                        {m.label}
                      </h2>
                      <div className="section-count">
                        {apps.length} {appWord(apps.length)}
                      </div>
                    </div>
                  </div>

                  {gridMode ? (
                    <div className="grid">{cards}</div>
                  ) : (
                    <Carousel count={apps.length}>{cards}</Carousel>
                  )}
                </section>
              );
            })
          ) : (
            <div className="empty">
              <svg {...sv} width="40" height="40"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5M8.5 11h5" /></svg>
              <div>
                {levelPages.length === 0
                  ? `No apps available for ${levelLabel} yet.`
                  : 'No apps match your search or filters.'}
              </div>
              {hasFilters && (
                <button
                  type="button"
                  className="clear-btn"
                  style={{ marginTop: 14 }}
                  onClick={clearFilters}
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}