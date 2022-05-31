const ChainBD = require('../models/chain');
const Transaction = require('../models/transaction');
const asyncWrapper = require('../middleware/async');
const { createCustomError } = require('../errors/custom-error');
const sha256 = require('sha256');

async function hashBlock(previousBlockHash, currentBlockData, nonce) {
  const dataAsString =
    previousBlockHash + nonce.toString() + JSON.stringify(currentBlockData);
  const hash = sha256(dataAsString);
  return hash;
}

async function proofOfWork(previousBlockHash, currentBlockData) {
  let nonce = 0;
  let hash = await hashBlock(previousBlockHash, currentBlockData, nonce);
  while (hash.substring(0, 4) !== '0000') {
    nonce++;
    hash = await hashBlock(previousBlockHash, currentBlockData, nonce);
  }
  return nonce;
}

async function chainIsValid(blockchain) {
  let validChain = true;

  for (var i = 1; i < blockchain.length; i++) {
    const currentBlock = blockchain[i];
    const prevBlock = blockchain[i - 1];
    const blockHash = await hashBlock(
      prevBlock['hash'],
      currentBlock['transactions'],
      currentBlock['nonce']
    );
    if (blockHash.substring(0, 4) !== '0000') {
      validChain = false;
    }
    if (currentBlock['previousBlockHash'] !== prevBlock['hash']) {
      validChain = false;
    }
  }

  const genesisBlock = blockchain[0];
  const corectNonce = genesisBlock['nonce'] === 0;
  const correctPreviousBlockHash = genesisBlock['previousBlockHash'] === '0';
  const correctHash = genesisBlock['hash'] === '0';

  if (!corectNonce || !correctPreviousBlockHash || !correctHash) {
    validChain = false;
  }

  return validChain;
}

const createNewBlock = asyncWrapper(async (req, res) => {
  //Импорт из БД
  const chain = await ChainBD.find({});
  const transaction = await Transaction.find({});
  req.body.transactions = transaction;
  //Если блокчейн не пустой то хэшируем
  if (chain.length != 0) {
    //Присваиваем след индекс новому блоку
    const newIndex = chain[chain.length - 1].index + 1;
    req.body.index = newIndex;
    //Присваиваем предыдущий хэш новому блоку
    const prevHash = chain[chain.length - 1].hash;
    req.body.previousBlockHash = prevHash;
    //Находим нонс и записываем в новый блок
    const nonce = await proofOfWork(prevHash, transaction);
    req.body.nonce = nonce;
    //Вычисляем хэш и записываем в новый блок
    const hash = await hashBlock(prevHash, transaction, nonce);
    req.body.hash = hash;
  }
  //Удаляем список транзакций
  await Transaction.deleteMany();
  //Майним новый блок
  await ChainBD.create(req.body);
  res.status(201).json({ msg: `New Block mined and added Successfully` });
});

const deleteAllChain = asyncWrapper(async (req, res) => {
  await ChainBD.deleteMany();
  res.status(200).json({ msg: `Full BlockChain deleted Successfully` });
});

const getAllChain = asyncWrapper(async (req, res) => {
  const chain = await ChainBD.find({});
  res.status(200).json({ chain });
});

const findData = asyncWrapper(async (req, res) => {
  const { hash } = req.query;
  const queryObject = {};

  if (hash) {
    queryObject.hash = hash;
  }

  let result = ChainBD.find(queryObject);

  const chain = await result;
  res.status(200).json({ chain });
});

const checkAllChain = asyncWrapper(async (req, res) => {
  const chain = await ChainBD.find({});
  const valid = await chainIsValid(chain);
  res.status(200).json({ msg: `Check completed`, valid: `${valid}` });
});

const createNewTransaction = asyncWrapper(async (req, res) => {
  await Transaction.create(req.body);
  const pendingTransactions = await Transaction.find({});
  res.status(201).json({ pendingTransactions });
});

module.exports = {
  createNewBlock,
  deleteAllChain,
  getAllChain,
  findData,
  checkAllChain,
  createNewTransaction,
};
