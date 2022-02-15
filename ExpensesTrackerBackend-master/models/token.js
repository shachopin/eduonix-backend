const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    token: {
        type: String,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }

}, {
    timestamps: true,
    collection: 'tokens'
});

module.exports = mongoose.model('Token', tokenSchema);