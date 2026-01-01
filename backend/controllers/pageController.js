const PageContent = require('../models/PageContent');
const Website = require('../models/Website');

/**
 * Get all pages for a website
 */
exports.getPagesByWebsite = async (req, res) => {
    try {
        const { websiteId } = req.params;

        const pages = await PageContent.find({ websiteId })
            .select('url title wordCount crawlStatus crawledAt')
            .sort({ crawledAt: -1 });

        res.status(200).json({
            success: true,
            count: pages.length,
            data: pages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get all crawled pages
 */
exports.getAllPages = async (req, res) => {
    try {
        const pages = await PageContent.find()
            .populate('websiteId', 'url domain')
            .select('url title wordCount crawlStatus crawledAt')
            .sort({ crawledAt: -1 })
            .limit(100);

        res.status(200).json({
            success: true,
            count: pages.length,
            data: pages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Get page details by ID
 */
exports.getPageById = async (req, res) => {
    try {
        const { pageId } = req.params;

        const page = await PageContent.findById(pageId)
            .populate('websiteId', 'url domain');

        if (!page) {
            return res.status(404).json({
                success: false,
                message: 'Page not found'
            });
        }

        res.status(200).json({
            success: true,
            data: page
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
