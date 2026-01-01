const express = require('express');
const router = express.Router();
const faqController = require('../controllers/faqController');

// POST /api/faq/generate-page - Generate FAQ for specific page
router.post('/generate-page', faqController.generateFAQForPage);

// POST /api/faq/generate-website - Generate FAQs for entire website
router.post('/generate-website', faqController.generateFAQForWebsite);

// GET /api/faq - Get all FAQs (with optional filters)
router.get('/', faqController.getAllFAQs);

// GET /api/faq/export - Export FAQs as JSON
router.get('/export', faqController.exportFAQs);

// PUT /api/faq/:id - Update FAQ
router.put('/:id', faqController.updateFAQ);

// DELETE /api/faq/:id - Delete FAQ
router.delete('/:id', faqController.deleteFAQ);

module.exports = router;
