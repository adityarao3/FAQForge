const express = require('express');
const router = express.Router();
const crawlController = require('../controllers/crawlController');

// POST /api/crawl - Start crawling a website
router.post('/', crawlController.startCrawl);

// GET /api/crawl/status/:websiteId - Get crawl status
router.get('/status/:websiteId', crawlController.getCrawlStatus);

// GET /api/crawl/websites - Get all websites
router.get('/websites', crawlController.getAllWebsites);

module.exports = router;
