/**
 * Real-world enrichment for seed sites.
 * - replacements: swap invented / weak filler rows for real destinations
 * - descriptions: longer visitor-facing text (facts from public tourism knowledge)
 * - visitorOverrides: 2019-ish baselines aligned to published figures where known
 *
 * Visitor series remain coursework estimates with a COVID dip pattern — not official
 * ministry time series for every site.
 */

/** @type {Record<string, [string, string, string, string, number, number, string, number, number, number, string, string[], string, string]>} */
const REPLACEMENTS = {
  'Yangon Night Bazaar': [
    '19th Street Chinatown',
    'Myanmar',
    'Markets',
    'Night Market',
    96.1562,
    16.7754,
    '',
    1990,
    280000,
    4.3,
    'free',
    ['yangon', 'chinatown', 'barbecue'],
    'Yangon 19th Street Chinatown barbecue',
    'real',
  ],
  'Phsar Chas Night Market': [
    'Phnom Penh Riverside Night Market',
    'Cambodia',
    'Markets',
    'Night Market',
    104.9308,
    11.5648,
    '',
    2013,
    420000,
    4.2,
    'free',
    ['phnom-penh', 'riverside', 'street-food'],
    'Phnom Penh riverside night market',
    'real',
  ],
  'Pakse Riverside Beach': [
    'Don Khon Beach',
    'Laos',
    'Beaches',
    'Rocky Coast',
    105.986,
    13.958,
    '',
    0,
    95000,
    4.3,
    'free',
    ['si-phan-don', 'mekong', 'don-khon'],
    'Don Khon beach Si Phan Don Laos',
    'real',
  ],
  'Lata Bukit Hijau': [
    'Kanching Waterfalls',
    'Malaysia',
    'Waterfalls',
    'Multi-tier',
    101.6195,
    3.3018,
    '',
    0,
    180000,
    4.3,
    'low',
    ['selangor', 'rawang'],
    'Kanching Waterfalls Selangor',
    'real',
  ],
  'Baguio Night Market': [
    'Baguio Night Market',
    'Philippines',
    'Markets',
    'Night Market',
    120.596,
    16.4125,
    '',
    2000,
    450000,
    4.2,
    'free',
    ['baguio', 'harrison-road', 'ukay'],
    'Baguio Harrison Road night market',
    'real',
  ],
  'Pelong Rocks': [
    'Selirong Island Forest Reserve',
    'Brunei',
    'Islands',
    'Island Group',
    115.15,
    4.9,
    '',
    0,
    18000,
    4.4,
    'medium',
    ['temburong', 'mangrove', 'wildlife'],
    'Selirong Island Brunei mangroves',
    'real',
  ],
  'Kek Seng Beopsa Temple': [
    'Buddhist Maha Vihara Brickfields',
    'Malaysia',
    'Pagodas & Temples',
    'Monastery',
    101.6845,
    3.1308,
    '',
    1895,
    120000,
    4.4,
    'free',
    ['kl', 'brickfields', 'theravada'],
    'Buddhist Maha Vihara Brickfields KL',
    'real',
  ],
  'Dawna Range Viewpoint': [
    'Mount Zwegabin',
    'Myanmar',
    'Mountains & Highlands',
    'Viewpoint/Hill Station',
    97.716,
    16.826,
    '',
    0,
    55000,
    4.5,
    'low',
    ['kayin', 'hlaingbwe', 'pilgrimage'],
    'Mount Zwegabin Hpa-an Myanmar',
    'real',
  ],
  'Detian Sister Falls View': [
    'Pongour Falls',
    'Vietnam',
    'Waterfalls',
    'Single Drop',
    108.446,
    11.687,
    '',
    0,
    160000,
    4.5,
    'low',
    ['lam-dong', 'dalat'],
    'Pongour Falls Da Lat Vietnam',
    'real',
  ],
  'Mondulkiri Jungle Falls': [
    'Bou Sra Waterfall',
    'Cambodia',
    'Waterfalls',
    'Single Drop',
    107.148,
    12.564,
    '',
    0,
    70000,
    4.5,
    'low',
    ['mondulkiri', 'sen-monorom'],
    'Bou Sra Waterfall Mondulkiri',
    'real',
  ],
  'Sungai Petani River Walk': [
    'Kinabatangan River',
    'Malaysia',
    'Lakes & Rivers',
    'River Delta',
    118.28,
    5.52,
    '',
    0,
    90000,
    4.6,
    'medium',
    ['sabah', 'wildlife', 'orangutan'],
    'Kinabatangan River safari Sabah',
    'real',
  ],
  'Bagan Floating Market Spot': [
    'Ywama Floating Market',
    'Myanmar',
    'Markets',
    'Floating Market',
    96.908,
    20.558,
    '',
    0,
    85000,
    4.3,
    'free',
    ['inle', 'shan', 'boats'],
    'Ywama floating market Inle Lake',
    'real',
  ],
  'Kampot Pepper Farm Market': [
    'Kep Crab Market',
    'Cambodia',
    'Markets',
    'Flea Market',
    104.316,
    10.482,
    '',
    0,
    220000,
    4.4,
    'free',
    ['kep', 'seafood', 'crab'],
    'Kep Crab Market Cambodia',
    'real',
  ],
  'Balinese Sea Temple Tanah Lot Rocks': [
    'Broken Beach Nusa Penida',
    'Indonesia',
    'Beaches',
    'Rocky Coast',
    115.457,
    -8.732,
    '',
    0,
    480000,
    4.6,
    'free',
    ['nusa-penida', 'bali', 'cliffs'],
    'Broken Beach Nusa Penida Bali',
    'real',
  ],
};

/** Published / widely cited 2019-scale baselines (approximate annual visits). */
const VISITOR_OVERRIDES = {
  'Angkor Wat': 2200000,
  Borobudur: 4000000,
  'Ha Long Bay': 4400000,
  'Hoi An Ancient Town': 2200000,
  'Hue Imperial City': 1500000,
  'Gardens by the Bay': 8000000,
  'Chatuchak Weekend Market': 4500000,
  'Wat Phra Kaew': 3500000,
  'Shwedagon Pagoda': 2500000,
  'Mount Kinabalu': 200000,
  'Puerto Princesa Underground River': 550000,
  'Komodo National Park': 220000,
};

/**
 * Longer descriptions keyed by site name (after replacements).
 * Keep under schema maxlength 2000.
 */
const DESCRIPTIONS = {
  'Shwedagon Pagoda':
    'Yangon’s gilded Shwedagon Pagoda is Myanmar’s most sacred Buddhist monument, said to enshrine relics of four Buddhas. The stupa complex crowns Singuttara Hill and draws pilgrims and visitors for sunrise and evening lighting ceremonies. Surrounding shrines, bells, and planetary posts make it a living centre of Burmese Buddhist practice.',
  'Bagan Temple Complex':
    'Bagan’s archaeological zone spreads thousands of brick temples and stupas across the Ayeyarwady plain, a UNESCO World Heritage landscape. Hot-air balloons and hilltop viewpoints reveal the density of monuments built mainly between the 9th and 13th centuries. Key temples such as Ananda and Thatbyinnyu remain active worship and study sites.',
  'Kyaiktiyo Golden Rock':
    'Kyaiktiyo (Golden Rock) is a pilgrimage pagoda balanced on a gold-leafed granite boulder in Mon State. Devotees believe a strand of the Buddha’s hair keeps the rock from falling. Access involves a mountain road and a short walk or ride to the floodlit shrine platform.',
  'Mahamuni Buddha Temple':
    'Mahamuni in Mandalay houses a highly revered bronze Buddha image whose torso is continually covered with gold leaf offered by male devotees. The temple is a major ritual stop for visitors to Upper Myanmar. Surrounding courtyards display inscriptions and cast figures linked to Arakanese and Burmese royal history.',
  'Sule Pagoda':
    'Sule Pagoda sits at a traffic roundabout in downtown Yangon and is traditionally dated to the early centuries of the common era. Its octagonal stupa is said to enshrine a hair of the Buddha. The site remains a civic and religious landmark amid colonial-era streets.',
  'Shwezigon Pagoda':
    'Shwezigon in Nyaung-U near Bagan is an early prototype of the Burmese bell-shaped stupa and is linked to King Anawrahta’s reforms. Pilgrims circle the gilded dome and visit surrounding nat shrines. It remains one of Bagan’s most important living pagodas.',
  'Ananda Temple':
    'Ananda Temple is among Bagan’s best-preserved monuments, completed in the early 12th century under King Kyansittha. Four standing Buddha images face the cardinal directions inside a Greek-cross plan. Intricate glazed tiles and stone carvings illustrate Jataka stories.',
  'Pindaya Cave Temple':
    'Pindaya’s limestone caves in Shan State hold thousands of Buddha images donated over centuries. A covered stairway and elevator reach the main chamber overlooking Pindaya town and its lake. The site combines natural caverns with continuous Buddhist devotion.',
  'Shwe Yan Pyay Monastery':
    'Shwe Yan Pyay is a teak monastery near Nyaungshwe, known for oval windows that frame novice monks for photographers. It sits on the approach to Inle Lake and reflects Shan monastic wooden architecture. Visitors usually combine it with lake boat trips.',
  'Inle Lake Stupa Trail':
    'Around Inle Lake, lakeside and hillside stupas include approaches to Phaung Daw Oo and other Shan Buddhist shrines. Boat routes link villages, floating gardens, and pagoda festivals. The landscape mixes wetland livelihoods with pilgrimage circuits.',
  'Kaunghmudaw Pagoda':
    'Kaunghmudaw near Sagaing is a massive white hemispherical stupa inspired by Sri Lanka’s Ruwanwelisaya. Built in the 17th century under King Thalun, it dominates the surrounding dry-zone plain. Pilgrims walk the broad terrace around the dome.',
  'Po Win Daung Caves':
    'Po Win Daung (Powin Taung) near Monywa features hillside cave shrines with murals and Buddha images spanning several centuries. Visitors climb among rock-cut chambers with views over the Chindwin region. The complex is an important art-historical stop in Upper Myanmar.',
  'Mingun Pahtodawgyi':
    'Mingun’s unfinished Pahtodawgyi is a colossal brick mass begun by King Bodawpaya and cracked by an 1839 earthquake. Across the river from Mandalay, it is paired with the Mingun Bell, one of the world’s largest ringing bells. The site is usually reached by boat.',
  'Kyaikthanlan Pagoda':
    'Kyaikthanlan is Mawlamyine’s tallest pagoda and offers estuary views over the Thanlwin (Salween) mouth. Local tradition ties it to early Mon Buddhist foundations. Evening light on the golden stupa makes it a popular town viewpoint.',
  'Thanboddhay Temple':
    'Thanboddhay near Monywa is densely covered with tens of thousands of small Buddha images on towers and walls. The 20th-century complex is brightly painted and remains an active worship site. It is often combined with visits to nearby Bodhi Tataung.',
  'Bogyoke Aung San Market':
    'Bogyoke Aung San Market (formerly Scott Market) is a colonial-era covered bazaar in Yangon for gems, textiles, lacquerware, and souvenirs. Built in the 1920s, its long halls still structure much of the city’s tourist shopping. Bargaining and craft stalls sit beside everyday local trade.',
  'Ngapali Beach':
    'Ngapali on the Bay of Bengal is Myanmar’s best-known resort beach, with a palm-lined strip of hotels near Thandwe. Clear water and seafood restaurants draw domestic and international visitors in the dry season. It remains quieter than many Southeast Asian beach hubs.',
  'Mount Victoria Nat Ma Taung':
    'Nat Ma Taung (Mount Victoria) is the highest peak in Chin State and a biodiversity hotspot for birds and highland flora. Treks pass through Chin villages and oak–rhododendron forest. Cool temperatures and remote roads make it a specialist nature destination.',
  'Anisakan Falls':
    'Anisakan (Dat Taw Gyaint) Falls near Pyin Oo Lwin tumble in multiple tiers through forested hills east of Mandalay. Day-trippers swim in pools and picnic on ledges. The area reflects the colonial hill-station landscape of Maymyo.',
  'Mrauk U Ruins':
    'Mrauk U was the capital of the Arakanese kingdom and retains stone temples and fortifications across rural hills in Rakhine State. Sites such as Htukkanthein and Koe-thaung show distinctive vaulted architecture. Tourism access has varied with regional conditions.',
  'Mergui Archipelago':
    'The Mergui (Myeik) Archipelago in the Andaman Sea holds hundreds of islands with diving reefs, beaches, and Moken sea-nomad communities. Most visits are by liveaboard or chartered boat from Kawthaung. The area is among Myanmar’s most remote coastal destinations.',
  'Inle Lake':
    'Inle Lake in Shan State is famous for leg-rowing Intha fishermen, floating gardens, and stilt-house villages. Boat circuits visit markets, weaving workshops, and Phaung Daw Oo Pagoda. Cool highland light and wetland ecology define the visitor experience.',
  '19th Street Chinatown':
    'Yangon’s 19th Street in Chinatown transforms after dark into open-air barbecue stalls serving skewers, seafood, and Myanmar–Chinese dishes. Plastic tables spill onto the street under red lanterns and neon. It is one of the city’s most reliable night-food destinations for locals and travellers.',
  'Chaung Tha Beach':
    'Chaung Tha is a popular domestic beach west of Yangon on the Bay of Bengal, busier and more affordable than Ngapali. Families rent beach huts and swim along a sandy bay backed by casuarina trees. Peak season coincides with Myanmar public holidays.',

  'Wat Pho':
    'Wat Pho (Temple of the Reclining Buddha) in Bangkok houses a 46-metre gold-plated reclining Buddha and a renowned traditional Thai massage school. The sprawling complex is among the city’s oldest royal temples. Murals, chedis, and medicine inscriptions make it a cultural as well as religious stop.',
  'Wat Arun':
    'Wat Arun, the Temple of Dawn, rises on the Thonburi bank of the Chao Phraya with a porcelain-encrusted Khmer-style prang. Climbing the steep stairs rewards visitors with river views toward the Grand Palace. The temple is especially photogenic at sunset and after dark.',
  'Doisuthep Temple':
    'Wat Phra That Doi Suthep overlooks Chiang Mai from a mountain ridge reached by a naga staircase or road. The gilded chedi is one of northern Thailand’s holiest pilgrimage sites. Clear days reveal the city and surrounding mountains from the terraces.',
  'White Temple Wat Rong Khun':
    'Wat Rong Khun near Chiang Rai is a contemporary white temple created by artist Chalermchai Kositpipat, covered in mirrored fragments and symbolic sculpture. The bridge to the ubosot represents the cycle of rebirth. It is an art installation as much as a Buddhist temple.',
  'Wat Phra Kaew':
    'Wat Phra Kaew within Bangkok’s Grand Palace complex enshrines the Emerald Buddha, Thailand’s palladium. Lavish murals, golden chedis, and royal halls make it the ceremonial heart of Thai Buddhism. Dress codes are strictly enforced for visitors.',
  'Wat Traimit':
    'Wat Traimit in Bangkok’s Chinatown holds the Golden Buddha, a nearly solid-gold seated image rediscovered in the 1950s. The temple museum explains the statue’s history and casting. It is an easy stop near Hua Lamphong and Yaowarat.',
  'Wat Benchamabophit':
    'Wat Benchamabophit, the Marble Temple, was built of Carrara marble in the reign of King Chulalongkorn. Cloisters display Buddha images in many attitudes, and the grounds are among Bangkok’s most elegant. It remains an active royal monastery.',
  'Wat Phra That Doi Suthep Golden Chedi':
    'The golden chedi of Wat Phra That Doi Suthep is the focal shrine of Chiang Mai’s mountain temple. Pilgrims circle the stupa and offer flowers and gold leaf. Legends link its founding to a white elephant that chose the site.',
  'Wat Chedi Luang':
    'Wat Chedi Luang’s massive ruined chedi once dominated Chiang Mai’s old city and briefly housed the Emerald Buddha. Earthquakes and war reduced its height, but the brick core remains imposing. The temple hosts the city pillar shrine (Lak Mueang).',
  'Wat Phra Singh':
    'Wat Phra Singh is a principal Lanna temple in Chiang Mai, housing the revered Phra Singh Buddha image. Its scripture repository and assembly halls show classic northern teak and stucco work. Songkran processions often centre on this monastery.',
  'Blue Temple Wat Rong Suea Ten':
    'Wat Rong Suea Ten in Chiang Rai is known for vivid blue interiors and modern Buddhist sculpture by local artists. A large white Buddha sits against deep ultramarine walls. It forms a popular trio with the White Temple and Black House.',
  'Wat Phra That Lampang Luang':
    'This fortified temple near Lampang preserves teak chapels, murals, and a sacred chedi within ancient walls. Visitors often arrive by horse carriage from Lampang town. It is among northern Thailand’s most atmospheric historic wats.',
  'Wat Mahathat Bangkok':
    'Wat Mahathat Yuwaratrangsarit beside Sanam Luang is a royal monastery and seat of a major Buddhist university. Meditation courses and monastic education continue on the grounds. It sits a short walk from the Grand Palace.',
  'Phra Pathom Chedi':
    'Phra Pathom Chedi in Nakhon Pathom is the tallest stupa in Thailand and a major pilgrimage landmark. The orange-tiled dome rises above a broad plaza of subordinate shrines. Its foundations relate to early Dvaravati Buddhist culture.',
  'Wat Phu Khao Thong Golden Mount':
    'The Golden Mount (Wat Saket) offers a spiral ascent to a chedi with panoramic views over Rattanakosin. The artificial hill was built on a failed chedi from the early Bangkok period. Temple fairs and city vistas draw evening crowds.',
  'Wat Chaiwatthanaram':
    'Wat Chaiwatthanaram on the Chao Phraya in Ayutthaya shows Khmer-influenced prangs arranged around a central tower. Built by King Prasat Thong in the 17th century, it is one of the former capital’s most photogenic riverside ruins. Sunset visits are especially popular.',
  'Chatuchak Weekend Market':
    'Chatuchak (JJ) Weekend Market is one of the world’s largest outdoor markets, with thousands of stalls for fashion, crafts, plants, and food. It operates mainly on Saturday and Sunday in northern Bangkok. Navigating the numbered sections is part of the experience.',
  'Damnoen Saduak Floating Market':
    'Damnoen Saduak in Ratchaburi is Thailand’s most famous floating market, with boat vendors selling fruit, snacks, and souvenirs along narrow canals. Early mornings are busiest before tour groups peak. It remains a classic day trip west of Bangkok.',
  'Chiang Mai Night Bazaar':
    'Chiang Mai Night Bazaar stretches along Chang Khlan Road with handicrafts, clothing, and northern Thai street food. It has operated for decades as a tourist-oriented evening market. Nearby walking streets add seasonal craft stalls.',
  'Maya Bay':
    'Maya Bay on Koh Phi Phi Leh became globally famous after the film The Beach and later closed periodically to restore coral and beaches. Steep limestone cliffs enclose a crescent of sand in the Andaman Sea. Access is regulated; check current park rules before visiting.',
  'Railay Beach':
    'Railay (Rai Leh) near Krabi is a peninsula reachable mainly by longtail boat, famed for limestone climbing cliffs and pocket beaches. East and West Railay offer different vibes, from quieter sand to nightlife. Kayaking and rock routes draw adventure travellers.',
  'Patong Beach':
    'Patong is Phuket’s busiest resort beach, with water sports, nightlife, and a dense hotel strip. The bay faces west for sunsets over the Andaman. It is the island’s most energetic tourist hub.',
  'Surin Beach':
    'Surin Beach on Phuket’s west coast is quieter than Patong, with seasonal surf, boutique resorts, and a hillside backdrop. Coral close to shore attracts snorkellers in calm months. Nearby Kamala and Bang Tao form a gentler beach circuit.',
  'Similan Islands':
    'The Similan Islands National Park is a premier Andaman diving destination of granite boulder islands and clear coral gardens. Visits are seasonal (typically November–May) by day trip or liveaboard. Strict park quotas protect reefs and beaches.',
  'Doi Inthanon':
    'Doi Inthanon is Thailand’s highest peak, with cloud forest, waterfalls, and twin royal chedis near the summit. Cool temperatures attract weekenders from Chiang Mai. Ang Ka nature trail and Wachirathan Falls are popular stops.',
  'Tee Lor Su Waterfall':
    'Tee Lor Su in Umphang Wildlife Sanctuary is one of Thailand’s largest and most dramatic multi-tier waterfalls. Access usually involves a trek or 4×4 through forest near the Myanmar border. Emerald pools sit below limestone cliffs.',
  'Ayutthaya Historic Park':
    'Ayutthaya Historic Park preserves the ruins of Siam’s former capital, a UNESCO World Heritage site of prangs, monasteries, and Buddha images. Wat Mahathat and Wat Phra Si Sanphet are signature stops. The island city sits at the confluence of three rivers.',
  'Sukhothai Historical Park':
    'Sukhothai Historical Park is the cradle of Thai civilization, with serene Buddha statues among temple ruins in a landscaped UNESCO zone. Wat Mahathat and walking/cycling paths define the visit. The site reflects 13th–14th century Sukhothai art.',
  'Phi Phi Islands':
    'The Phi Phi islands combine limestone karsts, beaches, viewpoints, and diving in the Andaman Sea. Koh Phi Phi Don holds most accommodation, while Leh is protected parkland. Day trips from Phuket and Krabi are extremely popular.',
  'Chao Phraya River Cruise':
    'Chao Phraya cruises pass Bangkok’s royal temples, colonial warehouses, and modern towers between piers such as Sathorn and Tha Maharaj. Dinner boats and public ferries both serve sightseeing. Sunset light on Wat Arun is a classic view.',

  'Perfume Pagoda':
    'The Perfume Pagoda (Huong Pagoda) complex southwest of Hanoi mixes riverboat approaches, mountain shrines, and a fragrant limestone cave sanctuary. Peak pilgrimage is during the Huong Festival in spring. It is one of northern Vietnam’s most important Buddhist journeys.',
  'One Pillar Pagoda':
    'Hanoi’s One Pillar Pagoda is a wooden lotus-shaped shrine rising from a square pond, originally founded in the Ly dynasty. Though rebuilt after war damage, it remains a national symbol. It sits beside the Ho Chi Minh Mausoleum complex.',
  'Ben Thanh Market':
    'Ben Thanh Market is Ho Chi Minh City’s landmark covered bazaar for food, coffee, handicrafts, and souvenirs under a distinctive clock-gate. Daytime stalls give way to evening street food around the perimeter. It anchors District 1 tourist traffic.',
  'Hoi An Night Market':
    'Hoi An’s night market lines the riverside with lanterns, street food, and handicrafts in the UNESCO ancient town. Pedestrian streets glow after dark with silk lantern workshops. It is best combined with an evening walk across the Japanese Bridge area.',
  'My Khe Beach':
    'My Khe (China Beach) at Da Nang is a long sandy stretch popular for swimming, surfing, and seaside seafood. The city skyline and Marble Mountains sit nearby. It was a rest-and-recreation beach in wartime history and is now a major domestic resort strip.',
  'Phu Quoc':
    'Phu Quoc in the Gulf of Thailand offers resort beaches, snorkeling, pepper farms, and a growing nightlife scene. Ung Van Khiem and Sao beaches are well-known sand stretches. Cable cars and theme parks have expanded the island’s mass tourism side.',
  'Sapa Terraces':
    'Sapa’s terraced rice fields and highland towns in Lao Cai province draw trekkers among Hmong, Dao, and other ethnic communities. Misty weather and weekend markets define the atmosphere. Fansipan and village homestays are common add-ons.',
  'Fansipan Peak':
    'Fansipan, the highest peak in Indochina, rises above Sapa and is reachable by cable car or strenuous trek. Summit temples and cloud views reward clear mornings. Weather changes quickly in the Hoang Lien range.',
  'Ban Gioc Waterfall':
    'Ban Gioc–Detian Falls tumble across the Vietnam–China border in Cao Bang as a wide multi-tier curtain. Bamboo rafts approach the spray on the Vietnamese side. The remote karst setting makes the journey part of the experience.',
  'Ha Long Bay':
    'Ha Long Bay’s limestone islets and emerald water form Vietnam’s signature UNESCO seascape, explored by overnight cruise. Floating villages, caves such as Sung Sot, and kayaking routes fill itineraries. Quang Ninh recorded millions of visits in peak pre-COVID years.',
  'Hoi An Ancient Town':
    'Hoi An Ancient Town is a UNESCO trading port with Chinese assembly halls, Japanese Bridge, and French-colonial layers along the Thu Bon River. Tailors, lanterns, and well-preserved shophouses define the old quarter. Flood seasons periodically inundate riverside streets.',
  'Hue Imperial City':
    'Hue’s Imperial City (Citadel) was the Nguyen Dynasty capital, with palaces, gates, and courtyards along the Perfume River. UNESCO listing covers tombs and monuments across the landscape. Ao dai rentals and cyclo rides are common visitor scenes.',
  'Con Dao Islands':
    'Con Dao National Park combines prison-history sites, beaches, and diving off southern Vietnam. Sea turtles nest on some beaches under conservation programs. Access is by flight or ferry from the mainland.',
  'Mekong Delta Cruise':
    'Mekong Delta cruises around Can Tho and Cai Rang explore floating markets, orchard canals, and riverine livelihoods. Boats pass under monkey bridges and visit brick kilns or coconut candy workshops. Early morning floating markets are the classic sight.',
  'Perfume River Hue':
    'Perfume River boat rides in Hue pass pagodas, gardens, and approaches to royal tombs. Dragon boats remain a tourist staple between the Citadel and Thien Mu Pagoda. Evening cruises add music and lantern light.',
  'Pongour Falls':
    'Pongour Falls near Da Lat is a broad multi-step cascade often called one of the most majestic waterfalls in the Central Highlands. Wide rock shelves allow walking across flowing tiers in the dry season. It is a popular day trip from the hill city.',

  'Angkor Wat':
    'Angkor Wat is the world’s largest religious monument, a 12th-century Khmer temple-mountain dedicated first to Vishnu and later used as a Buddhist shrine. Sunrise over the reflection pools is the iconic visit. The wider Angkor Archaeological Park drew about 2.2 million foreign ticket holders in 2019.',
  'Angkor Thom':
    'Angkor Thom was Jayavarman VII’s walled royal city, entered through monumental gateways topped with facing towers. Inside lie Bayon, Baphuon, and the Terrace of the Elephants. A circuit combines state temples with forested enclosure walls.',
  'Ta Prohm':
    'Ta Prohm is famous for silk-cotton and strangler-fig roots gripping stone galleries, left partly unrestored for atmosphere. Built as a Buddhist monastery under Jayavarman VII, it appears in many films and photographs. Conservation balances visitor access with structural safety.',
  'Wat Phnom':
    'Wat Phnom is the hilltop pagoda that gave Phnom Penh its name, according to the legend of Lady Penh. A Naga staircase leads to the sanctuary above the city’s parks. It remains a working temple and fortune-telling spot.',
  'Silver Pagoda':
    'The Silver Pagoda (Wat Preah Keo) within Phnom Penh’s Royal Palace is named for its silver-tiled floor and houses emerald and gold Buddha images. Royal regalia and gifts are displayed in adjacent halls. It is a centrepiece of state ceremonies.',
  'Bayon Temple':
    'Bayon at the centre of Angkor Thom is known for serene stone faces of Avalokitesvara on its towers. Bas-reliefs depict everyday Khmer life and military processions. It is essential on any Angkor itinerary.',
  'Banteay Srei':
    'Banteay Srei, the “citadel of women,” is a small pink sandstone temple renowned for ultra-fine Hindu carvings. Located north of the main Angkor circuit, it dates to the 10th century. Soft morning light brings out the relief detail.',
  'Preah Khan':
    'Preah Khan is a vast monastic complex with overgrown galleries, Buddhist and Hindu shrines, and a processional avenue. Jayavarman VII founded it on a battle site. Allow time to wander its maze-like corridors.',
  'Neak Pean':
    'Neak Pean is a circular island temple in an artificial lake, designed as a Buddhist healing sanctuary with radiating pools. A wooden walkway provides access in season. It sits on the Grand Circuit of Angkor.',
  'Wat Ounalom':
    'Wat Ounalom on Phnom Penh’s riverside is the historic headquarters of Cambodian Buddhism. Despite wartime damage, it remains an active monastic centre. The waterfront location pairs visits with Sisowath Quay.',
  'Wat Nokor Bachey':
    'Wat Nokor near Kampong Cham combines an 11th-century Angkorian temple with later Buddhist monastery buildings. Carved sandstone sits beside modern viharas. It is a rewarding stop on Mekong road trips.',
  'Phnom Chisor Temple':
    'Phnom Chisor is a hilltop Angkorian temple south of Phnom Penh with long stairways and plains views. The sanctuary retains lintels and brick–laterite construction. Weekends bring picnic crowds.',
  'Wat Botum':
    'Wat Botum Park monastery near the Royal Palace is one of Phnom Penh’s historic wats, active for local worship and ceremonies. Gardens and stupas sit close to the riverfront boulevards. It is quieter than the palace tourist core.',
  'Psar Thmei Central Market':
    'Psar Thmei (Central Market) is Phnom Penh’s Art Deco dome market for jewellery, clothes, and food. Built in the 1930s, its radiating halls are an architectural landmark. Tourists browse upstairs galleries while locals shop for everyday goods.',
  'Phnom Penh Riverside Night Market':
    'The riverside night market on Sisowath Quay sells clothes, souvenirs, and Khmer street food under tents facing the Tonle Sap–Mekong junction. It is popular with evening strollers and cruise passengers. Live music and food carts extend along the waterfront.',
  'Otres Beach':
    'Otres Beach south of Sihanoukville has long been the quieter alternative to Occheuteal, with sand, bungalows, and beach bars. Development pressure has changed parts of the coast, but Otres still draws travellers seeking a calmer bay. Sunsets face the Gulf of Thailand.',
  'Koh Rong':
    'Koh Rong is Cambodia’s best-known Gulf island, with white beaches such as Koh Touch and Long Set, plus denser jungle hinterland. Ferries run from Sihanoukville; smaller Koh Rong Samloem nearby is quieter. Nightlife and diving coexist with fishing villages.',
  'Kulen Waterfall':
    'Phnom Kulen’s waterfalls near Siem Reap offer swimming pools below jungle cascades, with riverbed linga carvings upstream at Kbal Spean approaches. The mountain is sacred as the birthplace of the Angkorian empire. A toll road reaches the falls area.',
  'Bokor Hill Station':
    'Bokor Hill Station above Kampot holds foggy French-colonial ruins, a modern casino plateau, and cliff viewpoints over the Gulf. Abandoned church and hotel shells define the atmospheric visit. Cool mist contrasts with the heat of the coast.',
  'Tonle Sap Lake':
    'Tonle Sap is Southeast Asia’s largest freshwater lake, with floating villages and dramatic seasonal expansion from Mekong floodwaters. Boat trips from Chong Kneas or Kampong Phluk show stilt houses and flooded forest. It is integral to Cambodia’s fish and rice economy.',
  'Bou Sra Waterfall':
    'Bou Sra (Busra) Waterfall near Sen Monorom is Mondulkiri’s signature cascade, dropping in broad steps through highland forest. Ethnic Bunong communities and elephant landscapes surround the plateau. It is the most visited nature stop in eastern Cambodia.',
  'Kep Crab Market':
    'Kep Crab Market is a waterfront row of stalls selling fresh crab, squid, and seafood cooked to order on Cambodia’s southern coast. Diners eat at simple tables overlooking the bay toward Vietnam. Kampot pepper crab is the signature dish.',

  'Wat Xieng Thong':
    'Wat Xieng Thong is Luang Prabang’s most exquisite temple, famed for the mosaic “tree of life” rear wall and sweeping low roof lines. Royal ceremonies historically used this monastery. It sits near the Mekong–Nam Khan confluence.',
  'Pha That Luang':
    'Pha That Luang is Laos’s national symbol, a grand golden stupa complex in Vientiane. Its that (relic stupa) form appears on the national emblem and currency. The That Luang Festival draws huge pilgrim crowds each November.',
  'Wat Mai Suwannaphumaham':
    'Wat Mai in Luang Prabang is a former royal temple with a richly gilded facade and historic murals. It played a role in coronation rituals. The monastery faces the main peninsula road near the palace museum.',
  'Wat Visoun':
    'Wat Visoun (Wat Wisunarat) is among Luang Prabang’s oldest temples, noted for the watermelon-shaped That Makmo stupa. A small museum of religious objects sits on the grounds. It anchors the southern end of the historic peninsula.',
  'Wat Sensoukarahm':
    'Wat Sen (Sensoukarahm) is a riverside monastery in Luang Prabang associated with the morning alms-giving (tak bat) route. Novices study in teak buildings along the Mekong. Visitors are asked to observe alms etiquette quietly.',
  'Wat Si Saket':
    'Wat Si Saket in Vientiane is known for cloister walls lined with thousands of niche Buddha images. Built in the early 19th century, it survived better than many temples after the Siamese invasion. It remains a calm historic stop downtown.',
  'Haw Phra Kaew':
    'Haw Phra Kaew was a royal temple that once housed the Emerald Buddha before its transfer to Thailand; it now serves as a museum. Gilded doors and Buddha galleries face Wat Si Saket across the street. The grounds include stone jars and garden exhibits.',
  'That Dam Stupa':
    'That Dam, the Black Stupa, sits in a quiet square in central Vientiane and is wrapped in local naga legends. Unlike That Luang, it is an understated everyday landmark. Office workers pass it on lunch breaks.',
  'Wat Phou Champasak':
    'Wat Phou is a UNESCO mountain-side Khmer temple complex overlooking the Mekong plains in Champasak. Processional causeways climb toward a spring-fed sanctuary. It predates and parallels Angkorian sacred geography.',
  'Kuāng Si Falls':
    'Kuang Si Falls near Luang Prabang tumble in turquoise multi-tier pools popular for swimming. A nearby bear rescue centre adds a conservation stop. The site is the city’s most visited nature excursion.',
  'Talat Sao Morning Market':
    'Talat Sao in Vientiane is a morning market for textiles, food, and household goods, partly modernised into a mall complex. Traditional fabric stalls still draw souvenir shoppers. It sits near the old city centre.',
  'Night Market Luang Prabang':
    'Luang Prabang’s night market along Sisavangvong Road sells handmade textiles, lanterns, and snacks under tented stalls. It is a primary evening activity on the peninsula. Bargaining is expected for crafts.',
  'Vang Vieng Cliffs':
    'Vang Vieng’s karst cliffs and blue lagoons above the Nam Song River define Laos’s adventure-tourism hub. Viewpoints, tubing, and cave visits replaced an earlier party reputation. Sunset from the cliffs overlooking the valley is a highlight.',
  'Si Phan Don':
    'Si Phan Don (Four Thousand Islands) spreads the Mekong into a braided archipelago near the Cambodian border. Don Det and Don Khon offer cycling, waterfalls, and rare Irrawaddy dolphin spotting. French-era railway remnants remain on Don Khon.',
  'Plain of Jars':
    'The Plain of Jars in Xieng Khouang holds mysterious megalithic stone jars across multiple UNESCO-listed sites. Visitors walk among jars whose original purpose remains debated. UXO clearance continues to shape safe access.',
  'Mekong Sunset Cruise LP':
    'Sunset boat rides from Luang Prabang drift past peninsula temples and stilted riverbanks on the Mekong. Local captains time the turn for golden light on the hills. It is a gentler alternative to longer slow-boat journeys.',
  'Nong Khiaw River Cliffs':
    'Nong Khiaw sits among dramatic limestone cliffs on the Nam Ou north of Luang Prabang. Viewpoint hikes and riverboat connections to Muang Ngoi define visits. The scale of the cliffs surprises many first-time travellers.',
  'Tad Fane Waterfall':
    'Tad Fane on the Bolaven Plateau is a twin waterfall plunging into a deep gorge amid coffee country. Viewpoints overlook the parallel cascades. Nearby Tad Yuang offers swimming pools for a combined plateau loop.',
  'Don Khon Beach':
    'Don Khon in Si Phan Don has sandy and rocky Mekong shores used for swimming and sunset watching, including stretches near the old French bridge. The island is quieter than neighbouring Don Det. Bicycle loops reach Li Phi Falls and dolphin viewpoints.',

  'Batu Caves':
    'Batu Caves near Kuala Lumpur are limestone caverns housing Hindu shrines, approached by a staircase watched over by a giant golden Murugan statue. Thaipusam draws massive pilgrim crowds. Dark Cave and other chambers add geological interest.',
  'Kek Lok Si':
    'Kek Lok Si in Penang is Malaysia’s largest Buddhist temple complex, climbing a hillside with pagodas, gardens, and a large Guanyin statue. Chinese New Year lights make it especially spectacular. It anchors Air Itam’s religious tourism.',
  'Petaling Street Market':
    'Petaling Street is Kuala Lumpur’s Chinatown bargain strip for souvenirs, apparel, and hawker food under a covered arcade. Cast iron decorations and temples nearby recall early Chinese settlement. Evening stalls intensify the street-food scene.',
  'Central Market KL':
    'Central Market (Pasar Seni) is a heritage Art Deco market for Malaysian crafts, batik, and souvenirs beside the Klang River. Cultural shows and nearby Kasturi Walk extend the visit. It is a standard stop between Chinatown and Merdeka Square.',
  'Perhentian Islands':
    'The Perhentian Islands off Terengganu offer turquoise water, backpacker bungalows, and coral snorkeling on Malaysia’s east coast. Seasonality follows the monsoon (typically March–October). Sea turtles and reef fish are common near shore.',
  'Langkawi Pantai Cenang':
    'Pantai Cenang is Langkawi’s main resort beach strip with sunset cafes, duty-free shopping, and water sports. The island’s cable car and mangroves are easy day trips. Soft sand and shallow water suit families.',
  'Mount Kinabalu':
    'Mount Kinabalu is Borneo’s highest summit and a UNESCO World Heritage park, climbed via guided overnight ascents. Unique alpine flora grows on ultramafic soils near the granite peak. Summit slots are quota-controlled.',
  'Cameron Highlands':
    'Cameron Highlands are Malaysia’s classic tea-plantation hill station, with cool climate, strawberry farms, and colonial bungalows in Pahang. Boh and other estates offer factory tours. Misty trails lead through mossy forest.',
  'Melaka Colonial Core':
    'Melaka’s UNESCO historic core includes Dutch Square, Christ Church, A Famosa gate, and Peranakan shophouses along the river. The city’s layered Portuguese, Dutch, and British past is walkable in a day. Night river cruises add reflections of red buildings.',
  'Sipadan Island':
    'Sipadan off Sabah is a world-famous oceanic dive site with wall reefs, turtles, and barracuda tornadoes. Daily dive permits are limited; stays are on nearby Mabul or Kapalai. It ranks among the world’s top scuba destinations.',
  'Lake Kenyir':
    'Lake Kenyir in Terengganu is Southeast Asia’s largest man-made lake, created by a hydroelectric dam amid rainforest. Houseboats, fishing, and waterfall side-trips define visits. Wildlife includes elephants and hornbills along forested shores.',
  'Kanching Waterfalls':
    'Kanching Cascades (Air Terjun Kanching) near Rawang is a multi-tier waterfall park in Selangor with swimming pools and forest trails. It is a popular weekend escape from Kuala Lumpur. Upper tiers require short climbs on wet rock.',
  'Buddhist Maha Vihara Brickfields':
    'Buddhist Maha Vihara in Brickfields, Kuala Lumpur, is a historic Theravada monastery founded in the late 19th century and a centre for Buddhist education. The white stupa and shrine halls serve a diverse urban congregation. Wesak celebrations here are among KL’s largest.',
  'Kinabatangan River':
    'The Kinabatangan River in Sabah is a premier wildlife-watching waterway for orangutans, proboscis monkeys, and hornbills. Lodge-based boat safaris run at dawn and dusk. Floodplain forest fragments make sightings surprisingly reliable.',

  'Buddha Tooth Relic Temple':
    'The Buddha Tooth Relic Temple in Singapore’s Chinatown is a Tang-style complex housing a sacred tooth relic and a museum. Rooftop gardens and a giant prayer wheel draw visitors upstairs. Evening lighting makes the facade a Chinatown landmark.',
  'Gardens by the Bay':
    'Gardens by the Bay features Supertree Grove, Cloud Forest, and Flower Dome conservatories on Marina Bay’s reclaimed waterfront. It is Singapore’s flagship contemporary garden attraction with millions of visits yearly. Night light shows illuminate the Supertrees.',
  'Chinatown Complex Market':
    'Chinatown Complex combines a wet market and one of Singapore’s most famous hawker centres on Smith Street. Upper floors sell produce while food stalls serve local classics. It is a reliable stop for authentic, affordable meals.',
  'Lau Pa Sat':
    'Lau Pa Sat is a Victorian cast-iron market structure in Singapore’s CBD, now a hawker food haven. Evening satay street closes the adjacent road for grill stalls. The octagonal hall is a National Monument.',
  'Sentosa Beach':
    'Sentosa’s engineered beaches (Siloso, Palawan, Tanjong) offer resort sand, cable-car views, and theme-park access. The island is Singapore’s main leisure playground. Universal Studios and the Merlion add family attractions.',
  'MacRitchie Reservoir Trail':
    'MacRitchie Reservoir holds boardwalks and the TreeTop Walk suspension bridge through secondary forest in central Singapore. Wildlife includes monkeys and rich birdlife. It is the city’s most popular long nature circuit.',
  'Pulau Ubin':
    'Pulau Ubin preserves kampung landscapes, bike trails, quarries, and mangroves a short bumboat ride from Changi. Chek Jawa wetlands are a biodiversity highlight. It offers a rural contrast to mainland Singapore.',
  'Bukit Timah Summit':
    'Bukit Timah Nature Reserve protects primary rainforest around Singapore’s highest natural hill. Short but steep trails reach the summit triangulation point. The reserve is a key habitat for native flora and macaques.',

  'Borobudur':
    'Borobudur in Central Java is the world’s largest Buddhist temple, a stone mandala of terraces and stupas with hundreds of Buddha statues and reliefs. Sunrise visits from nearby hills are popular. Park records put annual visits around four million in 2019.',
  'Prambanan':
    'Prambanan is a towering 9th-century Hindu temple complex dedicated to Shiva, Vishnu, and Brahma near Yogyakarta. Ramayana ballet performances are staged on some evenings. UNESCO listing pairs it culturally with nearby Buddhist monuments.',
  'Tanah Lot':
    'Tanah Lot is a Balinese sea temple on a rocky coastal outcrop, especially dramatic at sunset. Waves and tidal access shape when visitors can approach the shrine. It is one of Bali’s most visited puras.',
  'Uluwatu Temple':
    'Uluwatu sits on a sheer cliff on Bali’s Bukit peninsula and is famous for kecak dance at sunset. Guardians monkeys patrol the terraces. Ocean views stretch across the Indian Ocean.',
  'Pasar Baru':
    'Pasar Baru is a historic Jakarta street market for textiles, bags, and street food in Central Jakarta. Colonial-era planning still shapes its lanes. It remains a local shopping destination beyond malls.',
  'Ubud Art Market':
    'Ubud Art Market (Pasar Seni) opposite the royal palace sells Balinese crafts, batik, and souvenirs. Bargaining is expected; mornings are cooler and quieter. It anchors Ubud’s tourist centre with nearby temples and cafes.',
  'Kuta Beach':
    'Kuta Beach is Bali’s classic surf-and-nightlife shoreline, with long sand, sunset hawkers, and a dense hotel strip. Beginners learn to surf on gentle breaks. It remains the island’s most energetic tourist corridor.',
  'Nusa Dua':
    'Nusa Dua is a planned resort enclave on Bali’s Bukit peninsula with gated beaches, lagoon pools, and conference hotels. Water sports and calm reefs suit families. It contrasts with busier Kuta and Seminyak.',
  'Raja Ampat':
    'Raja Ampat in West Papua is a global coral biodiversity hotspot for diving and snorkeling among limestone islands. Liveaboards and eco-resorts base around Waigeo and Misool. Strict marine conservation underpins tourism.',
  'Mount Bromo':
    'Mount Bromo’s smoking crater in East Java’s Tengger caldera is a sunrise classic reached by jeep and short hike. Hindu Tenggerese ceremonies such as Yadnya Kasada continue at the volcano. The Sea of Sand surrounds the cone.',
  'Mount Merapi':
    'Merapi is Java’s most active volcano, with jeep lava tours and viewpoints from the Yogyakarta–Boyolali slopes. Eruptions periodically reshape access. Night tours seek glowing rockfall when activity allows.',
  'Tumpak Sewu':
    'Tumpak Sewu (“thousand waterfalls”) forms a semicircular curtain cascade in East Java, often compared to a tropical Niagara. A steep descent reaches the spray chamber. Goa Tetes cave is a common add-on.',
  'Komodo National Park':
    'Komodo National Park protects Komodo dragons on Komodo and Rinca, plus pink beaches and world-class diving. Boat trips from Labuan Bajo fill itineraries with treks and snorkels. UNESCO listing covers land and marine ecosystems.',
  'Gili Islands':
    'The Gili Islands off Lombok are car-free islets (Trawangan, Air, Meno) known for snorkeling, diving, and beach bars. Horse carts and bicycles replace motor traffic. Trawangan holds the liveliest nightlife.',
  'Lake Toba':
    'Lake Toba in North Sumatra is the world’s largest volcanic crater lake, with Samosir Island at its centre. Batak culture, hot springs, and ferry circuits define visits. The caldera landscape is visibly immense from hillside viewpoints.',
  'Sekumpul Waterfall':
    'Sekumpul in North Bali is a cluster of tall jungle waterfalls reached by a valley trek. Multiple cascades appear through dense vegetation after rains. It is among Bali’s most impressive inland nature sights.',
  'Broken Beach Nusa Penida':
    'Broken Beach (Pasih Uug) on Nusa Penida is a collapsed sea cave forming a rocky arch and circular bay. Cliff paths overlook surge channels without a conventional sand beach. Nearby Angel’s Billabong adds tide-pool swimming when calm.',

  'Chocolate Hills':
    'Bohol’s Chocolate Hills are hundreds of conical mounds that turn brown in the dry season, viewed from Carmen’s complex. Geological theories point to uplifted limestone weathering. The landscape is a National Geological Monument.',
  'Mount Apo':
    'Mount Apo is the Philippines’ highest peak, a multi-day trek in Mindanao through mossy forest and volcanic terrain. Hot springs and Lake Venado feature on common routes. Permits and guides are required.',
  'Boracay White Beach':
    'Boracay’s White Beach is a powder-sand shoreline famous for sunsets, sailing paraws, and nightlife. The island underwent a major rehabilitation closure in 2018 and reopened with stricter rules. Stations 1–3 organise the beach strip.',
  'El Nido Lagoons':
    'El Nido in northern Palawan is known for limestone lagoons, island-hopping tours, and clear water. Big Lagoon and Secret Lagoon are signature stops. The town is a gateway to Bacuit Bay.',
  'Siargao Cloud 9':
    'Cloud 9 is the reef break that put Siargao on the global surf map, with a photogenic viewing tower. The island also offers lagoons, caves, and increasingly busy tourism. Peak swell season is roughly September–November.',
  'Palawan Underground River':
    'Puerto Princesa Subterranean River National Park lets visitors boat through a navigable underground river in a limestone cave, a UNESCO World Heritage site. Park permits and boat slots are quota-managed. Monkeys and forest trails surround the wharf.',
  'Intramuros':
    'Intramuros is Manila’s walled Spanish colonial city, with Fort Santiago, San Agustin Church, and horse-drawn kalesas. Damaged in World War II, it remains the historic core of the capital. Walking tours unpack layers of colonial and wartime history.',
  'Quiapo Market':
    'Quiapo’s market streets around Quiapo Church sell religious items, electronics, clothes, and street food in a dense Manila bazaar. Friday crowds surge for Black Nazarene devotion. It is chaotic, local, and quintessentially urban Filipino.',
  'Baguio Night Market':
    'Baguio’s night market along Harrison Road is famous for ukay-ukay thrift fashion, street food, and cool highland evenings. It grew into a major Cordillera shopping strip for locals and tourists. Peak browsing runs after dusk into late night.',
  'Coron Island':
    'Coron Island offers Kayangan Lake, limestone cliffs, and nearby WWII wreck diving in northern Palawan waters. Twin Lagoon and hot springs are common tour stops. Access is via Coron town on Busuanga.',
  'Tubbataha Reefs':
    'Tubbataha Reefs Natural Park is a remote UNESCO marine park in the Sulu Sea, reachable only by liveaboard in season. Walls and lagoons host sharks, turtles, and huge fish schools. It is the Philippines’ premier expedition dive.',
  'Pagsanjan Falls':
    'Pagsanjan (Cavinti) Falls are reached by dugout boats through a gorge in Laguna, a classic day trip from Manila. The “shooting the rapids” return is part of the thrill. The main cascade plunges into a swimmable pool.',
  'Taal Lake':
    'Taal presents a lake within a volcano within a lake, viewed from Tagaytay ridge or by boat to Volcano Island when open. Eruptions periodically close access. The crater landscape is one of Luzon’s signature sights.',
  'Puerto Galera':
    'Puerto Galera on Mindoro’s north coast is a long-established dive and beach resort area with multiple coves. Ferries from Batangas make it a weekend escape from Manila. Coral reefs sit close to shore in several bays.',
  'Binondo Chinatown Market':
    'Binondo is often called the world’s oldest Chinatown, with food streets, temples, and wet markets in Manila. Culinary walks sample dumpling shops and hopia bakeries. It remains a living commercial district, not only a tourist set.',

  'Omar Ali Saifuddien Mosque':
    'Omar Ali Saifuddien Mosque in Bandar Seri Begawan is Brunei’s iconic golden-domed mosque set beside an artificial lagoon. Completed in the 1950s, it is a national landmark of Islamic architecture. Non-Muslim visitors may enter outside prayer times with dress rules.',
  'Tamu Kianggeh':
    'Tamu Kianggeh is Bandar’s open-air produce and local-goods market beside the river. Stalls sell fruit, snacks, and everyday necessities. It offers a glimpse of Bruneian daily commerce near the water village.',
  'Serasa Beach':
    'Serasa Beach near Muara is a popular local water-sports and picnic beach with a long jetty. Weekends draw families from the capital. Facilities are simple compared with resort coasts elsewhere in ASEAN.',
  'Ulu Temburong National Park':
    'Ulu Temburong protects pristine Bornean rainforest reached by boat and road into Temburong district. Canopy walkways and guided treks showcase biodiversity. The park is central to Brunei’s green tourism image.',
  'Tasek Lama Waterfall':
    'Tasek Lama is a city-edge waterfall and park hike popular with Bandar residents. Trails climb to reservoirs and forest viewpoints. It is an easy nature break within the capital area.',
  'Kampong Ayer Heritage':
    'Kampong Ayer is Brunei’s historic water village of stilt houses linked by boardwalks on the Brunei River, often called the Venice of the East. Schools, mosques, and homes sit over the water. Boat taxis weave through the lanes.',
  'Selirong Island Forest Reserve':
    'Selirong Island in Brunei Bay is a mangrove forest reserve with boardwalks for birdwatching and crab-eating macaques. Guided visits highlight tidal ecology near Temburong. It is one of Brunei’s accessible island nature trips.',
  'Brunei River Cruise':
    'Brunei River cruises pass Kampong Ayer, mangrove channels, and sometimes proboscis monkeys at dusk. Tours depart near the waterfront in Bandar Seri Begawan. The skyline of mosques frames the return journey.',

  'Cristo Rei Dili':
    'Cristo Rei is a hilltop Christ statue overlooking Dili Bay, inaugurated in the 1990s as a national landmark. A stepped path climbs to panoramic views of the capital and Atauro Island. It is Timor-Leste’s most visited viewpoint.',
  'Jaco Island':
    'Jaco Island at Timor’s eastern tip is a sacred, uninhabited islet with clear water and white sand, reached by short boat from Valu Beach. Overnight stays are traditionally restricted. Snorkelling and beach time define day visits.',
  'Atauro Island Dive Sites':
    'Atauro Island north of Dili is renowned for exceptional coral biodiversity and diving, with community-based tourism growing in villages. Ferries and charter boats cross from the capital. Hills and quiet beaches complement underwater attractions.',

  'Wat Ong Teu':
    'Wat Ong Teu Mahawihan in Vientiane is an important monastery historically linked to Lao Buddhist scholarship and reform. The sim (ordination hall) holds a large bronze Buddha. It sits near other central Vientiane temples.',
  'Cao Dai Tay Ninh':
    'The Cao Dai Holy See in Tay Ninh is a colourful temple of Vietnam’s syncretic Cao Dai faith, northwest of Ho Chi Minh City. Midday prayer ceremonies welcome respectful visitors. Dragon columns and all-seeing-eye motifs fill the nave.',
  'Mount Makiling Trail':
    'Mount Makiling is a legendary sacred mountain and biodiversity reserve south of Manila in Laguna–Batangas. Hiking trails and hot springs attract students and weekenders. Folklore of Maria Makiling still shapes local identity.',
  'Doi Pha Hom Pok':
    'Doi Pha Hom Pok National Park near Fang holds Thailand’s second-highest peak, with cool highland forests and viewpoints. Birdwatchers prize its migratory species. Misty ridges feel remote compared with Chiang Mai city.',
  'Mount Agung':
    'Mount Agung is Bali’s sacred volcano towering over Besakih, the island’s mother temple complex. Climbs are guided and sometimes closed after eruptions. The mountain dominates eastern Bali’s spiritual geography.',
  'Mount Zwegabin':
    'Mount Zwegabin near Hpa-an is a limestone peak with a long covered stairway to hilltop monasteries and panoramas of Kayin State. Pilgrims and trekkers share the climb. Twin pagodas crown the summit ridge.',
  'Erawan Falls':
    'Erawan Falls in Kanchanaburi’s national park cascade through seven turquoise limestone tiers with fish-filled pools. Crowds fill lower levels on weekends; upper tiers need more climbing. The park is a classic escape from Bangkok.',
  'Datanla Waterfall':
    'Datanla near Da Lat combines forest waterfalls with an alpine coaster and Pongour day-trip circuits in the Central Highlands. Cool climate and pine scenery surround the cascades. It is an easy family nature stop.',
  'Maria Cristina Falls':
    'Maria Cristina Falls near Iligan in Mindanao are powerful twin cascades harnessed for hydroelectric power. View platforms face the white water in a landscaped park. The falls are a symbol of the city.',
  'Pulau Payar Marine Park':
    'Pulau Payar off Kedah is a marine park island for snorkeling day trips from Langkawi or Penang routes. Coral gardens and a floating platform organise swimming. Feeding of fish is regulated by park rules.',
  'Thousand Islands Jakarta':
    'Kepulauan Seribu (Thousand Islands) in the Java Sea offers day-trip islands north of Jakarta for snorkeling and beach escapes. Ferries and speedboats leave from Marina Ancol. Water quality varies by island distance from the mainland.',
  'Irrawaddy Dolphin Cruise':
    'Boat trips on the Ayeyarwady north of Mandalay seek endangered Irrawaddy dolphins with local fishermen who still practice cooperative casting. Sightings are not guaranteed as numbers are low. Conservation tourism supports monitoring efforts.',
  'Pasar Malam Geylang Serai':
    'Geylang Serai’s pasar malam atmosphere in Singapore intensifies during Ramadan with Malay–Muslim food stalls and festive lights. Year-round the neighbourhood is a centre for Malay culture and dining. It sits near Paya Lebar transport links.',
  'Ywama Floating Market':
    'Ywama (Ywama) on Inle Lake is known for a floating and shoreline market that rotates with other lake villages on a five-day cycle. Boats cluster with produce, crafts, and noodles for sale. Confirm the market day when planning a visit.',
};

function applyEnrichment(row) {
  const name = row[0];
  const next = REPLACEMENTS[name] ? [...REPLACEMENTS[name]] : [...row];
  const finalName = next[0];
  if (DESCRIPTIONS[finalName]) {
    next[6] = DESCRIPTIONS[finalName];
  } else if (!next[6] || next[6].length < 40) {
    throw new Error(`Missing enrichment description for: ${finalName}`);
  }
  if (VISITOR_OVERRIDES[finalName] != null) {
    next[8] = VISITOR_OVERRIDES[finalName];
  }
  next[13] = 'real';
  return next;
}

module.exports = {
  REPLACEMENTS,
  DESCRIPTIONS,
  VISITOR_OVERRIDES,
  applyEnrichment,
};
