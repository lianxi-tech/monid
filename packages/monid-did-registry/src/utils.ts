import isNode from 'detect-node';
import FormData from 'form-data';
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
   * Helper method to serialize JSON so it can be parsed by the go-ipfs implementation
   * @param data - JSON document to be serialized
   */
  static serializeJSON(data: object) {
    if (!data || typeof data !== 'object') {
      throw new Error(`JSON expected, received ${typeof data}`);
    }

    const formData = new FormData();
    if (isNode) {
      formData.append('file', Buffer.from(JSON.stringify(data)));
      return formData;
    } else {
      const serializedData = Buffer.from(JSON.stringify(data)).toString('binary');
      const dataBlob = new Blob([serializedData], {});
      formData.append('file', dataBlob);
      return formData;
    }
  }

  /**
   * Helper method to post data using cross fetch implementation
   * @param endpoint - HTTP endpoint to post data to
   * @param data - JSON document to post
   */
  static async postRequest(endpoint: string, data: any) {
    return fetch(endpoint, {
      method: 'POST',
      body: data,
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${ipfsProjectId}:${ipfsProjectSecret}`, 'binary').toString('base64'),
      },
    });
  }

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
