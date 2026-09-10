# ASEAN Tourism Dashboard

Interactive MERN dashboard for exploring tourism sites across all **11 ASEAN countries**, with map filtering and a Myanmar-vs-ASEAN comparison tool powered by MongoDB aggregation.

## Stack

- **MongoDB** + Mongoose (GeoJSON, compound indexes, aggregation)
- **Express** API (`server/`)
- **React** + Vite + Leaflet + Recharts (`client/`)
- **Node.js**

## Quick start

### Prerequisites

- Node.js 18+
- MongoDB running locally (default URI: `mongodb://127.0.0.1:27017/asean_tourism`)

### 1. Backend

```bash
cd server
npm install
cp .env.example .env   # or use the included .env
npm run seed           # writes sites.seed.json + inserts ~160 sites
npm run dev            # http://localhost:5000
```

### 2. Frontend

```bash
cd client
npm install
npm run dev            # http://localhost:5173 (proxies /api → :5000)
```

Open [http://localhost:5173](http://localhost:5173).

## Project structure

```
docs/schema-design.md          # NoSQL modeling rationale (course report)
server/
  src/config/categoryTypes.js  # Fixed category → types map
  src/models/Site.js           # Mongoose schema + indexes
  src/data/sites.seed.json     # Seed dataset (inspect/reuse)
  src/data/sitesData.js        # Source definitions for seeding
  src/scripts/seed.js
  src/controllers/…            # Route handlers + aggregations
  src/routes/api.js
  src/index.js
client/
  src/pages/OverviewPage.jsx
  src/pages/MapPage.jsx
  src/pages/ComparePage.jsx
```

## API reference

Base URL: `http://localhost:5000/api`

### `GET /sites`

List sites. Query params: `country` (comma-separated), `category`, `type`, `minRating`.

```bash
curl "http://localhost:5000/api/sites?country=Myanmar&category=Pagodas%20%26%20Temples"
```

Example response (truncated):

```json
[
  {
    "_id": "...",
    "name": "Shwedagon Pagoda",
    "country": "Myanmar",
    "category": "Pagodas & Temples",
    "type": "Golden Stupa",
    "location": { "type": "Point", "coordinates": [96.1498, 16.7984] },
    "yearlyVisitors": [
      { "year": 2019, "visitors": 2500000 },
      { "year": 2020, "visitors": 700000 }
    ],
    "rating": 4.8,
    "entranceFee": "medium"
  }
]
```

### `GET /sites/:id`

Full site document. `404` if missing; `400` for invalid ObjectId.

### `GET /sites/near?lng=&lat=&maxDistanceKm=`

Geospatial `$near` query using the `2dsphere` index. `maxDistanceKm` defaults to `50`.

```bash
curl "http://localhost:5000/api/sites/near?lng=96.15&lat=16.8&maxDistanceKm=30"
```

### `GET /meta/categories`

Fixed category → types object for filter dropdowns.

```json
{
  "Pagodas & Temples": ["Golden Stupa", "Temple Complex", "..."],
  "Markets": ["Night Market", "Floating Market", "..."]
}
```

### `GET /stats/overview`

Aggregation summary: total sites, sites per country/category, estimated latest-year visitors per country and overall.

### `GET /compare?siteId=&limit=`

**Comparison endpoint.** Given a site id (intended: Myanmar), finds other ASEAN sites with the **same category and type** (excluding the source country), ranks by latest-year visitors via aggregation, and returns percentile among all sites in that category/type.

```bash
curl "http://localhost:5000/api/compare?siteId=YOUR_OBJECT_ID&limit=10"
```

Example shape:

```json
{
  "source": { "name": "Shwedagon Pagoda", "latestVisitors": 2300000, "isSource": true },
  "peers": [{ "name": "Wat Pho", "country": "Thailand", "latestVisitors": 3200000 }],
  "ranking": [],
  "totalInCategoryType": 8,
  "sourceRank": 2,
  "percentile": 85.7,
  "category": "Pagodas & Temples",
  "type": "Golden Stupa"
}
```

### `GET /compare/search?q=`

Autocomplete over **Myanmar** site names only.

```bash
curl "http://localhost:5000/api/compare/search?q=shwe"
```

## Frontend routes

| Route | Page |
|---|---|
| `/` | Overview stats dashboard |
| `/map` | Leaflet map + filters + site panel |
| `/compare` | Myanmar → ASEAN comparison |

## Data disclaimer

Visitor numbers for coursework are **synthetic or AI-approximated**, not official tourism-board figures. Seed entries include `dataProvenance: "real" | "invented"` so invented regional fillers are clear in reports. See also [docs/schema-design.md](docs/schema-design.md).

## Environment

| Variable | Default | Where |
|---|---|---|
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/asean_tourism` | `server/.env` |
| `PORT` | `5000` | `server/.env` |
| `CLIENT_ORIGIN` | `http://localhost:5173` | `server/.env` |
| `VITE_API_URL` | `` (use Vite proxy) | optional client |
