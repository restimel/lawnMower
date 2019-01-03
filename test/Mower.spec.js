var expect = require('chai').expect;
var Mower = require('../modules/Mower');

/* Mockups */

var LawnMockup = {
    isAccessible: function() {
        return true;
    },
};
var LawnMockupOutside = {
    isAccessible: function() {
        return false;
    },
};

/* Tests */

describe('Mower', function() {
    describe('Creating a new instance', function() {
        it('should have public methods', function() {
            var mower = new Mower(5, 5, 'N', LawnMockup);

            expect(typeof mower.move).to.equal('function');
            expect(typeof mower.getPosition).to.equal('function');
        });

        it('should have been correctly initialized', function () {
            var mower = new Mower(5, 5, 'N', LawnMockup);

            expect(mower.getPosition()).to.equal('5 5 N');
        });

        describe('should throw', function () {
            it('when direction is wrong', function() {
                var f = function() {
                    new Mower(5, 5, 'R', LawnMockup);
                };

                expect(f).to.throw();
            });

            it('when coordinates are outside lawn', function() {
                var f = function() {
                    new Mower(5, 5, 'N', LawnMockupOutside);
                };

                expect(f).to.throw();
            });

            it('when X is wrong', function() {
                var tests = [1.5, undefined, '2', []]

                tests.forEach(function(test) {
                    var f = function() {
                        new Mower(test, 5, 'N', LawnMockup);
                    };

                    expect(f).to.throw();
                });
            });

            it('when Y is wrong', function() {
                var tests = [1.5, undefined, '2', []]

                tests.forEach(function (test) {
                    var f = function () {
                        new Mower(5, test, 'N', LawnMockup);
                    };

                    expect(f).to.throw();
                });
            });
        });
    });

    describe('getPosition()', function() {
        it('should return the current position', function () {
            var mower = new Mower(1, 0, 'W', LawnMockup);

            expect(mower.getPosition()).to.equal('1 0 W');

            mower.x = 3;
            expect(mower.getPosition()).to.equal('3 0 W');

            mower.y = 56;
            expect(mower.getPosition()).to.equal('3 56 W');

            mower.direction = 2;
            expect(mower.getPosition()).to.equal('3 56 S');
        });
    });

    describe('move()', function() {
        describe('should move forward', function () {
            var tests = [
                { desc: 'North', dir: 'N', expected: '5 6 N' },
                { desc: 'East', dir: 'E', expected: '6 5 E' },
                { desc: 'West', dir: 'W', expected: '4 5 W' },
                { desc: 'South', dir: 'S', expected: '5 4 S' },
            ];

            tests.forEach(function(test) {
                it(test.desc, function() {
                    var mower = new Mower(5, 5, test.dir, LawnMockup);
                    mower.move('F');
                    expect(mower.getPosition()).to.equal(test.expected);
                });
            });
        });

        it('should not move forward', function() {
            var mower = new Mower(5, 5, 'N', LawnMockup);
            mower.lawn = LawnMockupOutside;

            mower.move('F');
            expect(mower.getPosition()).to.equal('5 5 N');
        });

        describe('should rotate left', function () {
            var tests = [
                { desc: 'North', dir: 'N', expected: '5 5 W' },
                { desc: 'East', dir: 'E', expected: '5 5 N' },
                { desc: 'West', dir: 'W', expected: '5 5 S' },
                { desc: 'South', dir: 'S', expected: '5 5 E' },
            ];

            tests.forEach(function (test) {
                it('with initial direction ' + test.desc, function () {
                    var mower = new Mower(5, 5, test.dir, LawnMockup);
                    mower.move('L');
                    expect(mower.getPosition()).to.equal(test.expected);
                });
            });
        });

        describe('should rotate right', function () {
            var tests = [
                { desc: 'North', dir: 'N', expected: '5 5 E' },
                { desc: 'East', dir: 'E', expected: '5 5 S' },
                { desc: 'West', dir: 'W', expected: '5 5 N' },
                { desc: 'South', dir: 'S', expected: '5 5 W' },
            ];

            tests.forEach(function (test) {
                it('with initial direction ' + test.desc, function () {
                    var mower = new Mower(5, 5, test.dir, LawnMockup);
                    mower.move('R');
                    expect(mower.getPosition()).to.equal(test.expected);
                });
            });
        });

        describe('should throw', function() {
            var mower = new Mower(5, 5, 'N', LawnMockup);

            it('when argument is not string', function() {
                var f = function() {
                    mower.move(1);
                };
                expect(f).to.throw();
            });

            it('when argument is not instruction', function () {
                var f = function () {
                    mower.move('N');
                };
                expect(f).to.throw();
            });
        });
    });
});
