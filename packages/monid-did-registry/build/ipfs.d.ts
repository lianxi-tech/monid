/**
 * @class
 * Class abstracting all interactions with ipfs nodes
 * @internal
 */
export declare class IpfsStorageAgent {
    private readonly _endpoint;
    /**
     * Creates an instance of {@link IpfsStorageAgent}
     * @param host - Remote ipfs gateway address
     * @example `const ipfsAgent = new IpfsStorageAgent(https://abc.com:443)`
     */
    constructor(host: string);
    /**
     * Get the ipfs gateway endpoint
     * @example `console.log(ipfsAgent.endpoint) // 'https://test.com'`
     */
    get endpoint(): string;
    /**
     * Stores a JSON document on IPFS, using a public gateway
     * @param data - JSON document to store
     * @param pin - Whether the hash should be added to the pinset
     * @returns {string} - IPFS hash
     * @example `await ipfsAgent.storeJSON({data: {test: 'test'}, pin: false})`
     */
    storeJSON(data: object, pin?: boolean): Promise<string>;
    /**
     * Removes the specified hash from the pinset
     * @param hash - IPFS hash
     * @example `await ipfsAgent.removePinnedHash('Qmb5X...')`
     */
    removePinnedHash(hash: string): Promise<void>;
}
/**
 * Returns a configured instance of the MONiD ipfs agent
 * @return - Instantiated IPFS agent
 */
export declare const monidIpfsStorageAgent: IpfsStorageAgent;
