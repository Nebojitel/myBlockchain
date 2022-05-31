const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  amount: {
    type: Number,
    default: 0,
  },
  sender: {
    type: String,
    default: '0',
  },
  recipient: {
    type: String,
    default: '0',
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
