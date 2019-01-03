
/* Purpose:
 * This file is to handle Mower (movement and current position)
 */

var directions = ['N', 'E', 'S', 'W'];

function Mower(x, y, direction, lawn) {
    if (typeof x !== 'number' || typeof y !== 'number' || x % 1 || y % 1) {
        throw new Error('position must be integer');
    }

    if (!lawn.isAccessible(x, y)) {
        throw new Error('position is outside lawn');
    }

    this.x = x;
    this.y = y;
    this.direction = directions.indexOf(direction);
    this.lawn = lawn;

    if (this.direction === -1) {
        throw new Error('direction is not known');
    }
}

Mower.prototype.getPosition = function() {
    return `${this.x} ${this.y} ${directions[this.direction]}`;
};

Mower.prototype.move = function (instruction) {
    switch (instruction) {
        case 'L':
            this.direction = (this.direction + directions.length - 1) % directions.length;
            break;
        case 'R':
            this.direction = (this.direction + 1) % directions.length;
            break;
        case 'F':
            this._moveForward();
            break;
        default: throw new Error(`Unknown instruction: ${instruction}`);
    }
    return `${this.x} ${this.y} ${directions[this.direction]}`;
};

/* private methods */

Mower.prototype._moveForward = function () {
    var x = this.x;
    var y = this.y;

    switch (this.direction) {
        case 0: // North
            y++;
            break;
        case 1: // East
            x++;
            break;
        case 2: // South
            y--;
            break;
        case 3: // West
            x--;
            break;
    }

    if (this.lawn.isAccessible(x, y)) {
        this.x = x;
        this.y = y;
    }
};

module.exports = Mower;
