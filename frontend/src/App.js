import React, { useState } from 'react';
import CrawlPanel from './components/CrawlPanel';
import FAQManager from './components/FAQManager';
import './index.css';

function App() {
    const [activeTab, setActiveTab] = useState('crawler');

    return (
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
            {/* Neo-Brutalism Header */}
            <header style={{
                background: 'var(--color-primary)',
                borderBottom: 'var(--border)',
                padding: '1.5rem 0',
                boxShadow: '0 4px 0px rgba(0, 0, 0, 1)'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'var(--color-black)',
                        border: 'var(--border)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        boxShadow: 'var(--shadow-sm)'
                    }}>
                        ⚡
                    </div>
                    <div>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: '700',
                            letterSpacing: '-0.5px',
                            margin: 0
                        }}>
                            FAQForge
                        </h1>
                        <p style={{
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            margin: 0,
                            opacity: 0.8
                        }}>
                            Contextual FAQ Generator
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '2rem'
            }}>
                {/* Neo-Brutalism Tabs */}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    marginBottom: '2rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        onClick={() => setActiveTab('crawler')}
                        style={{
                            fontFamily: 'var(--font-family)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            padding: '1rem 2rem',
                            border: 'var(--border)',
                            borderRadius: 'var(--radius-md)',
                            background: activeTab === 'crawler' ? 'var(--color-cyan)' : 'var(--color-white)',
                            boxShadow: activeTab === 'crawler' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            transform: activeTab === 'crawler' ? 'translate(-2px, -2px)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'crawler') {
                                e.target.style.transform = 'translate(-2px, -2px)';
                                e.target.style.boxShadow = 'var(--shadow-md)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'crawler') {
                                e.target.style.transform = 'none';
                                e.target.style.boxShadow = 'var(--shadow-sm)';
                            }
                        }}
                    >
                        🌐 Website Crawler
                    </button>

                    <button
                        onClick={() => setActiveTab('manager')}
                        style={{
                            fontFamily: 'var(--font-family)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            padding: '1rem 2rem',
                            border: 'var(--border)',
                            borderRadius: 'var(--radius-md)',
                            background: activeTab === 'manager' ? 'var(--color-lime)' : 'var(--color-white)',
                            boxShadow: activeTab === 'manager' ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                            transform: activeTab === 'manager' ? 'translate(-2px, -2px)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== 'manager') {
                                e.target.style.transform = 'translate(-2px, -2px)';
                                e.target.style.boxShadow = 'var(--shadow-md)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== 'manager') {
                                e.target.style.transform = 'none';
                                e.target.style.boxShadow = 'var(--shadow-sm)';
                            }
                        }}
                    >
                        📋 FAQ Manager
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-slide-in">
                    {activeTab === 'crawler' && <CrawlPanel />}
                    {activeTab === 'manager' && <FAQManager />}
                </div>
            </main>

            {/* Footer */}
            <footer style={{
                marginTop: '4rem',
                padding: '2rem',
                textAlign: 'center',
                borderTop: 'var(--border)',
                background: 'var(--color-white)'
            }}>
                <p style={{
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    margin: 0
                }}>
                    Built with ⚡ FAQForge • Powered by AI
                </p>
            </footer>
        </div>
    );
}

export default App;
