const mongoose = require('mongoose');

const pageContentSchema = new mongoose.Schema({
    websiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website',
        required: true
    },
    url: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        trim: true
    },
    headings: [{
        level: Number,
        text: String
    }],
    paragraphs: [String],
    extractedContent: {
        type: String,
        required: true
    },
    wordCount: {
        type: Number,
        default: 0
    },
    crawlStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'],
        default: 'pending'
    },
    errorMessage: String,
    crawledAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

pageContentSchema.index({ websiteId: 1 });
pageContentSchema.index({ url: 1 });
pageContentSchema.index({ crawlStatus: 1 });

// Calculate word count before saving
pageContentSchema.pre('save', function (next) {
    if (this.extractedContent) {
        this.wordCount = this.extractedContent.split(/\s+/).filter(word => word.length > 0).length;
    }
    next();
});

module.exports = mongoose.model('PageContent', pageContentSchema);
