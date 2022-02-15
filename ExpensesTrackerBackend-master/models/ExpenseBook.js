const mongoose = require('mongoose');

const entrySchema = new mongoose.Schema({
  price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  name: {
    type: String,
    required: true,
  }
})

const expenseBookSchema = new mongoose.Schema({
    entries: [entrySchema],
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    }
}, {
    timestamps: true,
    collection: 'expenseBooks'
});

module.exports = mongoose.model('ExpenseBook', expenseBookSchema);