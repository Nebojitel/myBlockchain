const mongoose = require('mongoose');

const chainSchema = new mongoose.Schema({
  index: {
    type: Number,
    default: 0,
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
  transactions: {
    type: Array,
    defaut: [],
  },
  nonce: {
    type: Number,
    default: 0,
  },
  hash: {
    type: String,
    default: '0',
  },
  previousBlockHash: {
    type: String,
    default: '0',
  },
});

module.exports = mongoose.model('ChainBD', chainSchema);
