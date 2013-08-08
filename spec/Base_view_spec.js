
define(['../public/js/views/BaseView'], function(BaseView) {


        (function () {
        describe("Base Tests", function () {
            var base = new BaseView();
            it("should have an initiate function", function () {
                expect(base.initArgs).to.be.ok;
            });
           it("should have loading function", function () {
                expect(base.startLoad).to.be.ok;
            }); 
           it("should have fadeInViewElements function", function () {
                expect(base.fadeInViewElements).to.be.ok;
            });
           it("should have a function", function () {
                expect(base.close).to.be.ok;
            });
           it("should have bindTo function", function () {
                expect(base.bindTo).to.be.ok;
            });
           it("should have bindToControl function", function () {
                expect(base.bindToControl).to.be.ok;
            });
           it("should have eachSubview function", function () {
                expect(base.eachSubview).to.be.ok;
            });
           it("should have unbindEventsToView function", function () {
                expect(base.unbindEventsToView).to.be.ok;
            });
           it("should have unbindControlEventsFromView function", function () {
                expect(base.unbindControlEventsFromView).to.be.ok;
            });
           it("should have unbindFromAll function", function () {
                expect(base.unbindFromAll).to.be.ok;
            });
           it("should have unbindFromAllControls function", function () {
                expect(base.unbindFromAllControls).to.be.ok;
            });
           it("should have addSubView function", function () {
                expect(base.addSubView).to.be.ok;
            });
           it("should have removeSubView function", function () {
                expect(base.removeSubView).to.be.ok;
            });
           it("should have reRender function", function () {
                expect(base.reRender).to.be.ok;
            });
           it("should have closeSubviews function", function () {
                expect(base.closeSubviews).to.be.ok;
            });
        });
    })();
});
