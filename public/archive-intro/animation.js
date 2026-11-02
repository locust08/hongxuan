// Original Hong Xuan artwork converted offline to native HTML5 Canvas drawing commands.
(function(){
var Filters;
var drawingFunctions = {image1,shape2,font3,text4,image5,shape6,text7,text8,text9,text10,text11,text12,image13,shape14,text15,text16,main,nextFrame,drawFrame};
/**
 *  JPEXS Free Flash Decompiler Filters
 */

Filters = {};

var createCanvas = function (width, height) {
    var c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    c.style.display = "none";
    //temporary add to document to get this work (getImageData, etc.)
    document.body.appendChild(c);
    document.body.removeChild(c);
    return c;
};

Filters._premultiply = function (data) {
    var len = data.length;
    for (var i = 0; i < len; i += 4) {
        var f = data[i + 3] * 0.003921569;
        data[i] = Math.round(data[i] * f);
        data[i + 1] = Math.round(data[i + 1] * f);
        data[i + 2] = Math.round(data[i + 2] * f);
    }
};

Filters._unpremultiply = function (data) {
    var len = data.length;
    for (var i = 0; i < len; i += 4) {
        var a = data[i + 3];
        if (a == 0 || a == 255) {
            continue;
        }
        var f = 255 / a;
        var r = (data[i] * f);
        var g = (data[i + 1] * f);
        var b = (data[i + 2] * f);
        if (r > 255) {
            r = 255;
        }
        if (g > 255) {
            g = 255;
        }
        if (b > 255) {
            b = 255;
        }

        data[i] = r;
        data[i + 1] = g;
        data[i + 2] = b;
    }
};


Filters._boxBlurHorizontal = function (pixels, mask, w, h, radius, maskType) {
    var index = 0;
    var newColors = [];

    for (var y = 0; y < h; y++) {
        var hits = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        for (var x = -radius * 4; x < w * 4; x += 4) {
            var oldPixel = x - radius * 4 - 4;
            if (oldPixel >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[index + oldPixel + 3] > 0) || (maskType == 2 && mask[index + oldPixel + 3] < 255)) {
                    a -= pixels[index + oldPixel + 3];
                    r -= pixels[index + oldPixel];
                    g -= pixels[index + oldPixel + 1];
                    b -= pixels[index + oldPixel + 2];
                    hits--;
                }
            }

            var newPixel = x + radius * 4;
            if (newPixel < w * 4) {
                if ((maskType == 0) || (maskType == 1 && mask[index + newPixel + 3] > 0) || (maskType == 2 && mask[index + newPixel + 3] < 255)) {
                    a += pixels[index + newPixel + 3];
                    r += pixels[index + newPixel];
                    g += pixels[index + newPixel + 1];
                    b += pixels[index + newPixel + 2];
                    hits++;
                }
            }

            if (x >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[index + x + 3] > 0) || (maskType == 2 && mask[index + x + 3] < 255)) {
                    if (hits == 0) {
                        newColors[x] = 0;
                        newColors[x + 1] = 0;
                        newColors[x + 2] = 0;
                        newColors[x + 3] = 0;
                    } else {
                        newColors[x] = Math.round(r / hits);
                        newColors[x + 1] = Math.round(g / hits);
                        newColors[x + 2] = Math.round(b / hits);
                        newColors[x + 3] = Math.round(a / hits);

                    }
                } else {
                    newColors[x] = 0;
                    newColors[x + 1] = 0;
                    newColors[x + 2] = 0;
                    newColors[x + 3] = 0;
                }
            }
        }
        for (var p = 0; p < w * 4; p += 4) {
            pixels[index + p] = newColors[p];
            pixels[index + p + 1] = newColors[p + 1];
            pixels[index + p + 2] = newColors[p + 2];
            pixels[index + p + 3] = newColors[p + 3];
        }

        index += w * 4;
    }
};

Filters._boxBlurVertical = function (pixels, mask, w, h, radius, maskType) {
    var newColors = [];
    var oldPixelOffset = -(radius + 1) * w * 4;
    var newPixelOffset = (radius) * w * 4;

    for (var x = 0; x < w * 4; x += 4) {
        var hits = 0;
        var r = 0;
        var g = 0;
        var b = 0;
        var a = 0;
        var index = -radius * w * 4 + x;
        for (var y = -radius; y < h; y++) {
            var oldPixel = y - radius - 1;
            if (oldPixel >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[index + oldPixelOffset + 3] > 0) || (maskType == 2 && mask[index + oldPixelOffset + 3] < 255)) {
                    a -= pixels[index + oldPixelOffset + 3];
                    r -= pixels[index + oldPixelOffset];
                    g -= pixels[index + oldPixelOffset + 1];
                    b -= pixels[index + oldPixelOffset + 2];
                    hits--;
                }

            }

            var newPixel = y + radius;
            if (newPixel < h) {
                if ((maskType == 0) || (maskType == 1 && mask[index + newPixelOffset + 3] > 0) || (maskType == 2 && mask[index + newPixelOffset + 3] < 255)) {
                    a += pixels[index + newPixelOffset + 3];
                    r += pixels[index + newPixelOffset];
                    g += pixels[index + newPixelOffset + 1];
                    b += pixels[index + newPixelOffset + 2];
                    hits++;
                }
            }

            if (y >= 0) {
                if ((maskType == 0) || (maskType == 1 && mask[y * w * 4 + x + 3] > 0) || (maskType == 2 && mask[y * w * 4 + x + 3] < 255)) {
                    if (hits == 0) {
                        newColors[4 * y] = 0;
                        newColors[4 * y + 1] = 0;
                        newColors[4 * y + 2] = 0;
                        newColors[4 * y + 3] = 0;
                    } else {
                        newColors[4 * y] = Math.round(r / hits);
                        newColors[4 * y + 1] = Math.round(g / hits);
                        newColors[4 * y + 2] = Math.round(b / hits);
                        newColors[4 * y + 3] = Math.round(a / hits);
                    }
                } else {
                    newColors[4 * y] = 0;
                    newColors[4 * y + 1] = 0;
                    newColors[4 * y + 2] = 0;
                    newColors[4 * y + 3] = 0;
                }
            }

            index += w * 4;
        }

        for (var y = 0; y < h; y++) {
            pixels[y * w * 4 + x] = newColors[4 * y];
            pixels[y * w * 4 + x + 1] = newColors[4 * y + 1];
            pixels[y * w * 4 + x + 2] = newColors[4 * y + 2];
            pixels[y * w * 4 + x + 3] = newColors[4 * y + 3];
        }
    }
};


Filters.blur = function (canvas, ctx, hRadius, vRadius, iterations, mask, maskType) {
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var data = imgData.data;
    Filters._premultiply(data);
    for (var i = 0; i < iterations; i++) {
        Filters._boxBlurHorizontal(data, mask, canvas.width, canvas.height, Math.floor(hRadius / 2), maskType);
        Filters._boxBlurVertical(data, mask, canvas.width, canvas.height, Math.floor(vRadius / 2), maskType);
    }

    Filters._unpremultiply(data);

    var width = canvas.width;
    var height = canvas.height;
    var retCanvas = createCanvas(width, height);
    var retImg = retCanvas.getContext("2d");
    retImg.putImageData(imgData, 0, 0);
    return retCanvas;
}

Filters._moveRGB = function (width, height, rgb, deltaX, deltaY, fill) {
    var img = createCanvas(width, height);

    var ig = img.getContext("2d");

    Filters._setRGB(ig, 0, 0, width, height, rgb);
    var retImg = createCanvas(width, height);
    retImg.width = width;
    retImg.height = height;
    var g = retImg.getContext("2d");
    g.fillStyle = fill;
    g.globalCompositeOperation = "copy";
    g.fillRect(0, 0, width, height);
    g.drawImage(img, deltaX, deltaY);
    return g.getImageData(0, 0, width, height).data;
};


Filters.FULL = 1;
Filters.INNER = 2;
Filters.OUTER = 3;

Filters._setRGB = function (ctx, x, y, width, height, data) {
    var id = ctx.createImageData(width, height);
    for (var i = 0; i < data.length; i++) {
        id.data[i] = data[i];
    }
    ctx.putImageData(id, x, y);
};

Filters.gradientGlow = function (srcCanvas, src, blurX, blurY, angle, distance, colors, ratios, type, iterations, strength, knockout) {
    var width = canvas.width;
    var height = canvas.height;
    var retCanvas = createCanvas(width, height);
    var retImg = retCanvas.getContext("2d");

    var gradCanvas = createCanvas(256, 1);

    var gradient = gradCanvas.getContext("2d");
    var grd = ctx.createLinearGradient(0, 0, 255, 0);
    for (var s = 0; s < colors.length; s++) {
        var v = "rgba(" + colors[s][0] + "," + colors[s][1] + "," + colors[s][2] + "," + colors[s][3] + ")";
        grd.addColorStop(ratios[s], v);
    }
    gradient.fillStyle = grd;
    gradient.fillRect(0, 0, 256, 1);
    var gradientPixels = gradient.getImageData(0, 0, gradCanvas.width, gradCanvas.height).data;

    var angleRad = angle / 180 * Math.PI;
    var moveX = (distance * Math.cos(angleRad));
    var moveY = (distance * Math.sin(angleRad));
    var srcPixels = src.getImageData(0, 0, width, height).data;
    var shadow = [];
    for (var i = 0; i < srcPixels.length; i += 4) {
        var alpha = srcPixels[i + 3];
        shadow[i] = 0;
        shadow[i + 1] = 0;
        shadow[i + 2] = 0;
        shadow[i + 3] = Math.round(alpha * strength);
    }
    var colorAlpha = "rgba(0,0,0,0)";
    shadow = Filters._moveRGB(width, height, shadow, moveX, moveY, colorAlpha);

    Filters._setRGB(retImg, 0, 0, width, height, shadow);

    var maskType = 0;
    if (type == Filters.INNER) {
        maskType = 1;
    }
    if (type == Filters.OUTER) {
        maskType = 2;
    }


    retCanvas = Filters.blur(retCanvas, retCanvas.getContext("2d"), blurX, blurY, iterations, srcPixels, maskType);
    retImg = retCanvas.getContext("2d");
    shadow = retImg.getImageData(0, 0, width, height).data;

    if (maskType != 0) {
        for (var i = 0; i < srcPixels.length; i += 4) {
            if ((maskType == 1 && srcPixels[i + 3] == 0) || (maskType == 2 && srcPixels[i + 3] == 255)) {
                shadow[i] = 0;
                shadow[i + 1] = 0;
                shadow[i + 2] = 0;
                shadow[i + 3] = 0;
            }
        }
    }


    for (var i = 0; i < shadow.length; i += 4) {
        var a = shadow[i + 3];
        shadow[i] = gradientPixels[a * 4];
        shadow[i + 1] = gradientPixels[a * 4 + 1];
        shadow[i + 2] = gradientPixels[a * 4 + 2];
        shadow[i + 3] = gradientPixels[a * 4 + 3];
    }

    Filters._setRGB(retImg, 0, 0, width, height, shadow);

    if (!knockout) {
        retImg.globalCompositeOperation = "destination-over";
        retImg.drawImage(srcCanvas, 0, 0);
    }

    return retCanvas;
};


Filters.dropShadow = function (canvas, src, blurX, blurY, angle, distance, color, inner, iterations, strength, knockout) {
    var width = canvas.width;
    var height = canvas.height;
    var srcPixels = src.getImageData(0, 0, width, height).data;
    var shadow = [];
    for (var i = 0; i < srcPixels.length; i += 4) {
        var alpha = srcPixels[i + 3];
        if (inner) {
            alpha = 255 - alpha;
        }
        shadow[i] = color[0];
        shadow[i + 1] = color[1];
        shadow[i + 2] = color[2];
        var sa = color[3] * alpha * strength;
        if (sa > 255)
            sa = 255;
        shadow[i + 3] = Math.round(sa);
    }
    var colorFirst = "#000000";
    var colorAlpha = "rgba(0,0,0,0)";
    var angleRad = angle / 180 * Math.PI;
    var moveX = (distance * Math.cos(angleRad));
    var moveY = (distance * Math.sin(angleRad));
    shadow = Filters._moveRGB(width, height, shadow, moveX, moveY, inner ? colorFirst : colorAlpha);


    var retCanvas = createCanvas(canvas.width, canvas.height);
    Filters._setRGB(retCanvas.getContext("2d"), 0, 0, width, height, shadow);
    if (blurX > 0 || blurY > 0) {
        retCanvas = Filters.blur(retCanvas, retCanvas.getContext("2d"), blurX, blurY, iterations, null, 0);
    }
    shadow = retCanvas.getContext("2d").getImageData(0, 0, width, height).data;

    var srcPixels = src.getImageData(0, 0, width, height).data;
    for (var i = 0; i < shadow.length; i += 4) {
        var mask = srcPixels[i + 3];
        if (!inner) {
            mask = 255 - mask;
        }
        shadow[i + 3] = mask * shadow[i + 3] / 255;
    }
    Filters._setRGB(retCanvas.getContext("2d"), 0, 0, width, height, shadow);

    if (!knockout) {
        var g = retCanvas.getContext("2d");
        g.globalCompositeOperation = "destination-over";
        g.drawImage(canvas, 0, 0);
    }

    return retCanvas;
};

Filters._cut = function (a, min, max) {
    if (a > max)
        a = max;
    if (a < min)
        a = min;
    return a;
}

Filters.gradientBevel = function (canvas, src, colors, ratios, blurX, blurY, strength, type, angle, distance, knockout, iterations) {
    var width = canvas.width;
    var height = canvas.height;
    var retImg = createCanvas(width, height);
    var srcPixels = src.getImageData(0, 0, width, height).data;

    var gradient = createCanvas(512, 1);
    var gg = gradient.getContext("2d");

    var grd = ctx.createLinearGradient(0, 0, 511, 0);
    for (var s = 0; s < colors.length; s++) {
        var v = "rgba(" + colors[s][0] + "," + colors[s][1] + "," + colors[s][2] + "," + colors[s][3] + ")";
        grd.addColorStop(ratios[s], v);
    }
    gg.fillStyle = grd;
    gg.globalCompositeOperation = "copy";
    gg.fillRect(0, 0, gradient.width, gradient.height);
    var gradientPixels = gg.getImageData(0, 0, gradient.width, gradient.height).data;


    if (type != Filters.OUTER) {
        var hilightIm = Filters.dropShadow(canvas, src, 0, 0, angle, distance, [255, 0, 0, 1], true, iterations, strength, true);
        var shadowIm = Filters.dropShadow(canvas, src, 0, 0, angle + 180, distance, [0, 0, 255, 1], true, iterations, strength, true);
        var h2 = createCanvas(width, height);
        var s2 = createCanvas(width, height);
        var hc = h2.getContext("2d");
        var sc = s2.getContext("2d");
        hc.drawImage(hilightIm, 0, 0);
        hc.globalCompositeOperation = "destination-out";
        hc.drawImage(shadowIm, 0, 0);

        sc.drawImage(shadowIm, 0, 0);
        sc.globalCompositeOperation = "destination-out";
        sc.drawImage(hilightIm, 0, 0);
        var shadowInner = s2;
        var hilightInner = h2;
    }
    if (type != Filters.INNER) {
        var hilightIm = Filters.dropShadow(canvas, src, 0, 0, angle + 180, distance, [255, 0, 0, 1], false, iterations, strength, true);
        var shadowIm = Filters.dropShadow(canvas, src, 0, 0, angle, distance, [0, 0, 255, 1], false, iterations, strength, true);
        var h2 = createCanvas(width, height);
        var s2 = createCanvas(width, height);
        var hc = h2.getContext("2d");
        var sc = s2.getContext("2d");
        hc.drawImage(hilightIm, 0, 0);
        hc.globalCompositeOperation = "destination-out";
        hc.drawImage(shadowIm, 0, 0);

        sc.drawImage(shadowIm, 0, 0);
        sc.globalCompositeOperation = "destination-out";
        sc.drawImage(hilightIm, 0, 0);
        var shadowOuter = s2;
        var hilightOuter = h2;
    }

    var hilightIm;
    var shadowIm;
    switch (type) {
        case Filters.OUTER:
            hilightIm = hilightOuter;
            shadowIm = shadowOuter;
            break;
        case Filters.INNER:
            hilightIm = hilightInner;
            shadowIm = shadowInner;
            break;
        case Filters.FULL:
            hilightIm = hilightInner;
            shadowIm = shadowInner;
            var hc = hilightIm.getContext("2d");
            hc.globalCompositeOperation = "source-over";
            hc.drawImage(hilightOuter, 0, 0);
            var sc = shadowIm.getContext("2d");
            sc.globalCompositeOperation = "source-over";
            sc.drawImage(shadowOuter, 0, 0);
            break;
    }

    var maskType = 0;
    if (type == Filters.INNER) {
        maskType = 1;
    }
    if (type == Filters.OUTER) {
        maskType = 2;
    }

    var retc = retImg.getContext("2d");
    retc.fillStyle = "#000000";
    retc.fillRect(0, 0, width, height);
    retc.drawImage(shadowIm, 0, 0);
    retc.drawImage(hilightIm, 0, 0);

    retImg = Filters.blur(retImg, retImg.getContext("2d"), blurX, blurY, iterations, srcPixels, maskType);
    var ret = retImg.getContext("2d").getImageData(0, 0, width, height).data;

    for (var i = 0; i < srcPixels.length; i += 4) {
        var ah = ret[i] * strength;
        var as = ret[i + 2] * strength;
        var ra = Filters._cut(ah - as, -255, 255);
        ret[i] = gradientPixels[4 * (255 + ra)];
        ret[i + 1] = gradientPixels[4 * (255 + ra) + 1];
        ret[i + 2] = gradientPixels[4 * (255 + ra) + 2];
        ret[i + 3] = gradientPixels[4 * (255 + ra) + 3];
    }
    Filters._setRGB(retImg.getContext("2d"), 0, 0, width, height, ret);


    if (!knockout) {
        var g = retImg.getContext("2d");
        g.globalCompositeOperation = "destination-over";
        g.drawImage(canvas, 0, 0);
    }
    return retImg;
}
Filters.bevel = function (canvas, src, blurX, blurY, strength, type, highlightColor, shadowColor, angle, distance, knockout, iterations) {
    return Filters.gradientBevel(canvas, src, [
        shadowColor,
        [shadowColor[0], shadowColor[1], shadowColor[2], 0],
        [highlightColor[0], highlightColor[1], highlightColor[2], 0],
        highlightColor
    ], [0, 127 / 255, 128 / 255, 1], blurX, blurY, strength, type, angle, distance, knockout, iterations);
}


//http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
Filters.convolution = function (canvas, ctx, weights, opaque) {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side / 2);
    var src = pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;
    // pad output by the convolution matrix
    var w = sw;
    var h = sh;
    var outCanvas = createCanvas(w, h);
    var outCtx = outCanvas.getContext("2d");
    var output = outCtx.getImageData(0, 0, w, h);
    var dst = output.data;
    // go through the destination image pixels
    var alphaFac = opaque ? 1 : 0;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y * w + x) * 4;
            // calculate the weighed sum of the source image pixels that
            // fall under the convolution matrix
            var r = 0, g = 0, b = 0, a = 0;
            for (var cy = 0; cy < side; cy++) {
                for (var cx = 0; cx < side; cx++) {
                    var scy = sy + cy - halfSide;
                    var scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = (scy * sw + scx) * 4;
                        var wt = weights[cy * side + cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff + 1] * wt;
                        b += src[srcOff + 2] * wt;
                        a += src[srcOff + 3] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff + 1] = g;
            dst[dstOff + 2] = b;
            dst[dstOff + 3] = a + alphaFac * (255 - a);
        }
    }
    outCtx.putImageData(output, 0, 0);
    return outCanvas;
};

Filters.colorMatrix = function (canvas, ctx, m) {
    var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

    var data = pixels.data;
    for (var i = 0; i < data.length; i += 4) {
        var r = i;
        var g = i + 1;
        var b = i + 2;
        var a = i + 3;

        var oR = data[r];
        var oG = data[g];
        var oB = data[b];
        var oA = data[a];

        data[r] = (m[0] * oR) + (m[1] * oG) + (m[2] * oB) + (m[3] * oA) + m[4];
        data[g] = (m[5] * oR) + (m[6] * oG) + (m[7] * oB) + (m[8] * oA) + m[9];
        data[b] = (m[10] * oR) + (m[11] * oG) + (m[12] * oB) + (m[13] * oA) + m[14];
        data[a] = (m[15] * oR) + (m[16] * oG) + (m[17] * oB) + (m[18] * oA) + m[19];
    }
    var outCanvas = createCanvas(canvas.width, canvas.height);
    var outCtx = outCanvas.getContext("2d");
    outCtx.putImageData(pixels, 0, 0);
    return outCanvas;
};


Filters.glow = function (canvas, src, blurX, blurY, strength, color, inner, knockout, iterations) {
    return Filters.dropShadow(canvas, src, blurX, blurY, 45, 0, color, inner, iterations, strength, knockout);
};


var BlendModes = {};

BlendModes._cut = function (v) {
    if (v < 0)
        v = 0;
    if (v > 255)
        v = 255;
    return v;
};

BlendModes.normal = function (src, dst, result, pos) {
    var am = (255 - src[pos + 3]) / 255;
    result[pos] = this._cut(src[pos] * src[pos + 3] / 255 + dst[pos] * dst[pos + 3] / 255 * am);
    result[pos + 1] = this._cut(src[pos + 1] * src[pos + 3] / 255 + dst[pos + 1] * dst[pos + 3] / 255 * am);
    result[pos + 2] = this._cut(src[pos + 2] * src[pos + 3] / 255 + dst[pos + 2] * dst[pos + 3] / 255 * am);
    result[pos + 3] = this._cut(src[pos + 3] + dst[pos + 3] * am);
};

BlendModes.layer = function (src, dst, result, pos) {
    BlendModes.normal(src, dst, result, pos);
};

BlendModes.multiply = function (src, dst, result, pos) {
    result[pos + 0] = (src[pos + 0] * dst[pos + 0]) >> 8;
    result[pos + 1] = (src[pos + 1] * dst[pos + 1]) >> 8;
    result[pos + 2] = (src[pos + 2] * dst[pos + 2]) >> 8;
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.screen = function (src, dst, result, pos) {
    result[pos + 0] = 255 - ((255 - src[pos + 0]) * (255 - dst[pos + 0]) >> 8);
    result[pos + 1] = 255 - ((255 - src[pos + 1]) * (255 - dst[pos + 1]) >> 8);
    result[pos + 2] = 255 - ((255 - src[pos + 2]) * (255 - dst[pos + 2]) >> 8);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.lighten = function (src, dst, result, pos) {
    result[pos + 0] = Math.max(src[pos + 0], dst[pos + 0]);
    result[pos + 1] = Math.max(src[pos + 1], dst[pos + 1]);
    result[pos + 2] = Math.max(src[pos + 2], dst[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.darken = function (src, dst, result, pos) {
    result[pos + 0] = Math.min(src[pos + 0], dst[pos + 0]);
    result[pos + 1] = Math.min(src[pos + 1], dst[pos + 1]);
    result[pos + 2] = Math.min(src[pos + 2], dst[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.difference = function (src, dst, result, pos) {
    result[pos + 0] = Math.abs(dst[pos + 0] - src[pos + 0]);
    result[pos + 1] = Math.abs(dst[pos + 1] - src[pos + 1]);
    result[pos + 2] = Math.abs(dst[pos + 2] - src[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.add = function (src, dst, result, pos) {
    result[pos + 0] = Math.min(255, src[pos + 0] + dst[pos + 0]);
    result[pos + 1] = Math.min(255, src[pos + 1] + dst[pos + 1]);
    result[pos + 2] = Math.min(255, src[pos + 2] + dst[pos + 2]);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3]);
};

BlendModes.subtract = function (src, dst, result, pos) {
    result[pos + 0] = Math.max(0, src[pos + 0] + dst[pos + 0] - 256);
    result[pos + 1] = Math.max(0, src[pos + 1] + dst[pos + 1] - 256);
    result[pos + 2] = Math.max(0, src[pos + 2] + dst[pos + 2] - 256);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.invert = function (src, dst, result, pos) {
    result[pos + 0] = 255 - dst[pos + 0];
    result[pos + 1] = 255 - dst[pos + 1];
    result[pos + 2] = 255 - dst[pos + 2];
    result[pos + 3] = src[pos + 3];
};

BlendModes.alpha = function (src, dst, result, pos) {
    result[pos + 0] = src[pos + 0];
    result[pos + 1] = src[pos + 1];
    result[pos + 2] = src[pos + 2];
    result[pos + 3] = dst[pos + 3]; //?
};

BlendModes.erase = function (src, dst, result, pos) {
    result[pos + 0] = src[pos + 0];
    result[pos + 1] = src[pos + 1];
    result[pos + 2] = src[pos + 2];
    result[pos + 3] = 255 - dst[pos + 3]; //?
};

BlendModes.overlay = function (src, dst, result, pos) {
    result[pos + 0] = dst[pos + 0] < 128 ? dst[pos + 0] * src[pos + 0] >> 7
            : 255 - ((255 - dst[pos + 0]) * (255 - src[pos + 0]) >> 7);
    result[pos + 1] = dst[pos + 1] < 128 ? dst[pos + 1] * src[pos + 1] >> 7
            : 255 - ((255 - dst[pos + 1]) * (255 - src[pos + 1]) >> 7);
    result[pos + 2] = dst[pos + 2] < 128 ? dst[pos + 2] * src[pos + 2] >> 7
            : 255 - ((255 - dst[pos + 2]) * (255 - src[pos + 2]) >> 7);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes.hardlight = function (src, dst, result, pos) {
    result[pos + 0] = src[pos + 0] < 128 ? dst[pos + 0] * src[pos + 0] >> 7
            : 255 - ((255 - src[pos + 0]) * (255 - dst[pos + 0]) >> 7);
    result[pos + 1] = src[pos + 1] < 128 ? dst[pos + 1] * src[pos + 1] >> 7
            : 255 - ((255 - src[pos + 1]) * (255 - dst[pos + 1]) >> 7);
    result[pos + 2] = src[pos + 2] < 128 ? dst[pos + 2] * src[pos + 2] >> 7
            : 255 - ((255 - src[pos + 2]) * (255 - dst[pos + 2]) >> 7);
    result[pos + 3] = Math.min(255, src[pos + 3] + dst[pos + 3] - (src[pos + 3] * dst[pos + 3]) / 255);
};

BlendModes._list = [
    BlendModes.normal,
    BlendModes.normal,
    BlendModes.layer,
    BlendModes.multiply,
    BlendModes.screen,
    BlendModes.lighten,
    BlendModes.darken,
    BlendModes.difference,
    BlendModes.add,
    BlendModes.subtract,
    BlendModes.invert,
    BlendModes.alpha,
    BlendModes.erase,
    BlendModes.overlay,
    BlendModes.hardlight
];

BlendModes.blendData = function (srcPixel, dstPixel, retData, modeIndex) {
    var result = [];
    var retPixel = [];
    var alpha = 1.0;
    for (var i = 0; i < retData.length; i += 4) {
        this._list[modeIndex](srcPixel, dstPixel, result, i);

        retPixel[i + 0] = this._cut(dstPixel[i + 0] + (result[i + 0] - dstPixel[i + 0]) * alpha);
        retPixel[i + 1] = this._cut(dstPixel[i + 1] + (result[i + 1] - dstPixel[i + 1]) * alpha);
        retPixel[i + 2] = this._cut(dstPixel[i + 2] + (result[i + 2] - dstPixel[i + 2]) * alpha);
        retPixel[i + 3] = this._cut(dstPixel[i + 3] + (result[i + 3] - dstPixel[i + 3]) * alpha);

        var af = srcPixel[i + 3] / 255;
        retData[i + 0] = this._cut((1 - af) * dstPixel[i + 0] + af * retPixel[i + 0]);
        retData[i + 1] = this._cut((1 - af) * dstPixel[i + 1] + af * retPixel[i + 1]);
        retData[i + 2] = this._cut((1 - af) * dstPixel[i + 2] + af * retPixel[i + 2]);
        retData[i + 3] = this._cut((1 - af) * dstPixel[i + 3] + af * retPixel[i + 3]);
    }
};

BlendModes.blendCanvas = function (src, dst, result, modeIndex) {
    var width = src.width;
    var height = src.height;
    var rctx = result.getContext("2d");
    var sctx = src.getContext("2d");
    var dctx = dst.getContext("2d");
    var ridata = rctx.getImageData(0, 0, width, height);
    var sidata = sctx.getImageData(0, 0, width, height);
    var didata = dctx.getImageData(0, 0, width, height);

    this.blendData(sidata.data, didata.data, ridata.data, modeIndex);
    rctx.putImageData(ridata, 0, 0);
};


function concatMatrix(m1, m2) {
    var result = [1, 0, 0, 1, 0, 0];
    var scaleX = 0;
    var rotateSkew0 = 1;
    var rotateSkew1 = 2;
    var scaleY = 3;
    var translateX = 4;
    var translateY = 5;

    result[scaleX] = m2[scaleX] * m1[scaleX] + m2[rotateSkew1] * m1[rotateSkew0];
    result[rotateSkew0] = m2[rotateSkew0] * m1[scaleX] + m2[scaleY] * m1[rotateSkew0];
    result[rotateSkew1] = m2[scaleX] * m1[rotateSkew1] + m2[rotateSkew1] * m1[scaleY];
    result[scaleY] = m2[rotateSkew0] * m1[rotateSkew1] + m2[scaleY] * m1[scaleY];
    result[translateX] = m2[scaleX] * m1[translateX] + m2[rotateSkew1] * m1[translateY] + m2[translateX];
    result[translateY] = m2[rotateSkew0] * m1[translateX] + m2[scaleY] * m1[translateY] + m2[translateY];

    return result;
}

var enhanceContext = function (context) {
    var m = [1, 0, 0, 1, 0, 0];
    context._matrix = m;

    //the stack of saved matrices
    context._savedMatrices = [m]; //[[m]];

    var super_ = context.__proto__;
    context.__proto__ = ({
        save: function () {
            this._savedMatrices.push(this._matrix); //.slice()
            super_.save.call(this);
        },
        //if the stack of matrices we're managing doesn't have a saved matrix,
        //we won't even call the context's original `restore` method.
        restore: function () {
            if (this._savedMatrices.length == 0)
                return;
            super_.restore.call(this);
            this._matrix = this._savedMatrices.pop();
        },
        scale: function (x, y) {
            super_.scale.call(this, x, y);
        },
        rotate: function (theta) {
            super_.rotate.call(this, theta);
        },
        translate: function (x, y) {
            super_.translate.call(this, x, y);
        },
        transform: function (a, b, c, d, e, f) {
            this._matrix = concatMatrix([a, b, c, d, e, f], this._matrix);
            super_.transform.call(this, a, b, c, d, e, f);
        },
        setTransform: function (a, b, c, d, e, f) {
            this._matrix = [a, b, c, d, e, f];
            super_.setTransform.call(this, a, b, c, d, e, f);
        },
        resetTransform: function () {
            super_.resetTransform.call(this);
        },
        applyTransforms: function (m) {
            this.setTransform(m[0], m[1], m[2], m[3], m[4], m[5])
        },
        applyTransformToPoint: function (p) {
            var ret = {};
            ret.x = this._matrix[0] * p.x + this._matrix[2] * p.y + this._matrix[4];
            ret.y = this._matrix[1] * p.x + this._matrix[3] * p.y + this._matrix[5];
            return ret;
        },
        __proto__: super_
    });

    return context;
};
var cxform = function (r_add, g_add, b_add, a_add, r_mult, g_mult, b_mult, a_mult) {
    this.r_add = r_add;
    this.g_add = g_add;
    this.b_add = b_add;
    this.a_add = a_add;
    this.r_mult = r_mult;
    this.g_mult = g_mult;
    this.b_mult = b_mult;
    this.a_mult = a_mult;
    this._cut = function (v, min, max) {
        if (v < min)
            v = min;
        if (v > max)
            v = max;
        return v;
    };
    this.apply = function (c) {
        var d = c;
        d[0] = this._cut(Math.round(d[0] * this.r_mult / 255 + this.r_add), 0, 255);
        d[1] = this._cut(Math.round(d[1] * this.g_mult / 255 + this.g_add), 0, 255);
        d[2] = this._cut(Math.round(d[2] * this.b_mult / 255 + this.b_add), 0, 255);
        d[3] = this._cut(d[3] * this.a_mult / 255 + this.a_add / 255, 0, 1);
        return d;
    };
    this.applyToImage = function (fimg) {
        if (this.isEmpty()) {
            return fimg
        }
        ;
        var icanvas = createCanvas(fimg.width, fimg.height);
        var ictx = icanvas.getContext("2d");
        ictx.drawImage(fimg, 0, 0);
        var imdata = ictx.getImageData(0, 0, icanvas.width, icanvas.height);
        var idata = imdata.data;
        for (var i = 0; i < idata.length; i += 4) {
            var c = this.apply([idata[i], idata[i + 1], idata[i + 2], idata[i + 3] / 255]);
            idata[i] = c[0];
            idata[i + 1] = c[1];
            idata[i + 2] = c[2];
            idata[i + 3] = Math.round(c[3] * 255);
        }
        ictx.putImageData(imdata, 0, 0);
        return icanvas;
    };
    this.merge = function (cx) {
        return new cxform(this.r_add + cx.r_add, this.g_add + cx.g_add, this.b_add + cx.b_add, this.a_add + cx.a_add, this.r_mult * cx.r_mult / 255, this.g_mult * cx.g_mult / 255, this.b_mult * cx.b_mult / 255, this.a_mult * cx.a_mult / 255);
    };
    this.isEmpty = function () {
        return this.r_add == 0 && this.g_add == 0 && this.b_add == 0 && this.a_add == 0 && this.r_mult == 255 && this.g_mult == 255 && this.b_mult == 255 && this.a_mult == 255;
    };
};

var placeRaw = function (obj, canvas, ctx, matrix, ctrans, blendMode, frame, ratio, time) {
    ctx.save();
    ctx.transform(matrix[0], matrix[1], matrix[2], matrix[3], matrix[4], matrix[5]);
    if (blendMode > 1) {
        var oldctx = ctx;
        var ncanvas = createCanvas(canvas.width, canvas.height);
        ctx = ncanvas.getContext("2d");
        enhanceContext(ctx);
        ctx.applyTransforms(oldctx._matrix);
    }
    if (blendMode > 1) {
        drawingFunctions[obj](ctx,new cxform(0,0,0,0,255,255,255,255),frame,ratio,time);
    } else {
        drawingFunctions[obj](ctx,ctrans,frame,ratio,time);
    }
    if (blendMode > 1) {
        BlendModes.blendCanvas(ctrans.applyToImage(ncanvas), canvas, canvas, blendMode);
        ctx = oldctx;
    }
    ctx.restore();
}

var transformPoint = function (matrix, p) {
    var ret = {};
    ret.x = matrix[0] * p.x + matrix[2] * p.y + matrix[4];
    ret.y = matrix[1] * p.x + matrix[3] * p.y + matrix[5];
    return ret;
}

var transformRect = function (matrix, rect) {
    var minX = Number.MAX_VALUE;
    var minY = Number.MAX_VALUE;
    var maxX = Number.MIN_VALUE;
    var maxY = Number.MIN_VALUE;
    var point = transformPoint(matrix, {x: rect.xMin, y: rect.yMin});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    point = transformPoint(matrix, {x: rect.xMax, y: rect.yMin});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    point = transformPoint(matrix, {x: rect.xMin, y: rect.yMax});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    point = transformPoint(matrix, {x: rect.xMax, y: rect.yMax});
    if (point.x < minX) {
        minX = point.x;
    }
    if (point.x > maxX) {
        maxX = point.x;
    }
    if (point.y < minY) {
        minY = point.y;
    }
    if (point.y > maxY) {
        maxY = point.y;
    }
    return {xMin: minX, xMax: maxX, yMin: minY, yMax: maxY};
}

var getTranslateMatrix = function (translateX, translateY) {
    return [1, 0, 0, 1, translateX, translateY];
}

var getRectWidth = function (rect) {
    return rect.xMax - rect.xMin;
}

var getRectHeight = function (rect) {
    return rect.yMax - rect.yMin;
}

var rint = function (v) {
    return Math.round(v);
}

var scaleMatrix = function (m, factorX, factorY) {
    var scaleX = 0;
    var rotateSkew0 = 1;
    var rotateSkew1 = 2;
    var scaleY = 3;
    var translateX = 4;
    var translateY = 5;

    var m2 = Object.assign({}, m);

    m2[scaleX] *= factorX;
    m2[scaleY] *= factorY;
    m2[rotateSkew0] *= factorX;
    m2[rotateSkew1] *= factorY;
    return m2;
}

var translateMatrix = function (m, x, y) {
    var m2 = Object.assign({}, m);
    var scaleX = 0;
    var rotateSkew0 = 1;
    var rotateSkew1 = 2;
    var scaleY = 3;
    var translateX = 4;
    var translateY = 5;

    m2[translateX] = m2[scaleX] * x + m2[rotateSkew1] * y + m2[translateX];
    m2[translateY] = m2[rotateSkew0] * x + m2[scaleY] * y + m2[translateY];

    return m2;
}

var place = function (obj, canvas, ctx, matrix, ctrans, blendMode, frame, ratio, time) {
    if ((typeof scalingGrids[obj]) !== "undefined") {
        var swfScaleMatrix = [1 / 20, 0, 0, 1 / 20, 0, 0];
        var boundRect = boundRects[obj];
        var scalingRect = scalingGrids[obj];
        var exRect = boundRect;
        var newRect = exRect;
        var transform = matrix;

        var transform2;
        newRect = transformRect(transform, exRect);
        transform = Object.assign({}, transform);

        transform = getTranslateMatrix(newRect.xMin, newRect.yMin);

        transform = concatMatrix(swfScaleMatrix, transform);

        var scaleWidth = getRectWidth(newRect) * 20 - scalingRect.xMin - (boundRect.xMax - scalingRect.xMax);
        var originalWidth = getRectWidth(boundRect) - scalingRect.xMin - (boundRect.xMax - scalingRect.xMax);
        var scaleX = scaleWidth / originalWidth;

        var scaleHeight = getRectHeight(newRect) * 20 - scalingRect.yMin - (boundRect.yMax - scalingRect.yMax);
        var originalHeight = getRectHeight(boundRect) - scalingRect.yMin - (boundRect.yMax - scalingRect.yMax);
        var scaleY = scaleHeight / originalHeight;


        //top left
        ctx.save();
        drawPath(ctx, ""
                + "M " + newRect.xMin + " " + newRect.yMin + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMin + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + newRect.xMin + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " Z"
                );
        ctx.clip();
        placeRaw(obj, canvas, ctx, transform, ctrans, blendMode, frame, ratio, time);

        ctx.restore();

        //bottom left
        transform2 = Object.assign({}, transform);
        transform2[5] /*translateY*/ += getRectHeight(newRect) - getRectHeight(boundRect) / 20;

        ctx.save();

        drawPath(ctx, "M " + newRect.xMin + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMax + " "
                + "L " + newRect.xMin + " " + newRect.yMax + " Z"
                )
        ctx.clip();

        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //top right
        transform2 = Object.assign({}, transform);
        transform2[4] /*translateX*/ += getRectWidth(newRect) - getRectWidth(boundRect) / 20;
        ctx.save();
        drawPath(ctx, "M " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMin + " "
                + "L " + newRect.xMax + " " + newRect.yMin + " "
                + "L " + newRect.xMax + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " Z");

        ctx.clip();

        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //bottom right
        transform2 = Object.assign({}, transform);
        transform2[4] /*translateX*/ += getRectWidth(newRect) - getRectWidth(boundRect) / 20;
        transform2[5] /*translateY*/ += getRectHeight(newRect) - getRectHeight(boundRect) / 20;
        ctx.save();
        drawPath(ctx, "M " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + newRect.xMax + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + newRect.xMax + " " + newRect.yMax + " "
                + "L " + (newRect.xMax - rint((exRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMax + " Z");

        ctx.clip();

        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();


        //top
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, scalingRect.xMin, 0);
        transform2 = scaleMatrix(transform2, scaleX, 1);
        transform2 = translateMatrix(transform2, -scalingRect.xMin, 0);

        drawPath(ctx, "M " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMin + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMin + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //left
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, 0, scalingRect.yMin);
        transform2 = scaleMatrix(transform2, 1, scaleY);
        transform2 = translateMatrix(transform2, 0, -scalingRect.yMin);

        drawPath(ctx, "M " + newRect.xMin + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + newRect.xMin + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //bottom
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, scalingRect.xMin, 0);
        transform2 = scaleMatrix(transform2, scaleX, 1);
        transform2 = translateMatrix(transform2, -scalingRect.xMin, 0);

        transform2 = translateMatrix(transform2, 0, getRectHeight(newRect) * 20 - getRectHeight(boundRect));

        drawPath(ctx, "M " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + newRect.yMax + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + newRect.yMax + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //right
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, 0, scalingRect.yMin)
        transform2 = scaleMatrix(transform2, 1, scaleY);
        transform2 = translateMatrix(transform2, 0, -scalingRect.yMin);

        transform2 = translateMatrix(transform2, getRectWidth(newRect) * 20 - getRectWidth(boundRect), 0);

        drawPath(ctx, "M " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + newRect.xMax + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + newRect.xMax + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();

        //center
        transform2 = Object.assign({}, transform);
        ctx.save();
        transform2 = translateMatrix(transform2, scalingRect.xMin, scalingRect.yMin)
        transform2 = scaleMatrix(transform2, scaleX, scaleY);
        transform2 = translateMatrix(transform2, -scalingRect.xMin, -scalingRect.yMin);

        drawPath(ctx, "M " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMin + rint(scalingRect.yMin / 20)) + " "
                + "L " + (newRect.xMax - rint((boundRect.xMax - scalingRect.xMax) / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " "
                + "L " + (newRect.xMin + rint(scalingRect.xMin / 20)) + " " + (newRect.yMax - rint((boundRect.yMax - scalingRect.yMax) / 20)) + " Z");

        ctx.clip();
        placeRaw(obj, canvas, ctx, transform2, ctrans, blendMode, frame, ratio, time);
        ctx.restore();
        return;
    }
    placeRaw(obj, canvas, ctx, matrix, ctrans, blendMode, frame, ratio, time);
}

var tocolor = function (c) {
    var r = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] + ")";
    return r;
};


function drawMorphPath(ctx, p, ratio, doStroke, scaleMode) {
    var parts = p.split(" ");
    var len = parts.length;
    if (doStroke) {
        for (var i = 0; i < len; i++) {
            switch (parts[i]) {
                case '':
                    break;
                case 'L':
                case 'M':
                case 'Q':
                    break;
                default:
                    var k = ctx.applyTransformToPoint({x: parts[i], y: parts[i + 2]});
                    parts[i] = k.x;
                    parts[i + 2] = k.y;
                    k = ctx.applyTransformToPoint({x: parts[i + 1], y: parts[i + 3]});
                    parts[i + 1] = k.x;
                    parts[i + 3] = k.y;
                    i += 3;
            }
        }

        switch (scaleMode) {
            case "NONE":
                break;
            case "NORMAL":
                ctx.lineWidth *= 20 * Math.max(ctx._matrix[0], ctx._matrix[3]);
                break;
            case "VERTICAL":
                ctx.lineWidth *= 20 * ctx._matrix[3];
                break;
            case "HORIZONTAL":
                ctx.lineWidth *= 20 * ctx._matrix[0];
                break;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.beginPath();
    var drawCommand = "";
    for (var i = 0; i < len; i++) {
        switch (parts[i]) {
            case 'L':
            case 'M':
            case 'Q':
                drawCommand = parts[i];
                break;
            default:
                switch (drawCommand) {
                    case 'L':
                        ctx.lineTo(useRatio(parts[i], parts[i + 1], ratio), useRatio(parts[i + 2], parts[i + 3], ratio));
                        i += 3;
                        break;
                    case 'M':
                        ctx.moveTo(useRatio(parts[i], parts[i + 1], ratio), useRatio(parts[i + 2], parts[i + 3], ratio));
                        i += 3;
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(useRatio(parts[i], parts[i + 1], ratio), useRatio(parts[i + 2], parts[i + 3], ratio),
                                useRatio(parts[i + 4], parts[i + 5], ratio), useRatio(parts[i + 6], parts[i + 7], ratio));
                        i += 7;
                        break;
                }
                break;
        }
    }
    if (doStroke) {
        ctx.stroke();
        ctx.restore();
    }
}

function useRatio(v1, v2, ratio) {
    return v1 * 1 + (v2 - v1) * ratio / 65535;
}

function drawPath(ctx, p, doStroke, scaleMode) {
//console.log("drawing "+p)
    var parts = p.split(" ");
    var len = parts.length;
    if (doStroke) {
        for (var i = 0; i < len; i++) {
            switch (parts[i]) {
                case 'L':
                case 'M':
                case 'Q':
                case 'Z':
                    break;
                default:
                    var k = ctx.applyTransformToPoint({x: parts[i], y: parts[i + 1]});
                    parts[i] = k.x;
                    parts[i + 1] = k.y;
                    i++;
            }
        }

        switch (scaleMode) {
            case "NONE":
                break;
            case "NORMAL":
                ctx.lineWidth *= 20 * Math.max(ctx._matrix[0], ctx._matrix[3]);
                break;
            case "VERTICAL":
                ctx.lineWidth *= 20 * ctx._matrix[3];
                break;
            case "HORIZONTAL":
                ctx.lineWidth *= 20 * ctx._matrix[0];
                break;
        }

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    ctx.beginPath();
    var drawCommand = "";
    for (var i = 0; i < len; i++) {
        switch (parts[i]) {
            case 'L':
            case 'M':
            case 'Q':
                drawCommand = parts[i];
                break;
            case 'Z':
                ctx.closePath();
                break;
            default:
                switch (drawCommand) {
                    case 'L':
                        ctx.lineTo(parts[i], parts[i + 1]);
                        i++;
                        break;
                    case 'M':
                        ctx.moveTo(parts[i], parts[i + 1]);
                        i++;
                        break;
                    case 'Q':
                        ctx.quadraticCurveTo(parts[i], parts[i + 1], parts[i + 2], parts[i + 3]);
                        i += 3;
                        break;
                }
                break;
        }
    }
    if (doStroke) {
        ctx.stroke();
        ctx.restore();
    }
}
var canvas=document.getElementById("archive-intro");
var ctx=canvas.getContext("2d");
enhanceContext(ctx);
var ctrans = new cxform(0,0,0,0,255,255,255,255);

var scalingGrids = {};
var boundRects = {};
var imageObj1 = document.createElement("img");
imageObj1.src="/archive-intro/343f3c022ef7b967.jpg";
function image1(ctx,ctrans,frame,ratio,time){
	var pathData="M 0 0 L 0 4720 3600 4720 3600 0 0 0";
	drawPath(ctx,pathData,false);
	ctx.save();
	ctx.clip();
	ctx.transform(20,0,0,20,0,0);
	ctx.transform(1.0055555555555555,0,0,1.0042372881355932,-0.5,-0.5);
	var fimg = ctrans.applyToImage(imageObj1);
	var pat=ctx.createPattern(fimg,"repeat");
	ctx.fillStyle = pat;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function shape2(ctx,ctrans,frame,ratio,time){
	var pathData="M -1800 -2360 L 1800 -2360 1800 2360 -1800 2360 -1800 -2360";
	drawPath(ctx,pathData,false);
	ctx.save();
	ctx.clip();
	ctx.transform(20,0,0,20,-1800,-2360);
	ctx.transform(1.0055555555555555,0,0,1.0042372881355932,-0.5,-0.5);
	var fimg = ctrans.applyToImage(imageObj1);
	var pat=ctx.createPattern(fimg,"repeat");
	ctx.fillStyle = pat;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M 1802 -2360 L 1802 2360";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([255,255,255,1]));
	ctx.lineWidth=0.05;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

	var pathData="M -1816 2361 L -1819 2361 -1819 -2360 -1816 -2360 -1816 2361";
	ctx.fillStyle=tocolor(ctrans.apply([107,100,200,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M -1816 2361 L -1816 -2360";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([255,255,255,1]));
	ctx.lineWidth=0.05;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function font3(ctx,ch,textColor){
	defaultFill = textColor;
	switch(ch){
		case " ":
			break;
		case "A":
			var pathData="M 202 -330 L 310 -330 256 -577 202 -330 M 149 -650 L 112 -649 Q 98 -648 90 -661 82 -674 82 -692 82 -711 90 -723 98 -737 112 -735 L 156 -733 199 -734 259 -735 Q 280 -735 298 -721 321 -703 329 -667 L 448 -121 Q 453 -96 460 -89 467 -82 482 -85 495 -87 502 -73 509 -61 509 -42 509 -24 502 -11 495 2 482 1 L 400 -4 318 1 Q 302 2 293 -11 285 -24 285 -42 285 -61 293 -73 302 -87 318 -85 334 -82 346 -90 360 -100 355 -121 L 329 -244 183 -244 157 -121 Q 151 -97 155 -90 160 -83 178 -85 192 -87 201 -73 208 -61 208 -42 208 -24 201 -11 192 2 178 1 L 105 -3 26 1 Q 15 2 9 -11 3 -24 3 -42 3 -61 9 -73 15 -87 26 -85 L 51 -89 64 -121 171 -613 174 -647 149 -650";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "B":
			var pathData="M 361 -303 Q 321 -336 235 -336 L 174 -336 174 -85 285 -85 Q 321 -85 354 -112 397 -146 397 -210 397 -272 361 -303 M 362 -542 Q 362 -599 332 -626 307 -649 263 -649 L 174 -649 174 -422 261 -422 Q 307 -422 334 -455 362 -488 362 -542 M 406 -685 Q 458 -633 458 -544 458 -474 436 -437 417 -404 376 -386 434 -369 462 -328 493 -283 493 -207 493 -109 438 -54 384 1 288 1 L 155 -3 44 1 Q 30 3 23 -11 16 -23 16 -42 16 -61 23 -74 30 -88 44 -85 64 -83 72 -91 82 -100 82 -132 L 82 -614 Q 82 -637 73 -644 L 44 -649 Q 30 -648 22 -662 15 -675 15 -693 15 -712 22 -724 30 -737 44 -735 L 143 -732 267 -735 Q 355 -735 406 -685";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "C":
			var pathData="M 429 -751 L 462 -743 Q 475 -734 472 -720 459 -664 462 -605 464 -544 483 -477 487 -462 475 -450 L 446 -434 413 -437 Q 397 -445 395 -463 L 381 -552 Q 371 -613 339 -641 312 -666 269 -666 194 -666 152 -586 110 -508 110 -374 110 -240 146 -159 187 -68 265 -68 322 -68 353 -87 392 -112 405 -172 409 -195 426 -204 L 460 -207 487 -185 Q 497 -167 491 -143 464 -53 396 -13 343 18 265 18 142 18 77 -90 15 -192 15 -374 15 -555 81 -655 147 -752 262 -752 303 -752 330 -741 349 -733 377 -709 L 378 -731 Q 378 -742 395 -747 L 429 -751";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "D":
			var pathData="M 357 -588 Q 318 -649 263 -649 L 170 -649 170 -85 263 -85 Q 318 -85 357 -147 404 -222 404 -367 404 -513 357 -588 M 78 -625 Q 78 -643 67 -648 L 45 -649 Q 32 -647 24 -662 18 -674 18 -693 18 -712 24 -725 32 -738 45 -735 L 144 -730 271 -735 Q 382 -735 441 -638 499 -543 499 -367 499 -192 441 -97 382 1 271 1 L 144 -4 45 1 Q 32 3 24 -11 18 -24 18 -43 18 -62 24 -75 32 -89 45 -86 L 67 -85 Q 78 -89 78 -105 L 78 -625";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "E":
			var pathData="M 431 -734 Q 472 -737 481 -724 487 -716 482 -685 L 482 -684 Q 474 -643 473 -596 472 -552 477 -522 479 -509 464 -501 450 -493 430 -493 409 -493 396 -501 381 -509 384 -522 L 388 -589 382 -649 168 -649 168 -423 258 -423 Q 267 -423 268 -437 L 265 -475 263 -492 Q 260 -503 274 -509 L 306 -515 337 -509 Q 350 -503 348 -492 342 -460 342 -383 341 -307 348 -273 350 -258 337 -248 L 306 -240 Q 287 -240 274 -248 260 -258 263 -273 L 265 -295 268 -327 Q 267 -337 258 -337 L 168 -337 168 -85 393 -85 396 -136 392 -195 Q 389 -210 404 -219 L 436 -226 468 -219 Q 483 -210 482 -195 L 479 -125 Q 480 -82 487 -57 495 -30 487 -14 480 1 461 1 L 209 -3 43 1 Q 28 3 20 -12 13 -25 13 -44 13 -64 20 -76 28 -89 43 -85 63 -80 70 -90 76 -99 76 -129 L 76 -614 Q 76 -640 70 -645 L 47 -650 43 -649 Q 28 -648 20 -661 13 -673 13 -691 13 -709 20 -722 28 -736 43 -734 87 -731 205 -731 323 -731 431 -734";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "F":
			var pathData="M 457 -734 Q 488 -736 496 -721 502 -711 498 -676 494 -649 493 -608 L 495 -536 Q 497 -519 483 -509 471 -500 451 -500 432 -500 420 -509 405 -519 408 -536 L 410 -595 406 -648 178 -648 178 -418 265 -418 Q 276 -418 278 -430 L 276 -457 274 -475 Q 272 -488 286 -495 L 315 -502 345 -495 Q 358 -488 357 -475 L 353 -374 357 -264 Q 358 -250 345 -242 333 -234 315 -234 298 -234 286 -242 272 -250 274 -264 L 275 -281 278 -316 Q 276 -332 265 -332 L 178 -332 178 -100 Q 178 -86 196 -83 L 239 -84 271 -85 Q 285 -87 294 -73 301 -61 301 -42 301 -24 294 -12 285 2 271 1 L 167 -2 42 1 Q 29 2 22 -12 15 -24 15 -43 15 -62 22 -74 29 -88 42 -85 L 54 -84 76 -83 Q 86 -86 86 -100 L 86 -621 Q 86 -637 71 -644 L 42 -647 Q 29 -646 22 -659 15 -672 15 -690 15 -709 22 -721 29 -735 42 -733 L 236 -731 Q 372 -731 457 -734";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "H":
			var pathData="M 467 -736 Q 481 -739 490 -725 497 -712 497 -693 497 -675 490 -662 481 -648 467 -650 L 462 -651 448 -649 444 -634 444 -94 Q 444 -83 449 -82 L 467 -85 Q 481 -88 490 -74 497 -61 497 -41 497 -21 490 -9 481 5 467 1 L 401 -3 326 1 Q 311 3 302 -11 294 -24 294 -44 294 -63 302 -75 311 -89 326 -85 L 342 -82 Q 352 -84 352 -94 L 352 -338 159 -338 159 -98 Q 159 -85 169 -83 L 189 -85 Q 203 -87 212 -73 220 -61 220 -43 220 -25 212 -12 203 2 189 1 L 118 -3 38 1 Q 26 3 18 -11 12 -24 12 -43 12 -62 18 -74 26 -88 38 -85 L 40 -85 60 -83 Q 67 -85 67 -98 L 67 -631 Q 67 -646 59 -650 53 -654 38 -650 26 -649 18 -663 12 -675 12 -694 12 -712 18 -725 26 -738 38 -736 L 119 -730 189 -736 Q 203 -739 212 -725 220 -713 220 -695 220 -676 212 -663 203 -649 189 -650 L 186 -651 168 -648 Q 159 -644 159 -631 L 159 -424 352 -424 352 -634 Q 352 -645 344 -649 L 328 -651 326 -650 Q 311 -648 302 -662 294 -675 294 -693 294 -712 302 -725 311 -739 326 -736 L 397 -732 467 -736";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "I":
			var pathData="M 411 -735 Q 433 -738 446 -724 458 -711 458 -692 458 -672 446 -660 433 -646 411 -649 L 380 -650 323 -648 Q 301 -645 301 -631 L 301 -99 Q 301 -82 339 -80 L 411 -85 Q 433 -88 446 -74 458 -62 458 -42 458 -23 446 -10 433 4 411 1 L 262 -3 98 1 Q 78 4 66 -10 56 -23 56 -42 56 -62 66 -74 78 -88 98 -85 L 164 -80 Q 209 -82 209 -99 L 209 -631 Q 209 -645 183 -648 L 124 -650 98 -649 Q 78 -646 66 -660 56 -672 56 -692 56 -711 66 -724 78 -738 98 -735 L 252 -731 411 -735";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "K":
			var pathData="M 445 -734 Q 462 -737 473 -724 483 -712 483 -693 483 -674 473 -661 462 -647 445 -648 L 423 -647 409 -634 282 -418 Q 357 -347 393 -275 433 -196 436 -96 436 -85 452 -83 L 477 -85 Q 491 -89 500 -76 508 -65 508 -46 508 -27 500 -14 491 1 477 1 L 448 0 420 2 367 2 Q 345 -2 346 -22 346 -135 320 -211 292 -288 234 -334 L 159 -206 159 -100 Q 159 -86 163 -83 L 177 -84 186 -85 Q 197 -88 204 -73 L 210 -41 204 -9 Q 197 4 186 1 L 109 -2 43 1 Q 28 3 20 -11 13 -23 13 -42 13 -61 20 -74 28 -88 43 -85 L 58 -84 63 -85 66 -91 67 -100 67 -623 Q 67 -638 60 -643 L 43 -646 Q 28 -641 20 -655 13 -667 13 -687 13 -707 20 -720 28 -735 43 -732 L 102 -729 176 -732 Q 192 -738 203 -724 212 -711 212 -691 212 -670 203 -657 192 -642 176 -646 L 163 -644 159 -623 159 -386 303 -633 Q 311 -644 304 -648 L 276 -648 Q 264 -647 256 -661 250 -673 250 -691 250 -710 256 -722 264 -736 276 -734 L 351 -731 445 -734";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "L":
			var pathData="M 90 -635 Q 90 -646 80 -648 L 53 -650 42 -649 Q 28 -648 20 -662 12 -674 12 -693 12 -712 20 -724 28 -738 42 -735 L 139 -731 281 -735 Q 299 -738 310 -724 320 -712 320 -693 320 -674 310 -662 299 -648 281 -649 L 258 -650 203 -648 Q 182 -645 182 -635 L 182 -114 Q 182 -94 200 -88 L 245 -85 262 -85 335 -90 Q 362 -96 374 -115 385 -134 388 -175 L 387 -285 Q 385 -303 401 -313 L 437 -322 471 -313 Q 486 -303 484 -285 L 474 -151 Q 470 -74 475 -38 475 -10 462 -2 L 407 1 222 -2 42 1 Q 28 3 20 -10 12 -23 12 -42 12 -61 20 -73 28 -88 42 -85 67 -81 76 -85 90 -90 90 -114 L 90 -635";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "M":
			var pathData="M 429 -730 L 475 -733 Q 489 -736 497 -721 505 -708 505 -689 505 -669 497 -657 489 -644 475 -647 L 457 -648 Q 449 -644 449 -631 L 449 -105 Q 449 -86 457 -82 L 475 -84 Q 489 -88 497 -75 505 -63 505 -44 505 -26 497 -13 489 1 475 0 L 404 -3 330 0 Q 316 1 308 -13 301 -25 301 -44 301 -62 308 -74 316 -87 330 -84 L 349 -82 Q 363 -86 363 -105 L 363 -506 303 -165 Q 290 -126 255 -126 220 -126 209 -165 L 148 -506 148 -105 Q 148 -91 159 -85 L 183 -84 Q 197 -87 206 -73 213 -61 213 -42 213 -24 206 -12 197 2 183 0 L 116 -4 35 -1 Q 21 2 14 -12 7 -23 7 -42 7 -61 14 -73 21 -87 35 -85 41 -80 51 -85 63 -91 63 -105 L 63 -629 Q 64 -643 57 -647 L 40 -649 35 -648 Q 21 -647 14 -661 7 -674 7 -692 7 -710 14 -722 21 -736 35 -734 L 87 -730 142 -733 Q 168 -739 177 -733 184 -728 191 -708 L 195 -699 244 -382 Q 250 -335 256 -335 261 -335 268 -382 L 313 -689 315 -695 Q 325 -718 332 -725 346 -737 372 -733 L 429 -730";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "N":
			var pathData="M 467 -734 Q 480 -737 488 -723 495 -711 495 -692 495 -673 488 -661 480 -647 467 -648 L 465 -649 451 -647 Q 442 -644 442 -632 L 442 -56 Q 442 -24 427 -4 415 13 394 17 375 20 356 10 336 -1 326 -22 L 166 -528 166 -103 Q 166 -88 173 -85 L 197 -86 203 -86 Q 218 -89 227 -74 236 -62 236 -42 236 -23 227 -11 218 4 203 2 L 122 -2 41 0 Q 29 2 23 -12 17 -25 17 -44 17 -64 23 -76 29 -90 41 -86 L 47 -86 66 -86 Q 74 -90 74 -103 L 74 -629 Q 74 -644 64 -647 L 42 -649 41 -648 Q 29 -647 23 -660 17 -673 17 -691 17 -710 23 -722 29 -736 41 -734 L 92 -731 150 -734 177 -729 190 -705 195 -696 350 -222 350 -632 Q 350 -646 341 -649 L 306 -649 305 -648 Q 289 -648 280 -662 272 -675 272 -693 272 -712 280 -724 289 -737 305 -734 L 385 -730 467 -734";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "O":
			var pathData="M 84 -638 Q 143 -752 256 -752 369 -752 428 -638 480 -537 480 -366 480 -197 428 -96 369 18 256 18 143 18 84 -96 32 -198 32 -366 32 -536 84 -638 M 356 -579 Q 324 -666 256 -666 188 -666 156 -579 128 -503 128 -367 128 -232 156 -156 188 -68 256 -68 324 -68 356 -156 384 -231 384 -367 384 -504 356 -579";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "P":
			var pathData="M 395 -508 Q 395 -588 354 -623 323 -649 271 -649 L 170 -649 170 -351 271 -351 Q 324 -351 354 -379 395 -417 395 -508 M 437 -675 Q 491 -616 491 -508 491 -388 437 -326 385 -265 282 -265 L 170 -265 170 -104 Q 170 -87 182 -84 190 -81 224 -84 L 254 -85 Q 274 -88 286 -74 296 -61 296 -42 296 -23 286 -11 274 3 254 1 L 146 -2 47 1 Q 32 3 24 -11 17 -24 17 -44 17 -63 24 -75 32 -89 47 -85 L 64 -83 Q 78 -85 78 -104 L 78 -632 Q 78 -645 67 -648 L 49 -650 47 -649 Q 32 -647 24 -662 17 -674 17 -694 17 -713 24 -725 32 -739 47 -735 L 129 -731 243 -734 282 -735 Q 383 -735 437 -675";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "R":
			var pathData="M 364 -515 Q 364 -582 335 -615 305 -649 245 -649 L 158 -649 158 -374 245 -374 Q 305 -374 335 -412 364 -447 364 -515 M 417 -669 Q 460 -614 460 -515 460 -427 424 -375 393 -330 331 -306 386 -271 411 -210 428 -165 431 -98 431 -84 444 -81 L 468 -85 Q 483 -89 493 -75 501 -63 501 -43 501 -24 493 -11 483 3 468 1 L 423 -2 370 1 Q 350 5 344 -7 L 340 -42 Q 340 -139 322 -190 297 -261 230 -288 L 158 -288 158 -96 Q 158 -85 168 -83 L 203 -85 206 -85 Q 222 -89 231 -75 240 -63 240 -43 240 -23 231 -11 222 4 206 1 L 111 -3 37 1 Q 24 4 16 -11 10 -23 10 -43 10 -63 16 -75 24 -89 37 -85 L 58 -83 Q 66 -85 66 -96 L 66 -629 Q 66 -645 58 -648 L 37 -649 Q 24 -648 16 -662 10 -674 10 -692 10 -711 16 -723 24 -737 37 -735 L 126 -731 252 -735 Q 365 -735 417 -669";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "S":
			var pathData="M 414 -749 L 451 -750 Q 473 -745 483 -734 495 -721 486 -702 471 -672 466 -615 461 -564 467 -527 471 -506 456 -493 444 -482 423 -482 402 -482 388 -493 373 -506 375 -527 381 -597 343 -634 310 -665 260 -665 200 -665 166 -625 136 -589 136 -534 136 -469 176 -436 204 -412 257 -404 L 271 -402 346 -388 Q 386 -377 412 -358 443 -335 459 -299 477 -257 477 -195 477 -97 417 -39 357 19 253 19 L 215 14 171 -1 170 -2 133 -18 Q 121 -20 119 -3 117 13 101 19 L 69 21 40 6 Q 28 -6 33 -21 43 -55 40 -107 38 -154 27 -198 21 -221 35 -235 47 -247 68 -247 89 -248 104 -238 120 -226 119 -206 112 -131 157 -96 193 -67 254 -67 312 -67 345 -101 381 -137 381 -204 381 -257 354 -283 326 -310 259 -318 167 -330 120 -362 40 -416 40 -538 40 -634 96 -692 154 -751 255 -751 L 309 -744 361 -727 Q 381 -715 387 -716 L 393 -726 395 -731 Q 396 -744 414 -749";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "T":
			var pathData="M 443 -734 L 481 -729 Q 493 -721 491 -690 L 493 -563 Q 496 -489 502 -435 505 -414 489 -402 475 -390 453 -390 431 -390 416 -402 400 -414 404 -435 L 408 -500 407 -580 Q 404 -621 388 -636 375 -647 346 -647 L 312 -640 Q 302 -632 302 -609 L 302 -102 Q 302 -80 305 -80 L 354 -87 Q 375 -92 388 -78 400 -65 400 -45 400 -25 388 -12 375 2 354 -1 L 253 -3 156 -1 Q 138 0 128 -15 119 -27 119 -46 119 -65 128 -77 138 -91 156 -87 L 170 -84 201 -80 Q 210 -83 210 -102 L 210 -609 Q 210 -632 199 -640 L 163 -647 Q 128 -647 116 -636 103 -623 99 -580 96 -550 96 -517 L 97 -466 98 -435 Q 102 -414 87 -402 75 -390 54 -390 34 -390 20 -402 5 -414 9 -435 L 20 -587 24 -690 Q 22 -719 30 -727 40 -738 75 -734 160 -731 259 -731 357 -731 443 -734";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "U":
			var pathData="M 477 -735 Q 491 -739 500 -726 508 -714 508 -695 508 -675 500 -662 491 -648 477 -649 L 471 -650 453 -647 Q 448 -643 448 -626 L 448 -171 Q 448 -76 391 -26 341 18 256 18 171 18 120 -26 64 -76 64 -171 L 64 -626 Q 64 -643 58 -647 L 33 -648 Q 19 -647 12 -661 5 -673 5 -691 5 -710 12 -722 19 -736 33 -734 L 111 -730 189 -734 Q 205 -739 216 -725 225 -714 225 -694 225 -675 216 -662 205 -647 189 -648 L 163 -646 Q 156 -642 156 -626 L 156 -171 Q 156 -126 182 -97 209 -68 257 -68 304 -68 330 -97 356 -125 356 -171 L 356 -626 Q 356 -646 348 -650 L 315 -648 Q 301 -647 294 -661 287 -674 287 -693 287 -712 294 -724 301 -738 315 -735 L 384 -731 477 -735";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "V":
			var pathData="M 460 -646 Q 453 -639 448 -613 L 326 -67 Q 318 -31 297 -10 278 9 255 9 232 9 214 -10 194 -31 188 -67 L 64 -613 51 -646 26 -650 Q 15 -649 9 -662 3 -675 3 -693 3 -712 9 -724 15 -738 26 -736 L 105 -732 178 -736 Q 192 -738 201 -724 208 -712 208 -693 208 -675 201 -662 192 -649 178 -650 159 -653 155 -645 151 -638 157 -613 L 256 -157 355 -613 Q 360 -635 346 -645 L 318 -650 Q 302 -649 293 -662 285 -675 285 -693 285 -712 293 -724 302 -738 318 -736 L 400 -731 482 -736 Q 495 -738 502 -724 509 -712 509 -693 509 -675 502 -662 495 -649 482 -650 L 460 -646";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
		case "W":
			var pathData="M 405 -731 L 480 -735 Q 495 -738 504 -724 512 -712 512 -693 512 -673 504 -661 495 -646 480 -648 L 462 -644 Q 456 -638 454 -618 L 409 -32 Q 405 -9 389 5 375 18 355 18 336 18 321 5 305 -9 303 -32 L 260 -338 254 -364 248 -338 206 -32 Q 200 -9 184 5 169 18 150 18 131 18 117 5 102 -9 100 -32 L 54 -623 45 -646 27 -650 Q 14 -648 6 -661 0 -673 0 -691 0 -710 6 -723 14 -737 27 -736 L 107 -730 170 -736 Q 183 -738 190 -725 197 -713 197 -695 197 -677 190 -664 183 -650 170 -650 L 139 -646 Q 132 -640 135 -623 L 156 -271 Q 157 -256 160 -256 L 167 -271 214 -597 Q 221 -637 254 -637 288 -637 294 -597 L 341 -271 Q 344 -256 347 -256 L 352 -271 373 -618 Q 374 -638 366 -646 L 345 -649 Q 330 -647 322 -661 315 -674 315 -693 315 -712 322 -724 330 -738 345 -735 L 405 -731";
			ctx.fillStyle=defaultFill;
			drawPath(ctx,pathData,false);
			ctx.fill("evenodd");
			break;
	}
}

function text4(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"M",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"N",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"U",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx,"F",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"C",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx,"U",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2090.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2280.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2470.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2660.0,309.0);
	font3(ctx,"N",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2850.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3040.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3230.0,309.0);
	font3(ctx,"U",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3420.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3610.0,309.0);
	font3(ctx,"O",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3800.0,309.0);
	font3(ctx,"M",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3990.0,309.0);
	font3(ctx,"O",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4180.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4370.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4560.0,309.0);
	font3(ctx,"V",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4750.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4940.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,5130.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,5320.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,5510.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,5700.0,309.0);
	font3(ctx,"C",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,5890.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,6080.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,6270.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,6460.0,309.0);
	font3(ctx,"C",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,6650.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,6840.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,7030.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,7220.0,309.0);
	font3(ctx,"P",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,7410.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,7600.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,7790.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,7980.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
}

var imageObj5 = document.createElement("img");
imageObj5.src="/archive-intro/f8c06614ae8ea83f.jpg";
function image5(ctx,ctrans,frame,ratio,time){
	var pathData="M 0 0 L 0 4720 3600 4720 3600 0 0 0";
	drawPath(ctx,pathData,false);
	ctx.save();
	ctx.clip();
	ctx.transform(20,0,0,20,0,0);
	ctx.transform(1.0055555555555555,0,0,1.0042372881355932,-0.5,-0.5);
	var fimg = ctrans.applyToImage(imageObj5);
	var pat=ctx.createPattern(fimg,"repeat");
	ctx.fillStyle = pat;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function shape6(ctx,ctrans,frame,ratio,time){
	var pathData="M -2360 -2360 L 1240 -2360 1240 2360 -2360 2360 -2360 -2360";
	drawPath(ctx,pathData,false);
	ctx.save();
	ctx.clip();
	ctx.transform(20,0,0,20,-2360,-2360);
	ctx.transform(1.0055555555555555,0,0,1.0042372881355932,-0.5,-0.5);
	var fimg = ctrans.applyToImage(imageObj5);
	var pat=ctx.createPattern(fimg,"repeat");
	ctx.fillStyle = pat;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -2369 -2360 L -2366 -2360 -2366 2361 -2369 2361 -2369 -2360";
	ctx.fillStyle=tocolor(ctrans.apply([107,100,200,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1252 -2360 L 1252 2360 M -2377 2361 L -2377 -2360";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([255,255,255,1]));
	ctx.lineWidth=0.05;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function text7(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"H",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"D",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"M",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx,"P",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"W",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2090.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2280.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2470.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2660.0,309.0);
	font3(ctx,"K",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2850.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3040.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
}

function text8(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"M",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"N",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"C",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2090.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2280.0,309.0);
	font3(ctx,"P",textColor);
	ctx.restore();
}

function text9(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"F",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"U",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx,"B",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"N",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2090.0,309.0);
	font3(ctx,"K",textColor);
	ctx.restore();
}

function text10(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx,"W",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2090.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2280.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2470.0,309.0);
	font3(ctx,"K",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2660.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2850.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
}

function text11(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"B",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"U",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"B",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"H",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"O",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx,"D",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
}

function text12(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx,"N",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"O",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx,"D",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"C",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"O",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2090.0,309.0);
	font3(ctx,"N",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2280.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2470.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2660.0,309.0);
	font3(ctx,"C",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2850.0,309.0);
	font3(ctx,"T",textColor);
	ctx.restore();
}

var imageObj13 = document.createElement("img");
imageObj13.src="/archive-intro/670ad0ef76d06ffc.jpg";
function image13(ctx,ctrans,frame,ratio,time){
	var pathData="M 0 0 L 0 4720 3600 4720 3600 0 0 0";
	drawPath(ctx,pathData,false);
	ctx.save();
	ctx.clip();
	ctx.transform(20,0,0,20,0,0);
	ctx.transform(1.0055555555555555,0,0,1.0042372881355932,-0.5,-0.5);
	var fimg = ctrans.applyToImage(imageObj13);
	var pat=ctx.createPattern(fimg,"repeat");
	ctx.fillStyle = pat;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
}

function shape14(ctx,ctrans,frame,ratio,time){
	var pathData="M -2360 -2360 L 1240 -2360 1240 2360 -2360 2360 -2360 -2360";
	drawPath(ctx,pathData,false);
	ctx.save();
	ctx.clip();
	ctx.transform(20,0,0,20,-2360,-2360);
	ctx.transform(1.0055555555555555,0,0,1.0042372881355932,-0.5,-0.5);
	var fimg = ctrans.applyToImage(imageObj13);
	var pat=ctx.createPattern(fimg,"repeat");
	ctx.fillStyle = pat;
	ctx.fillRect(-16384,-16384,32768,32768);
	ctx.restore();
	var pathData="M -2377 2361 L -2380 2361 -2380 -2360 -2377 -2360 -2377 2361";
	ctx.fillStyle=tocolor(ctrans.apply([107,100,200,1]));
	drawPath(ctx,pathData,false);
	ctx.fill("evenodd");
	var pathData="M 1230 -2360 L 1230 2360 M -2377 2361 L -2377 -2360";
	var scaleMode = "NORMAL";
	ctx.strokeStyle=tocolor(ctrans.apply([255,255,255,1]));
	ctx.lineWidth=0.05;
	ctx.lineCap="round";
	ctx.lineJoin="round";
	drawPath(ctx,pathData,true,scaleMode);

}

function text15(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"F",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"U",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"H",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"O",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx,"D",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
}

function text16(ctx,ctrans,frame,ratio,time){
	var textColor = tocolor(ctrans.apply([204,204,204,1]));
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,0.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,190.0,309.0);
	font3(ctx,"P",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,380.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,570.0,309.0);
	font3(ctx,"C",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,760.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,950.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1140.0,309.0);
	font3(ctx,"L",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1330.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1520.0,309.0);
	font3(ctx,"M",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1710.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,1900.0,309.0);
	font3(ctx,"D",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2090.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2280.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2470.0,309.0);
	font3(ctx,"W",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2660.0,309.0);
	font3(ctx,"I",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,2850.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3040.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3230.0,309.0);
	font3(ctx," ",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3420.0,309.0);
	font3(ctx,"H",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3610.0,309.0);
	font3(ctx,"A",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3800.0,309.0);
	font3(ctx,"R",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,3990.0,309.0);
	font3(ctx,"N",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4180.0,309.0);
	font3(ctx,"E",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4370.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
	ctx.save();
	ctx.transform(0.3515625,0.0,0.0,0.3515625,4560.0,309.0);
	font3(ctx,"S",textColor);
	ctx.restore();
}

function main(ctx,ctrans,frame,ratio,time){
	ctx.save();
	ctx.transform(1,0,0,1,0.0,0.0);
	var clips = [];
	var frame_cnt = 145;
	frame = frame % frame_cnt;
	switch(frame){
		case 0:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,677.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			break;
		case 1:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,642.25,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,30)),1,0,0,time);
			break;
		case 2:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,607.5,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,48)),1,0,0,time);
			break;
		case 3:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,572.75,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,65)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,-339.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			break;
		case 4:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,538.05,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,82)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,-278.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,32)),1,0,0,time);
			break;
		case 5:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,503.3,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,100)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,-216.95,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,52)),1,0,0,time);
			break;
		case 6:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,468.55,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,117)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,-155.55,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,71)),1,0,0,time);
			break;
		case 7:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,433.8,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,134)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,-94.2,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,91)),1,0,0,time);
			break;
		case 8:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,399.05,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,152)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,-32.8,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			break;
		case 9:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,364.3,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,169)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,28.6,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,129)),1,0,0,time);
			break;
		case 10:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,329.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,186)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,89.95,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,149)),1,0,0,time);
			break;
		case 11:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,294.85,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,204)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,151.35,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,168)),1,0,0,time);
			break;
		case 12:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,260.1,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,221)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,212.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,188)),1,0,0,time);
			break;
		case 13:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,190.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,274.1,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			break;
		case 14:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,176.1,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 15:
			place("shape2",canvas,ctx,[0.05000381469726563,0.0,0.0,0.0500030517578125,159.7,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 16:
			place("shape2",canvas,ctx,[0.050006866455078125,0.0,0.0,0.050005340576171876,143.25,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 17:
			place("shape2",canvas,ctx,[0.05001068115234375,0.0,0.0,0.050008392333984374,126.85,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 18:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 19:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,254)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 20:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,252)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 21:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,250)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 22:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,249)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 23:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,247)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 24:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,245)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 25:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,243)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 26:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,241)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 27:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,239)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 28:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,237)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 29:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,236)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 30:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,234)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 31:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,232)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 32:
			place("shape2",canvas,ctx,[0.05001373291015625,0.0,0.0,0.05001068115234375,110.4,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,230)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 33:
			place("shape2",canvas,ctx,[0.050012969970703126,0.0,0.0,0.05000991821289062,129.15,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,218)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 34:
			place("shape2",canvas,ctx,[0.05001220703125,0.0,0.0,0.0500091552734375,147.9,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,206)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 35:
			place("shape2",canvas,ctx,[0.05001144409179688,0.0,0.0,0.0500091552734375,166.7,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,194)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 36:
			place("shape2",canvas,ctx,[0.05001068115234375,0.0,0.0,0.050008392333984374,185.5,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,182)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 37:
			place("shape2",canvas,ctx,[0.05000991821289062,0.0,0.0,0.05000762939453125,204.25,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,170)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 38:
			place("shape2",canvas,ctx,[0.0500091552734375,0.0,0.0,0.050006866455078125,223.0,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,158)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 39:
			place("shape2",canvas,ctx,[0.050008392333984374,0.0,0.0,0.050006103515625,241.75,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,146)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 40:
			place("shape2",canvas,ctx,[0.05000762939453125,0.0,0.0,0.050005340576171876,260.5,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,134)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 41:
			place("shape2",canvas,ctx,[0.050006103515625,0.0,0.0,0.050005340576171876,279.3,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,122)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 42:
			place("shape2",canvas,ctx,[0.050005340576171876,0.0,0.0,0.05000457763671875,298.05,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,677.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.05,276.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 43:
			place("shape2",canvas,ctx,[0.05000457763671875,0.0,0.0,0.05000381469726563,316.8,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,98)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,649.2,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,27)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.043019866943359374,276.3,110.25],ctrans.merge(new cxform(0,0,0,0,256,256,256,221)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,-108.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,717.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,-42.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,684.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,2.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			break;
		case 44:
			place("shape2",canvas,ctx,[0.05000381469726563,0.0,0.0,0.0500030517578125,335.55,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,86)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,621.4,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,41)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.0360382080078125,276.3,111.5],ctrans.merge(new cxform(0,0,0,0,256,256,256,187)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,-66.45,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,40)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,666.9,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,40)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,-7.8,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,40)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,637.55,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,40)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,31.35,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,40)),1,0,0,time);
			break;
		case 45:
			place("shape2",canvas,ctx,[0.0500030517578125,0.0,0.0,0.05000228881835937,354.3,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,74)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,593.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,55)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.029058074951171874,276.3,112.75],ctrans.merge(new cxform(0,0,0,0,256,256,256,152)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,-24.9,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,67)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,616.8,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,67)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,26.45,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,67)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,591.1,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,67)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,60.65,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,67)),1,0,0,time);
			break;
		case 46:
			place("shape2",canvas,ctx,[0.05000228881835937,0.0,0.0,0.05000152587890625,373.0,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,62)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,565.8,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,69)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.02207794189453125,276.3,114.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,117)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,16.65,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,94)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,566.65,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,94)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,60.65,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,94)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,544.65,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,94)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,90.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,94)),1,0,0,time);
			break;
		case 47:
			place("shape2",canvas,ctx,[0.05000152587890625,0.0,0.0,0.05000152587890625,391.8,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,50)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,538.05,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,83)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.015097808837890626,276.3,115.3],ctrans.merge(new cxform(0,0,0,0,256,256,256,82)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,58.2,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,121)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,516.55,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,121)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,94.9,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,121)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,498.2,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,121)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,119.35,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,121)),1,0,0,time);
			break;
		case 48:
			place("shape2",canvas,ctx,[0.050000762939453124,0.0,0.0,0.050000762939453124,410.55,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,38)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,510.25,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,96)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.00811614990234375,276.3,116.55],ctrans.merge(new cxform(0,0,0,0,256,256,256,48)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,99.8,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,148)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,466.45,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,148)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,129.1,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,148)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,451.8,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,148)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,148.65,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,148)),1,0,0,time);
			break;
		case 49:
			place("shape2",canvas,ctx,[0.05,0.0,0.0,0.05,429.3,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,26)),1,0,0,time);
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,482.45,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			place("text4",canvas,ctx,[0.05,0.0,0.0,0.001136016845703125,276.3,117.8],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,141.35,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,175)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,416.35,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,175)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,163.35,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,175)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,405.35,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,175)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,178.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,175)),1,0,0,time);
			break;
		case 50:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,454.65,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,124)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,182.9,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,202)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,366.25,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,202)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,197.55,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,202)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,358.9,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,202)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,207.35,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,202)),1,0,0,time);
			break;
		case 51:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,426.85,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,138)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,224.45,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,229)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,316.1,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,229)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,231.8,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,229)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,312.45,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,229)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,236.65,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,229)),1,0,0,time);
			break;
		case 52:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,399.05,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,152)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 53:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,369.25,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,167)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 54:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,339.5,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,182)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 55:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,309.7,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,197)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 56:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,279.95,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,211)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 57:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,250.15,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,226)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 58:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,220.4,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,241)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 59:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,190.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 60:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,176.1,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 61:
			place("shape6",canvas,ctx,[0.049993133544921874,0.0,0.0,0.050005340576171876,159.65,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 62:
			place("shape6",canvas,ctx,[0.04998626708984375,0.0,0.0,0.05001068115234375,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 63:
			place("shape6",canvas,ctx,[0.04998626708984375,0.0,0.0,0.05001144409179688,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 64:
			place("shape6",canvas,ctx,[0.04998626708984375,0.0,0.0,0.05001144409179688,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 65:
			place("shape6",canvas,ctx,[0.04998703002929687,0.0,0.0,0.05001220703125,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 66:
			place("shape6",canvas,ctx,[0.04998703002929687,0.0,0.0,0.05001220703125,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 67:
			place("shape6",canvas,ctx,[0.04998703002929687,0.0,0.0,0.050012969970703126,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 68:
			place("shape6",canvas,ctx,[0.04998703002929687,0.0,0.0,0.050012969970703126,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 69:
			place("shape6",canvas,ctx,[0.04998703002929687,0.0,0.0,0.05001373291015625,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 70:
			place("shape6",canvas,ctx,[0.04998779296875,0.0,0.0,0.05001373291015625,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 71:
			place("shape6",canvas,ctx,[0.04998779296875,0.0,0.0,0.050014495849609375,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 72:
			place("shape6",canvas,ctx,[0.04998779296875,0.0,0.0,0.050014495849609375,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 73:
			place("shape6",canvas,ctx,[0.04998779296875,0.0,0.0,0.0500152587890625,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 74:
			place("shape6",canvas,ctx,[0.04998779296875,0.0,0.0,0.0500152587890625,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 75:
			place("shape6",canvas,ctx,[0.04998779296875,0.0,0.0,0.050016021728515624,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 76:
			place("shape6",canvas,ctx,[0.04998855590820313,0.0,0.0,0.050016021728515624,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 77:
			place("shape6",canvas,ctx,[0.04998855590820313,0.0,0.0,0.05001678466796875,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 78:
			place("shape6",canvas,ctx,[0.04998855590820313,0.0,0.0,0.05001678466796875,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 79:
			place("shape6",canvas,ctx,[0.04998855590820313,0.0,0.0,0.05001754760742187,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 80:
			place("shape6",canvas,ctx,[0.04998855590820313,0.0,0.0,0.05001754760742187,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 81:
			place("shape6",canvas,ctx,[0.04998931884765625,0.0,0.0,0.050018310546875,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 82:
			place("shape6",canvas,ctx,[0.04998931884765625,0.0,0.0,0.050018310546875,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 83:
			place("shape6",canvas,ctx,[0.04998931884765625,0.0,0.0,0.05001907348632813,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 84:
			place("shape6",canvas,ctx,[0.04999237060546875,0.0,0.0,0.050014495849609375,134.95,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 85:
			place("shape6",canvas,ctx,[0.04999465942382812,0.0,0.0,0.05000991821289062,126.7,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 86:
			place("shape6",canvas,ctx,[0.049997711181640626,0.0,0.0,0.05000457763671875,118.5,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 87:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,110.3,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 88:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,130.25,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,242)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 89:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,150.15,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,227)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,195)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 90:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,170.1,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,213)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 91:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,190.05,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,199)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,74)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,195)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 92:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,210.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,184)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 93:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,229.9,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,170)),1,0,0,time);
			place("text7",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,43.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,74)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,195)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 94:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,249.85,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,155)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 95:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,269.8,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,141)),1,0,0,time);
			place("text8",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,74)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,195)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 96:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,289.75,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,127)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 97:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,309.7,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,112)),1,0,0,time);
			place("text9",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,74)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,175)),1,0,0,time);
			break;
		case 98:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,329.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,98)),1,0,0,time);
			place("text10",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,94)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			break;
		case 99:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,349.55,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,84)),1,0,0,time);
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,677.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text11",canvas,ctx,[0.05,0.0,0.0,0.05,266.0,175.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,62)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			break;
		case 100:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,369.5,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,69)),1,0,0,time);
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,646.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,28)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,62)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			break;
		case 101:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,389.45,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,55)),1,0,0,time);
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,616.2,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,43)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,159)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,62)),1,0,0,time);
			break;
		case 102:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,409.35,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,40)),1,0,0,time);
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,585.8,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,59)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,159)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			break;
		case 103:
			place("shape6",canvas,ctx,[0.05,0.0,0.0,0.05,429.3,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,26)),1,0,0,time);
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,555.4,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,74)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,159)),1,0,0,time);
			break;
		case 104:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,525.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,89)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			break;
		case 105:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,494.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,104)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 106:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,464.2,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,119)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 107:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,433.8,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 108:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,403.4,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,150)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 109:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,373.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,165)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 110:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,342.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,180)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 111:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,312.2,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,195)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 112:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,281.8,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,210)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 113:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,251.4,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,226)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 114:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,221.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,241)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 115:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,190.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 116:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,176.1,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 117:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,159.65,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 118:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05001068115234375,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 119:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05001144409179688,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 120:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05001220703125,143.2,118.05],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 121:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.050012969970703126,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 122:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05001373291015625,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 123:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.050014495849609375,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 124:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.050014495849609375,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 125:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.0500152587890625,143.2,118.1],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 126:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.050016021728515624,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 127:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05001678466796875,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 128:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05001754760742187,143.2,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 129:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.0500091552734375,126.75,118.15],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 130:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,110.3,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 131:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,133.1,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,240)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 132:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,155.85,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,223)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,229.4,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,232)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 133:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,178.65,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,193.1,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,232.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,232)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,265.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,256)),1,0,0,time);
			break;
		case 134:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,201.45,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,190)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,156.8,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,183)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,199.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,226.1,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,232)),1,0,0,time);
			break;
		case 135:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,224.25,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,174)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,120.5,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,159)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,166.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,183)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,186.5,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,207)),1,0,0,time);
			break;
		case 136:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,247.0,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,157)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,84.2,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,133.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,159)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,146.9,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,183)),1,0,0,time);
			break;
		case 137:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,269.8,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,141)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,47.9,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,100.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,107.3,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,159)),1,0,0,time);
			break;
		case 138:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,292.6,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,125)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,11.6,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,86)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,67.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,67.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,135)),1,0,0,time);
			break;
		case 139:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,315.35,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,108)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,-24.7,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,62)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,34.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,86)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,28.1,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,110)),1,0,0,time);
			break;
		case 140:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,338.15,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,92)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,-61.0,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,37)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,1.7,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,62)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,-11.5,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,86)),1,0,0,time);
			break;
		case 141:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,360.95,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,75)),1,0,0,time);
			place("text12",canvas,ctx,[0.05,0.0,0.0,0.05,-97.3,76.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,-31.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,37)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,-51.1,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,62)),1,0,0,time);
			break;
		case 142:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,383.75,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,59)),1,0,0,time);
			place("text15",canvas,ctx,[0.05,0.0,0.0,0.05,-64.3,109.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,-90.7,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,37)),1,0,0,time);
			break;
		case 143:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,406.5,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,42)),1,0,0,time);
			place("text16",canvas,ctx,[0.05,0.0,0.0,0.05,-130.3,142.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,13)),1,0,0,time);
			break;
		case 144:
			place("shape14",canvas,ctx,[0.05,0.0,0.0,0.05,429.3,118.0],ctrans.merge(new cxform(0,0,0,0,256,256,256,26)),1,0,0,time);
			break;
	}
	ctx.restore();
}

var frame = -1;
var time = 0;
var frames = [];
frames.push(0);
frames.push(1);
frames.push(2);
frames.push(3);
frames.push(4);
frames.push(5);
frames.push(6);
frames.push(7);
frames.push(8);
frames.push(9);
frames.push(10);
frames.push(11);
frames.push(12);
frames.push(13);
frames.push(14);
frames.push(15);
frames.push(16);
frames.push(17);
frames.push(18);
frames.push(19);
frames.push(20);
frames.push(21);
frames.push(22);
frames.push(23);
frames.push(24);
frames.push(25);
frames.push(26);
frames.push(27);
frames.push(28);
frames.push(29);
frames.push(30);
frames.push(31);
frames.push(32);
frames.push(33);
frames.push(34);
frames.push(35);
frames.push(36);
frames.push(37);
frames.push(38);
frames.push(39);
frames.push(40);
frames.push(41);
frames.push(42);
frames.push(43);
frames.push(44);
frames.push(45);
frames.push(46);
frames.push(47);
frames.push(48);
frames.push(49);
frames.push(50);
frames.push(51);
frames.push(52);
frames.push(53);
frames.push(54);
frames.push(55);
frames.push(56);
frames.push(57);
frames.push(58);
frames.push(59);
frames.push(60);
frames.push(61);
frames.push(62);
frames.push(63);
frames.push(64);
frames.push(65);
frames.push(66);
frames.push(67);
frames.push(68);
frames.push(69);
frames.push(70);
frames.push(71);
frames.push(72);
frames.push(73);
frames.push(74);
frames.push(75);
frames.push(76);
frames.push(77);
frames.push(78);
frames.push(79);
frames.push(80);
frames.push(81);
frames.push(82);
frames.push(83);
frames.push(84);
frames.push(85);
frames.push(86);
frames.push(87);
frames.push(88);
frames.push(89);
frames.push(90);
frames.push(91);
frames.push(92);
frames.push(93);
frames.push(94);
frames.push(95);
frames.push(96);
frames.push(97);
frames.push(98);
frames.push(99);
frames.push(100);
frames.push(101);
frames.push(102);
frames.push(103);
frames.push(104);
frames.push(105);
frames.push(106);
frames.push(107);
frames.push(108);
frames.push(109);
frames.push(110);
frames.push(111);
frames.push(112);
frames.push(113);
frames.push(114);
frames.push(115);
frames.push(116);
frames.push(117);
frames.push(118);
frames.push(119);
frames.push(120);
frames.push(121);
frames.push(122);
frames.push(123);
frames.push(124);
frames.push(125);
frames.push(126);
frames.push(127);
frames.push(128);
frames.push(129);
frames.push(130);
frames.push(131);
frames.push(132);
frames.push(133);
frames.push(134);
frames.push(135);
frames.push(136);
frames.push(137);
frames.push(138);
frames.push(139);
frames.push(140);
frames.push(141);
frames.push(142);
frames.push(143);
frames.push(144);

var backgroundColor = "#0066ff";
var originalWidth = 757;
var originalHeight= 236;
function nextFrame(ctx,ctrans){
	var oldframe = frame;
	frame = (frame+1)%frames.length;
	if(frame==oldframe){time++;}else{time=0;};
	drawFrame();
}

function drawFrame(){
	ctx.fillStyle = backgroundColor;
	ctx.fillRect(0,0,canvas.width,canvas.height);
	ctx.save();
	ctx.transform(canvas.width/originalWidth,0,0,canvas.height/originalHeight,0,0);
	main(ctx,ctrans,frames[frame],0,time);
	ctx.restore();
}


// Native 30fps drawing timeline. Frame count includes the original preload scene.
var images = [imageObj1,imageObj13,imageObj5];
var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
Promise.all(images.map(function(image) { return image.complete ? Promise.resolve() : new Promise(function(resolve) { image.onload=resolve; image.onerror=resolve; }); })).then(function() {
  var started = performance.now();
  var forcedFrame = new URLSearchParams(location.search).get('headerFrame');
  function animate(now) {
    frame = forcedFrame !== null ? Math.max(0, Math.min(frames.length-1, Number(forcedFrame)||0)) : (reducedMotion.matches ? 0 : 0 + Math.floor((now-started)*12/1000) % (frames.length-0));
    drawFrame();
    canvas.dataset.frame = String(frame);
    if (forcedFrame === null && !reducedMotion.matches && canvas.isConnected) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});


})();
