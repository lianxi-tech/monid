/**
 * @class
 * Class provides utility functions
 * @internal
 */
export declare class Utils {
    /**
     * Helper method to get data using cross fetch implementation
     * @param endpoint - HTTP endpoint to get data from
     */
    static getRequest(endpoint: string): Promise<Response>;
}
