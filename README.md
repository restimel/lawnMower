 # Automatic lawn mower

Small simulation of automatic lawn mowers.

This small project has been done as technical test for LALALAB


## Installation

It needs nodeJs to run this application.
It has been tested with nodesJS version 4.0.0 and 9.11.2.

To require all needed dependencies, run the following code in  the project folder.

    npm install


## Run the application

You can now run the application with the following command:

    node index.js <instructions>

where `instructions` is mower configuration.

### With a file

It is possible to load it from file with the tag `-f`.

    node index.js -f examples/test1.txt

#### Datas

Some example datas are available in the `examples` folder.

## Run tests

### Unitary tests

Mocha tests can be run with the command:

    npm test

Tests are stored in the `test` folder

## Architecture

The project is quite simple. The min file (`index.js`) handles arguments from system to read data (either from file either from arguments).

It gives it to `modules/parse.js` to transform this raw text in JS object.

This object is used to build mowers (`modules/Mower.js`) which handle all mower's states.

The Lawn (`modules/Lawn.js`) is used to check if new position is still valid.

#### Notes

All code have been written in ES5 (except for some litteral strings) as I have noticed little bit too late, that I have an old NodeJS version on this computer.

## Author

Benoît Mariat
(b.mariat@gmail.com)
