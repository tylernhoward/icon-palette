'use strict';
const ColorThief = require('color-thief-browser');
const axios = require("axios");
const COMPANY_URL = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";
const LOGO_URL = "https://logo.clearbit.com/";
const WHITE = 230;
module.exports = {
    /**
     * Returns palette of 3 colors from image
     * @param {string} sourceImage
     * @return {string}
     */
    getPalette: async function (sourceImage, colors, strip, sort) {
        var colorThief = new ColorThief();
        var image = await this.createImage();
        image.src = sourceImage;
        colors = colors || 7;
        var palette = colorThief.getPalette(image, 7);
        if(strip == true){ 
            palette = this.stripWhites(palette) 
        } 
        palette = palette.slice(0, colors);
        if(sort == "color"){
            palette = this.sortByColor(palette);
        }else if (sort == "brightness"){
            palette = this.sortByBrightness(palette);
        }
        return palette
    },

    /**
     * Gets dominant color in image
     * @param {string} sourceImage
     * @return {string}
     */
    getMainColor: async function (sourceImage) {
        var colorThief = new ColorThief();
        var image = await this.createImage();
        image.src = sourceImage;
        var color = colorThief.getColor(image);
        return colorThief.getColor(image);
    },

    /**
     * Helper method to create image canvas
     * 
     * @return {Image}
     */
    createImage: function () {
       var image = new Image;
       image.crossOrigin = "anonymous";
       image.width = 32;
       image.height = 32;
       //image.onload = function () {};
       return image
    },

    /**
     * Strips white hues out of palette array.
     * @param  {array} palette
     * @return {array}
     */
    stripWhites: function (palette) {
        var result = [];
        for(var i = 0; i < palette.length; i++){
            var color = palette[i];
            if (!(color[0] > WHITE && color[1] > WHITE && color[2] > WHITE)) {
                result.push(palette[i]);
            }
        }
        return result;
    },

    /**
     * Converts color RGB array to hex string
     * @param  {array} color
     * @return {String}
     */
    convertToHex: function (color) {
        var hex = "";
        for(var i = 0; i < color.length; i++){
            c = color[i].toString(16);
            hex = hex + (c.length == 1 ? "0" + c : c);
        }
        return hex;
    },

    /**
     * Sorts by brightness
     * @param  {array} palette
     * @return {array}
     */
    sortByBrightness: function(palette){
        var sumColor = function(color) {
            // To calculate relative luminance under sRGB and RGB colorspaces that use Rec. 709:
            return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
        }

        palette.sort(function (a, b) {
            return sumColor(a) > sumColor(b);
        });
        return palette;
    },

    /**
     * Sorts by the ROYGBIV spectrum
     * @param  {array} palette
     * @return {array}
     */
    sortByColor: function (palette){
        var rgbToHsl = function(c) {
            var r = c[0] / 255, g = c[1] / 255, b = c[2] / 255;
            var max = Math.max(r, g, b), min = Math.min(r, g, b);
            var h, s, l = (max + min) / 2;

            if (max == min) {
                h = s = 0; // achromatic
            } else {
                var d = max - min;
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
        var sorted = [] 
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
    },

    /**
     * Finds a logo URL from a company name
     * @param  {String} company
     * @return {String}
     */
    findLogoByName: async function (company) {
        try {
            const response = await axios.get(COMPANY_URL + company);
            const data = response.data;
            return data[0].logo ? data[0].logo : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    },

    /**
     * Checks if logo exists and returns logo URL if true
     * @param  {String} URL
     * @return {String}
     */
    findLogoByURL: async function (URL) {
        try {
            const response = await axios.get(LOGO_URL + company);
            const data = response.data;
            return data ? data : null;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};