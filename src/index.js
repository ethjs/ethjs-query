const createRandomId = require('json-rpc-random-id')();
const format = require('ethjs-format');

module.exports = Eth;

function Eth(provider, options) {
  const self = this;
  const optionsObject = options || {};

  if (!(this instanceof Eth)) { throw new Error('[ethjs-query] the Eth object requires the "new" flag in order to function normally (i.e. `const eth = new Eth(provider);`).'); }
  if (typeof provider !== 'object') { throw new Error(`[ethjs-query] the Eth object requires that the first input 'provider' must be an object, got '${typeof provider}' (i.e. 'const eth = new Eth(provider);')`); }

  self.options = Object.assign({
    debug: optionsObject.debug || false,
    logger: optionsObject.logger || console,
    jsonSpace: optionsObject.jsonSpace || 0,
  });

  self.currentProvider = provider;
}

Eth.prototype.log = function log(message) {
  const self = this;
  if (self.options.debug) self.options.logger.log(`[ethjs-query log] ${message}`);
};

Eth.prototype.sendAsync = function sendAsync(opts, cb) {
  const self = this;
  self.currentProvider.sendAsync(createPayload(opts), (err, response) => {
    if (err || response.error) return cb(new Error(`[ethjs-query] with payload ${JSON.stringify(opts, null, 0)} ${err || response.error}`));
    if (!err && response.error) return cb(new Error(`[ethjs-query] RPC Error: ${response.error.message}`));
    return cb(null, response.result);
  });
};

function containsCallback(args) {
  return (args.length > 0 && typeof args[args.length - 1] === 'function');
}

function generateFnFor(method, methodObject) {
  return function outputMethod() {
    var protoCallback = () => {}; // eslint-disable-line
    var inputs = null; // eslint-disable-line
    const self = this;
    const args = [].slice.call(arguments); // eslint-disable-line
    const protoMethod = method.replace('eth_', ''); // eslint-disable-line

    if (containsCallback(args)) {
      protoCallback = args.pop();
    }

    if (methodObject[3] && args.length < methodObject[3]) {
      args.push('latest');
    }

    return new Promise((resolve, reject) => {
      const cb = (callbackError, callbackResult) => {
        if (callbackError) {
          reject(callbackError);
          protoCallback(callbackError, null);
        } else {
          try {
            const methodOutputs = format.formatOutputs(method, callbackResult);

            resolve(methodOutputs);
            protoCallback(null, methodOutputs);
          } catch (outputFormattingError) {
            const outputError = new Error(`[ethjs-query] while formatting inputs '${JSON.stringify(callbackResult, null, self.options.jsonSpace)}' for method '${protoMethod}' error: ${outputFormattingError}`);

            reject(outputError);
            protoCallback(outputError, null);
          }
        }
      };

      if (args.length < methodObject[2]) {
        cb(new Error(`[ethjs-query] method '${protoMethod}' requires at least ${methodObject[2]} input (format type ${methodObject[0][0]}), ${args.length} provided. For more information visit: https://github.com/ethereum/wiki/wiki/JSON-RPC#${method.toLowerCase()}`));
      }

      if (args.length > methodObject[0].length) {
        cb(new Error(`[ethjs-query] method '${protoMethod}' requires at most ${methodObject[0].length} params, ${args.length} provided '${JSON.stringify(args, null, self.options.jsonSpace)}'. For more information visit: https://github.com/ethereum/wiki/wiki/JSON-RPC#${method.toLowerCase()}`));
      }

      try {
        inputs = format.formatInputs(method, args);
      } catch (formattingError) {
        cb(new Error(`[ethjs-query] while formatting inputs '${JSON.stringify(args, null, self.options.jsonSpace)}' for method '${protoMethod}' error: ${formattingError}`));
      }

      self.sendAsync({ method, params: inputs }, cb);
    });
  };
}

Object.keys(format.schema.methods).forEach((rpcMethodName) => {
  Object.defineProperty(Eth.prototype, rpcMethodName.replace('eth_', ''), {
    enumerable: true,
    value: generateFnFor(rpcMethodName, format.schema.methods[rpcMethodName]),
  });
});

function createPayload(data) {
  return Object.assign({
    id: createRandomId(),
    jsonrpc: '2.0',
    params: [],
  }, data);
}
