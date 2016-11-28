const Query = require('eth-query');
const format = require('ethjs-format');

module.exports = Eth;

function Eth(provider, options) {
  const self = this;
  const optionsObject = options || {};
  self.options = Object.assign({
    debug: optionsObject.debug || false,
    logger: optionsObject.logger || console,
    jsonSpace: optionsObject.jsonSpace || 0,
  });

  self.query = new Query(provider);
}

Eth.prototype.getBalance = generateFnFor(2, 'eth_getBalance');
Eth.prototype.getCode = generateFnFor(2, 'eth_getCode');
Eth.prototype.getTransactionCount = generateFnFor(2, 'eth_getTransactionCount');
Eth.prototype.getStorageAt = generateFnFor(3, 'eth_getStorageAt');
Eth.prototype.call = generateFnFor(2, 'eth_call');
// standard
Eth.prototype.protocolVersion = generateFnFor(1, 'eth_protocolVersion');
Eth.prototype.syncing = generateFnFor(1, 'eth_syncing');
Eth.prototype.coinbase = generateFnFor(1, 'eth_coinbase');
Eth.prototype.mining = generateFnFor(1, 'eth_mining');
Eth.prototype.hashrate = generateFnFor(1, 'eth_hashrate');
Eth.prototype.gasPrice = generateFnFor(1, 'eth_gasPrice');
Eth.prototype.accounts = generateFnFor(1, 'eth_accounts');
Eth.prototype.blockNumber = generateFnFor(1, 'eth_blockNumber');
Eth.prototype.getBlockTransactionCountByHash = generateFnFor(1, 'eth_getBlockTransactionCountByHash');
Eth.prototype.getBlockTransactionCountByNumber = generateFnFor(1, 'eth_getBlockTransactionCountByNumber');
Eth.prototype.getUncleCountByBlockHash = generateFnFor(1, 'eth_getUncleCountByBlockHash');
Eth.prototype.getUncleCountByBlockNumber = generateFnFor(1, 'eth_getUncleCountByBlockNumber');
Eth.prototype.sign = generateFnFor(1, 'eth_sign');
Eth.prototype.sendTransaction = generateFnFor(1, 'eth_sendTransaction');
Eth.prototype.sendRawTransaction = generateFnFor(1, 'eth_sendRawTransaction');
Eth.prototype.estimateGas = generateFnFor(1, 'eth_estimateGas');
Eth.prototype.getBlockByHash = generateFnFor(1, 'eth_getBlockByHash');
Eth.prototype.getBlockByNumber = generateFnFor(1, 'eth_getBlockByNumber');
Eth.prototype.getTransactionByHash = generateFnFor(1, 'eth_getTransactionByHash');
Eth.prototype.getTransactionByBlockHashAndIndex = generateFnFor(1, 'eth_getTransactionByBlockHashAndIndex');
Eth.prototype.getTransactionByBlockNumberAndIndex = generateFnFor(1, 'eth_getTransactionByBlockNumberAndIndex');
Eth.prototype.getTransactionReceipt = generateFnFor(1, 'eth_getTransactionReceipt');
Eth.prototype.getUncleByBlockHashAndIndex = generateFnFor(1, 'eth_getUncleByBlockHashAndIndex');
Eth.prototype.getUncleByBlockNumberAndIndex = generateFnFor(1, 'eth_getUncleByBlockNumberAndIndex');
Eth.prototype.getCompilers = generateFnFor(1, 'eth_getCompilers');
Eth.prototype.compileLLL = generateFnFor(1, 'eth_compileLLL');
Eth.prototype.compileSolidity = generateFnFor(1, 'eth_compileSolidity');
Eth.prototype.compileSerpent = generateFnFor(1, 'eth_compileSerpent');
Eth.prototype.newFilter = generateFnFor(1, 'eth_newFilter');
Eth.prototype.newBlockFilter = generateFnFor(1, 'eth_newBlockFilter');
Eth.prototype.newPendingTransactionFilter = generateFnFor(1, 'eth_newPendingTransactionFilter');
Eth.prototype.uninstallFilter = generateFnFor(1, 'eth_uninstallFilter');
Eth.prototype.getFilterChanges = generateFnFor(1, 'eth_getFilterChanges');
Eth.prototype.getFilterLogs = generateFnFor(1, 'eth_getFilterLogs');
Eth.prototype.getLogs = generateFnFor(1, 'eth_getLogs');
Eth.prototype.getWork = generateFnFor(1, 'eth_getWork');
Eth.prototype.submitWork = generateFnFor(1, 'eth_submitWork');
Eth.prototype.submitHashrate = generateFnFor(1, 'eth_submitHashrate');

Eth.prototype.makeQuery = function (method, args) { // eslint-disable-line
  const self = this;

  self.query[method].apply(self.query, args);
};

Eth.prototype.log = function log(message) {
  const self = this;

  if (self.options.debug === true) {
    const logMessage = `[ethjs-query ${(new Date()).toISOString()}] ${message}`;

    self.options.logger.log(logMessage);
  }
};

Eth.prototype.stringify = function log(object) {
  const self = this;

  return JSON.stringify(object, null, self.options.jsonSpace);
};

function generateFnFor(length, method) {
  function outputMethod() {
    const self = this;
    const args = [].slice.call(arguments); // eslint-disable-line
    const queryMethod = method.replace('eth_', ''); // eslint-disable-line
    // const queryError = error.query(method, args);
    // if (queryError) throw new Error(queryError);

    self.log(`attempting method ${queryMethod} with params ${self.stringify(args)}`);

    const cb = args.pop();

    self.log(`[method '${queryMethod}'] callback provided: ${typeof cb === 'function'}`);
    self.log(`[method '${queryMethod}'] attempting input formatting of ${args.length} inputs`);

    const inputs = format.formatInputs(method, args);

    self.log(`[method '${queryMethod}'] formatted inputs: ${self.stringify(inputs)}`);

    const callback = function(error, result) { // eslint-disable-line
      if (error) {
        cb(error, result);
      } else {
        self.log(`[method '${queryMethod}'] callback success, attempting formatting of raw outputs: ${self.stringify(result)}`);

        try {
          const methodOutputs = format.formatOutputs(method, result);

          self.log(`[method '${queryMethod}'] formatted outputs: ${self.stringify(methodOutputs)}`);

          cb(null, methodOutputs);
        } catch (formatError) {
          cb(`error while formatting data from the RPC: ${formatError}`, null);
        }
      }
    };

    inputs.push(callback);

    try {
      self.log(`[method '${queryMethod}'] attempting query with formatted inputs...`);

      self.makeQuery(queryMethod, inputs);
    } catch (queryError) {
      cb(`error while querying the RPC provider: ${queryError}`, null);
    }
  }

  return outputMethod;
}
