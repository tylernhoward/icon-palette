import * as ColorThief from 'color-thief-browser';
import axios, { AxiosRequestConfig, AxiosPromise } from 'axios';
const COMPANY_URL = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";
const LOGO_URL = "https://logo.clearbit.com/";
const WHITE = 230;
export class IconPalette{
    /**
     * Returns palette of 3 colors from image
     * @param {string} sourceImage
     * @return {string}
     */
    getPalette(sourceImage: string, colors: number, strip?: boolean, sort?:string) {
        let palette = new Array();
        let colorThief = new ColorThief();
        let image = this.createImage();
        image.src = sourceImage;
        colors = colors || 7;
        // TODO: I have no idea. 
        palette = colorThief.getPalette(image, 7);
        palette = this.cleanUpPalette(palette, colors, strip, sort);
        return palette;
    }
    cleanUpPalette(palette: Array<any>,colors:number, strip?:boolean, sort?:string, ) {
        if (strip == true) {
            palette = this.stripWhites(palette)
        }
        palette = palette.slice(0, colors);
        if (sort == "color") {
            palette = this.sortByColor(palette);
        } else if (sort == "brightness") {
            palette = this.sortByBrightness(palette);
        }
        return palette
    }

    /**
     * Gets dominant color in image
     * @param {string} sourceImage
     * @return {string}
     */
    getMainColor(sourceImage:string) {
        let colorThief = new ColorThief();
        let image = this.createImage();
        image.src = sourceImage;
        return colorThief.getColor(image);
    }

    /**
     * Helper method to create image canvas
     * 
     * @return {Image}
     */
    createImage() {
        let image = new Image;
        image.crossOrigin = "anonymous";
        image.width = 32;
        image.height = 32;
        //image.onload = function () {};
        return image
    }

    /**
     * Strips white hues out of palette array.
     * @param  {array} palette
     * @return {array}
     */
    stripWhites(palette:Array<any>) {
        let result = new Array();
        for (let i = 0; i < palette.length; i++) {
            let color = palette[i];
            if (!(color[0] > WHITE && color[1] > WHITE && color[2] > WHITE)) {
                result.push(palette[i]);
            }
        }
        return result;
    }

    /**
     * Converts color RGB array to hex string
     * @param  {array} colors
     * @return {String}
     */
    convertToHex(color:Array<any>) {
        let hex = "";
        for (let i = 0; i < color.length; i++) {
            let c = color[i].toString(16);
            hex = hex + (c.length == 1 ? "0" + c : c);
        }
        return hex;
    }

    /**
     * Sorts by brightness
     * @param  {array} palette
     * @return {array}
     */
    sortByBrightness(palette: Array<any>) {
        let sumColor = function (color:Array<any>) {
            // To calculate relative luminance under sRGB and RGB colorspaces that use Rec. 709:
            return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
        }

        palette.sort(function (a, b) {
            return (sumColor(a) - sumColor(b));
        });
        return palette;
    }

    /**
     * Sorts by the ROYGBIV spectrum
     * @param  {array} palette
     * @return {array}
     */
    sortByColor(palette: Array<any>) {
        let rgbToHsl = function (c:Array<any>) {
            let r = c[0] / 255;
            let g = c[1] / 255;
            let b = c[2] / 255;
            let max = Math.max(r, g, b)
            let min = Math.min(r, g, b);
            let h = (max + min) / 2;
            let s = (max + min) / 2;
            let l = (max + min) / 2;


            if (max == min) {
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            return new Array(h * 360, s * 100, l * 100);
        };
        let sorted = []
        sorted = palette.map(function (c, i) {
            // Convert to HSL and keep track of original indices
            return { color: rgbToHsl(c), index: i };
        }).sort(function (c1, c2) {
            // Sort by hue
            return c1.color[0] - c2.color[0];
        }).map(function (data) {
            // Retrieve original RGB color
            return palette[data.index];
        });
        return sorted;
    }

    /**
     * Finds a logo URL from a company name
     * @param  {String} company
     * @return {String}
     */
    async findLogoByName(company:string) {
        try {
            const response = await axios.get(COMPANY_URL + company)
            const data = response.data;
            return data[0].logo ? data[0].logo : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }

    /**
     * Checks if logo exists and returns logo URL if true
     * @param  {String} URL
     * @return {String}
     */
    async findLogoByURL(URL:string) {
        try {
            const response = await axios.get(LOGO_URL + URL);
            const data = response.data;
            return data ? data : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
}