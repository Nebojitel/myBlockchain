const express = require('express');
const router = express.Router();

const {
  createNewBlock,
  deleteAllChain,
  getAllChain,
  createNewTransaction,
} = require('../controllers/functions');

router.route('/Mine').post(createNewBlock);
router.route('/Blockchain').get(getAllChain).delete(deleteAllChain);

module.exports = router;
