/**
 * Fixed category -> types map for ASEAN Tourism Dashboard.
 * Keep this list consistent across validation, seed data, and API meta.
 */
const CATEGORY_TYPES = {
  'Pagodas & Temples': [
    'Golden Stupa',
    'Temple Complex',
    'Cave Temple',
    'Monastery',
    'Pilgrimage Site/Ruins',
  ],
  Markets: [
    'Night Market',
    'Floating Market',
    'Wet Market',
    'Flea Market',
    'Street Market',
  ],
  Beaches: [
    'White Sand',
    'Diving/Snorkeling',
    'Surfing',
    'Resort Beach',
    'Rocky Coast',
  ],
  'Mountains & Highlands': [
    'Trekking Peak',
    'Volcanic',
    'Sacred Mountain',
    'Viewpoint/Hill Station',
  ],
  Waterfalls: ['Multi-tier', 'Single Drop', 'Cave Waterfall'],
  'Heritage & Ruins': [
    'Ancient City',
    'Colonial Architecture',
    'UNESCO Site',
  ],
  Islands: ['Private Island', 'Island Group', 'National Marine Park'],
  'Lakes & Rivers': ['Crater Lake', 'River Delta', 'Scenic River Cruise'],
};

const COUNTRIES = [
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

const ENTRANCE_FEES = ['free', 'low', 'medium', 'high'];

const CATEGORIES = Object.keys(CATEGORY_TYPES);

function isValidCategoryType(category, type) {
  const types = CATEGORY_TYPES[category];
  return Array.isArray(types) && types.includes(type);
}

function getTypesForCategory(category) {
  return CATEGORY_TYPES[category] || [];
}

module.exports = {
  CATEGORY_TYPES,
  CATEGORIES,
  COUNTRIES,
  ENTRANCE_FEES,
  isValidCategoryType,
  getTypesForCategory,
};
