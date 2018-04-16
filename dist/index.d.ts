export declare class IconPalette {
    /**
     * Returns palette of 3 colors from image
     * @param {string} sourceImage
     * @return {string}
     */
    getPalette(sourceImage: string, colors: number, strip?: boolean, sort?: string): any[];
    cleanUpPalette(palette: Array<any>, colors: number, strip?: boolean, sort?: string): any[];
    /**
     * Gets dominant color in image
     * @param {string} sourceImage
     * @return {string}
     */
    getMainColor(sourceImage: string): any;
    /**
     * Helper method to create image canvas
     *
     * @return {Image}
     */
    createImage(): HTMLImageElement;
    /**
     * Strips white hues out of palette array.
     * @param  {array} palette
     * @return {array}
     */
    stripWhites(palette: Array<any>): any[];
    /**
     * Converts color RGB array to hex string
     * @param  {array} colors
     * @return {String}
     */
    convertToHex(color: Array<any>): string;
    /**
     * Sorts by brightness
     * @param  {array} palette
     * @return {array}
     */
    sortByBrightness(palette: Array<any>): any[];
    /**
     * Sorts by the ROYGBIV spectrum
     * @param  {array} palette
     * @return {array}
     */
    sortByColor(palette: Array<any>): any[];
    /**
     * Finds a logo URL from a company name
     * @param  {String} company
     * @return {String}
     */
    findLogoByName(company: string): Promise<any>;
    /**
     * Checks if logo exists and returns logo URL if true
     * @param  {String} URL
     * @return {String}
     */
    findLogoByURL(URL: string): Promise<any>;
}
