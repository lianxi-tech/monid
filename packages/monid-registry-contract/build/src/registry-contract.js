'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y['return'] : op[0] ? y['throw'] || ((t = y['return']) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, '__esModule', { value: true });
var ethers_1 = require('ethers');
var Registry__factory_1 = require('../types/ethers-contracts/factories/Registry__factory');
var utils_1 = require('./utils');
var RegistryContract = /** @class */ (function () {
  function RegistryContract(address, providerUri) {
    this.provider = new ethers_1.ethers.providers.JsonRpcProvider(providerUri);
    this.contract = Registry__factory_1.Registry__factory.connect(address, this.provider);
  }
  /**
   * Resolves a DID on the MONiD Registry Contract. Checks if an entry for this DID exists and returns the related
   * IPFS hash if so.
   * @see https://docs.ethers.io/v5/getting-started/#getting-started--signing
   *
   * @param did -  the DID that should be resolved
   * @returns The IPFS hash if an entry exists for the given DID
   * @throws if the DID does not have a "monid" method identifier or if no Did Document was found
   * @example registryContract.resolveDID("did:monid:1fb352353ff51248c5104b407f9c04c3666627fcf5a167d693c9fc84b75964e2")
   */
  RegistryContract.prototype.resolveDID = function (did) {
    return __awaiter(this, void 0, void 0, function () {
      var idString;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            idString = utils_1.Utils.stripMethodPrefix(did);
            return [4 /*yield*/, this.contract.getRecord(idString)];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  /**
   * Given an unsigned, hex encoded Ethereum transaction
   * and a {@link SignatureLike} object (containing the R, S, and V values for the corresponding signature), will
   * assemble / encode the signed transaction and broadcast it to the Ethereum network,
   * then wait for the transaction to be mined, and return the result.
   * @see https://docs.ethers.io/v5/api/utils/bytes/#utils-splitSignature
   *
   * @param tx - hex encoded RLP encoded Ethereum transaction (e.g. as created by `prepareAnchoringTransaction`)
   * @param sig - Object containing the hex encoded values for R and S, and a 0 / 1 value vor V.
   *
   * @returns TransactionReceipt containing the status of the TX, gas used, # of confirmations, etc.
   */
  RegistryContract.prototype.broadcastTransaction = function (tx, sig) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (sig.r.length !== 66) {
          throw new Error('Invalid R length, expected 32 bytes, got ' + sig.r.length);
        }
        if (sig.s.length !== 66) {
          throw new Error('Invalid S length, expected 32 bytes, got ' + sig.s.length);
        }
        if (sig.recoveryParam !== 0 && sig.recoveryParam !== 1) {
          throw new Error('Invalid recovery param, expected 0 or 1, got ' + sig.recoveryParam);
        }
        return [
          2 /*return*/,
          this.provider.sendTransaction(ethers_1.utils.serializeTransaction(ethers_1.utils.parseTransaction(tx), sig)).then(function (tx) {
            return tx.wait();
          }),
        ];
      });
    });
  };
  /**
   * Returns an unsigned, RLP encoded, serialized, Etereum TX.
   * Once the transaction is signed, the RegistryContract.broadcastTransaction
   * method can be called to update the entry in the registry smart contract.
   *
   * @param did - the DID to be anchored, e.g. did:monid:accf...eed
   * @param hash - the IPFS hash for the corresponding DID Document
   * @param pubKey - the public key of the intended signer. It is used to fetch the latest nonce (for
   * the associated Ethereum dddress) and encode it in the TX
   * @param gasConfiguration - optional configuration for the gasPrice and gasLimit to be encoded in the TX
   *
   * @returns Buffer containing an unsigned RLP encoded call to the `update` function on the registry smart contract.
   */
  RegistryContract.prototype.prepareAnchoringTransaction = function (did, hash, pubKey, _a) {
    var _b =
        _a === void 0
          ? {
              gasPrice: utils_1.Utils.decimalToHex(21000000000),
              gasLimit: utils_1.Utils.decimalToHex(300000),
            }
          : _a,
      gasPrice = _b.gasPrice,
      gasLimit = _b.gasLimit;
    return __awaiter(this, void 0, void 0, function () {
      var idString, nonce;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            idString = utils_1.Utils.stripMethodPrefix(did);
            return [4 /*yield*/, this.provider.getTransactionCount(ethers_1.utils.computeAddress(pubKey))];
          case 1:
            nonce = _c.sent();
            return [
              2 /*return*/,
              this.contract.populateTransaction
                .setRecord(idString, hash, {
                  nonce: nonce,
                  gasLimit: gasLimit,
                  gasPrice: gasPrice,
                })
                .then(function (tx) {
                  return Buffer.from(ethers_1.utils.serializeTransaction(tx).slice(2), 'hex');
                }),
            ];
        }
      });
    });
  };
  /**
   * Given a raw unsigned ethereum TX, and a signature object (including R, S, and the recovery value),
   * will encode the signature correctly and use 'this.provider' to send the TX to the network.
   */
  RegistryContract.prototype.sendRawTransaction = function (txData) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        if (typeof txData === 'string') {
          return [2 /*return*/, this.provider.sendTransaction(txData)];
        }
        return [
          2 /*return*/,
          this.provider.sendTransaction(ethers_1.utils.serializeTransaction(txData.unsignedTx, txData.signature)).then(function (res) {
            return res.wait();
          }),
        ];
      });
    });
  };
  return RegistryContract;
})();
exports.default = RegistryContract;
