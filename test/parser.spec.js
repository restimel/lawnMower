var expect = require('chai').expect;
var parser = require('../modules/parser');

describe('Parser()', function() {
    it('should parse full text', function() {
        var text = `5 5
1 2 N
LFLFLFLFF
3 3 E
FFRFFRFRRF`;
        var result = parser(text);

        expect(result).to.deep.equal({
            lawn: {
                width: 5,
                height: 5,
            },
            mowers: [{
                init: {
                    x: 1,
                    y: 2,
                    direction: 'N',
                },
                instructions: ['L', 'F', 'L', 'F', 'L', 'F', 'L', 'F', 'F'],
            }, {
                init: {
                    x: 3,
                    y: 3,
                    direction: 'E',
                },
                instructions: ['F', 'F', 'R', 'F', 'F', 'R', 'F', 'R', 'R', 'F'],
            }],
        });
    });

    it('should ignore empty lines', function() {
        var text = `
 5 5

 1 2 N

LFLFLFLFF



 3 3 E

FFRFFRFRRF
 `;
        var result = parser(text);

        expect(result).to.deep.equal({
            lawn: {
                width: 5,
                height: 5,
            },
            mowers: [{
                init: {
                    x: 1,
                    y: 2,
                    direction: 'N',
                },
                instructions: ['L', 'F', 'L', 'F', 'L', 'F', 'L', 'F', 'F'],
            }, {
                init: {
                    x: 3,
                    y: 3,
                    direction: 'E',
                },
                instructions: ['F', 'F', 'R', 'F', 'F', 'R', 'F', 'R', 'R', 'F'],
            }],
        });
    });

    it('should parse with no mowers', function() {
        var text = `5 5`;
        var result = parser(text);

        expect(result).to.deep.equal({
            lawn: {
                width: 5,
                height: 5,
            },
            mowers: [],
        });
    });

    describe('should accept different lawn coordinate formats', function() {
        var tests = [
            { desc: '1 digit', arg: '7 1', expected: {width: 7, height: 1} },
            { desc: 'several digits', arg: '879 26', expected: {width: 879, height: 26} },
            { desc: 'with more spaces', arg: ' 42  42 ', expected: {width: 42, height: 42} },
            { desc: 'with tab separator', arg: '42\t42', expected: {width: 42, height: 42} },
        ];

        tests.forEach(function(test) {
            it(test.desc, function() {
                var result = parser(test.arg);
                expect(result).to.deep.equal({
                    lawn: test.expected,
                    mowers: [],
                });
            });
        });
    });

    it('should parse mowers with no instructions', function() {
        var text = `
100 100
1 1 N
2 2 N
F
3 3 N
`;
        var result = parser(text);

        expect(result).to.deep.equal({
            lawn: {
                width: 100,
                height: 100,
            },
            mowers: [{
                init: {
                    x: 1,
                    y: 1,
                    direction: 'N',
                },
                instructions: [],
            }, {
                init: {
                    x: 2,
                    y: 2,
                    direction: 'N',
                },
                instructions: ['F'],
            }, {
                init: {
                    x: 3,
                    y: 3,
                    direction: 'N',
                },
                instructions: [],
            }],
        });
    });

    describe('should accept different mower coordinate formats', function() {
        var tests = [
            { desc: '1 digit', coord: '1 9 N', expected: {x: 1, y: 9, direction: 'N'} },
            { desc: 'several digits', coord: '456 123789 N', expected: {x: 456, y: 123789, direction: 'N'} },
            { desc: 'with more spaces', coord: ' 42  42   N ', expected: {x: 42, y: 42, direction: 'N'} },
            { desc: 'with tab separator', coord: '42\t42\tN', expected: {x: 42, y: 42, direction: 'N'} },
            { desc: 'East direction', coord: '0 0 E', expected: {x: 0, y: 0, direction: 'E'} },
            { desc: 'West direction', coord: '0 0 W', expected: {x: 0, y: 0, direction: 'W'} },
            { desc: 'South direction', coord: '0 0 S', expected: {x: 0, y: 0, direction: 'S'} },
        ];

        tests.forEach(function(test) {
            it(test.desc, function() {
                var text = '1000 1000\n' + test.coord;
                var result = parser(text);
                expect(result).to.deep.equal({
                    lawn: {
                        width: 1000,
                        height: 1000,
                    },
                    mowers: [{
                        init: test.expected,
                        instructions: [],
                    }],
                });
            });
        });
    });

    describe('should throw', function() {
        describe('when giving wrong argument', function() {
            var tests = [
                { desc: 'as undefined', arg: undefined },
                { desc: 'as null', arg: null },
                { desc: 'as number', arg: 42 },
                { desc: 'as object', arg: {width: 5, height: 5} },
            ];

            tests.forEach(function(test) {
                var parseFunction = function() {
                    parser(test.arg);
                };

                it(test.desc, function() {
                    expect(parseFunction).to.throw();
                });
            });
        });

        describe('when lawn is badly formated', function() {
            var tests = [
                { desc: 'with negative number (1st argument)', lawn: '-1 42' },
                { desc: 'with negative number (2nd argument)', lawn: '1 -42' },
                { desc: 'with float number (1st argument)', lawn: '1.5 42' },
                { desc: 'with float number (2nd argument)', lawn: '1 4.2' },
                { desc: 'with not number (1st argument)', lawn: 'N 42' },
                { desc: 'with not number (2nd argument)', lawn: '1 E' },
                { desc: 'with additional argument', lawn: '1 4 2' },
            ];

            tests.forEach(function(test) {
                var parseFunction = function() {
                    parser(test.lawn);
                };

                it(test.desc, function() {
                    expect(parseFunction).to.throw();
                });
            });
        });

        describe('when mower is badly formated', function() {
            var tests = [
                { desc: 'with negative number (1st argument)', coord: '-1 42 N' },
                { desc: 'with negative number (2nd argument)', coord: '1 -42 N' },
                { desc: 'with float number (1st argument)', coord: '1.5 42 N' },
                { desc: 'with float number (2nd argument)', coord: '1 4.2 N' },
                { desc: 'with not number (1st argument)', coord: 'N 42 N' },
                { desc: 'with not number (2nd argument)', coord: '1 E N' },
                { desc: 'with wrong directional letter', coord: '1 42 A' },
                { desc: 'with additional argument', coord: '1 4 2 N' },
            ];

            tests.forEach(function(test) {
                var parseFunction = function() {
                    var text = '100 100\n' + test.coord;
                    parser(text);
                };

                it(test.desc, function() {
                    expect(parseFunction).to.throw();
                });
            });
        });

        it('when mower instructions are badly formated', function() {
            var parseFunction = function() {
                var text = `
100 100
5 5 N
FFFAF
                `;
                parser(text);
            };

            expect(parseFunction).to.throw();
        });
    });

});