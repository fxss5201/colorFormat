console.group('rgbToHex RGB转HEX');
    console.group('rgbToHex(getRgb("rgb(255,10,50)")):');
        console.dir(rgbToHex(getRgb("rgb(255,10,50)")));
    console.groupEnd();
    console.group('rgbToHex(getRgb("rgba(255,10,50,0.5)")):');
        console.dir(rgbToHex(getRgb("rgba(255, 10, 50, 0.5)")));
    console.groupEnd();
console.groupEnd();
function rgbToHex(rgb) {
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
}