const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
    websiteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Website',
        required: true
    },
    pageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PageContent',
        required: true
    },
    sourcePage: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true,
        trim: true
    },
    answer: {
        type: String,
        required: true,
        trim: true
    },
    confidenceScore: {
        type: Number,
        min: 0,
        max: 1,
        default: 0.8
    },
    published: {
        type: Boolean,
        default: false
    },
    edited: {
        type: Boolean,
        default: false
    },
    sourceSection: String,
    metadata: {
        type: Map,
        of: String
    }
}, {
    timestamps: true
});

faqSchema.index({ websiteId: 1 });
faqSchema.index({ pageId: 1 });
faqSchema.index({ published: 1 });
faqSchema.index({ createdAt: -1 });

module.exports = mongoose.model('FAQ', faqSchema);
