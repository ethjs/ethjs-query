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
    max: optionsObject.max || 9999999999999,
  });
  self.idCounter = Math.floor(Math.random() * self.options.max);
  self.currentProvider = provider;
}

Eth.prototype.log = function log(message) {
  const self = this;
  if (self.options.debug) self.options.logger.log(`[ethjs-query log] ${message}`);
};

Eth.prototype.sendAsync = function sendAsync(opts, cb) {
  const self = this;
  self.idCounter = self.idCounter % self.options.max;
  self.currentProvider.sendAsync(createPayload(opts, self.idCounter++), (err, response) => {
    const responseObject = response || {};
    if (err || responseObject.error) return cb(new Error(`[ethjs-query] ${(responseObject.error && 'rpc' || '')} error with payload ${JSON.stringify(opts, null, 0)} ${err || (JSON.stringify(response.error, null, 0))}`));
    return cb(null, responseObject.result);
  });
};

Object.keys(format.schema.methods).forEach((rpcMethodName) => {
  Object.defineProperty(Eth.prototype, rpcMethodName.replace('eth_', ''), {
    enumerable: true,
    value: generateFnFor(rpcMethodName, format.schema.methods[rpcMethodName]),
  });
});

function generateFnFor(method, methodObject) {
  return function outputMethod() {
    var protoCallback = () => {}; // eslint-disable-line
    var inputs = null; // eslint-disable-line
    var inputError = null; // eslint-disable-line
    const self = this;
    const args = [].slice.call(arguments); // eslint-disable-line
    const protoMethod = method.replace('eth_', ''); // eslint-disable-line

    if (args.length > 0 && typeof args[args.length - 1] === 'function') {
      protoCallback = args.pop();
    }

    return new Promise((resolve, reject) => {
      const cb = (callbackError, callbackResult) => {
        if (callbackError) {
          reject(callbackError);
          protoCallback(callbackError, null);
        } else {
          try {
            self.log(`attempting method formatting for '${protoMethod}' with raw outputs: ${JSON.stringify(callbackResult, null, self.options.jsonSpace)}`);
            const methodOutputs = format.formatOutputs(method, callbackResult);
            self.log(`method formatting success for '${protoMethod}' formatted result: ${JSON.stringify(methodOutputs, null, self.options.jsonSpace)}`);

            resolve(methodOutputs);
            protoCallback(null, methodOutputs);
          } catch (outputFormattingError) {
            const outputError = new Error(`[ethjs-query] while formatting outputs from RPC '${JSON.stringify(callbackResult, null, self.options.jsonSpace)}' for method '${protoMethod}' ${outputFormattingError}`);

            reject(outputError);
            protoCallback(outputError, null);
          }
        }
      };

      if (args.length < methodObject[2]) {
        return cb(new Error(`[ethjs-query] method '${protoMethod}' requires at least ${methodObject[2]} input (format type ${methodObject[0][0]}), ${args.length} provided. For more information visit: https://github.com/ethereum/wiki/wiki/JSON-RPC#${method.toLowerCase()}`));
      }

      if (args.length > methodObject[0].length) {
        return cb(new Error(`[ethjs-query] method '${protoMethod}' requires at most ${methodObject[0].length} params, ${args.length} provided '${JSON.stringify(args, null, self.options.jsonSpace)}'. For more information visit: https://github.com/ethereum/wiki/wiki/JSON-RPC#${method.toLowerCase()}`));
      }

      if (methodObject[3] && args.length < methodObject[3]) {
        args.push('latest');
      }

      self.log(`attempting method formatting for '${protoMethod}' with inputs ${JSON.stringify(args, null, self.options.jsonSpace)}`);

      try {
        inputs = format.formatInputs(method, args);
        self.log(`method formatting success for '${protoMethod}' with formatted result: ${JSON.stringify(inputs, null, self.options.jsonSpace)}`);
      } catch (formattingError) {
        return cb(new Error(`[ethjs-query] while formatting inputs '${JSON.stringify(args, null, self.options.jsonSpace)}' for method '${protoMethod}' error: ${formattingError}`));
      }

      return self.sendAsync({ method, params: inputs }, cb);
    });
  };
}

function createPayload(data, id) {
  return Object.assign({
    id,
    jsonrpc: '2.0',
    params: [],
  }, data);
}
