import { Utils } from './utils';

/**
 * @class
 * Class abstracting all interactions with ipfs nodes
 * @internal
 */
export class IpfsStorageAgent {
  private readonly _endpoint: string;

  /**
   * Creates an instance of {@link IpfsStorageAgent}
   * @param host - Remote ipfs gateway address
   * @example `const ipfsAgent = new IpfsStorageAgent(https://abc.com:443)`
   */
  constructor(host: string) {
    this._endpoint = host;
  }

  /**
   * Get the ipfs gateway endpoint
   * @example `console.log(ipfsAgent.endpoint) // 'https://test.com'`
   */
  get endpoint() {
    return this._endpoint;
  }

  /**
   * Stores a JSON document on IPFS, using a public gateway
   * @param data - JSON document to store
   * @param pin - Whether the hash should be added to the pinset
   * @returns {string} - IPFS hash
   * @example `await ipfsAgent.storeJSON({data: {test: 'test'}, pin: false})`
   */
  public async storeJSON(data: object, pin: boolean = true): Promise<string> {
    const endpoint = `${this.endpoint}/api/v0/add?pin=${pin}`;
    const serializedData = Utils.serializeJSON(data);
    const { Hash } = await Utils.postRequest(endpoint, serializedData).then((res) => res.json());
    return Hash;
  }

  /**
   * Removes the specified hash from the pinset
   * @param hash - IPFS hash
   * @example `await ipfsAgent.removePinnedHash('Qmb5X...')`
   */
  public async removePinnedHash(hash: string): Promise<void> {
    const endpoint = `${this.endpoint}/api/v0/pin/rm?arg=${hash}`;
    const res = await Utils.getRequest(endpoint);
    if (!res.ok) {
      throw new Error(`Removing pinned hash ${hash} failed, status code: ${res.status}`);
    }
  }
}

/**
 * Returns a configured instance of the MONiD ipfs agent
 * @return - Instantiated IPFS agent
 */
export const monidIpfsStorageAgent = new IpfsStorageAgent('https://ipfs.monid.com:443');
