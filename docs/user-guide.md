# User Guide

All information for developers using `ethjs-query` should consult this document.

## Install

```
npm install --save ethjs-query
```

## Usage

```js
const HttpProvider = require('ethjs-provider-http');
const Eth = require('ethjs-query');
const eth = new Eth(new HttpProvider('http://localhost:8545'));

eth.getBalance('0x407d73d8a49eeb85d32cf465507dd71d507100c1', cb);

// result null <BigNumber ...>

eth.sendTransaction({
  from: '0x407d73d8a49eeb85d32cf465507dd71d507100c1',
  to: '0x987d73d8a49eeb85d32cf462207dd71d50710033',
  gas: 300000,
  data: '0x',
}).then(cb).catch(cb);

// result null 0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470
```

## Debugging Options

`ethjs-query` comes equip with a full debug options for all data inputs and outputs.

```js
const HttpProvider = require('ethjs-provider-http');
const Eth = require('ethjs-query');
const eth = new Eth(new HttpProvider('http://localhost:8545'), { debug: true, logger: console, jsonSpace: 0 });

eth.accounts(cb);

/* result
[ethjs-query 2016-11-27T19:37:54.917Z] attempting method accounts with params [null]
[ethjs-query 2016-11-27T19:37:54.917Z] [method 'accounts'] callback provided: true
[ethjs-query 2016-11-27T19:37:54.917Z] [method 'accounts'] attempting input formatting of 0 inputs
[ethjs-query 2016-11-27T19:37:54.917Z] [method 'accounts'] formatted inputs: []
[ethjs-query 2016-11-27T19:37:54.917Z] [method 'accounts'] attempting query with formatted inputs...
[ethjs-query 2016-11-27T19:37:54.919Z] [method 'accounts'] callback success, attempting formatting of raw outputs: ["0xb88643569c19d05dc67b960f91d9d696eebf808e","0xf...]
[ethjs-query 2016-11-27T19:37:54.919Z] [method 'accounts'] formatted outputs: ["0xb88643569c19d05dc67b960f91d9d696eebf808e","0xf...]
*/
```

## Promise and Callbacks

`ethjs-query` supports both callbacks and promises for all RPC methods.

## Supported Methods

`ethjs-query` supports all Ethereum spec RPC methods. Note, all `eth` RPC methods are attached as methods to the `Eth` object without the `eth_` prefix. All other methods (e.g. `web3_`, `net_` and `ssh_` etc.) require the full RPC method name (note, this policy may change in the future).

* [eth.protocolVersion](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_protocolversion)
* [eth.syncing](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_syncing)
* [eth.coinbase](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_coinbase)
* [eth.mining](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_mining)
* [eth.hashrate](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_hashrate)
* [eth.gasPrice](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gasprice)
* [eth.accounts](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_accounts)
* [eth.blockNumber](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_blocknumber)
* [eth.getBalance](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getbalance)
* [eth.getStorageAt](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getstorageat)
* [eth.getTransactionCount](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactioncount)
* [eth.getBlockTransactionCountByHash](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblocktransactioncountbyhash)
* [eth.getBlockTransactionCountByNumber](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblocktransactioncountbynumber)
* [eth.getUncleCountByBlockHash](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getunclecountbyblockhash)
* [eth.getUncleCountByBlockNumber](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getunclecountbyblocknumber)
* [eth.getCode](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getcode)
* [eth.sign](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sign)
* [eth.sendTransaction](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendtransaction)
* [eth.sendRawTransaction](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_sendrawtransaction)
* [eth.call](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_call)
* [eth.estimateGas](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_estimategas)
* [eth.getBlockByHash](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbyhash)
* [eth.getBlockByNumber](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getblockbynumber)
* [eth.getTransactionByHash](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyhash)
* [eth.getTransactionByBlockHashAndIndex](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyblockhashandindex)
* [eth.getTransactionByBlockNumberAndIndex](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionbyblocknumberandindex)
* [eth.getTransactionReceipt](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_gettransactionreceipt)
* [eth.getUncleByBlockHashAndIndex](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getunclebyblockhashandindex)
* [eth.getUncleByBlockNumberAndIndex](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getunclebyblocknumberandindex)
* [eth.getCompilers](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getcompilers)
* [eth.compileLLL](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_compilelll)
* [eth.compileSolidity](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_compilesolidity)
* [eth.compileSerpent](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_compileserpent)
* [eth.newFilter](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newfilter)
* [eth.newBlockFilter](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newblockfilter)
* [eth.newPendingTransactionFilter](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_newpendingtransactionfilter)
* [eth.uninstallFilter](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_uninstallfilter)
* [eth.getFilterChanges](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterchanges)
* [eth.getFilterLogs](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getfilterlogs)
* [eth.getLogs](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getlogs)
* [eth.getWork](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_getwork)
* [eth.submitWork](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_submitwork)
* [eth.submitHashrate](https://github.com/ethereum/wiki/wiki/JSON-RPC#eth_submithashrate)

* [eth.web3_clientVersion](https://github.com/ethereum/wiki/wiki/JSON-RPC#web3_clientversion)
* [eth.web3_sha3](https://github.com/ethereum/wiki/wiki/JSON-RPC#web3_sha3)

* [eth.net_version](https://github.com/ethereum/wiki/wiki/JSON-RPC#net_version)
* [eth.net_peerCount](https://github.com/ethereum/wiki/wiki/JSON-RPC#net_peercount)
* [eth.net_listening](https://github.com/ethereum/wiki/wiki/JSON-RPC#net_listening)

* [eth.db_putString](https://github.com/ethereum/wiki/wiki/JSON-RPC#db_putstring)
* [eth.db_getString](https://github.com/ethereum/wiki/wiki/JSON-RPC#db_getstring)
* [eth.db_putHex](https://github.com/ethereum/wiki/wiki/JSON-RPC#db_puthex)
* [eth.db_getHex](https://github.com/ethereum/wiki/wiki/JSON-RPC#db_gethex)

* [eth.shh_post](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_post)
* [eth.shh_version](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_version)
* [eth.shh_newIdentity](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_newidentity)
* [eth.shh_hasIdentity](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_hasidentity)
* [eth.shh_newGroup](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_newgroup)
* [eth.shh_addToGroup](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_addtogroup)
* [eth.shh_newFilter](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_newfilter)
* [eth.shh_uninstallFilter](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_uninstallfilter)
* [eth.shh_getFilterChanges](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_getfilterchanges)
* [eth.shh_getMessages](https://github.com/ethereum/wiki/wiki/JSON-RPC#shh_getmessages)

## Why BN.js?

`ethjs` has made a policy of using `BN.js` across all of its repositories. Here are some of the reasons why:

  1. lighter than alternatives (BigNumber.js)
  2. faster than most alternatives, see [benchmarks](https://github.com/indutny/bn.js/issues/89)
  3. used by the Ethereum foundation across all [`ethereumjs`](https://github.com/ethereumjs) repositories
  4. is already used by a critical JS dependency of many ethereum packages, see package [`elliptic`](https://github.com/indutny/elliptic)
  5. purposefully **does not support decimals or floats numbers** (for greater precision), remember, the Ethereum blockchain cannot and will not support float values or decimal numbers.

## Browser Builds

`ethjs` provides production distributions for all of its modules that are ready for use in the browser right away. Simply include either `dist/ethjs-query.js` or `dist/ethjs-query.min.js` directly into an HTML file to start using this module. Note, an `Eth` object is made available globally.

```html
<script type="text/javascript" src="ethjs-query.min.js"></script>
<script type="text/javascript">
new Eth(...);
</script>
```

## Latest Webpack Figures

Hash: 312cb780824459f46121                                                         
Version: webpack 2.1.0-beta.15
Time: 802ms
             Asset    Size  Chunks             Chunk Names
    ethjs-query.js  243 kB       0  [emitted]  main
ethjs-query.js.map  303 kB       0  [emitted]  main
   [2] ./lib/index.js 4.97 kB {0} [built]
    + 2 hidden modules

> ethjs-query@0.1.1 build:umd:min /home/nick/github/ethjs-query
> cross-env BABEL_ENV=commonjs NODE_ENV=production webpack --config ./internals/webpack/webpack.config.js ./lib/index.js --progress

Hash: cdbbccab14a0f8e45077                                                         
Version: webpack 2.1.0-beta.15
Time: 3238ms
             Asset    Size  Chunks             Chunk Names
ethjs-query.min.js  105 kB       0  [emitted]  main
   [2] ./lib/index.js 4.97 kB {0} [built]
    + 2 hidden modules

Note, even though `ethjs` should have transformed and polyfilled most of the requirements to run this module across most modern browsers. You may want to look at an additional polyfill for extra support.

Use a polyfill service such as `Polyfill.io` to ensure complete cross-browser support:
https://polyfill.io/

## Other Awesome Modules, Tools and Frameworks

 - [web3.js](https://github.com/ethereum/web3.js) -- the original Ethereum swiss army knife **Ethereum Foundation**
 - [ethereumjs](https://github.com/ethereumjs) -- critical ethereumjs infrastructure **Ethereum Foundation**
 - [browser-solidity](https://ethereum.github.io/browser-solidity) -- an in browser Solidity IDE **Ethereum Foundation**
 - [wafr](https://github.com/silentcicero/wafr) -- a super simple Solidity testing framework
 - [truffle](https://github.com/ConsenSys/truffle) -- a solidity/js dApp framework
 - [embark](https://github.com/iurimatias/embark-framework) -- a solidity/js dApp framework
 - [dapple](https://github.com/nexusdev/dapple) -- a solidity dApp framework
 - [chaitherium](https://github.com/SafeMarket/chaithereum) -- a JS web3 unit testing framework
 - [contest](https://github.com/DigixGlobal/contest) -- a JS testing framework for contracts

## Our Relationship with Ethereum & EthereumJS

 We would like to mention that we are not in any way affiliated with the Ethereum Foundation or `ethereumjs`. However, we love the work they do and work with them often to make Ethereum great! Our aim is to support the Ethereum ecosystem with a policy of diversity, modularity, simplicity, transparency, clarity, optimization and extensibility.

 Many of our modules use code from `web3.js` and the `ethereumjs-` repositories. We thank the authors where we can in the relevant repositories. We use their code carefully, and make sure all test coverage is ported over and where possible, expanded on.
