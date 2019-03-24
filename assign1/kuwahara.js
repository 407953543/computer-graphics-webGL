(function(imageproc) {
    "use strict";

    /*
     * Apply Kuwahara filter to the input data
     */
    imageproc.kuwahara = function(inputData, outputData, size) {
        var regionSize = Math.ceil(size / 2);
        var regionNum = regionSize * regionSize;
        var halfSize = Math.floor(regionSize / 2);
        /* An internal function to find the regional stat centred at (x, y) */
        function regionStat(x, y) {
            /* Find the mean colour and brightness */
            var meanR = 0, meanG = 0, meanB = 0;
            var meanValue = 0;
            for (var j = -1 * halfSize; j <= halfSize; j++) {
                for (var i = -1 * halfSize; i <= halfSize; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);

                    /* For the mean colour */
                    meanR += pixel.r;
                    meanG += pixel.g;
                    meanB += pixel.b;

                    /* For the mean brightness */
                    meanValue += pixel.r * 0.2126 +
                                 pixel.g * 0.7152 +
                                 pixel.b * 0.0722;
                }
            }
            meanR /= regionNum;
            meanG /= regionNum;
            meanB /= regionNum;
            meanValue /= regionNum;

            /* Find the variance */
            var variance = 0;
            for (var j = -1 * halfSize; j <= halfSize; j++) {
                for (var i = -1 * halfSize; i <= halfSize; i++) {
                    var pixel = imageproc.getPixel(inputData, x + i, y + j);
                    var value = pixel.r * 0.2126 +
                                pixel.g * 0.7152 +
                                pixel.b * 0.0722;

                    variance += Math.pow(value - meanValue, 2);
                }
            }
            variance /= regionNum;

            /* Return the mean and variance as an object */
            return {
                mean: {r: meanR, g: meanG, b: meanB},
                variance: variance
            };
        }

        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                /* Find the statistics of the four sub-regions */
                var regionA = regionStat(x - halfSize, y - halfSize, inputData);
                var regionB = regionStat(x + halfSize, y - halfSize, inputData);
                var regionC = regionStat(x - halfSize, y + halfSize, inputData);
                var regionD = regionStat(x + halfSize, y + halfSize, inputData);

                /* Get the minimum variance value */
                var minV = Math.min(regionA.variance, regionB.variance,
                                    regionC.variance, regionD.variance);

                var i = (x + y * inputData.width) * 4;

                /* Put the mean colour of the region with the minimum
                   variance in the pixel */
                switch (minV) {
                case regionA.variance:
                    outputData.data[i]     = regionA.mean.r;
                    outputData.data[i + 1] = regionA.mean.g;
                    outputData.data[i + 2] = regionA.mean.b;
                    break;
                case regionB.variance:
                    outputData.data[i]     = regionB.mean.r;
                    outputData.data[i + 1] = regionB.mean.g;
                    outputData.data[i + 2] = regionB.mean.b;
                    break;
                case regionC.variance:
                    outputData.data[i]     = regionC.mean.r;
                    outputData.data[i + 1] = regionC.mean.g;
                    outputData.data[i + 2] = regionC.mean.b;
                    break;
                case regionD.variance:
                    outputData.data[i]     = regionD.mean.r;
                    outputData.data[i + 1] = regionD.mean.g;
                    outputData.data[i + 2] = regionD.mean.b;
                }
            }
        }
    }
 
}(window.imageproc = window.imageproc || {}));
