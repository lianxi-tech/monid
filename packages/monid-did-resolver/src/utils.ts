import fetch from 'cross-fetch';
require('dotenv').config();

const ipfsProjectId = process.env.INFURA_IPFS_PROJECT_ID || '';
const ipfsProjectSecret = process.env.INFURA_IPFS_PROJECT_SECRET || '';

if (ipfsProjectId == '') {
  console.error('must assign INFURA_IPFS_PROJECT_ID');
  process.exit(1);
}

if (ipfsProjectSecret == '') {
  console.error('must assign INFURA_IPFS_PROJECT_SECRET');
  process.exit(1);
}

/**
 * @class
 * Class provides utility functions
 * @internal
 */
export class Utils {
  /**
   * Helper method to get data using cross fetch implementation
   * @param endpoint - HTTP endpoint to get data from
   */
  static async getRequest(endpoint: string) {
    return fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${ipfsProjectId}:${ipfsProjectSecret}`, 'binary').toString('base64'),
      },
    });
  }
}
