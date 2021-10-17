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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicProfile = exports.getResolver = exports.monidIpfsHost = exports.monidRegistryContract = exports.infuraUrl = void 0;
var registry_contract_1 = __importDefault(require("@monid/registry-contract"));
var ipfs_1 = require("./ipfs");
require('dotenv').config();
exports.infuraUrl = process.env.INFURA_URI || '';
exports.monidRegistryContract = process.env.REGISTRY_CONTRACT_ADDRESS || '';
exports.monidIpfsHost = process.env.INFURA_IPFS_URI || '';
if (exports.infuraUrl == '') {
    console.error('must assign INFURA_URI');
    process.exit(1);
}
if (exports.monidRegistryContract == '') {
    console.error('must assign REGISTRY_CONTRACT_ADDRESS');
    process.exit(1);
}
if (exports.monidIpfsHost == '') {
    console.error('must assign INFURA_IPFS_URI');
    process.exit(1);
}
/**
 * Returns a configured resolver for the did:monid method
 * @param providerUri - Ethereum HTTP gateway used for reading the registry contract state and broadcasting transactions
 * @param contractAddress - The Ethereum address of a instance of the registry smart contract to use for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents
 */
function getResolver(providerUri, contractAddress, ipfsHost) {
    if (providerUri === void 0) { providerUri = exports.infuraUrl; }
    if (contractAddress === void 0) { contractAddress = exports.monidRegistryContract; }
    if (ipfsHost === void 0) { ipfsHost = exports.monidIpfsHost; }
    var registryContract = new registry_contract_1.default(contractAddress, providerUri);
    var ipfsAgent = new ipfs_1.IpfsStorageAgent(ipfsHost);
    /**
     * Given a `monid` DID, will attempt to fetch the corresponding DID Document according to the (`did:monid` method specification).
     * @param did - the did to resolve
     * @param parsed - a object containing the parsed DID, as provided by the "did-resolver" module
     * @param didResolver - instance of {@link Resolver}, populated by the "did-resolver" module
     * @returns DID Document - Did Document for the corresponding DID in JSON form
     */
    function resolve(did, parsed, didResolver) {
        return __awaiter(this, void 0, void 0, function () {
            var ipfsHash;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, registryContract.resolveDID(did)];
                    case 1:
                        ipfsHash = _a.sent();
                        if (!ipfsHash) return [3 /*break*/, 3];
                        return [4 /*yield*/, ipfsAgent.catJSON(ipfsHash)];
                    case 2: return [2 /*return*/, (_a.sent())];
                    case 3: return [2 /*return*/, {
                            '@context': 'https://w3id.org/did/v1',
                            id: '',
                            publicKey: [],
                        }];
                }
            });
        });
    }
    return { monid: resolve };
}
exports.getResolver = getResolver;
/**
 * Given a Did Document for a `monid` identity and a link to an IPFS HTTP gateway, the function will attempt
 * to fetch the Public Profile listed in the `ServiceEndpoint` section if one is present.
 * @see https://monid-lib.readthedocs.io/en/latest/publicProfile.html
 *
 * @param didDoc - JSON Did Document potentially containing a MONiD public profile serviceEndpoint section
 * @param ipfsHost - A public IPFS gateway which can be used to retrieve the public profile signed credential
 * @returns SignedCredential - A public profile signed credential encoding some general info about the identity
 * if one is present in the Did Document
 */
function getPublicProfile(didDoc, ipfsHost) {
    var _a;
    if (ipfsHost === void 0) { ipfsHost = exports.monidIpfsHost; }
    return __awaiter(this, void 0, void 0, function () {
        var ipfsAgent, publicProfileSection, hash;
        return __generator(this, function (_b) {
            ipfsAgent = new ipfs_1.IpfsStorageAgent(ipfsHost);
            publicProfileSection = (_a = didDoc === null || didDoc === void 0 ? void 0 : didDoc.service) === null || _a === void 0 ? void 0 : _a.find(function (endpoint) { return endpoint.type === 'MONiDPublicProfile'; });
            if (publicProfileSection === null || publicProfileSection === void 0 ? void 0 : publicProfileSection.serviceEndpoint) {
                hash = publicProfileSection.serviceEndpoint.replace('ipfs://', '');
                return [2 /*return*/, ipfsAgent.catJSON(hash)];
            }
            return [2 /*return*/];
        });
    });
}
exports.getPublicProfile = getPublicProfile;
