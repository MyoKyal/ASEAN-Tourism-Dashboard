const Site = require('../models/Site');
const { CATEGORY_TYPES } = require('../config/categoryTypes');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** GET /api/sites */
async function listSites(req, res, next) {
  try {
    const filter = {};
    const { country, category, type, minRating } = req.query;

    if (country) {
      const countries = String(country)
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);
      if (countries.length === 1) filter.country = countries[0];
      else if (countries.length > 1) filter.country = { $in: countries };
    }
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (minRating !== undefined && minRating !== '') {
      const n = Number(minRating);
      if (Number.isNaN(n) || n < 0 || n > 5) {
        return res.status(400).json({ error: 'minRating must be a number between 0 and 5' });
      }
      filter.rating = { $gte: n };
    }

    const sites = await Site.find(filter).lean();
    res.json(sites);
  } catch (err) {
    next(err);
  }
}

/** GET /api/sites/near */
async function sitesNear(req, res, next) {
  try {
    const lng = Number(req.query.lng);
    const lat = Number(req.query.lat);
    const maxDistanceKm = Number(req.query.maxDistanceKm ?? 50);

    if (Number.isNaN(lng) || Number.isNaN(lat)) {
      return res.status(400).json({ error: 'lng and lat are required numbers' });
    }
    if (Number.isNaN(maxDistanceKm) || maxDistanceKm <= 0) {
      return res.status(400).json({ error: 'maxDistanceKm must be a positive number' });
    }

    const sites = await Site.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: maxDistanceKm * 1000,
        },
      },
    }).lean();

    res.json(sites);
  } catch (err) {
    next(err);
  }
}

/** GET /api/sites/:id */
async function getSite(req, res, next) {
  try {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid site id' });
    }
    const site = await Site.findById(id).lean();
    if (!site) return res.status(404).json({ error: 'Site not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
}

/** GET /api/meta/categories */
function getCategories(_req, res) {
  res.json(CATEGORY_TYPES);
}

/** GET /api/stats/overview */
async function statsOverview(_req, res, next) {
  try {
    const [summary] = await Site.aggregate([
      {
        $facet: {
          totalSites: [{ $count: 'count' }],
          byCountry: [
            { $group: { _id: '$country', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          byCategory: [
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
          ],
          visitorsByCountry: [
            {
              $project: {
                country: 1,
                latestVisitors: {
                  $let: {
                    vars: {
                      sorted: {
                        $sortArray: {
                          input: '$yearlyVisitors',
                          sortBy: { year: 1 },
                        },
                      },
                    },
                    in: { $arrayElemAt: ['$$sorted.visitors', -1] },
                  },
                },
              },
            },
            {
              $group: {
                _id: '$country',
                totalLatestVisitors: { $sum: '$latestVisitors' },
              },
            },
            { $sort: { totalLatestVisitors: -1 } },
          ],
          totalLatestVisitors: [
            {
              $project: {
                latestVisitors: {
                  $let: {
                    vars: {
                      sorted: {
                        $sortArray: {
                          input: '$yearlyVisitors',
                          sortBy: { year: 1 },
                        },
                      },
                    },
                    in: { $arrayElemAt: ['$$sorted.visitors', -1] },
                  },
                },
              },
            },
            {
              $group: {
                _id: null,
                total: { $sum: '$latestVisitors' },
              },
            },
          ],
        },
      },
    ]);

    res.json({
      totalSites: summary.totalSites[0]?.count ?? 0,
      totalCountries: summary.byCountry.length,
      totalCategories: summary.byCategory.length,
      sitesPerCountry: summary.byCountry.map((r) => ({
        country: r._id,
        count: r.count,
      })),
      sitesPerCategory: summary.byCategory.map((r) => ({
        category: r._id,
        count: r.count,
      })),
      visitorsPerCountry: summary.visitorsByCountry.map((r) => ({
        country: r._id,
        totalEstimatedVisitors: r.totalLatestVisitors,
      })),
      totalEstimatedVisitorsLatestYear:
        summary.totalLatestVisitors[0]?.total ?? 0,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/compare?siteId=&limit=
 * Aggregation: same category/type, rank by latest-year visitors, percentile of source.
 */
async function compareSites(req, res, next) {
  try {
    const { siteId } = req.query;
    const limit = Math.min(Number(req.query.limit) || 15, 50);

    if (!siteId || !String(siteId).match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Valid siteId query param is required' });
    }
    if (Number.isNaN(limit) || limit < 1) {
      return res.status(400).json({ error: 'limit must be a positive number' });
    }

    const source = await Site.findById(siteId).lean();
    if (!source) return res.status(404).json({ error: 'Site not found' });

    const [result] = await Site.aggregate([
      {
        $match: {
          category: source.category,
          type: source.type,
        },
      },
      {
        $addFields: {
          latestVisitors: {
            $let: {
              vars: {
                sorted: {
                  $sortArray: {
                    input: '$yearlyVisitors',
                    sortBy: { year: 1 },
                  },
                },
              },
              in: { $arrayElemAt: ['$$sorted.visitors', -1] },
            },
          },
          latestYear: {
            $let: {
              vars: {
                sorted: {
                  $sortArray: {
                    input: '$yearlyVisitors',
                    sortBy: { year: 1 },
                  },
                },
              },
              in: { $arrayElemAt: ['$$sorted.year', -1] },
            },
          },
          isSource: { $eq: ['$_id', source._id] },
        },
      },
      { $sort: { latestVisitors: -1, name: 1 } },
      {
        $group: {
          _id: null,
          sites: { $push: '$$ROOT' },
          total: { $sum: 1 },
        },
      },
      {
        $project: {
          total: 1,
          ranked: {
            $map: {
              input: { $range: [0, '$total'] },
              as: 'i',
              in: {
                $mergeObjects: [
                  { $arrayElemAt: ['$sites', '$$i'] },
                  { rank: { $add: ['$$i', 1] } },
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          total: 1,
          sourceEntry: {
            $first: {
              $filter: {
                input: '$ranked',
                as: 's',
                cond: { $eq: ['$$s._id', source._id] },
              },
            },
          },
          peers: {
            $filter: {
              input: '$ranked',
              as: 's',
              cond: {
                $and: [
                  { $ne: ['$$s._id', source._id] },
                  { $ne: ['$$s.country', source.country] },
                ],
              },
            },
          },
          allRanked: '$ranked',
        },
      },
      {
        $project: {
          totalInCategoryType: '$total',
          sourceRank: '$sourceEntry.rank',
          percentile: {
            $cond: [
              { $lte: ['$total', 1] },
              100,
              {
                $round: [
                  {
                    $multiply: [
                      {
                        $divide: [
                          { $subtract: ['$total', '$sourceEntry.rank'] },
                          { $subtract: ['$total', 1] },
                        ],
                      },
                      100,
                    ],
                  },
                  1,
                ],
              },
            ],
          },
          peers: { $slice: ['$peers', limit] },
          ranking: {
            $slice: [
              {
                $filter: {
                  input: '$allRanked',
                  as: 's',
                  cond: {
                    $or: [
                      { $eq: ['$$s._id', source._id] },
                      { $ne: ['$$s.country', source.country] },
                    ],
                  },
                },
              },
              limit + 1,
            ],
          },
        },
      },
    ]);

    if (!result) {
      return res.json({
        source,
        peers: [],
        ranking: [],
        totalInCategoryType: 1,
        sourceRank: 1,
        percentile: 100,
        message: 'No comparable sites in this category/type',
      });
    }

    const slim = (s) => ({
      _id: s._id,
      name: s.name,
      country: s.country,
      category: s.category,
      type: s.type,
      rating: s.rating,
      yearlyVisitors: s.yearlyVisitors,
      latestVisitors: s.latestVisitors,
      latestYear: s.latestYear,
      rank: s.rank,
      isSource: Boolean(s.isSource),
      location: s.location,
      entranceFee: s.entranceFee,
      description: s.description,
    });

    res.json({
      source: slim({ ...result.ranking.find((r) => String(r._id) === String(source._id)) || source, isSource: true }),
      peers: (result.peers || []).map(slim),
      ranking: (result.ranking || []).map(slim),
      totalInCategoryType: result.totalInCategoryType,
      sourceRank: result.sourceRank,
      percentile: result.percentile,
      category: source.category,
      type: source.type,
    });
  } catch (err) {
    next(err);
  }
}

/** GET /api/compare/search?q= — Myanmar sites only */
async function compareSearch(req, res, next) {
  try {
    const q = String(req.query.q || '').trim();
    if (q.length < 1) {
      return res.status(400).json({ error: 'q query param is required' });
    }

    const sites = await Site.find({
      country: 'Myanmar',
      name: { $regex: escapeRegex(q), $options: 'i' },
    })
      .select('name category type rating country')
      .limit(12)
      .lean();

    res.json(sites);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listSites,
  sitesNear,
  getSite,
  getCategories,
  statsOverview,
  compareSites,
  compareSearch,
};
