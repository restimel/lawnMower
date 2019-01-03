
/* Purpose:
 * This file is to handle rules related to Lawn
 */

var Mower = require('../modules/Mower');

function Lawn(width, height) {
    if (typeof width !== 'number' || width < 0 || width % 1) {
        throw new Error('width should be a positive integer');
    }

    if (typeof height !== 'number' || height < 0 || height % 1) {
        throw new Error('height should be a positive integer');
    }

    this.width = width;
    this.height = height;
}

Lawn.prototype.isAccessible = function(x, y) {
    return x >= 0
        && y >= 0
        && x <= this.width
        && y <= this.height;
};

module.exports = Lawn;
