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
     * Dereferences an IPFS hash and parses the result as json
     * @param hash - IPFS hash
     * @example `console.log(await ipfsAgent.catJSON('Qmb5X...')) // {test: 'test'}`
     */
    catJSON(hash: string): Promise<object>;
}
/**
 * Returns a configured instance of the MONiD ipfs agent
 * @return - Instantiated IPFS agent
 */
export declare const monidIpfsStorageAgent: IpfsStorageAgent;
