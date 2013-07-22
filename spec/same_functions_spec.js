
// Next Part working OK within the function

window.hello = function () {
  return "Hello World";
};

describe("Trying out the test libraries", function () {
  describe("Chai", function () {
    it("should be equal using 'expect'", function () {
      expect(hello()).to.equal("Hello World");
    });
  });

  var x= 4;
  describe("Test cached", function () {
  it("should pass on assertion", function () {
    expect(x).to.equal(4);
  });
});

  describe("Test failures", function () {
  it("should pass on assertion", function () {
    expect("hi").to.equal("hi");
    expect(x).to.equal(4);
  });

  it("should fail on unexpected exception", function () {
    throw new Error();
  });
  });
  describe("Test timing", function () {
  it("should be a fast test", function (done) {
    expect("hi").to.equal("hi");
    done();
  });

  it("should be a medium test", function (done) {
    setTimeout(function () {
      expect("hi").to.equal("hi");
      done();
    }, 40);
  });

  it("should be a slow test", function (done) {
    setTimeout(function () {
      expect("hi").to.equal("hi");
      done();
    }, 100);
  });

  it("should be a timeout failure", function (done) {
    setTimeout(function () {
      expect("hi").to.equal("hi");
      done();
    }, 2001);
  });
});
  'use strict';
(function () {
    describe('Give it some context', function () {
        describe('maybe a bit more context here', function () {
            it('should run here few assertions', function () {

            });
        });
    });
})();

});