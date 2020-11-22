"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.monidIpfsStorageAgent = exports.IpfsStorageAgent = void 0;
var utils_1 = require("./utils");
/**
 * @class
 * Class abstracting all interactions with ipfs nodes
 * @internal
 */
var IpfsStorageAgent = /** @class */ (function () {
    /**
     * Creates an instance of {@link IpfsStorageAgent}
     * @param host - Remote ipfs gateway address
     * @example `const ipfsAgent = new IpfsStorageAgent(https://abc.com:443)`
     */
    function IpfsStorageAgent(host) {
        this._endpoint = host;
    }
    Object.defineProperty(IpfsStorageAgent.prototype, "endpoint", {
        /**
         * Get the ipfs gateway endpoint
         * @example `console.log(ipfsAgent.endpoint) // 'https://test.com'`
         */
        get: function () {
            return this._endpoint;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Stores a JSON document on IPFS, using a public gateway
     * @param data - JSON document to store
     * @param pin - Whether the hash should be added to the pinset
     * @returns {string} - IPFS hash
     * @example `await ipfsAgent.storeJSON({data: {test: 'test'}, pin: false})`
     */
    IpfsStorageAgent.prototype.storeJSON = function (data, pin) {
        if (pin === void 0) { pin = true; }
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, serializedData, Hash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.endpoint + "/api/v0/add?pin=" + pin;
                        serializedData = utils_1.Utils.serializeJSON(data);
                        return [4 /*yield*/, utils_1.Utils.postRequest(endpoint, serializedData).then(function (res) { return res.json(); })];
                    case 1:
                        Hash = (_a.sent()).Hash;
                        return [2 /*return*/, Hash];
                }
            });
        });
    };
    /**
     * Removes the specified hash from the pinset
     * @param hash - IPFS hash
     * @example `await ipfsAgent.removePinnedHash('Qmb5X...')`
     */
    IpfsStorageAgent.prototype.removePinnedHash = function (hash) {
        return __awaiter(this, void 0, void 0, function () {
            var endpoint, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        endpoint = this.endpoint + "/api/v0/pin/rm?arg=" + hash;
                        return [4 /*yield*/, utils_1.Utils.getRequest(endpoint)];
                    case 1:
                        res = _a.sent();
                        if (!res.ok) {
                            throw new Error("Removing pinned hash " + hash + " failed, status code: " + res.status);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return IpfsStorageAgent;
}());
exports.IpfsStorageAgent = IpfsStorageAgent;
/**
 * Returns a configured instance of the MONiD ipfs agent
 * @return - Instantiated IPFS agent
 */
exports.monidIpfsStorageAgent = new IpfsStorageAgent('https://ipfs.monid.com:443');
