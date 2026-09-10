const express = require('express');
const {
  listSites,
  sitesNear,
  getSite,
  getCategories,
  statsOverview,
  compareSites,
  compareSearch,
} = require('../controllers/sitesController');

const router = express.Router();

router.get('/sites/near', sitesNear);
router.get('/sites', listSites);
router.get('/sites/:id', getSite);

router.get('/meta/categories', getCategories);
router.get('/stats/overview', statsOverview);

router.get('/compare/search', compareSearch);
router.get('/compare', compareSites);

module.exports = router;
