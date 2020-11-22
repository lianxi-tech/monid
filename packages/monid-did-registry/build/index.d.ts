/// <reference types="node" />
import { IDidDocument } from '@decentralized-identity/did-common-typescript';
import { SignatureLike } from '@monid/registry-contract';
export declare const infura = "https://rinkeby.infura.io/v3/15d4004b3d9d4eef90898b33ba6358c8";
export declare const monidRegistryContract = "0x61F36Db1849bC8F21F9A41A74b4f073D09E7F160";
export declare const monidIpfsHost = "https://ipfs.monid.io:443";
/**
 * Returns a configured registrar for the did:monid method
 * @param providerUri - Ethereum HTTP gateway used for reading the smart contract state and broadcasting transactions
 * @param contractAddress - Ethereum address of a instance of the registry smart contract, to be used for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents, should allow for pinning
 */
export declare const getRegistry: (providerUrl?: string, contractAddress?: string, ipfsHost?: string) => {
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
    publishDidDocument(pubKey: Buffer, didDocument: IDidDocument): Promise<string>;
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
    broadcastTransaction(transactionHex: string, signature: SignatureLike): Promise<import("@ethersproject/abstract-provider").TransactionReceipt>;
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
    publishPublicProfile(did: string, publicProfile: any): Promise<ReturnType<typeof generatePublicProfileServiceSection>>;
};
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
declare function generatePublicProfileServiceSection(did: string, profileIpfsHash: string): {
    id: string;
    serviceEndpoint: string;
    description: string;
    type: string;
};
export {};
