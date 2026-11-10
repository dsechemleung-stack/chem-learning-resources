import React from 'react';
import { PAGES_CONFIG, TOPIC_LABELS } from './pagesConfig';

export default function App() {
  const [activeLevel, setActiveLevel] = React.useState('F4');
  const [selectedTopic, setSelectedTopic] = React.useState('all');

  // Get unique topics for the current level
  const getTopicsForLevel = (level) => {
    const topics = new Set(PAGES_CONFIG
      .filter(p => p.level === level)
      .map(p => p.topic)
    );
    return ['all', ...Array.from(topics)];
  };

  // Filter pages by level and topic
  const getFilteredPages = () => {
    return PAGES_CONFIG.filter(p => 
      p.level === activeLevel && 
      (selectedTopic === 'all' || p.topic === selectedTopic)
    );
  };

  const currentTopics = getTopicsForLevel(activeLevel);
  const filteredPages = getFilteredPages();

  return (
    <div style={{ minHeight: '100vh', width: '100%', position: 'relative', background: '#0a1a18' }}>
      <style>{`
        .brand-script {
          font-family: 'Quicksand', sans-serif;
          background: linear-gradient(135deg, #C5D7B5 0%, #76A8A5 50%, #ffffff 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          -webkit-text-stroke: 2px rgba(255,255,255,0.98);
          text-shadow:
            1px 0 0 rgba(255,255,255,0.95),
            -1px 0 0 rgba(255,255,255,0.95),
            0 1px 0 rgba(255,255,255,0.95),
            0 -1px 0 rgba(255,255,255,0.95),
            1px 1px 0 rgba(255,255,255,0.9),
            -1px 1px 0 rgba(255,255,255,0.9),
            1px -1px 0 rgba(255,255,255,0.9),
            -1px -1px 0 rgba(255,255,255,0.9);
        }

        .hero-tagline {
          font-family: 'Quicksand', sans-serif;
        }

        .pill-badge {
          font-family: 'Quicksand', sans-serif;
          font-weight: 700;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #fff;
          background: rgba(118,168,165,0.55);
          border: 1.5px solid rgba(197,215,181,0.7);
          border-radius: 999px;
          padding: 6px 16px;
          display: inline-block;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 2px 16px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1);
          text-shadow: 0 1px 4px rgba(255,255,255,0.3);
        }

        .landing-widget {
          font-family: 'Quicksand', sans-serif;
          text-decoration: none;
          color: rgba(255,255,255,0.96);
          background: rgba(118,168,165,0.14);
          border: 1.5px solid rgba(197,215,181,0.55);
          border-radius: 18px;
          padding: 20px;
          width: 100%;
          max-width: 320px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 16px 50px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.08);
          transition: transform 140ms ease, box-shadow 140ms ease, border-color 140ms ease;
        }

        .landing-widget-image {
          width: 100%;
          aspect-ratio: 1;
          max-width: 200px;
          border-radius: 14px;
          object-fit: cover;
          background: rgba(197,215,181,0.1);
          flex-shrink: 0;
        }

        .landing-widget-content {
          text-align: center;
          width: 100%;
        }

        .landing-widget:hover {
          transform: translateY(-2px);
          border-color: rgba(197,215,181,0.8);
          box-shadow: 0 18px 60px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.12);
        }

        .landing-widget:focus-visible {
          outline: none;
          box-shadow: 0 18px 60px rgba(0,0,0,0.55), 0 0 0 4px rgba(118,168,165,0.55);
        }

        .landing-widget-title {
          font-weight: 800;
          letter-spacing: -0.01em;
          font-size: 16px;
          margin: 0;
          line-height: 1.25;
          text-shadow: 0 1px 10px rgba(0,0,0,0.35);
        }

        .landing-widget-subtitle {
          margin: 6px 0 0;
          font-weight: 600;
          font-size: 13px;
          color: rgba(230,245,230,0.9);
          line-height: 1.45;
          text-shadow: 0 1px 10px rgba(0,0,0,0.35);
        }

        .landing-widget-chip {
          font-weight: 800;
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 12px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.16);
          background: linear-gradient(135deg, rgba(197,215,181,0.9), rgba(118,168,165,0.85));
          color: rgba(10,26,24,0.95);
          white-space: nowrap;
          box-shadow: 0 8px 22px rgba(0,0,0,0.35);
        }

        .level-toggle {
          display: inline-flex;
          gap: 8px;
          padding: 6px;
          border-radius: 999px;
          border: 1.5px solid rgba(197,215,181,0.55);
          background: rgba(118,168,165,0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: 0 10px 34px rgba(0,0,0,0.4);
        }

        .level-btn {
          appearance: none;
          border: 0;
          cursor: pointer;
          border-radius: 999px;
          padding: 8px 14px;
          font-family: 'Quicksand', sans-serif;
          font-weight: 800;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.85);
          background: transparent;
          transition: background 140ms ease, color 140ms ease, transform 140ms ease;
        }

        .level-btn:hover {
          transform: translateY(-1px);
          color: rgba(255,255,255,0.95);
        }

        .level-btn.active {
          background: linear-gradient(135deg, rgba(197,215,181,0.9), rgba(118,168,165,0.85));
          color: rgba(10,26,24,0.95);
        }

        .topic-filter {
          display: inline-flex;
          gap: 6px;
          padding: 4px;
          border-radius: 999px;
          border: 1px solid rgba(197,215,181,0.3);
          background: rgba(118,168,165,0.08);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          margin-top: 12px;
          flex-wrap: wrap;
          justify-content: center;
          min-height: 44px;
          min-width: 200px;
        }

        .topic-btn {
          appearance: none;
          border: 0;
          cursor: pointer;
          border-radius: 999px;
          padding: 6px 12px;
          font-family: 'Quicksand', sans-serif;
          font-weight: 600;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.7);
          background: transparent;
          transition: background 140ms ease, color 140ms ease;
        }

        .topic-btn:hover {
          color: rgba(255,255,255,0.9);
        }

        .topic-btn.active {
          background: rgba(197,215,181,0.25);
          color: rgba(197,215,181,1);
          border: 1px solid rgba(197,215,181,0.4);
        }
      `}</style>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(10,26,24,0.2) 0%, rgba(10,26,24,0.9) 100%)',
          pointerEvents: 'none',
        }}
      />

      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
          padding: '20px 18px',
          background: 'rgba(10,26,24,0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(197,215,181,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ filter: 'drop-shadow(0 0 10px rgba(118,168,165,0.5))' }}>
            <div
              style={{
                clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
                background: 'linear-gradient(135deg, #76A8A5, #C5D7B5)',
                width: 56,
                height: 56,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  clipPath: 'polygon(50% 0%, 95% 25%, 95% 75%, 50% 100%, 5% 75%, 5% 25%)',
                  background: '#0d1f1e',
                  width: 50,
                  height: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src="/ChemistreeIcon_square.png"
                  alt="ChemLeung"
                  draggable={false}
                  style={{ width: 36, height: 36, objectFit: 'contain' }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
            <span
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 800,
                fontSize: 18,
                color: '#fff',
                letterSpacing: '-0.01em',
              }}
            >
              Chemistry Learning Tools
            </span>
            <span
              style={{
                fontFamily: "'Quicksand', sans-serif",
                fontWeight: 700,
                fontSize: 12,
                color: 'rgba(255,255,255,0.72)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 4,
              }}
            >
              by Mr Hugo Leung
            </span>
          </div>
        </div>
      </nav>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          textAlign: 'center',
          padding: '120px 24px 40px',
          overflowY: 'auto',
        }}
      >
        <div className="pill-badge" style={{ marginBottom: 28, minWidth: '140px', textAlign: 'center' }}>
          {activeLevel} Chemistry
        </div>

        <h1 className="brand-script" style={{ fontSize: 'clamp(2.6rem, 8vw, 5.2rem)', lineHeight: 1.08, margin: 0 }}>
          Chemistry Learning Tools
        </h1>

        <div style={{ marginTop: 24 }}>
          <div className="level-toggle" role="tablist" aria-label="Select level">
            <button
              type="button"
              className={`level-btn ${activeLevel === 'F3' ? 'active' : ''}`}
              onClick={() => { setActiveLevel('F3'); setSelectedTopic('all'); }}
              aria-pressed={activeLevel === 'F3'}
            >
              F3
            </button>
            <button
              type="button"
              className={`level-btn ${activeLevel === 'F4' ? 'active' : ''}`}
              onClick={() => { setActiveLevel('F4'); setSelectedTopic('all'); }}
              aria-pressed={activeLevel === 'F4'}
            >
              F4
            </button>
            <button
              type="button"
              className={`level-btn ${activeLevel === 'F5' ? 'active' : ''}`}
              onClick={() => { setActiveLevel('F5'); setSelectedTopic('all'); }}
              aria-pressed={activeLevel === 'F5'}
            >
              F5
            </button>
            <button
              type="button"
              className={`level-btn ${activeLevel === 'F6' ? 'active' : ''}`}
              onClick={() => { setActiveLevel('F6'); setSelectedTopic('all'); }}
              aria-pressed={activeLevel === 'F6'}
            >
              F6
            </button>
          </div>
        </div>

        <div style={{ width: 'min(680px, 100%)', marginTop: 26 }}>
          {/* Topic Filter */}
          <div 
            className="topic-filter" 
            role="group" 
            aria-label="Filter by topic"
            style={{ visibility: currentTopics.length > 1 ? 'visible' : 'hidden' }}
          >
            {currentTopics.map(topic => (
              <button
                key={topic}
                type="button"
                className={`topic-btn ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => setSelectedTopic(topic)}
                aria-pressed={selectedTopic === topic}
              >
                {topic === 'all' ? 'All' : (TOPIC_LABELS[topic] || topic)}
              </button>
            ))}
          </div>

          {/* Page Widgets */}
          {filteredPages.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
              gap: 20, 
              marginTop: 16, 
              width: '100%',
              maxWidth: '1400px',
              margin: '16px auto 0',
              padding: '0 24px'
            }}>
              {filteredPages.map(page => (
                <a
                  key={page.file}
                  className="landing-widget"
                  href={page.file}
                  aria-label={`Open ${page.title}`}
                >
                  {page.image && (
                    <img
                      src={`/${page.image}`}
                      alt=""
                      className="landing-widget-image"
                    />
                  )}
                  <div className="landing-widget-content">
                    <p className="landing-widget-title">{page.title}</p>
                    <p className="landing-widget-subtitle">{page.subtitle}</p>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div style={{ 
              padding: '40px 20px', 
              textAlign: 'center', 
              color: 'rgba(255,255,255,0.5)',
              fontSize: '14px'
            }}>
              No pages available for this topic.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
