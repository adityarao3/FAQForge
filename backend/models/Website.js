const mongoose = require('mongoose');

const websiteSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    domain: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'crawling', 'completed', 'failed'],
        default: 'pending'
    },
    crawlStartedAt: Date,
    crawlCompletedAt: Date,
    totalPages: {
        type: Number,
        default: 0
    },
    errorMessage: String,
    lastCrawledAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

websiteSchema.index({ url: 1 });
websiteSchema.index({ domain: 1 });
websiteSchema.index({ status: 1 });

module.exports = mongoose.model('Website', websiteSchema);
