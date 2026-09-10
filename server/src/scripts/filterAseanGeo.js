const fs = require('fs');
const path = require('path');

const raw = JSON.parse(
  fs.readFileSync(path.join(process.env.TEMP, 'countries.geojson'), 'utf8')
);

const want = {
  Myanmar: ['Myanmar', 'Burma'],
  Thailand: ['Thailand'],
  Vietnam: ['Vietnam', 'Viet Nam'],
  Laos: ['Laos', "Lao People's Democratic Republic", 'Lao PDR'],
  Cambodia: ['Cambodia'],
  Malaysia: ['Malaysia'],
  Singapore: ['Singapore'],
  Indonesia: ['Indonesia'],
  Philippines: ['Philippines'],
  Brunei: ['Brunei', 'Brunei Darussalam'],
  'Timor-Leste': ['Timor-Leste', 'East Timor', 'Timor Leste'],
};

const features = [];
for (const f of raw.features) {
  const n =
    f.properties.name ||
    f.properties.ADMIN ||
    f.properties.NAME ||
    f.properties.NAME_EN ||
    '';
  for (const [std, aliases] of Object.entries(want)) {
    if (aliases.some((a) => a.toLowerCase() === String(n).toLowerCase())) {
      features.push({
        type: 'Feature',
        properties: { name: std },
        geometry: f.geometry,
      });
      break;
    }
  }
}

console.log(
  'found',
  features.map((f) => f.properties.name).sort().join(', '),
  'count',
  features.length
);

const out = path.join(
  __dirname,
  '../../../client/public/asean-countries.geojson'
);
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(
  out,
  JSON.stringify({ type: 'FeatureCollection', features })
);
console.log('wrote', out);
