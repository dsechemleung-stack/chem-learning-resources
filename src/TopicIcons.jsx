import React from 'react';
import { getTopicMeta } from './pagesConfig';

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

// Icon names you can also type in the sheet's "icon" column
export const ICONS = {
  atom: (
    <>
      <circle cx="12" cy="12" r="1.6" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
    </>
  ),
  metal: (
    <>
      <path d="M3.5 18.5l3-8h11l3 8z" />
      <path d="M7.5 10.5l1.5-4.5h6l1.5 4.5" />
    </>
  ),
  calculator: (
    <>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8.5 7.5h7" />
      <path d="M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01" strokeWidth="2.4" />
    </>
  ),
  flask: (
    <>
      <path d="M9 3h6" />
      <path d="M10 3v6l-5.5 10a1.5 1.5 0 0 0 1.3 2.2h12.4a1.5 1.5 0 0 0 1.3-2.2L14 9V3" />
      <path d="M7.5 15h9" />
    </>
  ),
  organic: (
    <>
      <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  molecule: (
    <>
      <circle cx="12" cy="6" r="2.5" />
      <circle cx="5.5" cy="17" r="2.5" />
      <circle cx="18.5" cy="17" r="2.5" />
      <path d="M10.7 8.2l-3.9 6.6M13.3 8.2l3.9 6.6M8 17h8" />
    </>
  ),
  redox: (
    <>
      <path d="M21 12a9 9 0 0 0-15-6.7L3 8" />
      <path d="M3 3v5h5" />
      <path d="M3 12a9 9 0 0 0 15 6.7l3-2.7" />
      <path d="M16 16h5v5" />
    </>
  ),
  flame: (
    <path d="M12 3c1 3.5 5 5.5 5 10a5 5 0 0 1-10 0c0-2 1-3.2 2-4.2.2 1.2.8 2 1.6 2.4C10.2 8.6 10.5 5.5 12 3z" />
  ),
  gauge: (
    <>
      <path d="M4 17a8 8 0 1 1 16 0" />
      <path d="M12 17l4-5" />
      <circle cx="12" cy="17" r="1.2" />
    </>
  ),
  equilibrium: (
    <>
      <path d="M4 8h16M16 4l4 4-4 4" />
      <path d="M20 16H4M8 12l-4 4 4 4" />
    </>
  ),
  pattern: (
    <>
      <rect x="3.5" y="3.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="3.5" width="5" height="5" rx="1" />
      <rect x="15.5" y="3.5" width="5" height="5" rx="1" />
      <rect x="3.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="3.5" y="15.5" width="5" height="5" rx="1" />
    </>
  ),
  industry: <path d="M3 21V11l6 4v-4l6 4V5h4v16z" />,
  analytical: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M20 20l-4.8-4.8" />
      <path d="M8 11.5l1.8-2 1.6 1.6 1.6-2" />
    </>
  ),
  leaf: (
    <>
      <path d="M5 19c0-9 5-14 15-14 0 10-5 15-14 15" />
      <path d="M5 19l8-8" />
    </>
  ),
  grid: (
    <>
      <rect x="4" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" />
      <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" />
      <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" />
    </>
  ),
  default: (
    <>
      <path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" />
      <circle cx="12" cy="12" r="1.5" />
    </>
  ),
};

// <TopicIcon topic="MW1" size={20} />   or   <TopicIcon name="flask" />
export function TopicIcon({ topic, name, size = 20 }) {
  const iconName = name || (topic ? getTopicMeta(topic)?.icon : '');
  const body = ICONS[iconName] || ICONS.default;
  return (
    <svg {...base} width={size} height={size}>
      {body}
    </svg>
  );
}