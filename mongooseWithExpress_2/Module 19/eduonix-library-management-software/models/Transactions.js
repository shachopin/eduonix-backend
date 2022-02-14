const mongoose = require('mongoose');
const { Schema } = mongoose;

const transactionSchema = new Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student"
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book"
    },
    issueDate: {
        type: Date,
        default: Date.now()
    },
    returnDate: {
        type: Date,
        default: Date.now() + 24 * 60 * 60 * 1000 * 7
    },
    isRenewed: {
        type: Boolean,
        default: false
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);