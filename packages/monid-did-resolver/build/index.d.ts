import { DIDDocument, ParsedDID, Resolver } from 'did-resolver';
export declare const infuraUrl: string;
export declare const monidRegistryContract: string;
export declare const monidIpfsHost: string;
/**
 * Returns a configured resolver for the did:monid method
 * @param providerUri - Ethereum HTTP gateway used for reading the registry contract state and broadcasting transactions
 * @param contractAddress - The Ethereum address of a instance of the registry smart contract to use for anchoring / resolution
 * @param ipfsHost - IPFS gateway HTTPS API endpoint used for storing / reading IPFS documents
 */
export declare function getResolver(providerUri?: string, contractAddress?: string, ipfsHost?: string): {
    monid: (did: string, parsed: ParsedDID, didResolver: Resolver) => Promise<DIDDocument>;
};
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
export declare function getPublicProfile(didDoc: DIDDocument, ipfsHost?: string): Promise<any | null>;
