const axios = require('axios');
const cheerio = require('cheerio');
const { URL } = require('url');

class WebCrawler {
    constructor(options = {}) {
        this.maxDepth = options.maxDepth || parseInt(process.env.MAX_CRAWL_DEPTH) || 3;
        this.maxPages = options.maxPages || parseInt(process.env.MAX_PAGES_PER_DOMAIN) || 20;
        this.timeout = options.timeout || parseInt(process.env.CRAWL_TIMEOUT) || 10000;
        this.visitedUrls = new Set();
        this.domain = null;
    }

    /**
     * Normalize URL for consistency
     */
    normalizeUrl(url) {
        try {
            const urlObj = new URL(url);
            // Remove trailing slash, hash, and query params for deduplication
            return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`.replace(/\/$/, '');
        } catch (error) {
            return null;
        }
    }

    /**
     * Check if URL belongs to the same domain
     */
    isSameDomain(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.hostname === this.domain;
        } catch (error) {
            return false;
        }
    }

    /**
     * Fetch HTML content from URL
     */
    async fetchPage(url) {
        try {
            const response = await axios.get(url, {
                timeout: this.timeout,
                headers: {
                    'User-Agent': 'FAQForge Crawler Bot/1.0'
                },
                maxRedirects: 5
            });

            if (response.status === 200 && response.data) {
                return response.data;
            }
            return null;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error.message);
            throw new Error(`Failed to fetch page: ${error.message}`);
        }
    }

    /**
     * Extract readable content from HTML
     */
    extractContent(html, url) {
        const $ = cheerio.load(html);

        // Remove unwanted elements
        $('script, style, nav, header, footer, aside, iframe, noscript, svg').remove();
        $('.advertisement, .ads, #cookie-banner, .modal').remove();

        // Extract title
        const title = $('title').text().trim() ||
            $('h1').first().text().trim() ||
            'Untitled Page';

        // Extract headings
        const headings = [];
        $('h1, h2, h3').each((i, elem) => {
            const text = $(elem).text().trim();
            const level = parseInt(elem.name.substring(1));
            if (text) {
                headings.push({ level, text });
            }
        });

        // Extract paragraphs
        const paragraphs = [];
        $('p').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text && text.length > 30) { // Filter out short snippets
                paragraphs.push(text);
            }
        });

        // Extract FAQ-like sections
        const faqSections = [];
        $('[class*="faq"], [id*="faq"], dt, .question').each((i, elem) => {
            const text = $(elem).text().trim();
            if (text) {
                faqSections.push(text);
            }
        });

        // Combine all content
        let extractedContent = '';

        if (headings.length > 0) {
            extractedContent += 'HEADINGS:\n' + headings.map(h => `${'#'.repeat(h.level)} ${h.text}`).join('\n') + '\n\n';
        }

        if (paragraphs.length > 0) {
            extractedContent += 'CONTENT:\n' + paragraphs.join('\n\n') + '\n\n';
        }

        if (faqSections.length > 0) {
            extractedContent += 'FAQ SECTIONS:\n' + faqSections.join('\n') + '\n\n';
        }

        // Get plain text as fallback
        if (!extractedContent.trim()) {
            extractedContent = $('body').text().replace(/\s+/g, ' ').trim();
        }

        return {
            title,
            headings,
            paragraphs,
            extractedContent: extractedContent.trim(),
            wordCount: extractedContent.split(/\s+/).length
        };
    }

    /**
     * Extract links from page
     */
    extractLinks(html, baseUrl) {
        const $ = cheerio.load(html);
        const links = new Set();

        $('a[href]').each((i, elem) => {
            try {
                const href = $(elem).attr('href');
                if (!href) return;

                // Resolve relative URLs
                const absoluteUrl = new URL(href, baseUrl).href;
                const normalized = this.normalizeUrl(absoluteUrl);

                if (normalized &&
                    this.isSameDomain(normalized) &&
                    !this.visitedUrls.has(normalized) &&
                    !normalized.match(/\.(pdf|jpg|jpeg|png|gif|zip|exe|dmg)$/i)) {
                    links.add(normalized);
                }
            } catch (error) {
                // Invalid URL, skip
            }
        });

        return Array.from(links);
    }

    /**
     * Crawl a single page
     */
    async crawlPage(url) {
        const normalized = this.normalizeUrl(url);

        if (!normalized || this.visitedUrls.has(normalized)) {
            return null;
        }

        this.visitedUrls.add(normalized);

        try {
            const html = await this.fetchPage(url);
            if (!html) return null;

            const content = this.extractContent(html, url);
            const links = this.extractLinks(html, url);

            return {
                url: normalized,
                ...content,
                links,
                crawledAt: new Date()
            };
        } catch (error) {
            throw error;
        }
    }

    /**
     * Crawl website with BFS approach
     */
    async crawlWebsite(startUrl) {
        try {
            const urlObj = new URL(startUrl);
            this.domain = urlObj.hostname;
        } catch (error) {
            throw new Error('Invalid URL provided');
        }

        const results = [];
        const queue = [{ url: startUrl, depth: 0 }];

        while (queue.length > 0 && results.length < this.maxPages) {
            const { url, depth } = queue.shift();

            if (depth > this.maxDepth) continue;

            try {
                const pageData = await this.crawlPage(url);

                if (pageData) {
                    results.push(pageData);

                    // Add discovered links to queue
                    if (depth < this.maxDepth) {
                        pageData.links.forEach(link => {
                            if (!this.visitedUrls.has(link) && results.length < this.maxPages) {
                                queue.push({ url: link, depth: depth + 1 });
                            }
                        });
                    }
                }

                // Polite delay between requests
                await new Promise(resolve => setTimeout(resolve, 500));
            } catch (error) {
                console.error(`Error crawling ${url}:`, error.message);
                results.push({
                    url,
                    error: error.message,
                    crawlStatus: 'failed'
                });
            }
        }

        return results;
    }
}

module.exports = WebCrawler;
