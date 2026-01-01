const express = require('express');
const router = express.Router();
const pageController = require('../controllers/pageController');

// GET /api/pages - Get all pages
router.get('/', pageController.getAllPages);

// GET /api/pages/website/:websiteId - Get pages by website
router.get('/website/:websiteId', pageController.getPagesByWebsite);

// GET /api/pages/:pageId - Get page by ID
router.get('/:pageId', pageController.getPageById);

module.exports = router;
