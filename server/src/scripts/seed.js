/**
 * Seed MongoDB with ASEAN tourism sites and write sites.seed.json.
 * Usage: node src/scripts/seed.js
 * Requires MONGODB_URI in server/.env (defaults to local).
 */
require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Site = require('../models/Site');
const { buildSites } = require('../data/sitesData');

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/asean_tourism';

async function main() {
  const sites = buildSites();

  const jsonPath = path.join(__dirname, '../data/sites.seed.json');
  fs.writeFileSync(jsonPath, JSON.stringify(sites, null, 2), 'utf8');
  console.log(`Wrote ${sites.length} sites to ${jsonPath}`);

  await mongoose.connect(MONGODB_URI);
  console.log('Connected to', MONGODB_URI);

  await Site.deleteMany({});
  await Site.insertMany(sites, { ordered: false });
  console.log(`Inserted ${sites.length} documents into sites collection.`);

  const byCountry = await Site.aggregate([
    { $group: { _id: '$country', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);
  const byCategory = await Site.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
  ]);

  console.log('\n=== Sites per country ===');
  byCountry.forEach((r) => console.log(`  ${r._id}: ${r.count}`));
  console.log('\n=== Sites per category ===');
  byCategory.forEach((r) => console.log(`  ${r._id}: ${r.count}`));
  console.log(`\nTotal: ${sites.length}`);

  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  try {
    await mongoose.disconnect();
  } catch (_) {
    /* ignore */
  }
  process.exit(1);
});
