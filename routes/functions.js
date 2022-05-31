const express = require('express');
const router = express.Router();

const {
  createNewBlock,
  deleteAllChain,
  getAllChain,
  findData,
  checkAllChain,
  createNewTransaction,
} = require('../controllers/functions');

router.route('/Mine').post(createNewBlock);
router.route('/Blockchain').get(getAllChain).delete(deleteAllChain);
router.route('/Transaction').post(createNewTransaction);
router.route('/Check').get(checkAllChain);
router.route('/').get(findData);

module.exports = router;
