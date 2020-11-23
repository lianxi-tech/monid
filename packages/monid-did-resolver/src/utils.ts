import fetch from 'cross-fetch';

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
    return fetch(endpoint);
  }
}
