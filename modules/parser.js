
/* Purpose:
 * This file is to convert input text to JS format. It checks that data are correctly formated.
 * It is not part of parser to check validity of data (like if mowers are inside lawn)
 */

function parser(text) {
    if (typeof text !== 'string') {
        throw new Error('parser expect a string argument');
    }

    /* remove all empty lines from text */
    var trimedText = text.replace(/\n(?:\s*\n)+/g, '\n');
    trimedText = trimedText.replace(/^\n|\n\s*$/g, ''); // remove start and end empty lines
    var lines = trimedText.split('\n');

    var lawnLine = lines.shift();
    var lawn = parseLawn(lawnLine);
    var mowers = parseMowers(lines);

    return {
        lawn: lawn,
        mowers: mowers,
    };
}

function parseLawn(line) {
    /* parse strings like "42 42" and get the 2 numbers*/
    var parsedLine = line.match(/^\s*(\d+)\s+(\d+)\s*$/);
    if (!parsedLine) {
        throw new Error(`Lawn line "${line}" is not correctly formated (which should look like "1 1")`);
    }
    var width = parseInt(parsedLine[1], 10);
    var height = parseInt(parsedLine[2], 10);

    return {
        width: width,
        height: height,
    };
}

function parseMowers(lines) {
    var mowers = [];

    var index = 0;
    var length = lines.length;
    var lineMower, mowerParsed, mower, lineInstructions;

    /* XXX: index can be changed inside the loop */
    for (index = 0; index < length; index++) {
        lineMower = lines[index];
        /* parse strings like "42 42 N" and get the 2 numbers and the letter */
        mowerParsed = lineMower.match(/^\s*(\d+)\s+(\d+)\s+([NEWS])\s*$/);
        if (!mowerParsed) {
            throw new Error(`line "${lineMower}" is not formated as a mower line (which should look like "0 0 N")`);
        }

        mower = {
            init: {
                x: parseInt(mowerParsed[1], 10),
                y: parseInt(mowerParsed[2], 10),
                direction: mowerParsed[3],
            },
            instructions: [],
        };

        lineInstructions = lines[index + 1];
        if (lineInstructions && /^[FLR]+$/.test(lineInstructions)) {
            mower.instructions = lineInstructions.split('');
            index++;
        }

        mowers.push(mower);
    }

    return mowers;
}

module.exports = parser;
