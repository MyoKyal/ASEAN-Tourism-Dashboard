/**
 * Seed site definitions for ASEAN Tourism Dashboard.
 * dataProvenance: "real" = well-known place name; "invented" = plausible filler for course coverage.
 * Visitor numbers are synthetic / AI-approximated for coursework — not official tourism stats.
 */

function slugify(name, country) {
  return `${name}-${country}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/** Build 2019–2023 series with COVID dip and recovery */
function visitors(base2019, opts = {}) {
  const {
    dip2020 = 0.28,
    dip2021 = 0.35,
    recover2022 = 0.72,
    recover2023 = 0.95,
    jitter = 0.08,
  } = opts;
  const j = (n) => Math.round(n * (1 + (Math.random() - 0.5) * jitter));
  return [
    { year: 2019, visitors: j(base2019) },
    { year: 2020, visitors: j(base2019 * dip2020) },
    { year: 2021, visitors: j(base2019 * dip2021) },
    { year: 2022, visitors: j(base2019 * recover2022) },
    { year: 2023, visitors: j(base2019 * recover2023) },
  ];
}

/**
 * [name, country, category, type, lng, lat, description, establishedYear,
 *  baseVisitors, rating, entranceFee, tags, imageQuery, provenance]
 */
const RAW = [
  // —— Myanmar Pagodas & Temples (strong) ——
  ['Shwedagon Pagoda', 'Myanmar', 'Pagodas & Temples', 'Golden Stupa', 96.1498, 16.7984, 'Iconic gilded stupa dominating the Yangon skyline; Myanmar\'s most sacred Buddhist site.', 585, 2500000, 4.8, 'medium', ['yangon', 'buddhist', 'landmark'], 'Shwedagon Pagoda Yangon golden stupa', 'real'],
  ['Bagan Temple Complex', 'Myanmar', 'Pagodas & Temples', 'Temple Complex', 94.875, 21.1667, 'Thousands of temples and pagodas across the ancient Bagan plain along the Ayeyarwady.', 849, 800000, 4.9, 'medium', ['bagan', 'unesco', 'plains'], 'Bagan temples Myanmar aerial', 'real'],
  ['Kyaiktiyo Golden Rock', 'Myanmar', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 97.1667, 17.4817, 'Precariously balanced gilded boulder pagoda — major pilgrimage destination in Mon State.', 1100, 450000, 4.7, 'low', ['pilgrimage', 'mon-state'], 'Golden Rock Kyaiktiyo Myanmar', 'real'],
  ['Mahamuni Buddha Temple', 'Myanmar', 'Pagodas & Temples', 'Temple Complex', 96.078, 21.953, 'Revered ancient Buddha image in Mandalay, continuously covered by devotees\' gold leaf.', 1784, 600000, 4.6, 'free', ['mandalay', 'buddha'], 'Mahamuni Temple Mandalay', 'real'],
  ['Sule Pagoda', 'Myanmar', 'Pagodas & Temples', 'Golden Stupa', 96.1565, 16.7743, 'Historic stupa at the heart of downtown Yangon, said to enshrine a hair of the Buddha.', 250, 320000, 4.4, 'free', ['yangon', 'city'], 'Sule Pagoda Yangon', 'real'],
  ['Shwezigon Pagoda', 'Myanmar', 'Pagodas & Temples', 'Golden Stupa', 94.862, 21.195, 'Prototype of Burmese stupas in Nyaung-U near Bagan, associated with early Bagan kings.', 1086, 280000, 4.5, 'low', ['bagan', 'nyaung-u'], 'Shwezigon Pagoda Bagan', 'real'],
  ['Ananda Temple', 'Myanmar', 'Pagodas & Temples', 'Temple Complex', 94.867, 21.171, 'Finest surviving temple of early Bagan, known for four standing Buddha images.', 1105, 220000, 4.7, 'low', ['bagan', 'architecture'], 'Ananda Temple Bagan', 'real'],
  ['Pindaya Cave Temple', 'Myanmar', 'Pagodas & Temples', 'Cave Temple', 96.676, 20.841, 'Limestone cave packed with thousands of Buddha images overlooking Pindaya town.', 1773, 95000, 4.5, 'low', ['shan', 'cave'], 'Pindaya Caves Myanmar', 'real'],
  ['Shwe Yan Pyay Monastery', 'Myanmar', 'Pagodas & Temples', 'Monastery', 96.8, 20.65, 'Teak monastery near Nyaungshwe famous for its oval windows overlooking Inle approaches.', 1882, 75000, 4.3, 'free', ['inle', 'teak'], 'Shwe Yan Pyay Monastery', 'real'],
  ['Inle Lake Stupa Trail', 'Myanmar', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 96.91, 20.55, 'Cluster of lakeside and hill stupas around Inle, including Phaung Daw Oo approaches.', 1200, 180000, 4.4, 'low', ['inle', 'shan'], 'Inle Lake pagodas Myanmar', 'real'],
  ['Kaunghmudaw Pagoda', 'Myanmar', 'Pagodas & Temples', 'Golden Stupa', 95.98, 21.9, 'Massive white dome pagoda near Sagaing, modeled after Sri Lanka\'s Ruwanwelisaya.', 1636, 110000, 4.2, 'free', ['sagaing'], 'Kaunghmudaw Pagoda Sagaing', 'real'],
  ['Po Win Daung Caves', 'Myanmar', 'Pagodas & Temples', 'Cave Temple', 94.43, 22.05, 'Hillside cave temples near Monywa with mural-covered chambers and Buddha images.', 1300, 65000, 4.3, 'low', ['monywa', 'murals'], 'Po Win Daung caves', 'real'],
  ['Mingun Pahtodawgyi', 'Myanmar', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 96.01, 22.05, 'Unfinished giant brick stupa ruin across the river from Mandalay, earthquake-scarred.', 1790, 140000, 4.4, 'low', ['mingun', 'ruins'], 'Mingun Pagoda Myanmar', 'real'],
  ['Kyaikthanlan Pagoda', 'Myanmar', 'Pagodas & Temples', 'Golden Stupa', 97.63, 16.48, 'Tall golden stupa overlooking Mawlamyine and the estuary.', 875, 85000, 4.3, 'free', ['mawlamyine'], 'Kyaikthanlan Pagoda Mawlamyine', 'real'],
  ['Thanboddhay Temple', 'Myanmar', 'Pagodas & Temples', 'Temple Complex', 95.15, 22.12, 'Temple complex near Monywa covered with tens of thousands of small Buddha images.', 1939, 70000, 4.2, 'low', ['monywa'], 'Thanboddhay Temple', 'real'],

  // Myanmar other categories
  ['Bogyoke Aung San Market', 'Myanmar', 'Markets', 'Street Market', 96.155, 16.78, 'Colonial-era covered market in Yangon for gems, textiles, and souvenirs.', 1926, 900000, 4.3, 'free', ['yangon', 'shopping'], 'Bogyoke Market Yangon', 'real'],
  ['Ngapali Beach', 'Myanmar', 'Beaches', 'Resort Beach', 94.33, 18.43, 'Palm-lined Bay of Bengal beach known as Myanmar\'s premier resort stretch.', 0, 120000, 4.6, 'free', ['rakhine', 'resort'], 'Ngapali Beach Myanmar', 'real'],
  ['Mount Victoria Nat Ma Taung', 'Myanmar', 'Mountains & Highlands', 'Trekking Peak', 93.9, 21.23, 'Highest peak in Chin State with rare birdlife and highland villages.', 0, 25000, 4.5, 'low', ['chin', 'trek'], 'Nat Ma Taung Mount Victoria', 'real'],
  ['Anisakan Falls', 'Myanmar', 'Waterfalls', 'Multi-tier', 96.5, 21.98, 'Multi-tier waterfall near Pyin Oo Lwin popular for day trips from Mandalay.', 0, 40000, 4.2, 'free', ['pyin-oo-lwin'], 'Anisakan Falls Myanmar', 'real'],
  ['Mrauk U Ruins', 'Myanmar', 'Heritage & Ruins', 'Ancient City', 93.2, 20.6, 'Former Arakanese capital with stone temples scattered across rural hills.', 1430, 55000, 4.6, 'low', ['rakhine', 'ruins'], 'Mrauk U Myanmar ruins', 'real'],
  ['Mergui Archipelago', 'Myanmar', 'Islands', 'Island Group', 98.0, 11.5, 'Remote Andaman island group with diving, beaches, and Moken communities.', 0, 18000, 4.7, 'high', ['andaman', 'diving'], 'Mergui Archipelago Myanmar', 'real'],
  ['Inle Lake', 'Myanmar', 'Lakes & Rivers', 'Scenic River Cruise', 96.92, 20.55, 'Highland lake famous for floating gardens and leg-rowing fishermen.', 0, 350000, 4.7, 'low', ['shan', 'lake'], 'Inle Lake Myanmar fishermen', 'real'],
  ['Yangon Night Bazaar', 'Myanmar', 'Markets', 'Night Market', 96.16, 16.79, 'Evening street market stretch near downtown Yangon with street food stalls.', 2010, 200000, 4.1, 'free', ['yangon', 'food'], 'Yangon night market street food', 'invented'],
  ['Chaung Tha Beach', 'Myanmar', 'Beaches', 'White Sand', 94.45, 17.0, 'Popular domestic beach destination west of Yangon with sandy shores.', 0, 180000, 4.0, 'free', ['ayingyi'], 'Chaung Tha Beach Myanmar', 'real'],

  // —— Thailand ——
  ['Wat Pho', 'Thailand', 'Pagodas & Temples', 'Temple Complex', 100.494, 13.746, 'Bangkok temple home to the giant Reclining Buddha and traditional massage school.', 1788, 3500000, 4.7, 'low', ['bangkok', 'buddha'], 'Wat Pho Reclining Buddha', 'real'],
  ['Wat Arun', 'Thailand', 'Pagodas & Temples', 'Temple Complex', 100.489, 13.744, 'Temple of Dawn on the Chao Phraya with intricate porcelain-decorated prang.', 1656, 2800000, 4.8, 'low', ['bangkok', 'river'], 'Wat Arun Bangkok', 'real'],
  ['Doisuthep Temple', 'Thailand', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 98.921, 18.805, 'Hilltop wat overlooking Chiang Mai, reached by a long naga staircase.', 1383, 1200000, 4.6, 'low', ['chiang-mai'], 'Doi Suthep Chiang Mai', 'real'],
  ['White Temple Wat Rong Khun', 'Thailand', 'Pagodas & Temples', 'Temple Complex', 99.763, 19.824, 'Contemporary white mirrored temple near Chiang Rai by artist Chalermchai Kositpipat.', 1997, 900000, 4.5, 'low', ['chiang-rai', 'art'], 'Wat Rong Khun White Temple', 'real'],
  ['Wat Phra Kaew', 'Thailand', 'Pagodas & Temples', 'Temple Complex', 100.4927, 13.751, 'Temple of the Emerald Buddha within Bangkok\'s Grand Palace complex.', 1782, 4000000, 4.8, 'medium', ['bangkok', 'emerald-buddha'], 'Wat Phra Kaew Emerald Buddha', 'real'],
  ['Wat Traimit', 'Thailand', 'Pagodas & Temples', 'Golden Stupa', 100.514, 13.738, 'Temple of the Golden Buddha — solid gold seated Buddha in Chinatown Bangkok.', 0, 900000, 4.6, 'low', ['bangkok', 'chinatown'], 'Wat Traimit Golden Buddha', 'real'],
  ['Wat Benchamabophit', 'Thailand', 'Pagodas & Temples', 'Monastery', 100.5145, 13.7665, 'Marble Temple of Bangkok with Carrara marble and elegant cloisters.', 1899, 450000, 4.5, 'low', ['bangkok', 'marble'], 'Wat Benchamabophit Marble Temple', 'real'],
  ['Wat Phra That Doi Suthep Golden Chedi', 'Thailand', 'Pagodas & Temples', 'Golden Stupa', 98.9215, 18.8048, 'Gilded chedi at Doi Suthep, one of northern Thailand\'s holiest stupas.', 1383, 1100000, 4.7, 'low', ['chiang-mai', 'chedi'], 'Doi Suthep golden chedi', 'real'],
  ['Wat Chedi Luang', 'Thailand', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 98.986, 18.787, 'Massive ruined chedi in Chiang Mai\'s old city, once home to the Emerald Buddha.', 1400, 700000, 4.6, 'free', ['chiang-mai'], 'Wat Chedi Luang Chiang Mai', 'real'],
  ['Wat Phra Singh', 'Thailand', 'Pagodas & Temples', 'Temple Complex', 98.981, 18.7885, 'Important Lanna-style temple housing the revered Phra Singh Buddha image.', 1345, 550000, 4.5, 'free', ['chiang-mai', 'lanna'], 'Wat Phra Singh Chiang Mai', 'real'],
  ['Blue Temple Wat Rong Suea Ten', 'Thailand', 'Pagodas & Temples', 'Temple Complex', 99.803, 19.915, 'Vivid blue contemporary temple in Chiang Rai with ornate modern Buddhist art.', 2005, 650000, 4.5, 'free', ['chiang-rai', 'blue-temple'], 'Wat Rong Suea Ten Blue Temple', 'real'],
  ['Wat Phra That Lampang Luang', 'Thailand', 'Pagodas & Temples', 'Temple Complex', 99.4, 18.22, 'Ancient fortified temple complex near Lampang with teak chapels and a sacred chedi.', 0, 280000, 4.6, 'free', ['lampang'], 'Wat Phra That Lampang Luang', 'real'],
  ['Wat Mahathat Bangkok', 'Thailand', 'Pagodas & Temples', 'Monastery', 100.49, 13.755, 'Royal monastery and Buddhist university near the Grand Palace.', 1782, 200000, 4.3, 'free', ['bangkok'], 'Wat Mahathat Bangkok', 'real'],
  ['Phra Pathom Chedi', 'Thailand', 'Pagodas & Temples', 'Golden Stupa', 100.119, 13.819, 'Tallest stupa in Thailand at Nakhon Pathom, a major Buddhist pilgrimage site.', 0, 500000, 4.6, 'low', ['nakhon-pathom'], 'Phra Pathom Chedi', 'real'],
  ['Wat Phu Khao Thong Golden Mount', 'Thailand', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 100.514, 13.753, 'Golden Mount chedi offering panoramic views over historic Bangkok.', 0, 600000, 4.4, 'low', ['bangkok'], 'Wat Saket Golden Mount', 'real'],
  ['Wat Chaiwatthanaram', 'Thailand', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 100.539, 14.343, 'Riverside Khmer-influenced prang temple ruin in Ayutthaya.', 1630, 400000, 4.7, 'low', ['ayutthaya'], 'Wat Chaiwatthanaram Ayutthaya', 'real'],
  ['Chatuchak Weekend Market', 'Thailand', 'Markets', 'Flea Market', 100.55, 13.8, 'One of the world\'s largest weekend markets with thousands of stalls in Bangkok.', 1948, 5000000, 4.4, 'free', ['bangkok', 'shopping'], 'Chatuchak Market Bangkok', 'real'],
  ['Damnoen Saduak Floating Market', 'Thailand', 'Markets', 'Floating Market', 99.959, 13.518, 'Iconic canal market west of Bangkok with boat vendors selling produce and snacks.', 0, 1500000, 4.2, 'free', ['ratchaburi', 'boats'], 'Damnoen Saduak floating market', 'real'],
  ['Chiang Mai Night Bazaar', 'Thailand', 'Markets', 'Night Market', 98.999, 18.787, 'Long-running night market corridor for crafts, clothes, and northern Thai food.', 0, 1800000, 4.3, 'free', ['chiang-mai'], 'Chiang Mai Night Bazaar', 'real'],
  ['Maya Bay', 'Thailand', 'Beaches', 'White Sand', 98.778, 7.677, 'Famous Phi Phi beach framed by limestone cliffs; periodically closed for recovery.', 0, 800000, 4.6, 'medium', ['phi-phi', 'limestone'], 'Maya Bay Phi Phi', 'real'],
  ['Railay Beach', 'Thailand', 'Beaches', 'Rocky Coast', 98.84, 8.01, 'Clifftop-access beach peninsula near Krabi prized for climbing and kayaking.', 0, 600000, 4.7, 'free', ['krabi', 'climbing'], 'Railay Beach Krabi', 'real'],
  ['Patong Beach', 'Thailand', 'Beaches', 'Resort Beach', 98.296, 7.896, 'Bustling Phuket resort beach with nightlife and water sports.', 0, 2200000, 4.0, 'free', ['phuket'], 'Patong Beach Phuket', 'real'],
  ['Surin Beach', 'Thailand', 'Beaches', 'Surfing', 98.275, 7.983, 'Quieter Phuket beach with seasonal surf breaks and boutique resorts.', 0, 350000, 4.4, 'free', ['phuket', 'surf'], 'Surin Beach Phuket', 'real'],
  ['Similan Islands', 'Thailand', 'Beaches', 'Diving/Snorkeling', 97.645, 8.65, 'Andaman dive paradise with granite boulders and clear coral gardens.', 0, 280000, 4.8, 'high', ['andaman', 'diving'], 'Similan Islands diving', 'real'],
  ['Doi Inthanon', 'Thailand', 'Mountains & Highlands', 'Trekking Peak', 98.487, 18.588, 'Thailand\'s highest peak with cloud forests, waterfalls, and twin chedis.', 0, 450000, 4.6, 'low', ['chiang-mai', 'summit'], 'Doi Inthanon summit', 'real'],
  ['Tee Lor Su Waterfall', 'Thailand', 'Waterfalls', 'Multi-tier', 98.73, 15.93, 'One of Thailand\'s largest and most dramatic multi-tier jungle waterfalls.', 0, 120000, 4.7, 'low', ['tak', 'jungle'], 'Tee Lor Su waterfall', 'real'],
  ['Ayutthaya Historic Park', 'Thailand', 'Heritage & Ruins', 'UNESCO Site', 100.569, 14.355, 'Ruins of the former Siamese capital with towering prangs and Buddha images.', 1350, 1600000, 4.7, 'low', ['ayutthaya', 'unesco'], 'Ayutthaya Historic Park', 'real'],
  ['Sukhothai Historical Park', 'Thailand', 'Heritage & Ruins', 'Ancient City', 99.79, 17.01, 'Cradle of Thai civilization with serene Buddha statues among temple ruins.', 1238, 500000, 4.6, 'low', ['sukhothai', 'unesco'], 'Sukhothai Historical Park', 'real'],
  ['Phi Phi Islands', 'Thailand', 'Islands', 'Island Group', 98.78, 7.74, 'Limestone island group in the Andaman with beaches, viewpoints, and diving.', 0, 1400000, 4.5, 'medium', ['krabi', 'andaman'], 'Phi Phi Islands Thailand', 'real'],
  ['Chao Phraya River Cruise', 'Thailand', 'Lakes & Rivers', 'Scenic River Cruise', 100.49, 13.75, 'Evening and daytime cruises past Bangkok temples and colonial facades.', 0, 900000, 4.3, 'medium', ['bangkok', 'river'], 'Chao Phraya dinner cruise', 'real'],

  // —— Vietnam ——
  ['Perfume Pagoda', 'Vietnam', 'Pagodas & Temples', 'Cave Temple', 105.75, 20.62, 'Pilgrimage complex of shrines and a fragrant limestone cave southwest of Hanoi.', 0, 800000, 4.4, 'low', ['hanoi', 'pilgrimage'], 'Perfume Pagoda Vietnam', 'real'],
  ['One Pillar Pagoda', 'Vietnam', 'Pagodas & Temples', 'Monastery', 105.833, 21.035, 'Iconic wooden lotus-shaped pagoda rising from a pond in Hanoi.', 1049, 600000, 4.3, 'free', ['hanoi'], 'One Pillar Pagoda Hanoi', 'real'],
  ['Ben Thanh Market', 'Vietnam', 'Markets', 'Wet Market', 106.698, 10.772, 'Saigon\'s landmark covered market for food, crafts, and late-night stalls.', 1914, 2500000, 4.2, 'free', ['ho-chi-minh'], 'Ben Thanh Market Saigon', 'real'],
  ['Hoi An Night Market', 'Vietnam', 'Markets', 'Night Market', 108.332, 15.877, 'Lantern-lit riverside night market in the ancient town of Hoi An.', 0, 1100000, 4.5, 'free', ['hoi-an'], 'Hoi An night market lanterns', 'real'],
  ['My Khe Beach', 'Vietnam', 'Beaches', 'White Sand', 108.246, 16.06, 'Long sandy beach at Da Nang popular with surfers and city visitors.', 0, 900000, 4.4, 'free', ['da-nang'], 'My Khe Beach Da Nang', 'real'],
  ['Phu Quoc', 'Vietnam', 'Beaches', 'Resort Beach', 103.98, 10.23, 'Island resort beaches in the Gulf of Thailand with snorkeling and nightlife.', 0, 1500000, 4.5, 'free', ['phu-quoc'], 'Phu Quoc beach Vietnam', 'real'],
  ['Sapa Terraces', 'Vietnam', 'Mountains & Highlands', 'Viewpoint/Hill Station', 103.844, 22.34, 'Misty highland town and rice terrace treks among Hmong and Dao villages.', 0, 700000, 4.7, 'low', ['sapa', 'trek'], 'Sapa rice terraces Vietnam', 'real'],
  ['Fansipan Peak', 'Vietnam', 'Mountains & Highlands', 'Trekking Peak', 103.775, 22.303, 'Indochina\'s roof — cable car or trek to the summit above Sapa.', 0, 450000, 4.6, 'medium', ['sapa', 'summit'], 'Fansipan Peak Vietnam', 'real'],
  ['Ban Gioc Waterfall', 'Vietnam', 'Waterfalls', 'Multi-tier', 106.72, 22.85, 'Wide multi-tier falls on the Vietnam–China border in Cao Bang.', 0, 200000, 4.8, 'low', ['cao-bang'], 'Ban Gioc Waterfall', 'real'],
  ['Ha Long Bay', 'Vietnam', 'Heritage & Ruins', 'UNESCO Site', 107.05, 20.91, 'Karst seascape of thousands of limestone islets — Vietnam\'s signature cruise.', 0, 4000000, 4.9, 'medium', ['unesco', 'cruise'], 'Ha Long Bay Vietnam', 'real'],
  ['Hoi An Ancient Town', 'Vietnam', 'Heritage & Ruins', 'UNESCO Site', 108.328, 15.88, 'Lantern-lit trading port with Chinese, Japanese, and French architectural layers.', 0, 2200000, 4.8, 'low', ['unesco', 'lanterns'], 'Hoi An Ancient Town', 'real'],
  ['Hue Imperial City', 'Vietnam', 'Heritage & Ruins', 'Ancient City', 107.578, 16.47, 'Nguyen Dynasty citadel and palace complex along the Perfume River.', 1802, 1200000, 4.6, 'medium', ['hue', 'unesco'], 'Hue Imperial City', 'real'],
  ['Con Dao Islands', 'Vietnam', 'Islands', 'National Marine Park', 106.6, 8.68, 'Remote national park islands with prisons history, beaches, and diving.', 0, 120000, 4.7, 'medium', ['con-dao'], 'Con Dao Islands Vietnam', 'real'],
  ['Mekong Delta Cruise', 'Vietnam', 'Lakes & Rivers', 'River Delta', 105.95, 10.35, 'Floating markets and orchard canals of the Mekong Delta near Can Tho.', 0, 800000, 4.4, 'medium', ['mekong', 'delta'], 'Mekong Delta floating market', 'real'],
  ['Perfume River Hue', 'Vietnam', 'Lakes & Rivers', 'Scenic River Cruise', 107.58, 16.47, 'Scenic boat rides past pagodas and royal tombs in Hue.', 0, 500000, 4.3, 'low', ['hue', 'river'], 'Perfume River Hue cruise', 'real'],

  // —— Cambodia ——
  ['Angkor Wat', 'Cambodia', 'Heritage & Ruins', 'UNESCO Site', 103.867, 13.4125, 'World\'s largest religious monument — Khmer temple city at sunrise.', 1150, 2500000, 4.9, 'high', ['siem-reap', 'unesco'], 'Angkor Wat sunrise', 'real'],
  ['Angkor Thom', 'Cambodia', 'Heritage & Ruins', 'Ancient City', 103.859, 13.441, 'Walled royal city including Bayon\'s smiling faces and Terrace of the Elephants.', 1181, 1800000, 4.8, 'high', ['siem-reap'], 'Angkor Thom Bayon', 'real'],
  ['Ta Prohm', 'Cambodia', 'Heritage & Ruins', 'UNESCO Site', 103.889, 13.435, 'Temple overtaken by silk-cotton tree roots — atmospheric jungle ruin.', 1186, 1600000, 4.8, 'high', ['siem-reap', 'roots'], 'Ta Prohm temple trees', 'real'],
  ['Wat Phnom', 'Cambodia', 'Pagodas & Temples', 'Temple Complex', 104.923, 11.576, 'Hilltop pagoda that gave Phnom Penh its name.', 1373, 400000, 4.2, 'free', ['phnom-penh'], 'Wat Phnom Phnom Penh', 'real'],
  ['Silver Pagoda', 'Cambodia', 'Pagodas & Temples', 'Temple Complex', 104.931, 11.563, 'Royal Palace temple with silver-tiled floor and emerald Buddha.', 1866, 550000, 4.5, 'medium', ['phnom-penh', 'royal'], 'Silver Pagoda Phnom Penh', 'real'],
  ['Bayon Temple', 'Cambodia', 'Pagodas & Temples', 'Temple Complex', 103.859, 13.4415, 'Angkor Thom state temple famous for serene stone faces of Avalokitesvara.', 1181, 1500000, 4.8, 'high', ['angkor', 'bayon'], 'Bayon Temple faces Angkor', 'real'],
  ['Banteay Srei', 'Cambodia', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 103.963, 13.599, 'Pink sandstone citadel of women — exquisite Hindu carvings near Angkor.', 967, 700000, 4.8, 'medium', ['angkor', 'banteay-srei'], 'Banteay Srei Cambodia', 'real'],
  ['Preah Khan', 'Cambodia', 'Pagodas & Temples', 'Monastery', 103.872, 13.462, 'Vast monastic complex at Angkor with overgrown galleries and Buddhist shrines.', 1191, 500000, 4.6, 'high', ['angkor'], 'Preah Khan Angkor', 'real'],
  ['Neak Pean', 'Cambodia', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 103.895, 13.463, 'Island temple in an artificial lake, designed as a Buddhist healing sanctuary.', 0, 350000, 4.5, 'high', ['angkor'], 'Neak Pean Angkor', 'real'],
  ['Wat Ounalom', 'Cambodia', 'Pagodas & Temples', 'Monastery', 104.928, 11.569, 'Headquarters of Cambodian Buddhism on the Phnom Penh riverside.', 1443, 180000, 4.3, 'free', ['phnom-penh'], 'Wat Ounalom Phnom Penh', 'real'],
  ['Wat Nokor Bachey', 'Cambodia', 'Pagodas & Temples', 'Temple Complex', 105.45, 11.99, '11th-century temple near Kampong Cham with later Buddhist additions.', 0, 70000, 4.2, 'low', ['kampong-cham'], 'Wat Nokor Cambodia', 'real'],
  ['Phnom Chisor Temple', 'Cambodia', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 104.82, 11.18, 'Hilltop Angkorian temple south of Phnom Penh with panoramic views.', 0, 90000, 4.4, 'low', ['takeo'], 'Phnom Chisor temple', 'real'],
  ['Wat Botum', 'Cambodia', 'Pagodas & Temples', 'Monastery', 104.929, 11.556, 'Historic Phnom Penh monastery near the Royal Palace, active for local worship.', 0, 120000, 4.1, 'free', ['phnom-penh'], 'Wat Botum Phnom Penh', 'real'],
  ['Psar Thmei Central Market', 'Cambodia', 'Markets', 'Street Market', 104.921, 11.57, 'Art Dec dome market in Phnom Penh for jewelry, clothes, and food.', 1937, 700000, 4.1, 'free', ['phnom-penh'], 'Central Market Phnom Penh', 'real'],
  ['Phsar Chas Night Market', 'Cambodia', 'Markets', 'Night Market', 104.925, 11.568, 'Riverside night market near Phnom Penh\'s old quarter.', 0, 350000, 4.0, 'free', ['phnom-penh'], 'Phnom Penh night market', 'invented'],
  ['Otres Beach', 'Cambodia', 'Beaches', 'White Sand', 103.58, 10.57, 'Quieter sandy beach south of Sihanoukville\'s busier strips.', 0, 280000, 4.3, 'free', ['sihanoukville'], 'Otres Beach Cambodia', 'real'],
  ['Koh Rong', 'Cambodia', 'Islands', 'Island Group', 103.3, 10.7, 'Gulf of Thailand island with white beaches and backpacker hubs.', 0, 400000, 4.5, 'free', ['koh-rong'], 'Koh Rong Cambodia', 'real'],
  ['Kulen Waterfall', 'Cambodia', 'Waterfalls', 'Multi-tier', 104.1, 13.6, 'Sacred mountain waterfall near Siem Reap with carving riverbed upstream.', 0, 180000, 4.3, 'low', ['kulen', 'siem-reap'], 'Kulen Waterfall Cambodia', 'real'],
  ['Bokor Hill Station', 'Cambodia', 'Mountains & Highlands', 'Viewpoint/Hill Station', 104.02, 10.63, 'Foggy colonial hill station ruins and casino plateau above Kampot.', 1925, 150000, 4.2, 'medium', ['kampot', 'colonial'], 'Bokor Hill Station', 'real'],
  ['Tonle Sap Lake', 'Cambodia', 'Lakes & Rivers', 'Scenic River Cruise', 104.05, 12.85, 'Southeast Asia\'s largest freshwater lake with floating villages.', 0, 600000, 4.4, 'low', ['tonle-sap'], 'Tonle Sap floating village', 'real'],

  // —— Laos ——
  ['Wat Xieng Thong', 'Laos', 'Pagodas & Temples', 'Temple Complex', 102.156, 19.897, 'Luang Prabang\'s most exquisite temple with mosaic tree of life rear wall.', 1560, 350000, 4.7, 'low', ['luang-prabang'], 'Wat Xieng Thong', 'real'],
  ['Pha That Luang', 'Laos', 'Pagodas & Temples', 'Golden Stupa', 102.636, 17.978, 'National symbol of Laos — grand golden stupa in Vientiane.', 1566, 280000, 4.5, 'low', ['vientiane'], 'Pha That Luang Vientiane', 'real'],
  ['Wat Mai Suwannaphumaham', 'Laos', 'Pagodas & Temples', 'Temple Complex', 102.14, 19.891, 'Royal temple in Luang Prabang with gilded facade and historic murals.', 1796, 220000, 4.5, 'low', ['luang-prabang'], 'Wat Mai Luang Prabang', 'real'],
  ['Wat Visoun', 'Laos', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 102.145, 19.886, 'One of Luang Prabang\'s oldest temples with the distinctive That Makmo stupa.', 1512, 150000, 4.4, 'low', ['luang-prabang'], 'Wat Visoun That Makmo', 'real'],
  ['Wat Sensoukarahm', 'Laos', 'Pagodas & Temples', 'Monastery', 102.15, 19.895, 'Riverside monastery in Luang Prabang known for morning alms processions.', 0, 100000, 4.3, 'free', ['luang-prabang', 'alms'], 'Wat Sen Luang Prabang', 'real'],
  ['Wat Si Saket', 'Laos', 'Pagodas & Temples', 'Temple Complex', 102.612, 17.963, 'Vientiane temple with cloister walls lined by thousands of Buddha images.', 1818, 200000, 4.5, 'low', ['vientiane'], 'Wat Si Saket Vientiane', 'real'],
  ['Haw Phra Kaew', 'Laos', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 102.6125, 17.9615, 'Former royal temple that once housed the Emerald Buddha, now a museum.', 1565, 180000, 4.4, 'low', ['vientiane'], 'Haw Phra Kaew Vientiane', 'real'],
  ['That Dam Stupa', 'Laos', 'Pagodas & Temples', 'Golden Stupa', 102.615, 17.968, 'Black Stupa legend site in central Vientiane, a quiet local landmark.', 0, 80000, 4.0, 'free', ['vientiane'], 'That Dam Vientiane', 'real'],
  ['Wat Phou Champasak', 'Laos', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 105.82, 14.85, 'UNESCO mountain-side Khmer temple complex overlooking the Mekong plains.', 0, 120000, 4.7, 'low', ['champasak', 'unesco'], 'Wat Phou Champasak', 'real'],
  ['Kuāng Si Falls', 'Laos', 'Waterfalls', 'Multi-tier', 101.99, 19.75, 'Turquoise multi-tier falls and bear rescue center near Luang Prabang.', 0, 400000, 4.8, 'low', ['luang-prabang'], 'Kuang Si Falls Laos', 'real'],
  ['Talat Sao Morning Market', 'Laos', 'Markets', 'Wet Market', 102.61, 17.965, 'Vientiane morning market for textiles, food, and household goods.', 0, 200000, 4.0, 'free', ['vientiane'], 'Talat Sao Vientiane', 'real'],
  ['Night Market Luang Prabang', 'Laos', 'Markets', 'Night Market', 102.135, 19.889, 'Handicraft night market along Sisavangvong Road.', 0, 320000, 4.4, 'free', ['luang-prabang'], 'Luang Prabang night market', 'real'],
  ['Vang Vieng Cliffs', 'Laos', 'Mountains & Highlands', 'Viewpoint/Hill Station', 102.448, 18.923, 'Karst cliffs and lagoon viewpoints above the Nam Song River.', 0, 250000, 4.5, 'low', ['vang-vieng'], 'Vang Vieng lagoon viewpoint', 'real'],
  ['Si Phan Don', 'Laos', 'Islands', 'Island Group', 105.95, 13.95, 'Four Thousand Islands stretch of the Mekong with waterfalls and dolphins.', 0, 180000, 4.4, 'low', ['mekong', '4000-islands'], 'Si Phan Don Laos', 'real'],
  ['Plain of Jars', 'Laos', 'Heritage & Ruins', 'UNESCO Site', 103.16, 19.43, 'Mysterious megalithic stone jar sites across Xieng Khouang plateau.', 0, 90000, 4.5, 'low', ['unesco', 'jars'], 'Plain of Jars Laos', 'real'],
  ['Mekong Sunset Cruise LP', 'Laos', 'Lakes & Rivers', 'Scenic River Cruise', 102.14, 19.89, 'Sunset boat rides on the Mekong at Luang Prabang.', 0, 150000, 4.3, 'medium', ['mekong'], 'Mekong sunset Luang Prabang', 'real'],
  ['Nong Khiaw River Cliffs', 'Laos', 'Lakes & Rivers', 'Scenic River Cruise', 102.53, 20.57, 'Dramatic limestone cliffs along the Nam Ou river north of Luang Prabang.', 0, 80000, 4.6, 'low', ['nong-khiaw'], 'Nong Khiaw Laos', 'real'],
  ['Tad Fane Waterfall', 'Laos', 'Waterfalls', 'Single Drop', 106.65, 15.18, 'Twin waterfall plunge on the Bolaven Plateau.', 0, 70000, 4.5, 'low', ['bolaven'], 'Tad Fane Waterfall Laos', 'real'],
  ['Pakse Riverside Beach', 'Laos', 'Beaches', 'Rocky Coast', 105.8, 15.12, 'Local riverside sandbanks near Pakse used as seasonal bathing spots.', 0, 40000, 3.8, 'free', ['pakse'], 'Pakse Mekong sandbank', 'invented'],

  // —— Malaysia ——
  ['Batu Caves', 'Malaysia', 'Pagodas & Temples', 'Cave Temple', 101.684, 3.238, 'Hindu shrine caves and giant golden Murugan statue near Kuala Lumpur.', 1891, 1800000, 4.5, 'free', ['kl', 'hindu'], 'Batu Caves Malaysia', 'real'],
  ['Kek Lok Si', 'Malaysia', 'Pagodas & Temples', 'Temple Complex', 100.274, 5.399, 'Largest Buddhist temple complex in Malaysia, Penang hillside.', 1890, 700000, 4.6, 'free', ['penang'], 'Kek Lok Si Penang', 'real'],
  ['Petaling Street Market', 'Malaysia', 'Markets', 'Street Market', 101.698, 3.144, 'Kuala Lumpur Chinatown street market for bargains and hawker food.', 0, 1200000, 4.1, 'free', ['kl', 'chinatown'], 'Petaling Street KL', 'real'],
  ['Central Market KL', 'Malaysia', 'Markets', 'Flea Market', 101.695, 3.146, 'Heritage art-deco market for Malaysian crafts and souvenirs.', 1888, 900000, 4.2, 'free', ['kl'], 'Central Market Kuala Lumpur', 'real'],
  ['Perhentian Islands', 'Malaysia', 'Beaches', 'Diving/Snorkeling', 102.77, 5.92, 'East coast islands with turquoise water and coral snorkeling.', 0, 350000, 4.7, 'medium', ['terengganu'], 'Perhentian Islands Malaysia', 'real'],
  ['Langkawi Pantai Cenang', 'Malaysia', 'Beaches', 'Resort Beach', 99.727, 6.293, 'Main resort beach strip on Langkawi with sunset cafes.', 0, 800000, 4.3, 'free', ['langkawi'], 'Pantai Cenang Langkawi', 'real'],
  ['Mount Kinabalu', 'Malaysia', 'Mountains & Highlands', 'Trekking Peak', 116.558, 6.075, 'UNESCO-listed granite massif — Borneo\'s highest summit.', 0, 200000, 4.8, 'high', ['sabah', 'unesco'], 'Mount Kinabalu summit', 'real'],
  ['Cameron Highlands', 'Malaysia', 'Mountains & Highlands', 'Viewpoint/Hill Station', 101.4, 4.47, 'Tea plantations and cool climate hill resorts in Pahang.', 0, 600000, 4.4, 'free', ['pahang', 'tea'], 'Cameron Highlands tea', 'real'],
  ['Melaka Colonial Core', 'Malaysia', 'Heritage & Ruins', 'Colonial Architecture', 102.25, 2.19, 'UNESCO historic city with Dutch Square, A Famosa, and Peranakan shophouses.', 1511, 1100000, 4.5, 'low', ['melaka', 'unesco'], 'Melaka Dutch Square', 'real'],
  ['Sipadan Island', 'Malaysia', 'Islands', 'National Marine Park', 118.63, 4.115, 'World-class wall diving island off Sabah\'s east coast.', 0, 50000, 4.9, 'high', ['sabah', 'diving'], 'Sipadan Island diving', 'real'],
  ['Lake Kenyir', 'Malaysia', 'Lakes & Rivers', 'Crater Lake', 102.75, 5.0, 'Vast man-made lake and rainforest recreation area in Terengganu.', 1985, 120000, 4.2, 'low', ['terengganu'], 'Lake Kenyir Malaysia', 'real'],
  ['Lata Bukit Hijau', 'Malaysia', 'Waterfalls', 'Multi-tier', 100.8, 5.35, 'Forest multi-tier waterfall recreation park in Kedah.', 0, 60000, 4.1, 'free', ['kedah'], 'Lata Bukit Hijau waterfall', 'invented'],

  // —— Singapore ——
  ['Buddha Tooth Relic Temple', 'Singapore', 'Pagodas & Temples', 'Temple Complex', 103.844, 1.2814, 'Tang-style temple museum in Chinatown housing a sacred tooth relic.', 2007, 900000, 4.5, 'free', ['chinatown'], 'Buddha Tooth Relic Temple Singapore', 'real'],
  ['Gardens by the Bay', 'Singapore', 'Heritage & Ruins', 'UNESCO Site', 103.8636, 1.2816, 'Futuristic gardens with Supertrees and Cloud Forest — Singapore\'s modern heritage landmark (visitor figures approximated for coursework).', 2012, 5000000, 4.8, 'medium', ['marina-bay'], 'Gardens by the Bay Supertrees', 'real'],
  ['Chinatown Complex Market', 'Singapore', 'Markets', 'Wet Market', 103.843, 1.282, 'Hawker centre and wet market heart of Singapore Chinatown.', 1983, 1500000, 4.4, 'free', ['chinatown', 'hawker'], 'Chinatown Complex Singapore', 'real'],
  ['Lau Pa Sat', 'Singapore', 'Markets', 'Street Market', 103.8505, 1.2807, 'Victorian cast-iron market turned food haven in the CBD.', 1894, 1200000, 4.5, 'free', ['cbd', 'food'], 'Lau Pa Sat Singapore', 'real'],
  ['Sentosa Beach', 'Singapore', 'Beaches', 'Resort Beach', 103.82, 1.249, 'Imported sand resort beaches on Sentosa Island.', 0, 2000000, 4.2, 'medium', ['sentosa'], 'Sentosa Beach Singapore', 'real'],
  ['MacRitchie Reservoir Trail', 'Singapore', 'Lakes & Rivers', 'Scenic River Cruise', 103.822, 1.341, 'Boardwalk and treetop walk around Singapore\'s oldest reservoir.', 1867, 400000, 4.4, 'free', ['nature'], 'MacRitchie Reservoir Singapore', 'real'],
  ['Pulau Ubin', 'Singapore', 'Islands', 'Island Group', 103.96, 1.41, 'Kampung-style island escape with bikes, quarries, and mangroves.', 0, 250000, 4.5, 'free', ['ubin'], 'Pulau Ubin Singapore', 'real'],
  ['Bukit Timah Summit', 'Singapore', 'Mountains & Highlands', 'Trekking Peak', 103.776, 1.354, 'Singapore\'s highest natural hill with primary rainforest reserve.', 0, 300000, 4.3, 'free', ['nature'], 'Bukit Timah Nature Reserve', 'real'],

  // —— Indonesia ——
  ['Borobudur', 'Indonesia', 'Pagodas & Temples', 'Temple Complex', 110.213, -7.608, 'World\'s largest Buddhist temple — concentric stone mandala near Yogyakarta.', 800, 2000000, 4.9, 'high', ['java', 'unesco'], 'Borobudur sunrise', 'real'],
  ['Prambanan', 'Indonesia', 'Pagodas & Temples', 'Temple Complex', 110.491, -7.752, 'Towering Hindu temple complex dedicated to the Trimurti.', 850, 1200000, 4.8, 'medium', ['java', 'unesco'], 'Prambanan temple', 'real'],
  ['Tanah Lot', 'Indonesia', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 115.087, -8.621, 'Sea temple perched on a rocky coastal outcrop in Bali.', 16, 1800000, 4.6, 'medium', ['bali'], 'Tanah Lot Bali sunset', 'real'],
  ['Uluwatu Temple', 'Indonesia', 'Pagodas & Temples', 'Pilgrimage Site/Ruins', 115.084, -8.829, 'Clifftop sea temple famous for kecak dance at sunset.', 0, 1400000, 4.7, 'medium', ['bali', 'cliff'], 'Uluwatu Temple Bali', 'real'],
  ['Pasar Baru', 'Indonesia', 'Markets', 'Street Market', 106.835, -6.185, 'Historic Jakarta street market for textiles and street food.', 1820, 600000, 4.0, 'free', ['jakarta'], 'Pasar Baru Jakarta', 'real'],
  ['Ubud Art Market', 'Indonesia', 'Markets', 'Flea Market', 115.262, -8.507, 'Balinese craft market opposite the royal palace in Ubud.', 0, 900000, 4.2, 'free', ['ubud', 'bali'], 'Ubud Art Market', 'real'],
  ['Kuta Beach', 'Indonesia', 'Beaches', 'Surfing', 115.168, -8.718, 'Classic Bali surf beach with lively nightlife strip.', 0, 3000000, 4.1, 'free', ['bali', 'surf'], 'Kuta Beach Bali surfing', 'real'],
  ['Nusa Dua', 'Indonesia', 'Beaches', 'Resort Beach', 115.232, -8.8, 'Gated resort beaches on Bali\'s Bukit peninsula.', 0, 1200000, 4.4, 'free', ['bali'], 'Nusa Dua Beach Bali', 'real'],
  ['Raja Ampat', 'Indonesia', 'Beaches', 'Diving/Snorkeling', 130.5, -0.4, 'Global biodiversity hotspot for coral and reef diving in West Papua.', 0, 80000, 4.9, 'high', ['papua', 'diving'], 'Raja Ampat diving', 'real'],
  ['Mount Bromo', 'Indonesia', 'Mountains & Highlands', 'Volcanic', 112.953, -7.942, 'Active volcanic crater in East Java\'s Tengger massif — sunrise classic.', 0, 700000, 4.8, 'medium', ['java', 'volcano'], 'Mount Bromo sunrise', 'real'],
  ['Mount Merapi', 'Indonesia', 'Mountains & Highlands', 'Volcanic', 110.446, -7.541, 'Java\'s most active volcano with jeep tours and lava views.', 0, 400000, 4.6, 'medium', ['java', 'volcano'], 'Mount Merapi Yogyakarta', 'real'],
  ['Tumpak Sewu', 'Indonesia', 'Waterfalls', 'Multi-tier', 112.92, -8.23, 'Semicircular curtain waterfall nicknamed Indonesia\'s Niagara.', 0, 150000, 4.8, 'low', ['east-java'], 'Tumpak Sewu waterfall', 'real'],
  ['Komodo National Park', 'Indonesia', 'Islands', 'National Marine Park', 119.5, -8.55, 'Home of the Komodo dragon with pink beaches and world-class diving.', 0, 250000, 4.9, 'high', ['flores', 'unesco'], 'Komodo National Park dragons', 'real'],
  ['Gili Islands', 'Indonesia', 'Islands', 'Island Group', 116.07, -8.35, 'Car-free island trio off Lombok for snorkeling and beach bars.', 0, 800000, 4.5, 'medium', ['lombok'], 'Gili Islands Lombok', 'real'],
  ['Lake Toba', 'Indonesia', 'Lakes & Rivers', 'Crater Lake', 98.87, 2.6, 'Largest volcanic crater lake on Earth in North Sumatra.', 0, 350000, 4.6, 'low', ['sumatra', 'caldera'], 'Lake Toba Sumatra', 'real'],
  ['Sekumpul Waterfall', 'Indonesia', 'Waterfalls', 'Multi-tier', 115.2, -8.18, 'Cluster of tall jungle waterfalls in North Bali.', 0, 100000, 4.7, 'low', ['bali'], 'Sekumpul Waterfall Bali', 'real'],

  // —— Philippines ——
  ['Chocolate Hills', 'Philippines', 'Mountains & Highlands', 'Viewpoint/Hill Station', 124.15, 9.8, 'Hundreds of symmetrical haycock hills in Bohol that brown in dry season.', 0, 500000, 4.6, 'low', ['bohol'], 'Chocolate Hills Bohol', 'real'],
  ['Mount Apo', 'Philippines', 'Mountains & Highlands', 'Trekking Peak', 125.27, 6.99, 'Highest peak in the Philippines — multi-day trek in Mindanao.', 0, 40000, 4.7, 'medium', ['mindanao'], 'Mount Apo Philippines', 'real'],
  ['Boracay White Beach', 'Philippines', 'Beaches', 'White Sand', 121.925, 11.967, 'Powder-white beach island famed for sunsets and nightlife.', 0, 2000000, 4.6, 'free', ['boracay'], 'Boracay White Beach', 'real'],
  ['El Nido Lagoons', 'Philippines', 'Beaches', 'Diving/Snorkeling', 119.39, 11.18, 'Limestone lagoons and island-hopping in northern Palawan.', 0, 700000, 4.8, 'medium', ['palawan'], 'El Nido Big Lagoon', 'real'],
  ['Siargao Cloud 9', 'Philippines', 'Beaches', 'Surfing', 126.1, 9.8, 'World-class reef break that put Siargao on the surf map.', 0, 350000, 4.7, 'free', ['siargao', 'surf'], 'Cloud 9 Siargao', 'real'],
  ['Palawan Underground River', 'Philippines', 'Heritage & Ruins', 'UNESCO Site', 118.925, 10.192, 'Navigable underground river through a spectacular limestone cave.', 0, 600000, 4.8, 'medium', ['palawan', 'unesco'], 'Puerto Princesa Underground River', 'real'],
  ['Intramuros', 'Philippines', 'Heritage & Ruins', 'Colonial Architecture', 120.975, 14.59, 'Walled Spanish colonial city at the heart of Manila.', 1571, 900000, 4.4, 'low', ['manila'], 'Intramuros Manila', 'real'],
  ['Quiapo Market', 'Philippines', 'Markets', 'Street Market', 120.983, 14.6, 'Chaotic Manila market around Quiapo Church for goods and street food.', 0, 1100000, 4.0, 'free', ['manila'], 'Quiapo Market Manila', 'real'],
  ['Baguio Night Market', 'Philippines', 'Markets', 'Night Market', 120.59, 16.41, 'Cool-climate night market along Session Road approaches.', 0, 400000, 4.1, 'free', ['baguio'], 'Baguio night market', 'invented'],
  ['Coron Island', 'Philippines', 'Islands', 'Island Group', 120.2, 12.0, 'Kayangan Lake and WWII wreck diving among limestone cliffs.', 0, 450000, 4.8, 'medium', ['palawan', 'diving'], 'Coron Kayangan Lake', 'real'],
  ['Tubbataha Reefs', 'Philippines', 'Islands', 'National Marine Park', 119.8, 8.85, 'Remote UNESCO marine park — premier Philippine dive expedition.', 0, 15000, 4.9, 'high', ['unesco', 'diving'], 'Tubbataha Reef diving', 'real'],
  ['Pagsanjan Falls', 'Philippines', 'Waterfalls', 'Cave Waterfall', 121.45, 14.27, 'Boat-accessed falls and gorge near Laguna, classic day trip from Manila.', 0, 250000, 4.3, 'medium', ['laguna'], 'Pagsanjan Falls', 'real'],
  ['Taal Lake', 'Philippines', 'Lakes & Rivers', 'Crater Lake', 121.0, 14.0, 'Lake within a volcano within a lake — dramatic crater views from Tagaytay.', 0, 800000, 4.5, 'free', ['batangas'], 'Taal Volcano Lake', 'real'],
  ['Puerto Galera', 'Philippines', 'Beaches', 'Resort Beach', 120.85, 13.5, 'Dive resorts and beaches on Mindoro\'s northern coast.', 0, 400000, 4.4, 'free', ['mindoro'], 'Puerto Galera beach', 'real'],
  ['Binondo Chinatown Market', 'Philippines', 'Markets', 'Wet Market', 120.975, 14.6, 'Oldest Chinatown in the world with food streets and wet markets.', 1594, 700000, 4.2, 'free', ['manila', 'chinatown'], 'Binondo Manila food', 'real'],

  // —— Brunei ——
  ['Omar Ali Saifuddien Mosque', 'Brunei', 'Pagodas & Temples', 'Temple Complex', 114.939, 4.89, 'Iconic mosque with golden dome and artificial lagoon in Bandar Seri Begawan. (Islamic landmark listed under temple-complex filter for cross-ASEAN comparison tooling.)', 1958, 200000, 4.7, 'free', ['bandar', 'mosque'], 'Omar Ali Saifuddien Mosque', 'real'],
  ['Tamu Kianggeh', 'Brunei', 'Markets', 'Wet Market', 114.945, 4.89, 'Open-air produce and local goods market in the capital.', 0, 120000, 4.0, 'free', ['bandar'], 'Tamu Kianggeh Brunei', 'real'],
  ['Serasa Beach', 'Brunei', 'Beaches', 'White Sand', 115.05, 5.02, 'Popular local beach and water-sports area near Muara.', 0, 80000, 3.9, 'free', ['muara'], 'Serasa Beach Brunei', 'real'],
  ['Ulu Temburong National Park', 'Brunei', 'Mountains & Highlands', 'Trekking Peak', 115.15, 4.55, 'Pristine rainforest canopy walks in Temburong district.', 1991, 45000, 4.6, 'medium', ['temburong'], 'Ulu Temburong canopy walk', 'real'],
  ['Tasek Lama Waterfall', 'Brunei', 'Waterfalls', 'Single Drop', 114.94, 4.91, 'City-edge waterfall hike popular with Bandar residents.', 0, 50000, 4.0, 'free', ['bandar'], 'Tasek Lama waterfall Brunei', 'real'],
  ['Kampong Ayer Heritage', 'Brunei', 'Heritage & Ruins', 'Colonial Architecture', 114.948, 4.883, 'Historic water village on stilts — Venice of the East.', 0, 180000, 4.4, 'free', ['water-village'], 'Kampong Ayer Brunei', 'real'],
  ['Pelong Rocks', 'Brunei', 'Islands', 'Island Group', 115.07, 5.04, 'Small rocky islets near Muara used for local boat trips.', 0, 20000, 3.8, 'low', ['muara'], 'Pelong Rocks Brunei', 'invented'],
  ['Brunei River Cruise', 'Brunei', 'Lakes & Rivers', 'Scenic River Cruise', 114.95, 4.88, 'Boat tours through Kampong Ayer and mangrove waterways.', 0, 90000, 4.2, 'medium', ['bandar', 'river'], 'Brunei River cruise Kampong Ayer', 'real'],

  // —— Timor-Leste (thin) ——
  ['Cristo Rei Dili', 'Timor-Leste', 'Heritage & Ruins', 'Colonial Architecture', 125.61, -8.52, 'Hilltop Christ statue overlooking Dili Bay — national landmark.', 1996, 35000, 4.3, 'free', ['dili'], 'Cristo Rei Dili Timor-Leste', 'real'],
  ['Jaco Island', 'Timor-Leste', 'Islands', 'National Marine Park', 127.32, -8.42, 'Sacred uninhabited island at Timor\'s eastern tip with pristine waters.', 0, 8000, 4.6, 'low', ['lautem'], 'Jaco Island Timor-Leste', 'real'],
  ['Atauro Island Dive Sites', 'Timor-Leste', 'Beaches', 'Diving/Snorkeling', 125.57, -8.22, 'World-class coral biodiversity island north of Dili.', 0, 12000, 4.8, 'medium', ['atauro', 'diving'], 'Atauro Island diving Timor', 'real'],

  // Extra fillers to reach ~130–145 and ensure category breadth
  ['Kek Seng Beopsa Temple', 'Malaysia', 'Pagodas & Temples', 'Monastery', 101.7, 3.15, 'Urban Buddhist monastery courtyard used by local devotees in Greater KL.', 1975, 45000, 4.0, 'free', ['kl'], 'Buddhist monastery Kuala Lumpur', 'invented'],
  ['Wat Ong Teu', 'Laos', 'Pagodas & Temples', 'Monastery', 102.61, 17.97, 'Important Vientiane monastery historically linked to Lao Buddhism.', 0, 90000, 4.2, 'free', ['vientiane'], 'Wat Ong Teu Vientiane', 'real'],
  ['Cao Dai Tay Ninh', 'Vietnam', 'Pagodas & Temples', 'Temple Complex', 106.1, 11.31, 'Colorful Cao Dai holy see temple northwest of Ho Chi Minh City.', 1933, 400000, 4.5, 'free', ['tay-ninh'], 'Cao Dai Temple Tay Ninh', 'real'],
  ['Mount Makiling Trail', 'Philippines', 'Mountains & Highlands', 'Sacred Mountain', 121.2, 14.13, 'Legendary sacred mountain and biodiversity reserve south of Manila.', 0, 70000, 4.4, 'free', ['laguna'], 'Mount Makiling Philippines', 'real'],
  ['Doi Pha Hom Pok', 'Thailand', 'Mountains & Highlands', 'Sacred Mountain', 99.15, 20.05, 'Second-highest Thai peak with sacred highland lore near Fang.', 0, 55000, 4.3, 'low', ['chiang-mai'], 'Doi Pha Hom Pok', 'real'],
  ['Mount Agung', 'Indonesia', 'Mountains & Highlands', 'Sacred Mountain', 115.508, -8.342, 'Bali\'s sacred volcano towering over Besakih mother temple.', 0, 180000, 4.7, 'medium', ['bali', 'volcano'], 'Mount Agung Bali', 'real'],
  ['Dawna Range Viewpoint', 'Myanmar', 'Mountains & Highlands', 'Viewpoint/Hill Station', 98.5, 16.8, 'Hill viewpoint along the Thai–Myanmar border ranges.', 0, 20000, 4.1, 'free', ['kayin'], 'Dawna Range Myanmar viewpoint', 'invented'],
  ['Erawan Falls', 'Thailand', 'Waterfalls', 'Multi-tier', 99.145, 14.37, 'Seven-tier turquoise waterfall in Erawan National Park.', 0, 500000, 4.7, 'low', ['kanchanaburi'], 'Erawan Falls Thailand', 'real'],
  ['Detian Sister Falls View', 'Vietnam', 'Waterfalls', 'Single Drop', 106.72, 22.86, 'Vietnamese-side viewing areas for the Ban Gioc–Detian falls complex.', 0, 90000, 4.4, 'low', ['cao-bang'], 'Ban Gioc Vietnam viewpoint', 'invented'],
  ['Datanla Waterfall', 'Vietnam', 'Waterfalls', 'Cave Waterfall', 108.45, 11.9, 'Falls and alpine coaster near Dalat in the central highlands.', 0, 220000, 4.2, 'low', ['dalat'], 'Datanla Waterfall Dalat', 'real'],
  ['Maria Cristina Falls', 'Philippines', 'Waterfalls', 'Single Drop', 124.27, 8.18, 'Powerful twin falls near Iligan, source of hydroelectric power.', 0, 100000, 4.5, 'low', ['iligan'], 'Maria Cristina Falls', 'real'],
  ['Mondulkiri Jungle Falls', 'Cambodia', 'Waterfalls', 'Single Drop', 107.2, 12.45, 'Remote highland waterfall treks in elephant country Mondulkiri.', 0, 45000, 4.4, 'low', ['mondulkiri'], 'Mondulkiri waterfall Cambodia', 'invented'],
  ['Pulau Payar Marine Park', 'Malaysia', 'Islands', 'National Marine Park', 100.27, 6.06, 'Snorkeling marine park island off Kedah.', 0, 150000, 4.4, 'medium', ['kedah'], 'Pulau Payar marine park', 'real'],
  ['Thousand Islands Jakarta', 'Indonesia', 'Islands', 'Island Group', 106.55, -5.7, 'Island chain in the Java Sea north of Jakarta for day trips.', 0, 400000, 4.1, 'medium', ['jakarta'], 'Kepulauan Seribu Jakarta', 'real'],
  ['Irrawaddy Dolphin Cruise', 'Myanmar', 'Lakes & Rivers', 'Scenic River Cruise', 95.4, 21.8, 'Boat trips seeking Irrawaddy dolphins north of Mandalay.', 0, 35000, 4.5, 'medium', ['ayeyarwady'], 'Irrawaddy dolphin Myanmar', 'real'],
  ['Sungai Petani River Walk', 'Malaysia', 'Lakes & Rivers', 'River Delta', 100.49, 5.65, 'Riverside promenade and estuary walks in southern Kedah.', 0, 40000, 3.7, 'free', ['kedah'], 'Sungai Petani riverwalk', 'invented'],
  ['Pasar Malam Geylang Serai', 'Singapore', 'Markets', 'Night Market', 103.898, 1.317, 'Festive Malay night market atmosphere in Geylang Serai.', 0, 500000, 4.3, 'free', ['geylang'], 'Geylang Serai night market', 'real'],
  ['Bagan Floating Market Spot', 'Myanmar', 'Markets', 'Floating Market', 94.88, 21.17, 'Seasonal riverside produce trading near Bagan boat landings.', 0, 30000, 3.9, 'free', ['bagan'], 'Bagan riverside market Myanmar', 'invented'],
  ['Kampot Pepper Farm Market', 'Cambodia', 'Markets', 'Flea Market', 104.18, 10.61, 'Farm-gate and weekend stalls selling famous Kampot pepper.', 0, 80000, 4.2, 'free', ['kampot'], 'Kampot pepper farm', 'invented'],
  ['Balinese Sea Temple Tanah Lot Rocks', 'Indonesia', 'Beaches', 'Rocky Coast', 115.086, -8.622, 'Rocky coastal shelves around Tanah Lot used for sunset photography.', 0, 600000, 4.3, 'free', ['bali'], 'Tanah Lot rocky coast', 'invented'],
];

function buildSites() {
  // Deterministic-ish jitter by seeding with index
  const originalRandom = Math.random;
  let seed = 42;
  Math.random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const sites = RAW.map((row) => {
    const [
      name,
      country,
      category,
      type,
      lng,
      lat,
      description,
      establishedYear,
      baseVisitors,
      rating,
      entranceFee,
      tags,
      imageQuery,
      dataProvenance,
    ] = row;

    const doc = {
      name,
      slug: slugify(name, country),
      country,
      category,
      type,
      location: { type: 'Point', coordinates: [lng, lat] },
      description,
      yearlyVisitors: visitors(baseVisitors),
      rating,
      entranceFee,
      tags,
      imageQuery,
      dataProvenance,
      createdAt: new Date().toISOString(),
    };
    if (establishedYear && establishedYear > 0) {
      doc.establishedYear = establishedYear;
    }
    return doc;
  });

  Math.random = originalRandom;
  return sites;
}

module.exports = { buildSites, RAW };
