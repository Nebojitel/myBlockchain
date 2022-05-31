const ChainBD = require('../models/chain');
const Transaction = require('../models/transaction');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');

const createNewBlock = asyncWrapper(async (req, res) => {
  const chain = await ChainBD.create(req.body);
  res.status(201).json({ msg: `New Block mined and added Successfully` });
});

const deleteAllChain = asyncWrapper(async (req, res) => {
  await ChainBD.deleteMany();
  res.status(200).json({ msg: `Full BlockChain deleted Successfully` });
});

const getAllChain = asyncWrapper(async (req, res) => {
  const chain = await ChainBD.find({});
  res.status(200).json({ chain });
  // console.log(chain);
});

const createNewTransaction = asyncWrapper(async (req, res) => {
  const pendingTransactions = await Transaction.create(req.body);
  res.status(201).json({ pendingTransactions });
});

module.exports = {
  createNewBlock,
  deleteAllChain,
  getAllChain,
  createNewTransaction,
};
