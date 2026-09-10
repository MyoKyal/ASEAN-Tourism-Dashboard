# Schema Design Decisions — ASEAN Tourism Dashboard

This document explains the MongoDB / NoSQL modeling choices for the `sites` collection used in the ASEAN Tourism Dashboard (Big Data / NoSQL course project).

## Collection overview

A single `sites` collection stores one document per tourism site. Each document embeds location (GeoJSON), category/type as strings, and a multi-year `yearlyVisitors` array. There are no separate collections for categories, types, or visitor time series.

## Why an embedded `yearlyVisitors` array (not a subcollection)

Visitor history is always read **with** the site: map popups, detail panels, trend charts, and the Myanmar-vs-ASEAN comparison all need the same site’s yearly series in one response.

| Approach | Trade-off |
|---|---|
| **Embedded array** `{ year, visitors }[]` | One document read; aggregation can `$unwind` / `$arrayElemAt` for latest year and percentile ranking in a single pipeline. Fits the access pattern. |
| Separate `visitors` collection | Extra round trips or `$lookup` joins for every chart and compare call — more like a relational model and weaker for this dashboard’s read shape. |

We keep **at least five years** (2019–2023 in the seed) so trends and COVID dip/recovery are visible without another collection.

**When a separate collection would make sense:** very long time series (decades of monthly points), or visitors shared across many entities. Neither applies here.

## Why `category` and `type` are strings (not references)

Categories and types are a **closed, tiny vocabulary** (8 categories, fixed types per category), defined once in `categoryTypes.js` and validated on write.

- **Filtering / faceting:** map filters and comparison (`match` on `category` + `type`) stay simple equality predicates — no joins.
- **Aggregation:** `sites per category`, compare-by-type ranking, and overview stats are natural `$group` / `$match` stages on denormalized strings.
- **Refs would buy little:** there is no rich category metadata that changes often; joining would slow the hot paths (map list + compare).

Validation still enforces the fixed map via Mongoose enums + a custom type validator against `categoryTypes.js`.

## GeoJSON `Point` and `2dsphere`

Coordinates are stored as GeoJSON:

```json
{ "type": "Point", "coordinates": [lng, lat] }
```

A `2dsphere` index supports `GET /api/sites/near` (`$near` / max distance). Longitude-first order matches MongoDB’s GeoJSON convention.

## Compound indexes

| Index | Query pattern |
|---|---|
| `{ category: 1, type: 1 }` | Comparison tool + type filters |
| `{ country: 1, category: 1 }` | Map country/category filters |
| `{ location: "2dsphere" }` | Near-me geospatial queries |

## Other field notes

- **`slug`:** unique URL-friendly id for future deep links; ObjectId remains the primary API `:id`.
- **`entranceFee`:** enum `free | low | medium | high` — ordinal tier, not currency, so cross-country fee comparison stays simple.
- **`imageQuery`:** short search phrase for later photo lookup (no binary blobs in MongoDB).
- **`dataProvenance`:** `real` vs `invented` marks seed authenticity for the project report (visitor counts for landmarks are approximations, not official tourism-board figures).

## Why MongoDB fits this project

1. **Document model** matches a site-centric UI (one payload = map marker + chart).
2. **Aggregation** implements comparison ranking and percentile in one round trip without application-level sorting of large joins.
3. **Geospatial** indexes are first-class for “sites near me.”
4. Flexible documents allow thin coverage for Timor-Leste without sparse relational tables.
