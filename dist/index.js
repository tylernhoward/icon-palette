"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ColorThief = __importStar(require("color-thief-browser"));
var axios_1 = __importDefault(require("axios"));
var COMPANY_URL = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";
var LOGO_URL = "https://logo.clearbit.com/";
var WHITE = 230;
var IconPalette = /** @class */ (function () {
    function IconPalette() {
    }
    /**
     * Returns palette of 3 colors from image
     * @param {string} sourceImage
     * @return {string}
     */
    IconPalette.prototype.getPalette = function (sourceImage, colors, strip, sort) {
        var palette = new Array();
        var colorThief = new ColorThief();
        var image = this.createImage();
        image.src = sourceImage;
        colors = colors || 7;
        // TODO: I have no idea. 
        palette = colorThief.getPalette(image, 7);
        palette = this.cleanUpPalette(palette, colors, strip, sort);
        return palette;
    };
    IconPalette.prototype.cleanUpPalette = function (palette, colors, strip, sort) {
        if (strip == true) {
            palette = this.stripWhites(palette);
        }
        palette = palette.slice(0, colors);
        if (sort == "color") {
            palette = this.sortByColor(palette);
        }
        else if (sort == "brightness") {
            palette = this.sortByBrightness(palette);
        }
        return palette;
    };
    /**
     * Gets dominant color in image
     * @param {string} sourceImage
     * @return {string}
     */
    IconPalette.prototype.getMainColor = function (sourceImage) {
        var colorThief = new ColorThief();
        var image = this.createImage();
        image.src = sourceImage;
        return colorThief.getColor(image);
    };
    /**
     * Helper method to create image canvas
     *
     * @return {Image}
     */
    IconPalette.prototype.createImage = function () {
        var image = new Image;
        image.crossOrigin = "anonymous";
        image.width = 32;
        image.height = 32;
        //image.onload = function () {};
        return image;
    };
    /**
     * Strips white hues out of palette array.
     * @param  {array} palette
     * @return {array}
     */
    IconPalette.prototype.stripWhites = function (palette) {
        var result = new Array();
        for (var i = 0; i < palette.length; i++) {
            var color = palette[i];
            if (!(color[0] > WHITE && color[1] > WHITE && color[2] > WHITE)) {
                result.push(palette[i]);
            }
        }
        return result;
    };
    /**
     * Converts color RGB array to hex string
     * @param  {array} colors
     * @return {String}
     */
    IconPalette.prototype.convertToHex = function (color) {
        var hex = "";
        for (var i = 0; i < color.length; i++) {
            var c = color[i].toString(16);
            hex = hex + (c.length == 1 ? "0" + c : c);
        }
        return hex;
    };
    /**
     * Sorts by brightness
     * @param  {array} palette
     * @return {array}
     */
    IconPalette.prototype.sortByBrightness = function (palette) {
        var sumColor = function (color) {
            // To calculate relative luminance under sRGB and RGB colorspaces that use Rec. 709:
            return 0.2126 * color[0] + 0.7152 * color[1] + 0.0722 * color[2];
        };
        palette.sort(function (a, b) {
            return (sumColor(a) - sumColor(b));
        });
        return palette;
    };
    /**
     * Sorts by the ROYGBIV spectrum
     * @param  {array} palette
     * @return {array}
     */
    IconPalette.prototype.sortByColor = function (palette) {
        var rgbToHsl = function (c) {
            var r = c[0] / 255;
            var g = c[1] / 255;
            var b = c[2] / 255;
            var max = Math.max(r, g, b);
            var min = Math.min(r, g, b);
            var h = (max + min) / 2;
            var s = (max + min) / 2;
            var l = (max + min) / 2;
            if (max == min) {
                h = s = 0; // achromatic
            }
            else {
                var d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r:
                        h = (g - b) / d + (g < b ? 6 : 0);
                        break;
                    case g:
                        h = (b - r) / d + 2;
                        break;
                    case b:
                        h = (r - g) / d + 4;
                        break;
                }
                h /= 6;
            }
            return new Array(h * 360, s * 100, l * 100);
        };
        var sorted = [];
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
    };
    /**
     * Finds a logo URL from a company name
     * @param  {String} company
     * @return {String}
     */
    IconPalette.prototype.findLogoByName = function (company) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(COMPANY_URL + company)];
                    case 1:
                        response = _a.sent();
                        data = response.data;
                        return [2 /*return*/, data[0].logo ? data[0].logo : null];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Checks if logo exists and returns logo URL if true
     * @param  {String} URL
     * @return {String}
     */
    IconPalette.prototype.findLogoByURL = function (URL) {
        return __awaiter(this, void 0, void 0, function () {
            var response, data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, axios_1.default.get(LOGO_URL + URL)];
                    case 1:
                        response = _a.sent();
                        data = response.data;
                        return [2 /*return*/, data ? data : null];
                    case 2:
                        error_2 = _a.sent();
                        console.log(error_2);
                        return [2 /*return*/, null];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return IconPalette;
}());
exports.IconPalette = IconPalette;
