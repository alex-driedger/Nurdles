
//define(['../public/js/models/Layer'], function(Layer) {
//define(['../public/js/models/Filter'], function(Filter) {
define(['../public/js/views/map/MapView'], function(MapView) {
//define(['../public/js/views/BaseView'], function(BaseView) {

    // Next Part working OK within the function

        (function () {
        describe(" MapView Tests", function () {
            var map = new MapView();
            it("should have an map function'", function () {
                expect(map.initialize).to.be.ok;
            });
        });
        /*describe("Base Tests", function () {
            var base = new BaseView();
            it("should have an update function'", function () {
                expect(base.initArgs).to.be.ok;
            });
        });*/
       /* describe("Filter Tests", function () {
            var filter = new Filter();
            it("should have a filter function'", function () {
                expect(filter.initialize).to.be.ok;
            });
        });*/
            'use strict';
            (function () {
                describe('Give it some context', function () {
                    describe('maybe a bit more context here', function () {
                        it('should run here few assertions', function () {

                        });
                    });
                });
            })();
    })();
});
