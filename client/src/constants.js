export const CATEGORY_COLORS = {
  'Pagodas & Temples': '#f0c14b',
  Markets: '#e07a3d',
  Beaches: '#3dd6c6',
  'Mountains & Highlands': '#6ecf8e',
  Waterfalls: '#5eb3e8',
  'Heritage & Ruins': '#d4a574',
  Islands: '#7ec8e3',
  'Lakes & Rivers': '#4a90d9',
};

export const CATEGORY_ICONS = {
  'Pagodas & Temples': '🛕',
  Markets: '🛒',
  Beaches: '🏖️',
  'Mountains & Highlands': '⛰️',
  Waterfalls: '💧',
  'Heritage & Ruins': '🏛️',
  Islands: '🏝️',
  'Lakes & Rivers': '🌊',
};

/** Flat country fills inspired by the ASEAN map reference */
export const COUNTRY_COLORS = {
  Myanmar: '#e85d9a',
  Thailand: '#b39ddb',
  Vietnam: '#f5e6a3',
  Laos: '#7cbf4a',
  Cambodia: '#f4a261',
  Malaysia: '#e09f5a',
  Singapore: '#ffd166',
  Indonesia: '#e76f8c',
  Philippines: '#f284b8',
  Brunei: '#90e0ef',
  'Timor-Leste': '#c77dff',
};

export const COUNTRIES = [
  'Myanmar',
  'Thailand',
  'Vietnam',
  'Laos',
  'Cambodia',
  'Malaysia',
  'Singapore',
  'Indonesia',
  'Philippines',
  'Brunei',
  'Timor-Leste',
];

export const ASEAN_CENTER = [8.5, 108];
export const ASEAN_BOUNDS = [
  [-12, 92],
  [29, 142],
];

export function formatVisitors(n) {
  if (n == null) return '—';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export function latestVisitors(site) {
  if (!site?.yearlyVisitors?.length) return null;
  const sorted = [...site.yearlyVisitors].sort((a, b) => a.year - b.year);
  return sorted[sorted.length - 1];
}
