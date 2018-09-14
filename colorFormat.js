;(function (undefined) {
    "use strict"
    var _global;
    /**
     * 根据参数将颜色转换为对应的颜色格式（暂时只支持HEX/RGB/RGBA/HSL/HSLA）
     * @param {string} options.color 待转换的颜色值
     * @param {string} options.format 转换颜色的格式
     */
    var colorFormat = function (options) {
        var result,
            color = options && options.color && options.color.toLowerCase() || "#f00", // color ：默认值为 "#f00"
            format = options && options.format && options.format.toLowerCase() || "rgb", // format ：默认值为 "rgb"
            rgbType = format.indexOf("rgba") == -1 ? 0 : 1, // rgbType 0表示rgb，1表示rgba
            hslType = format.indexOf("hsla") == -1 ? 0 : 1; // hslType 0表示hsl，1表示hsla
        if (color.indexOf("#") > -1){
            if (format == "hex"){ // hex 转 hex
                result = this.hexToRgb(color);
                result = this.rgbToHex(result);
            } else if (format.indexOf("rgb") > -1){ // hex 转 rgb/rgba
                result = this.hexToRgb(color, rgbType);
            } else if (format.indexOf("hsl") > -1) { // hex 转 hsl/hsla
                result = this.hexToRgb(color);
                result = this.rgbToHsl(result, hslType);
            }
        } else if (color.indexOf("rgb") > -1) {
            result = this.getRgb(color, rgbType); // rgb 转 rgb/rgba
            if (format == "hex") { // rgb/rgba 转 hex
                result = this.rgbToHex(result);
            } else if (format.indexOf("hsl") > -1) { // rgb/rgba 转 hsl
                result = this.rgbToHsl(result, hslType);
            }
        } else if (color.indexOf("hsl") > -1) {
            result = this.getHsl(color, hslType);
            result = this.hslToRgb(result, rgbType); // hsl 转 rgb/rgba
            if (format == "hex") { // hsl 转 hex
                result = this.rgbToHex(result);
            } else if (format.indexOf("hsl") > -1) { // hsl 转 hsl/hsla
                result = this.rgbToHsl(result, hslType);
            }
        }
        return result;
    };
    colorFormat.prototype = {
        getRgb: function(rgb, type){
            /**
             * 传入字符串的rgb，如 "rgb(255,0,255)" ，获取rgb的各个参数值
             */
            rgb = rgb.toLowerCase();
            var flag = rgb.indexOf("rgba") == -1 ? 0 : 1; // flag 0表示rgb，1表示rgba
            rgb = flag ? rgb.replace("rgba", "") : rgb.replace("rgb", "");
            rgb = rgb.replace(/\s/g, "").split(",");
            var red = Number(rgb[0].slice(1)),
                green = Number(rgb[1]),
                blue = flag ? Number(rgb[2]) : Number(rgb[2].slice(0, -1)),
                opacity = flag ? Number(rgb[3].slice(0, -1)) : 1;
            return {
                r: red,
                g: green,
                b: blue,
                o: opacity,
                complete: type ?
                    ("rgba(" + [red, green, blue, opacity].join(",") + ")") :
                    ("rgb(" + [red, green, blue].join(",") + ")")
            }
        },
        getHsl: function(hsl, type){
            /**
             * 传入字符串的hsl，如 "hsl(300,100%,50%)" ，获取hsl的各个参数值
             */
            hsl = hsl.toLowerCase();
            var flag = hsl.indexOf("hsla") == -1 ? 0 : 1; // flag 0表示hsl，1表示hsla
            hsl = flag ? hsl.replace("hsla", "") : hsl.replace("hsl", "");
            hsl = hsl.replace(/\s/g, "").split(",");
            var h = Number(hsl[0].slice(1)),
                s = parseInt(hsl[1]),
                l = flag ? parseInt(hsl[2]) : parseInt(hsl[2].slice(0, -1)),
                opacity = flag ? Number(hsl[3].slice(0, -1)) : 1;
            return {
                h: h,
                s: s / 100,
                l: l / 100,
                o: opacity,
                complete: type ?
                    ("hsla(" + [h, s, l, opacity].join(",") + ")") :
                    ("hsl(" + [h, s, l].join(",") + ")")
            }
        },
        rgbToHex: function(rgb) {
            /**
             * 传入通过getRgb获取的rgb对象，将其转换为hex格式
             */
            var red = Number(rgb.r).toString(16),
                green = Number(rgb.g).toString(16),
                blue = Number(rgb.b).toString(16),
                opacity = Math.round(rgb.o * 255).toString(16);
            red.length < 2 && (red = 0 + red);
            green.length < 2 && (green = 0 + green);
            blue.length < 2 && (blue = 0 + blue);
            opacity.length < 2 && (opacity = 0 + opacity);
            if(red[0] == red[1] && green[0] == green[1] && blue[0] == blue[1] && opacity[0] == opacity[1]){
                red = red[0];
                green = green[0];
                blue = blue[0];
                opacity = opacity[0];
            }
            return {
                r: red,
                g: green,
                b: blue,
                o: opacity,
                complete: "#" + red + green + blue + (rgb.o == 1 ? "" : opacity)
            }
        },
        rgbToHsl: function (rgb, type) {
            /**
             * 传入通过getRgb获取的rgb对象，将其转换为hsl格式
             */
            var r = Number(rgb.r) / 255,
                g = Number(rgb.g) / 255,
                b = Number(rgb.b) / 255,
                o = Number(rgb.o),
                max = Math.max(r, g, b),
                min = Math.min(r, g, b),
                h, s, l = (max + min) / 2;
            if (max == min) {
                h = s = 0;
            } else {
                var d = max - min;
                s = l < 0.5 ? d / (max + min) : d / (2 - max - min);
                switch (max) {
                    case r: h = (g - b) / d; break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h = h * 60;
                h = h < 0 ? h + 360 : h;
            }
            h = Math.round(h);
            s = Math.round(s * 100) + "%";
            l = Math.round(l * 100) + "%";
            return {
                h: h,
                s: s,
                l: l,
                o: o,
                complete: type ?
                    ("hsla(" + [h, s, l, o].join(",") + ")") :
                    ("hsl(" + [h, s, l].join(",") + ")")
            }
        },
        hexToRgb: function(hex, type) {
            /**
             * 传入hex格式，如 "#ff00ff" ，转换为rgb格式
             */
            hex = hex.replace("#", "");
            var red, green, blue, opacity;
            var hexsplit = hex.split("");
            if (hex.length == 3) {
                red = parseInt(hexsplit[0] + hexsplit[0], 16);
                green = parseInt(hexsplit[1] + hexsplit[1], 16);
                blue = parseInt(hexsplit[2] + hexsplit[2], 16);
                opacity = 1;
            } else if (hex.length == 4) {
                red = parseInt(hexsplit[0] + hexsplit[0], 16);
                green = parseInt(hexsplit[1] + hexsplit[1], 16);
                blue = parseInt(hexsplit[2] + hexsplit[2], 16);
                opacity = Math.round(parseInt(hexsplit[3] + hexsplit[3], 16) / 255 * 100) / 100;
            } else if (hex.length == 6) {
                red = parseInt(hexsplit[0] + hexsplit[1], 16);
                green = parseInt(hexsplit[2] + hexsplit[3], 16);
                blue = parseInt(hexsplit[4] + hexsplit[5], 16);
                opacity = 1;
            } else if (hex.length == 8) {
                red = parseInt(hexsplit[0] + hexsplit[1], 16);
                green = parseInt(hexsplit[2] + hexsplit[3], 16);
                blue = parseInt(hexsplit[4] + hexsplit[5], 16);
                opacity = Math.round(parseInt(hexsplit[6] + hexsplit[7], 16) / 255 * 100) / 100;
            }
            return {
                r: red,
                g: green,
                b: blue,
                o: opacity,
                complete: type ?
                    ("rgba(" + [red, green, blue, opacity].join(",") + ")") :
                    ("rgb(" + [red, green, blue].join(",") + ")")
            }
        },
        hslToRgb: function(hsl, type) {
            /**
             * 传入通过getHsl获取的Hsl对象，将其转换为rgb格式
             */
            var h = Number(hsl.h),
                s = Number(hsl.s),
                l = Number(hsl.l),
                o = Number(hsl.o),
                r, g, b;
            if (s == 0) {
                r = g = b = l;
            } else {
                var temp2 = l < 0.5 ? l * (1 + s) : l + s - l * s,
                    temp1 = 2 * l - temp2;
                h /= 360;
                var hue2rgb = function (p, q, t) {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                }
                r = hue2rgb(temp1, temp2, h + 1 / 3);
                g = hue2rgb(temp1, temp2, h);
                b = hue2rgb(temp1, temp2, h - 1 / 3);
            }
            r = Math.round(r * 255);
            g = Math.round(g * 255);
            b = Math.round(b * 255);
            return {
                r: r,
                g: g,
                b: b,
                o: o,
                complete: type ?
                    ("rgba(" + [r, g, b, o].join(",") + ")") :
                    ("rgb(" + [r, g, b].join(",") + ")")
            }
        }
    };
    // 最后将插件对象暴露给全局对象
    _global = (function(){ return this || (0, eval)('this'); }());
    if (typeof module !== "undefined" && module.exports) {
        module.exports = colorFormat;
    } else if (typeof define === "function" && define.amd) {
        define(function(){return colorFormat;});
    } else {
        !('colorFormat' in _global) && (_global.colorFormat = colorFormat);
    }
}());