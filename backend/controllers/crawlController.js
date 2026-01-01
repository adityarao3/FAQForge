const Website = require('../models/Website');
const PageContent = require('../models/PageContent');
const CrawlStatus = require('../models/CrawlStatus');
const FAQ = require('../models/FAQ');
const WebCrawler = require('../services/crawlerService');
const openaiService = require('../services/openaiService');
const { URL } = require('url');

/**
 * Start crawling a website
 */
exports.startCrawl = async (req, res) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: 'URL is required'
            });
        }

        // Validate URL
        let urlObj;
        try {
            urlObj = new URL(url);
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Invalid URL format'
            });
        }

        const domain = urlObj.hostname;

        // Check if website already exists
        let website = await Website.findOne({ url });

        if (website) {
            // Update existing website
            website.status = 'crawling';
            website.crawlStartedAt = new Date();
            website.lastCrawledAt = new Date();
            website.errorMessage = null;
            await website.save();
        } else {
            // Create new website entry
            website = await Website.create({
                url,
                domain,
                status: 'crawling',
                crawlStartedAt: new Date()
            });
        }

        // Create crawl status
        const crawlStatus = await CrawlStatus.create({
            websiteId: website._id,
            status: 'processing',
            startedAt: new Date()
        });

        // Start crawling in background
        performCrawl(website._id, url, crawlStatus._id);

        res.status(200).json({
            success: true,
            message: 'Crawling started',
            data: {
                websiteId: website._id,
                crawlStatusId: crawlStatus._id,
                url: website.url,
                status: website.status
            }
        });

    } catch (error) {
        console.error('Start crawl error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

/**
 * Perform the actual crawling process (async)
 */
async function performCrawl(websiteId, url, crawlStatusId) {
    try {
        const crawler = new WebCrawler();
        const crawlStatus = await CrawlStatus.findById(crawlStatusId);

        // Crawl website
        const pages = await crawler.crawlWebsite(url);

        crawlStatus.pagesDiscovered = pages.length;
        await crawlStatus.save();

        let successCount = 0;
        let failedCount = 0;

        // Save pages to database
        for (const pageData of pages) {
            try {
                if (pageData.error) {
                    failedCount++;
                    crawlStatus.errorLog.push({
                        url: pageData.url,
                        error: pageData.error,
                        timestamp: new Date()
                    });
                    continue;
                }

                const pageContent = await PageContent.create({
                    websiteId,
                    url: pageData.url,
                    title: pageData.title,
                    headings: pageData.headings,
                    paragraphs: pageData.paragraphs,
                    extractedContent: pageData.extractedContent,
                    wordCount: pageData.wordCount,
                    crawlStatus: 'success',
                    crawledAt: pageData.crawledAt
                });

                successCount++;
                crawlStatus.pagesCrawled = successCount;
                crawlStatus.progress = Math.round((successCount / pages.length) * 100);
                await crawlStatus.save();

            } catch (error) {
                console.error(`Error saving page ${pageData.url}:`, error.message);
                failedCount++;
                crawlStatus.errorLog.push({
                    url: pageData.url,
                    error: error.message,
                    timestamp: new Date()
                });
            }
        }

        crawlStatus.pagesFailed = failedCount;
        crawlStatus.status = 'completed';
        crawlStatus.completedAt = new Date();
        crawlStatus.progress = 100;
        await crawlStatus.save();

        // Update website status
        const website = await Website.findById(websiteId);
        website.status = 'completed';
        website.totalPages = successCount;
        website.crawlCompletedAt = new Date();
        await website.save();

    } catch (error) {
        console.error('Crawl error:', error);

        const crawlStatus = await CrawlStatus.findById(crawlStatusId);
        crawlStatus.status = 'failed';
        crawlStatus.completedAt = new Date();
        crawlStatus.errorLog.push({
            url: url,
            error: error.message,
            timestamp: new Date()
        });
        await crawlStatus.save();

        const website = await Website.findById(websiteId);
        website.status = 'failed';
        website.errorMessage = error.message;
        await website.save();
    }
}

/**
 * Get crawl status
 */
exports.getCrawlStatus = async (req, res) => {
    try {
        const { websiteId } = req.params;

        const website = await Website.findById(websiteId);
        if (!website) {
            return res.status(404).json({
                success: false,
                message: 'Website not found'
            });
        }

        const crawlStatus = await CrawlStatus.findOne({ websiteId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                website,
                crawlStatus
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
 * Get all websites
 */
exports.getAllWebsites = async (req, res) => {
    try {
        const websites = await Website.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: websites.length,
            data: websites
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
