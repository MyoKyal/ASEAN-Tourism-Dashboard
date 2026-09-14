# ASEAN Tourism Dashboard — System Documentation

**Course context:** Big Data / NoSQL (MongoDB) · **Stack:** MongoDB, Express, React, Node (MERN)

This document explains what the system does end-to-end, how MongoDB’s document model and aggregation features are used, and how the Myanmar-vs-ASEAN comparison feature works — with concrete examples.

Related file: [schema-design.md](./schema-design.md) (focused modeling decisions for the project report).

---

## 1. What the system does

The **ASEAN Tourism Dashboard** is an interactive web application for exploring tourism sites across all **11 ASEAN member countries**:

Myanmar, Thailand, Vietnam, Laos, Cambodia, Malaysia, Singapore, Indonesia, Philippines, Brunei, and Timor-Leste (admitted October 2025; intentionally thin data coverage).

### Core capabilities

| Feature | What the user sees |
|---|---|
| **ASEAN map (home)** | Color-coded country polygons only (no road/label clutter). Category markers for each tourism site. Filters by country, category, type, and minimum rating. |
| **Site detail** | Click a marker → name, country, category/type, description, rating, entrance fee, and a 2019–2023 visitor trend chart. |
| **Compare** | Start from a **Myanmar** site (search or map click). The system finds other ASEAN sites of the **same category and type**, ranks them by latest-year visitors, and supports **one-to-one** comparison when you click a peer. |
| **Stats** | Summary cards and charts (sites per country/category, estimated latest-year visitors). |

### Domain model (categories & types)

Sites are classified with a fixed vocabulary (validated on the server):

- **Pagodas & Temples** — Golden Stupa, Temple Complex, Cave Temple, Monastery, Pilgrimage Site/Ruins  
- **Markets** — Night Market, Floating Market, Wet Market, Flea Market, Street Market  
- **Beaches** — White Sand, Diving/Snorkeling, Surfing, Resort Beach, Rocky Coast  
- **Mountains & Highlands** — Trekking Peak, Volcanic, Sacred Mountain, Viewpoint/Hill Station  
- **Waterfalls** — Multi-tier, Single Drop, Cave Waterfall  
- **Heritage & Ruins** — Ancient City, Colonial Architecture, UNESCO Site  
- **Islands** — Private Island, Island Group, National Marine Park  
- **Lakes & Rivers** — Crater Lake, River Delta, Scenic River Cruise  

Comparison is only meaningful **within the same category + type** (e.g. Myanmar Golden Stupa vs other ASEAN Golden Stupas — not vs beaches).

---

## 2. High-level architecture

```text
┌─────────────────────┐         REST / JSON          ┌─────────────────────┐
│  React client       │  ←────────────────────────→  │  Express API        │
│  (Vite + Leaflet    │     /api/sites, /compare,    │  (Node + Mongoose)  │
│   + Recharts)       │     /stats, /meta, …         │                     │
└─────────────────────┘                              └──────────┬──────────┘
                                                                │
                                                                ▼
                                                     ┌─────────────────────┐
                                                     │  MongoDB            │
                                                     │  DB: asean_tourism  │
                                                     │  Collection: sites  │
                                                     └─────────────────────┘
```

### Responsibilities

- **Client (`client/`)** — Map UI, filters, charts, comparison interaction. Calls the API; does **not** run MongoDB queries.
- **Server (`server/`)** — Validation, filtering, geospatial queries, and **aggregation pipelines** (stats + compare).
- **MongoDB** — Single primary collection `sites`; indexes for filter, compare, and `$near`.

### Typical data flow (map)

1. Browser loads `/` → React Map page.  
2. `GET /api/meta/categories` fills filter dropdowns.  
3. `GET /api/sites?country=…&category=…` returns matching documents.  
4. Client draws ASEAN GeoJSON polygons + Leaflet markers.  
5. Marker click opens a side panel; yearly visitors are already embedded in the document (no second fetch required for the chart).

---

## 3. How NoSQL / MongoDB is applied

This project uses MongoDB as a **document store**, not a relational database. The design choices below are intentional for a NoSQL course.

### 3.1 One collection, one document per site

Each tourism site is **one JSON-like document** in `sites`. A simplified example:

```json
{
  "_id": "ObjectId(...)",
  "name": "Shwedagon Pagoda",
  "slug": "shwedagon-pagoda-myanmar",
  "country": "Myanmar",
  "category": "Pagodas & Temples",
  "type": "Golden Stupa",
  "location": {
    "type": "Point",
    "coordinates": [96.1498, 16.7984]
  },
  "description": "Iconic gilded stupa dominating the Yangon skyline…",
  "establishedYear": 585,
  "yearlyVisitors": [
    { "year": 2019, "visitors": 2500000 },
    { "year": 2020, "visitors": 700000 },
    { "year": 2021, "visitors": 875000 },
    { "year": 2022, "visitors": 1800000 },
    { "year": 2023, "visitors": 2375000 }
  ],
  "rating": 4.8,
  "entranceFee": "medium",
  "tags": ["yangon", "buddhist", "landmark"],
  "imageQuery": "Shwedagon Pagoda Yangon golden stupa",
  "dataProvenance": "real",
  "createdAt": "2026-…"
}
```

**Why this matters for NoSQL:** the UI’s “site card” (map popup + chart + compare inputs) matches the document boundary. You fetch **one document** and have everything needed for that site.

### 3.2 Embedded array vs separate visitor collection

`yearlyVisitors` is an **embedded array**, not a second collection with foreign keys.

| Relational-style approach | Document approach used here |
|---|---|
| `sites` + `site_visitors(site_id, year, visitors)` + JOIN | Visitors live inside the site document |
| Two queries or a join for every chart | One read; aggregation can take the last year with `$arrayElemAt` |

Visitor series are short (5 years) and always consumed with the site → embedding is the natural NoSQL pattern.

### 3.3 Strings for category/type (denormalization)

`category` and `type` are plain strings (validated against `categoryTypes.js`), **not** ObjectId references to a `categories` collection.

- Fast `$match` / `$group` for filters, stats, and compare  
- No `$lookup` joins on the hottest paths  
- Closed vocabulary → validation is enough; a normalized “category table” adds little value  

### 3.4 GeoJSON + `2dsphere`

Location uses MongoDB’s GeoJSON `Point` (`[longitude, latitude]`). A **`2dsphere`** index powers:

`GET /api/sites/near?lng=96.15&lat=16.8&maxDistanceKm=50`

This is a first-class MongoDB geospatial feature — awkward to replicate cleanly in a simple relational schema without GIS extensions.

### 3.5 Indexes aligned to query patterns

| Index | Supports |
|---|---|
| `{ location: "2dsphere" }` | Near-me geospatial queries |
| `{ category: 1, type: 1 }` | Comparison + type filters |
| `{ country: 1, category: 1 }` | Map country/category filters |

### 3.6 Aggregation pipelines (server-side analytics)

MongoDB **aggregation** computes summaries and rankings **in the database**, in one round trip:

- **`GET /api/stats/overview`** — `$facet` / `$group` for totals, sites per country/category, sum of latest-year visitors  
- **`GET /api/compare`** — match same category/type → derive latest visitors → sort → assign ranks → percentile → split peers  

In a relational design, the same logic often becomes multiple queries plus application-level sorting. Here, the pipeline is the “why MongoDB” talking point for the course.

### 3.7 Flexible coverage (Timor-Leste)

Timor-Leste has only a handful of sites and may be absent from some categories. Document stores tolerate **sparse, uneven** coverage without nullable columns across many junction tables.

### 3.8 Data disclaimer

Visitor **names and places** are real ASEAN destinations with expanded descriptions. Selected 2019 baselines follow published figures where available (e.g. Angkor foreign tickets, Borobudur park visits, Ha Long Bay arrivals); the full yearly series remains a coursework COVID-dip model, not official ministry time series for every site.

---

## 4. How comparison works

### 4.1 Product rules

1. The comparison tool **starts from a Myanmar site** (search autocomplete is Myanmar-only; map flow highlights Myanmar first).  
2. Peers are sites with the **same `category` and `type`**, in **other ASEAN countries** (Myanmar peers of the same type are excluded from the “other ASEAN” peer list).  
3. Ranking uses each site’s **most recent year** in `yearlyVisitors` (seed data: 2023).  
4. **Percentile** is computed among **all** sites in that category/type (including other Myanmar sites), so the source’s standing in the full peer group is clear.  
5. **One-to-one mode:** after peers load, the user clicks another marker (or a peer in the list) → side-by-side stats + dual trend chart (Myanmar vs that peer only).

### 4.2 API

```http
GET /api/compare/search?q=shwe
→ Myanmar name autocomplete

GET /api/compare?siteId=<ObjectId>&limit=15
→ source + peers + ranking + percentile
```

### 4.3 Aggregation pipeline (conceptual)

```text
$match     { category, type }           // same bucket as the Myanmar source
$addFields latestVisitors, latestYear   // from embedded yearlyVisitors array
$sort      latestVisitors descending
$group     push all into one array + count
$project   assign rank 1..N
$project   sourceEntry, peers (≠ source country), percentile
```

**Percentile (simplified):**  
If there are `N` sites in the bucket and the source has rank `R` (1 = most visitors):

\[
\text{percentile} \approx \frac{N - R}{N - 1} \times 100
\]

Higher percentile ⇒ stronger visitor standing in that category/type.

### 4.4 UI flow

```text
User selects Myanmar site (search or map)
        │
        ▼
GET /api/compare?siteId=…
        │
        ▼
Map shows source (highlighted) + peer markers
Sidebar shows rank / percentile / peer list
        │
        ▼
User clicks peer site (e.g. Wat Pho)
        │
        ▼
One-to-one panel: visitors, rating, 2019–2023 dual line chart
```

---

## 5. Comparison examples

> Numbers below are **illustrative** of the seed shape (COVID dip then recovery). Exact seeded values may vary slightly after re-seed.

### Example A — Golden Stupa (narrow type)

**Source:** Shwedagon Pagoda (Myanmar), `Pagodas & Temples` / `Golden Stupa`

| Step | Result |
|---|---|
| Match same category + type | Other Golden Stupas in ASEAN (e.g. Pha That Luang in Laos, Thai chedis typed as Golden Stupa, etc.) |
| Exclude Myanmar from **peers** | Other Myanmar golden stupas (Sule, Shwezigon, …) stay in the **full ranking** for percentile but are not listed as “other ASEAN” peers |
| Rank by 2023 visitors | Highest latestVisitors → rank 1 |
| One-to-one | User clicks **Pha That Luang** → VS panel compares Shwedagon vs Pha That Luang trends only |

**What this shows:** a **precise** like-for-like type comparison. The peer set can be small if few countries use that exact type label.

### Example B — Temple Complex (rich peer set)

**Source:** Bagan Temple Complex (Myanmar), `Pagodas & Temples` / `Temple Complex`

| Peer country (examples) | Example peers of type Temple Complex |
|---|---|
| Thailand | Wat Pho, Wat Arun, Wat Phra Kaew, … |
| Cambodia | Bayon Temple, Silver Pagoda, … |
| Laos | Wat Xieng Thong, Wat Si Saket, … |
| Indonesia | Borobudur, Prambanan, … |
| Vietnam / others | Cao Dai Tay Ninh, … |

**Typical API shape:**

```json
{
  "category": "Pagodas & Temples",
  "type": "Temple Complex",
  "source": {
    "name": "Bagan Temple Complex",
    "country": "Myanmar",
    "latestVisitors": 760000,
    "rank": 7,
    "isSource": true
  },
  "peers": [
    { "name": "Wat Pho", "country": "Thailand", "latestVisitors": 3300000, "rank": 1 },
    { "name": "Borobudur", "country": "Indonesia", "latestVisitors": 1900000, "rank": 2 }
  ],
  "totalInCategoryType": 16,
  "sourceRank": 7,
  "percentile": 60
}
```

**How to read it:**

- Among **16** Temple Complex sites in ASEAN (all countries), Bagan is **#7**.  
- Percentile **~60** means it sits above a majority of that bucket by latest-year visitors (exact formula as in §4.3).  
- **Peers** are non-Myanmar sites — ideal for the course narrative “Myanmar vs the rest of ASEAN.”  
- Clicking **Wat Pho** on the map switches to one-to-one: absolute visitors + COVID recovery shape side by side.

### Example C — Empty / thin peer set

**Source:** A Myanmar site whose `type` is rare outside Myanmar.

- Pipeline still returns the source.  
- `peers: []`  
- UI shows a clear empty state instead of blank charts (“No other ASEAN sites share this category and type…”).  

This is expected for some types and is preferable to inventing false matches across unrelated types.

### Example D — Beaches (non-temple)

**Source:** Ngapali Beach (Myanmar), `Beaches` / `Resort Beach`

Peers might include Patong (Thailand), Nusa Dua (Indonesia), Sentosa Beach (Singapore), etc. — **same type**, different countries. The aggregation logic is identical to temples; only the matched strings change.

---

## 6. API surface (summary)

| Endpoint | Role |
|---|---|
| `GET /api/sites` | List/filter sites (`country`, `category`, `type`, `minRating`) |
| `GET /api/sites/:id` | Full site document |
| `GET /api/sites/near` | Geospatial `$near` via `2dsphere` |
| `GET /api/meta/categories` | Fixed category → types map for UI |
| `GET /api/stats/overview` | Aggregation: totals and breakdowns |
| `GET /api/compare` | Aggregation: rank + percentile + peers |
| `GET /api/compare/search` | Myanmar-only name autocomplete |

Full request/response notes live in the root [README.md](../README.md).

---

## 7. Frontend routes

| Route | Page |
|---|---|
| `/` | ASEAN map (home) |
| `/compare` | Myanmar vs ASEAN comparison (map + one-to-one) |
| `/overview` | Stats dashboard |

---

## 8. Why this design fits a NoSQL / MongoDB course

1. **Document modeling** — site-centric documents with embedded time series match how the UI reads data.  
2. **Denormalized facets** — string `category` / `type` enable fast filter and compare without joins.  
3. **Aggregation** — comparison ranking and percentile run in **one pipeline round trip**.  
4. **Geospatial** — GeoJSON + `2dsphere` for “sites near me.”  
5. **Flexible documents** — uneven country coverage (e.g. Timor-Leste) without rigid schemas.  

Together, the schema doc and the compare aggregation are the strongest “why not only SQL?” arguments for the project report.

---

## 9. How to run (quick)

```bash
# Terminal 1 — API + seed
cd server
npm install
npm run seed
npm run dev

# Terminal 2 — UI
cd client
npm install
npm run dev
```

Open http://localhost:5173 — use **Map** to explore, **Compare** to run Myanmar-vs-ASEAN examples such as Bagan Temple Complex vs Wat Pho.
