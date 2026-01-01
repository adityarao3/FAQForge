import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Crawl APIs
export const startCrawl = (url) => api.post('/crawl', { url });
export const getCrawlStatus = (websiteId) => api.get(`/crawl/status/${websiteId}`);
export const getAllWebsites = () => api.get('/crawl/websites');

// Page APIs
export const getAllPages = () => api.get('/pages');
export const getPagesByWebsite = (websiteId) => api.get(`/pages/website/${websiteId}`);
export const getPageById = (pageId) => api.get(`/pages/${pageId}`);

// FAQ APIs
export const generateFAQForPage = (pageId) => api.post('/faq/generate-page', { pageId });
export const generateFAQForWebsite = (websiteId) => api.post('/faq/generate-website', { websiteId });
export const getAllFAQs = (params) => api.get('/faq', { params });
export const updateFAQ = (id, data) => api.put(`/faq/${id}`, data);
export const deleteFAQ = (id) => api.delete(`/faq/${id}`);
export const exportFAQs = (params) => api.get('/faq/export', { params });

export default api;
