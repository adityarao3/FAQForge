import React, { useState, useEffect } from 'react';
import { getAllFAQs, updateFAQ, deleteFAQ, exportFAQs, getAllWebsites } from '../services/api';

function FAQManager() {
    const [faqs, setFaqs] = useState([]);
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(null);
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ question: '', answer: '' });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, faq: null });

    // Filters
    const [filterWebsite, setFilterWebsite] = useState('');
    const [filterPublished, setFilterPublished] = useState('all');

    useEffect(() => {
        fetchWebsites();
        fetchFAQs();
    }, []);

    const fetchWebsites = async () => {
        try {
            const response = await getAllWebsites();
            setWebsites(response.data.data);
        } catch (error) {
            console.error('Error fetching websites:', error);
        }
    };

    const fetchFAQs = async () => {
        try {
            const params = {};
            if (filterWebsite) params.websiteId = filterWebsite;
            if (filterPublished !== 'all') params.published = filterPublished === 'published';

            const response = await getAllFAQs(params);
            setFaqs(response.data.data);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to fetch FAQs' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFAQs();
    }, [filterWebsite, filterPublished]);

    const handleEdit = (faq) => {
        setEditingId(faq._id);
        setEditForm({
            question: faq.question,
            answer: faq.answer
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ question: '', answer: '' });
    };

    const handleSaveEdit = async (id) => {
        try {
            await updateFAQ(id, editForm);
            setMessage({ type: 'success', text: 'FAQ updated successfully' });
            setEditingId(null);
            fetchFAQs();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update FAQ' });
        }
    };

    const handleTogglePublish = async (faq) => {
        try {
            await updateFAQ(faq._id, { published: !faq.published });
            setMessage({
                type: 'success',
                text: faq.published ? 'FAQ unpublished' : 'FAQ published'
            });
            fetchFAQs();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update FAQ' });
        }
    };

    const handleDeleteClick = (faq) => {
        setDeleteDialog({ open: true, faq });
    };

    const handleDeleteConfirm = async () => {
        try {
            await deleteFAQ(deleteDialog.faq._id);
            setMessage({ type: 'success', text: 'FAQ deleted successfully' });
            setDeleteDialog({ open: false, faq: null });
            fetchFAQs();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to delete FAQ' });
        }
    };

    const handleExport = async () => {
        try {
            const params = {};
            if (filterWebsite) params.websiteId = filterWebsite;
            if (filterPublished !== 'all') params.published = filterPublished === 'published';

            const response = await exportFAQs(params);

            const blob = new Blob([JSON.stringify(response.data.data, null, 2)], {
                type: 'application/json'
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `faqs-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

            setMessage({ type: 'success', text: 'FAQs exported successfully' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to export FAQs' });
        }
    };

    return (
        <div>
            {/* Filters and Actions */}
            <div className="neo-card" style={{ marginBottom: '2rem' }}>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <h2 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        margin: 0
                    }}>
                        🎯 Filters
                    </h2>
                    <button
                        className="neo-button neo-button-primary"
                        onClick={handleExport}
                        disabled={faqs.length === 0}
                        style={{
                            opacity: faqs.length === 0 ? 0.5 : 1,
                            cursor: faqs.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        📥 Export FAQs
                    </button>
                </div>

                {message && (
                    <div className={`neo-alert neo-alert-${message.type}`} style={{ marginBottom: '1rem' }}>
                        {message.text}
                    </div>
                )}

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '1rem'
                }}>
                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Website
                        </label>
                        <select
                            className="neo-input"
                            value={filterWebsite}
                            onChange={(e) => setFilterWebsite(e.target.value)}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="">All Websites</option>
                            {websites.map((website) => (
                                <option key={website._id} value={website._id}>
                                    {website.domain}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{
                            display: 'block',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            marginBottom: '0.5rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            Status
                        </label>
                        <select
                            className="neo-input"
                            value={filterPublished}
                            onChange={(e) => setFilterPublished(e.target.value)}
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="all">All FAQs</option>
                            <option value="published">Published Only</option>
                            <option value="unpublished">Unpublished Only</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* FAQs List */}
            {loading ? (
                <div className="neo-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏳</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>Loading FAQs...</p>
                </div>
            ) : faqs.length === 0 ? (
                <div className="neo-card" style={{ textAlign: 'center', padding: '3rem' }}>
                    <p style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📝</p>
                    <p style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        No FAQs found
                    </p>
                    <p style={{ fontSize: '0.95rem', opacity: 0.7 }}>
                        Start by crawling a website and generating FAQs
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {faqs.map((faq) => (
                        <div
                            key={faq._id}
                            className="neo-card animate-slide-in"
                            style={{
                                background: faq.published ? 'var(--color-success)' : 'var(--color-white)'
                            }}
                        >
                            {/* FAQ Header */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                marginBottom: '1rem',
                                gap: '1rem'
                            }}>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                                        <span className="neo-badge" style={{
                                            background: 'var(--color-cyan)',
                                            fontSize: '0.75rem',
                                            padding: '0.2rem 0.6rem'
                                        }}>
                                            {websites.find(w => w._id === faq.websiteId)?.domain || 'Unknown'}
                                        </span>
                                        {faq.edited && (
                                            <span className="neo-badge" style={{
                                                background: 'var(--color-orange)',
                                                fontSize: '0.75rem',
                                                padding: '0.2rem 0.6rem'
                                            }}>
                                                ✏️ Edited
                                            </span>
                                        )}
                                        <span className="neo-badge" style={{
                                            background: 'var(--color-purple)',
                                            fontSize: '0.75rem',
                                            padding: '0.2rem 0.6rem'
                                        }}>
                                            {Math.round(faq.confidenceScore * 100)}% confidence
                                        </span>
                                    </div>
                                </div>

                                {/* Publish Toggle */}
                                <button
                                    onClick={() => handleTogglePublish(faq)}
                                    style={{
                                        background: faq.published ? 'var(--color-white)' : 'var(--color-lime)',
                                        border: 'var(--border)',
                                        borderRadius: '50%',
                                        width: '48px',
                                        height: '48px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        fontSize: '1.5rem',
                                        boxShadow: 'var(--shadow-sm)',
                                        transition: 'all 0.2s ease',
                                        flexShrink: 0
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.transform = 'translate(-2px, -2px)';
                                        e.target.style.boxShadow = 'var(--shadow-md)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.transform = 'none';
                                        e.target.style.boxShadow = 'var(--shadow-sm)';
                                    }}
                                    title={faq.published ? 'Unpublish' : 'Publish'}
                                >
                                    {faq.published ? '✅' : '⭕'}
                                </button>
                            </div>

                            {/* FAQ Content */}
                            {editingId === faq._id ? (
                                <div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Question
                                        </label>
                                        <input
                                            type="text"
                                            className="neo-input"
                                            value={editForm.question}
                                            onChange={(e) => setEditForm({ ...editForm, question: e.target.value })}
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.9rem',
                                            fontWeight: '600',
                                            marginBottom: '0.5rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            Answer
                                        </label>
                                        <textarea
                                            className="neo-input"
                                            rows="5"
                                            value={editForm.answer}
                                            onChange={(e) => setEditForm({ ...editForm, answer: e.target.value })}
                                            style={{ resize: 'vertical', fontFamily: 'var(--font-family)' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            className="neo-button neo-button-success"
                                            onClick={() => handleSaveEdit(faq._id)}
                                            style={{ flex: 1 }}
                                        >
                                            💾 Save
                                        </button>
                                        <button
                                            className="neo-button"
                                            onClick={handleCancelEdit}
                                            style={{ flex: 1 }}
                                        >
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <h3 style={{
                                            fontSize: '1.2rem',
                                            fontWeight: '700',
                                            marginBottom: '0.5rem',
                                            lineHeight: '1.4'
                                        }}>
                                            ❓ {faq.question}
                                        </h3>
                                    </div>
                                    <div style={{
                                        background: 'var(--color-white)',
                                        border: '2px solid var(--color-black)',
                                        borderRadius: 'var(--radius-sm)',
                                        padding: '1rem',
                                        marginBottom: '1rem'
                                    }}>
                                        <p style={{
                                            fontSize: '1rem',
                                            lineHeight: '1.6',
                                            margin: 0
                                        }}>
                                            {faq.answer}
                                        </p>
                                    </div>
                                    <div style={{
                                        fontSize: '0.85rem',
                                        opacity: 0.7,
                                        marginBottom: '1rem'
                                    }}>
                                        <strong>Source:</strong> {faq.sourcePage}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                                        <button
                                            className="neo-button neo-button-secondary"
                                            onClick={() => handleEdit(faq)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="neo-button neo-button-error"
                                            onClick={() => handleDeleteClick(faq)}
                                        >
                                            🗑️ Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            {deleteDialog.open && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '1rem'
                }}>
                    <div className="neo-card" style={{
                        maxWidth: '500px',
                        width: '100%',
                        background: 'var(--color-white)',
                        boxShadow: 'var(--shadow-xl)'
                    }}>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '1rem',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                        }}>
                            ⚠️ Confirm Delete
                        </h2>
                        <p style={{
                            fontSize: '1rem',
                            marginBottom: '1.5rem',
                            lineHeight: '1.6'
                        }}>
                            Are you sure you want to delete this FAQ? This action cannot be undone.
                        </p>
                        <div style={{
                            background: 'var(--color-bg)',
                            border: '2px solid var(--color-black)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '1rem',
                            marginBottom: '1.5rem'
                        }}>
                            <p style={{ fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                {deleteDialog.faq?.question}
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                            <button
                                className="neo-button neo-button-error"
                                onClick={handleDeleteConfirm}
                                style={{ flex: 1 }}
                            >
                                🗑️ Delete
                            </button>
                            <button
                                className="neo-button"
                                onClick={() => setDeleteDialog({ open: false, faq: null })}
                                style={{ flex: 1 }}
                            >
                                ❌ Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default FAQManager;
