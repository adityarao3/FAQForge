import React, { useState, useEffect } from 'react';
import { startCrawl, getAllWebsites, getCrawlStatus, generateFAQForWebsite } from '../services/api';

function CrawlPanel() {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [websites, setWebsites] = useState([]);
    const [selectedWebsite, setSelectedWebsite] = useState(null);
    const [crawlStatusData, setCrawlStatusData] = useState(null);

    useEffect(() => {
        fetchWebsites();
    }, []);

    const fetchWebsites = async () => {
        try {
            const response = await getAllWebsites();
            setWebsites(response.data.data);
        } catch (error) {
            console.error('Error fetching websites:', error);
        }
    };

    const handleStartCrawl = async () => {
        if (!url.trim()) {
            setMessage({ type: 'error', text: 'Please enter a valid URL' });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await startCrawl(url);
            setMessage({
                type: 'success',
                text: 'Crawling started successfully! Check status below.'
            });
            setUrl('');

            setTimeout(() => {
                fetchWebsites();
            }, 1000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to start crawling'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshStatus = async (websiteId) => {
        try {
            const response = await getCrawlStatus(websiteId);
            setSelectedWebsite(response.data.data.website);
            setCrawlStatusData(response.data.data.crawlStatus);
        } catch (error) {
            console.error('Error fetching status:', error);
        }
    };

    const handleGenerateFAQs = async (websiteId) => {
        try {
            setMessage({ type: 'info', text: 'Starting FAQ generation...' });
            await generateFAQForWebsite(websiteId);
            setMessage({
                type: 'success',
                text: 'FAQ generation started! This may take a few minutes.'
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to generate FAQs'
            });
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'var(--color-success)';
            case 'failed':
                return 'var(--color-error)';
            case 'crawling':
                return 'var(--color-warning)';
            case 'pending':
                return 'var(--color-secondary)';
            default:
                return 'var(--color-white)';
        }
    };

    const getStatusEmoji = (status) => {
        switch (status) {
            case 'completed':
                return '✅';
            case 'failed':
                return '❌';
            case 'crawling':
            case 'pending':
                return '⏳';
            default:
                return '📄';
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
            {/* Left Column */}
            <div>
                {/* Start Crawl Card */}
                <div className="neo-card" style={{ marginBottom: '2rem' }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        marginBottom: '0.5rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        🌐 Start Website Crawl
                    </h2>
                    <p style={{
                        fontSize: '0.95rem',
                        marginBottom: '1.5rem',
                        opacity: 0.7
                    }}>
                        Enter a website URL to begin crawling and content extraction
                    </p>

                    {message && (
                        <div className={`neo-alert neo-alert-${message.type}`} style={{ marginBottom: '1rem' }}>
                            {message.text}
                        </div>
                    )}

                    <input
                        type="url"
                        className="neo-input"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                        style={{ marginBottom: '1rem' }}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleStartCrawl();
                        }}
                    />

                    <button
                        className="neo-button neo-button-primary"
                        onClick={handleStartCrawl}
                        disabled={loading}
                        style={{
                            width: '100%',
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? '⏳ Starting Crawl...' : '🚀 Start Crawling'}
                    </button>
                </div>

                {/* Crawl Details Card */}
                {selectedWebsite && (
                    <div className="neo-card animate-slide-in">
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            📊 Crawl Details
                        </h2>

                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                <strong>URL:</strong>
                            </p>
                            <p style={{
                                fontSize: '0.9rem',
                                wordBreak: 'break-all',
                                background: 'var(--color-bg)',
                                padding: '0.5rem',
                                border: '2px solid var(--color-black)',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                                {selectedWebsite.url}
                            </p>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                <strong>Status:</strong>
                            </p>
                            <span className="neo-badge" style={{
                                background: getStatusColor(selectedWebsite.status)
                            }}>
                                {getStatusEmoji(selectedWebsite.status)} {selectedWebsite.status}
                            </span>
                        </div>

                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>
                                <strong>Total Pages:</strong> {selectedWebsite.totalPages || 0}
                            </p>
                        </div>

                        {crawlStatusData && (
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '600' }}>
                                    Progress: {crawlStatusData.progress}%
                                </p>
                                <div style={{
                                    width: '100%',
                                    height: '30px',
                                    background: 'var(--color-white)',
                                    border: 'var(--border)',
                                    borderRadius: 'var(--radius-sm)',
                                    overflow: 'hidden',
                                    position: 'relative'
                                }}>
                                    <div style={{
                                        width: `${crawlStatusData.progress}%`,
                                        height: '100%',
                                        background: 'var(--color-lime)',
                                        transition: 'width 0.3s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '700',
                                        fontSize: '0.85rem'
                                    }}>
                                        {crawlStatusData.progress}%
                                    </div>
                                </div>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '1rem',
                                    marginTop: '1rem'
                                }}>
                                    <div style={{
                                        background: 'var(--color-cyan)',
                                        border: 'var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '1rem',
                                        textAlign: 'center',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        <p style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                                            {crawlStatusData.pagesCrawled}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                            Crawled
                                        </p>
                                    </div>
                                    <div style={{
                                        background: 'var(--color-purple)',
                                        border: 'var(--border)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '1rem',
                                        textAlign: 'center',
                                        boxShadow: 'var(--shadow-sm)'
                                    }}>
                                        <p style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                                            {crawlStatusData.faqsGenerated}
                                        </p>
                                        <p style={{ fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase' }}>
                                            FAQs Generated
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <button
                            className="neo-button neo-button-success"
                            onClick={() => handleGenerateFAQs(selectedWebsite._id)}
                            disabled={selectedWebsite.status !== 'completed'}
                            style={{
                                width: '100%',
                                marginTop: '1rem',
                                opacity: selectedWebsite.status !== 'completed' ? 0.5 : 1,
                                cursor: selectedWebsite.status !== 'completed' ? 'not-allowed' : 'pointer'
                            }}
                        >
                            ⚡ Generate FAQs
                        </button>
                    </div>
                )}
            </div>

            {/* Right Column - Websites List */}
            <div>
                <div className="neo-card">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '1.5rem'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            margin: 0
                        }}>
                            📚 Crawled Websites
                        </h2>
                        <button
                            onClick={fetchWebsites}
                            style={{
                                background: 'var(--color-white)',
                                border: 'var(--border)',
                                borderRadius: '50%',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                boxShadow: 'var(--shadow-sm)',
                                transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.transform = 'rotate(180deg)';
                                e.target.style.boxShadow = 'var(--shadow-md)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.transform = 'rotate(0deg)';
                                e.target.style.boxShadow = 'var(--shadow-sm)';
                            }}
                        >
                            🔄
                        </button>
                    </div>

                    {websites.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '3rem 1rem',
                            background: 'var(--color-bg)',
                            border: '2px dashed var(--color-black)',
                            borderRadius: 'var(--radius-md)'
                        }}>
                            <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🌐</p>
                            <p style={{ fontSize: '1rem', fontWeight: '500', opacity: 0.7 }}>
                                No websites crawled yet
                            </p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {websites.map((website) => (
                                <div
                                    key={website._id}
                                    onClick={() => handleRefreshStatus(website._id)}
                                    style={{
                                        background: selectedWebsite?._id === website._id ? 'var(--color-yellow)' : 'var(--color-white)',
                                        border: 'var(--border)',
                                        borderRadius: 'var(--radius-md)',
                                        padding: '1rem',
                                        cursor: 'pointer',
                                        boxShadow: selectedWebsite?._id === website._id ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                                        transition: 'all 0.2s ease',
                                        transform: selectedWebsite?._id === website._id ? 'translate(-2px, -2px)' : 'none'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedWebsite?._id !== website._id) {
                                            e.currentTarget.style.transform = 'translate(-2px, -2px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedWebsite?._id !== website._id) {
                                            e.currentTarget.style.transform = 'none';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                                        }
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        marginBottom: '0.5rem'
                                    }}>
                                        <span style={{ fontSize: '1.5rem' }}>
                                            {getStatusEmoji(website.status)}
                                        </span>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            fontWeight: '700',
                                            margin: 0,
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}>
                                            {website.domain}
                                        </h3>
                                    </div>
                                    <p style={{
                                        fontSize: '0.85rem',
                                        marginBottom: '0.75rem',
                                        opacity: 0.7,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {website.url}
                                    </p>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <span className="neo-badge" style={{
                                            background: getStatusColor(website.status),
                                            fontSize: '0.75rem',
                                            padding: '0.2rem 0.6rem'
                                        }}>
                                            {website.status}
                                        </span>
                                        {website.totalPages > 0 && (
                                            <span className="neo-badge" style={{
                                                background: 'var(--color-pink)',
                                                fontSize: '0.75rem',
                                                padding: '0.2rem 0.6rem'
                                            }}>
                                                📄 {website.totalPages} pages
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CrawlPanel;
