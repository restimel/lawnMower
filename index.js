var ArgumentParser = require('argparse').ArgumentParser;
var fs = require('fs');

var parser = require('./modules/parser');
var Mower = require('./modules/Mower');
var Lawn = require('./modules/Lawn');

function main() {
    var data = getParams();
    var configuration, lawnConfig, lawn;

    try {
        configuration = parser(data);
        lawnConfig = configuration.lawn;
        lawn = new Lawn(lawnConfig.width, lawnConfig.height);

        configuration.mowers.forEach(function(mowerConfig) {
            var init = mowerConfig.init;
            var mower = new Mower(init.x, init.y, init.direction, lawn);
            mowerConfig.instructions.forEach(function(instruction) {
                mower.move(instruction);
            });

            /* print the final position of this mower */
            console.log(mower.getPosition());
        });
    } catch(e) {
        displayError(e.message);
    }
}

/* parse args and manage help */
function getParams() {
    var parser = new ArgumentParser({
        version: '1.0.0',
        addHelp: true,
        description: 'This is a simulation of an automatic lawn mower.'
    });

    parser.addArgument('-f', {
        help: 'Configuration file which describe lawn and mowers',
        defaultValue: undefined,
        dest: 'file',
        metavar: '<file>',
    });

    parser.addArgument('configuration', {
        help: 'Configuration of lawn and mowers',
        nargs: '?',
        defaultValue: '',
        metavar: '<configuration>'
    });

    var args = parser.parseArgs();

    if (args.file) {
        return readFile(args.file);
    }

    if (args.configuration) {
        return args.configuration;
    }

    displayError('Mower configuration is missing.\nIt should be defined either from file either from argument.');
}

function readFile(path) {
    var fileContent;

    try {
        fileContent = fs.readFileSync(path, {
            encoding: 'utf8'
        });
    } catch(e) {
        displayError(`
Cannot read the file "${path}".
Reason: ${e.message}
        `);
    }

    return fileContent;
}

function displayError(message) {
    console.error(message);
    process.exit(1);
}

main();
