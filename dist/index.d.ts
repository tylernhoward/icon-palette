export default class IconPalette {
    /**
     * Returns palette of 3 colors from image
     * @param {string} sourceImage
     * @return {string}
     */
    getPalette(sourceImage: string, colors: number, strip?: boolean, sort?: string): Promise<Array<any>>;
    private fetchColors(image);
    private cleanUpPalette(palette, colors?, strip?, sort?);
    /**
     * Gets dominant color in image
     * @param {string} sourceImage
     * @return {string}
     */
    getMainColor(sourceImage: string): Promise<Array<any>>;
    private fetchColor(image);
    /**
     * Helper method to create image canvas
     *
     * @return {Image}
     */
    private createImage(sourceImage);
    /**
     * Strips white hues out of palette array.
     * @param  {array} palette
     * @return {array}
     */
    private stripWhites(palette);
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
    private sortByBrightness(palette);
    /**
     * Sorts by the ROYGBIV spectrum
     * @param  {array} palette
     * @return {array}
     */
    private sortByColor(palette);
    /**
     * Finds a logo URL from a company name
     * @param  {String} company
     * @return {String}
     */
    findLogoByName(company: string): Promise<string>;
    /**
     * Checks if logo exists and returns logo URL if true
     * @param  {String} URL
     * @return {String}
     */
    findLogoByURL(URL: string): Promise<string>;
}
