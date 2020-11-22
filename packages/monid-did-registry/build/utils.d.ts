import FormData from 'form-data';
/**
 * @class
 * Class provides utility functions
 * @internal
 */
export declare class Utils {
    /**
     * Helper method to serialize JSON so it can be parsed by the go-ipfs implementation
     * @param data - JSON document to be serialized
     */
    static serializeJSON(data: object): FormData;
    /**
     * Helper method to post data using cross fetch implementation
     * @param endpoint - HTTP endpoint to post data to
     * @param data - JSON document to post
     */
    static postRequest(endpoint: string, data: any): Promise<Response>;
    /**
     * Helper method to get data using cross fetch implementation
     * @param endpoint - HTTP endpoint to get data from
     */
    static getRequest(endpoint: string): Promise<Response>;
}
