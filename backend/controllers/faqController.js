const FAQ = require('../models/FAQ');
const PageContent = require('../models/PageContent');
const Website = require('../models/Website');
const CrawlStatus = require('../models/CrawlStatus');
const openaiService = require('../services/openaiService');

/**
 * Generate FAQs for a specific page
 */
exports.generateFAQForPage = async (req, res) => {
    try {
        const { pageId } = req.body;

        if (!pageId) {
            return res.status(400).json({
                success: false,
                message: 'Page ID is required'
            });
        }

        const page = await PageContent.findById(pageId);

        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found'
            });
        }

        // Generate FAQs using OpenAI
        const result = await openaiService.generateFAQs(
            page.extractedContent,
            page.url
        );

        if (!result.success) {
            return res.status(400).json({
                success: false,
                message: result.message
            });
        }

        // Save FAQs to database
        const savedFAQs = [];
        for (const faqData of result.faqs) {
            const faq = await FAQ.create({
                websiteId: page.websiteId,
                pageId: page._id,
                sourcePage: page.url,
                question: faqData.question,
                answer: faqData.answer,
                confidenceScore: 0.8,
                sourceSection: faqData.source || page.title
            });
            savedFAQs.push(faq);
        }

        // Update crawl status
        const crawlStatus = await CrawlStatus.findOne({ websiteId: page.websiteId })
            .sort({ createdAt: -1 });

        if (crawlStatus) {
            crawlStatus.faqsGenerated += savedFAQs.length;
            await crawlStatus.save();
        }

        res.status(200).json({
            success: true,
            message: `Generated ${savedFAQs.length} FAQs`,
            data: savedFAQs
        });

    } catch (error) {
        console.error('Generate FAQ error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Generate FAQs for entire website
 */
exports.generateFAQForWebsite = async (req, res) => {
    try {
        const { websiteId } = req.body;

        if (!websiteId) {
            return res.status(400).json({
                success: false,
                message: 'Website ID is required'
            });
        }

        const website = await Website.findById(websiteId);

        if (!website) {
            return res.status(404).json({
                success: false,
                message: 'Website not found'
            });
        }

        // Get all pages for this website
        const pages = await PageContent.find({
            websiteId,
            crawlStatus: 'success'
        });

        if (pages.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No successfully crawled pages found'
            });
        }

        // Start generating FAQs in background
        generateFAQsForWebsite(websiteId, pages);

        res.status(200).json({
            success: true,
            message: `FAQ generation started for ${pages.length} pages`,
            data: {
                websiteId,
                pagesCount: pages.length
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Background FAQ generation for website
 */
async function generateFAQsForWebsite(websiteId, pages) {
    let totalGenerated = 0;

    for (const page of pages) {
        try {
            // Check if FAQs already exist for this page
            const existingCount = await FAQ.countDocuments({ pageId: page._id });
            if (existingCount > 0) {
                console.log(`Skipping ${page.url} - FAQs already exist`);
                continue;
            }

            const result = await openaiService.generateFAQs(
                page.extractedContent,
                page.url
            );

            if (result.success && result.faqs.length > 0) {
                for (const faqData of result.faqs) {
                    await FAQ.create({
                        websiteId: page.websiteId,
                        pageId: page._id,
                        sourcePage: page.url,
                        question: faqData.question,
                        answer: faqData.answer,
                        confidenceScore: 0.8
                    });
                    totalGenerated++;
                }
            }

            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));

        } catch (error) {
            console.error(`Error generating FAQs for ${page.url}:`, error.message);
        }
    }

    // Update crawl status
    const crawlStatus = await CrawlStatus.findOne({ websiteId })
        .sort({ createdAt: -1 });

    if (crawlStatus) {
        crawlStatus.faqsGenerated = totalGenerated;
        await crawlStatus.save();
    }

    console.log(`✅ Generated ${totalGenerated} FAQs for website ${websiteId}`);
}

/**
 * Get all FAQs
 */
exports.getAllFAQs = async (req, res) => {
    try {
        const { websiteId, published } = req.query;

        const filter = {};
        if (websiteId) filter.websiteId = websiteId;
        if (published !== undefined) filter.published = published === 'true';

        const faqs = await FAQ.find(filter)
            .populate('websiteId', 'url domain')
            .populate('pageId', 'url title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: faqs.length,
            data: faqs
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Update FAQ
 */
exports.updateFAQ = async (req, res) => {
    try {
        const { id } = req.params;
        const { question, answer, published } = req.body;

        const faq = await FAQ.findById(id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        // Update fields
        if (question !== undefined) {
            faq.question = question;
            faq.edited = true;
        }
        if (answer !== undefined) {
            faq.answer = answer;
            faq.edited = true;
        }
        if (published !== undefined) {
            faq.published = published;
        }

        await faq.save();

        res.status(200).json({
            success: true,
            message: 'FAQ updated successfully',
            data: faq
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Delete FAQ
 */
exports.deleteFAQ = async (req, res) => {
    try {
        const { id } = req.params;

        const faq = await FAQ.findByIdAndDelete(id);

        if (!faq) {
            return res.status(404).json({
                success: false,
                message: 'FAQ not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'FAQ deleted successfully'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Export FAQs as JSON
 */
exports.exportFAQs = async (req, res) => {
    try {
        const { websiteId, published } = req.query;

        const filter = {};
        if (websiteId) filter.websiteId = websiteId;
        if (published !== undefined) filter.published = published === 'true';

        const faqs = await FAQ.find(filter)
            .select('question answer sourcePage published confidenceScore createdAt')
            .sort({ createdAt: -1 });

        const exportData = {
            exportDate: new Date().toISOString(),
            totalFAQs: faqs.length,
            faqs: faqs.map(faq => ({
                question: faq.question,
                answer: faq.answer,
                source: faq.sourcePage,
                published: faq.published,
                confidence: faq.confidenceScore,
                createdAt: faq.createdAt
            }))
        };

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=faqs-export-${Date.now()}.json`);
        res.status(200).json(exportData);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
