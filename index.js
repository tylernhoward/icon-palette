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
    getPalette: async function (sourceImage, colors, strip) {
        var colorThief = new ColorThief();
        var image = await createImage();
        image.src = sourceImage;
        colors = colors || 8;
        var palette = colorThief.getPalette(image, 7);
        if(strip === true){ 
            palette = stripWhites() 
        } 
        palette = palette.slice(0, colors);
        return palette
    },

    /**
     * Gets dominant color in image
     * @param {string} sourceImage
     * @return {string}
     */
    getMainColor: async function (sourceImage) {
        var colorThief = new ColorThief();
        var image = await createImage();
        image.src = sourceImage;
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
        var result;
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
     * Finds a logo URL from a company name
     * @param  {String} company
     * @return {String}
     */
    findLogoByName: async function (company) {
        try {
            const response = await axios.get(API_URL + company);
            const data = response.data;
            return data[0].logo;
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
            return data;
        } catch (error) {
            console.log(error);
            return null;
        }
    }
};