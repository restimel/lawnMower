var expect = require('chai').expect;
var Lawn = require('../modules/Lawn');

describe('Lawn', function () {
    describe('Creating a new instance', function () {
        it('should have public methods', function () {
            var lawn = new Lawn(5, 5);

            expect(typeof lawn.isAccessible).to.equal('function');
        });

        describe('should throw', function () {
            it('when width is wrong', function() {
                var tests = [-1, 4.2, undefined, '2', []]

                tests.forEach(function(test) {
                    var f = function() {
                        new Lawn(test, 5);
                    };

                    expect(f).to.throw();
                });
            });

            it('when height is wrong', function() {
                var tests = [-1, 4.2, undefined, '2', []]

                tests.forEach(function (test) {
                    var f = function () {
                        new Lawn(5, test);
                    };

                    expect(f).to.throw();
                });
            });
        });
    });

    describe('isAccessible()', function() {
        it('should accept positions inside', function() {
            var lawn = new Lawn(10, 10);

            expect(lawn.isAccessible(1, 1)).to.equal(true);
            expect(lawn.isAccessible(2, 7)).to.equal(true);
            expect(lawn.isAccessible(9, 3)).to.equal(true);
        });

        it('should accept positions at edge', function () {
            var lawn = new Lawn(10, 10);

            expect(lawn.isAccessible(0, 0)).to.equal(true);
            expect(lawn.isAccessible(10, 10)).to.equal(true);
            expect(lawn.isAccessible(0, 10)).to.equal(true);
            expect(lawn.isAccessible(10, 0)).to.equal(true);
            expect(lawn.isAccessible(3, 10)).to.equal(true);
            expect(lawn.isAccessible(3, 0)).to.equal(true);
            expect(lawn.isAccessible(0, 7)).to.equal(true);
            expect(lawn.isAccessible(10, 7)).to.equal(true);
        });


        it('should forbid positions outside', function () {
            var lawn = new Lawn(10, 10);

            expect(lawn.isAccessible(-1, 7)).to.equal(false);
            expect(lawn.isAccessible(3, -1)).to.equal(false);
            expect(lawn.isAccessible(20, 7)).to.equal(false);
            expect(lawn.isAccessible(3, 70)).to.equal(false);
            expect(lawn.isAccessible(-15, -100)).to.equal(false);
            expect(lawn.isAccessible(40, -3)).to.equal(false);
            expect(lawn.isAccessible(40, 70)).to.equal(false);
            expect(lawn.isAccessible(-20, 70)).to.equal(false);
        });

        it('should support rectangular lawn', function () {
            var lawn1 = new Lawn(100, 10);

            expect(lawn1.isAccessible(50, 5)).to.equal(true);
            expect(lawn1.isAccessible(5, 50)).to.equal(false);

            var lawn2 = new Lawn(10, 100);

            expect(lawn2.isAccessible(50, 5)).to.equal(false);
            expect(lawn2.isAccessible(5, 50)).to.equal(true);
        });
    });
});
