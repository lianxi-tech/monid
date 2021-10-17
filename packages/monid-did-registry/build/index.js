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
exports.getRegistry = exports.monidIpfsHost = exports.monidRegistryContract = exports.infuraUrl = void 0;
var registry_contract_1 = __importDefault(require("@monid/registry-contract"));
var ipfs_1 = require("./ipfs");
require('dotenv').config();
var MONID_PUBLIC_PROFILE_TYPE = 'MONiDPublicProfile';
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
 * Returns a configured registrar for the did:monid method
 * @param providerUri - Ethereum HTTP gateway used for reading the smart contract state and broadcasting transactions
 * @param contractAddress - Ethereum address of a instance of the registry smart contract, to be used for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents, should allow for pinning
 */
var getRegistry = function (providerUrl, contractAddress, ipfsHost) {
    if (providerUrl === void 0) { providerUrl = exports.infuraUrl; }
    if (contractAddress === void 0) { contractAddress = exports.monidRegistryContract; }
    if (ipfsHost === void 0) { ipfsHost = exports.monidIpfsHost; }
    var registryContract = new registry_contract_1.default(contractAddress, providerUrl);
    var ipfs = new ipfs_1.IpfsStorageAgent(ipfsHost);
    return {
        /**
         * Returns an unsigned, RLP encoded, serialized, Etereum TX.
         * Once the transaction is signed, it can be broadcast to the network to be
         * processed by the registry smart contract.
         *
         * @param pubKey - the public key of the future transaction signer. This is required
         * to fetch the latest corresponding Ethereum transaction nonce, and assemble a valid transaction
         * @param didDocument - the Did Document to store on IPFS
         * @returns Unsigned, hex encoded, RLP encoded contract call. Can be signed using a secp256k1 key.
         */
        publishDidDocument: function (pubKey, didDocument) {
            return __awaiter(this, void 0, void 0, function () {
                var documentHash;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, ipfs.storeJSON(didDocument)];
                        case 1:
                            documentHash = _a.sent();
                            return [2 /*return*/, registryContract
                                    .prepareAnchoringTransaction(didDocument.id, documentHash, pubKey)
                                    .then(function (txBuffer) { return '0x' + txBuffer.toString('hex'); })];
                    }
                });
            });
        },
        /**
         * Given an unsigned, hex encoded Ethereum transaction (e.g. as created by `publishDidDocument`)
         * and a {@link SignatureLike} object (containing the R, S, and V values for the corresponding signature), will
         * assemble / encode the signed transaction and broadcast it to the Ethereum network,
         * then wait for the transaction to be mined, and return the result.
         * @see https://docs.ethers.io/v5/api/utils/bytes/#utils-splitSignature
         *
         * @param transactionHex - RLP encoded Ethereum transaction (e.g. as created by `publishDidDocument`)
         * @param signature - Object containing the hex encoded values for R and S, and a 0 / 1 value vor V.
         * @returns TransactionReceipt containing the status of the TX, gas used, # of confirmations, etc.
         */
        broadcastTransaction: function (transactionHex, signature) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, registryContract.broadcastTransaction(transactionHex, signature)];
                });
            });
        },
        /**
         * Given a DID and a "Public Profile" JSON object, the function will attempt to publish the Public Profile document
         * to IPFS, and return a "ServiceEndpoint" section with the corresponding IPFS hash included
         * @see https://monid-lib.readthedocs.io/en/latest/publicProfile.html
         *
         * @param did - The DID of the identity associated with the public profile
         * @param publicProfile - Document to be published to IPFS and linked in the Did Document
         *   the public profile is expected to be a JSON Signed Verifiable Credential
         *
         * @returns Service Endpoint section in JSON form, advertising the newly published document
         * The returned section can be included in a DID Document to make the public profile discoverable.
         */
        publishPublicProfile: function (did, publicProfile) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _a = generatePublicProfileServiceSection;
                            _b = [did];
                            return [4 /*yield*/, ipfs.storeJSON(publicProfile)];
                        case 1: return [2 /*return*/, _a.apply(void 0, _b.concat([_c.sent()]))];
                    }
                });
            });
        },
    };
};
exports.getRegistry = getRegistry;
/**
 * @internal
 * Helper function to generate a Service Endpoint entry advertising a Public Profile
 * given an IPFS hash and the DID of the owner / associated identity.
 * The returned section can be added to a DID Document to advertise
 *
 * @param did - The DID of the identity associated with the public profile
 * @param profileIpfsHash - The IPFS hash to be listed
 *   the public profile is expected to be a JSON Signed Verifiable Credential
 *
 * @returns Service Endpoint section in JSON form, advertising the newly published document
 * The returned section can be included in a DID Document to make the public profile discoverable.
 */
function generatePublicProfileServiceSection(did, profileIpfsHash) {
    return {
        id: did + ";MONiDPubProfile",
        serviceEndpoint: "ipfs://" + profileIpfsHash,
        description: 'Verifiable Credential describing entity profile',
        type: MONID_PUBLIC_PROFILE_TYPE,
    };
}
