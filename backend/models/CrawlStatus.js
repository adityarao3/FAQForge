const mongoose = require('mongoose');

const crawlStatusSchema = new mongoose.Schema({
    websiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website',
        required: true
    },
    status: {
        type: String,
        enum: ['queued', 'processing', 'completed', 'failed'],
        default: 'queued'
    },
    pagesDiscovered: {
        type: Number,
        default: 0
    },
    pagesCrawled: {
        type: Number,
        default: 0
    },
    pagesFailed: {
        type: Number,
        default: 0
    },
    faqsGenerated: {
        type: Number,
        default: 0
    },
    currentUrl: String,
    errorLog: [{
        url: String,
        error: String,
        timestamp: Date
    }],
    progress: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    startedAt: Date,
    completedAt: Date
}, {
    timestamps: true
});

crawlStatusSchema.index({ websiteId: 1 });
crawlStatusSchema.index({ status: 1 });

module.exports = mongoose.model('CrawlStatus', crawlStatusSchema);
