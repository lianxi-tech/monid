import { Utils } from './utils';
require('dotenv').config();

const ipfsHost = process.env.INFURA_IPFS_URI || '';
if (ipfsHost == '') {
  console.error('must assign INFURA_IPFS_URI');
  process.exit(1);
}

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
   * Dereferences an IPFS hash and parses the result as json
   * @param hash - IPFS hash
   * @example `console.log(await ipfsAgent.catJSON('Qmb5X...')) // {test: 'test'}`
   */
  public async catJSON(hash: string): Promise<object> {
    const endpoint = `${this._endpoint}/api/v0/cat/${hash}`;
    const res = await Utils.getRequest(endpoint);
    return res.json();
  }
}

/**
 * Returns a configured instance of the MONiD ipfs agent
 * @return - Instantiated IPFS agent
 */
export const monidIpfsStorageAgent = new IpfsStorageAgent(ipfsHost);
