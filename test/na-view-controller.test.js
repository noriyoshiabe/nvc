import assert from 'power-assert';
import NAViewController from '../src/na-view-controller';

describe("destroy", () => {
  it("call view's destroy", () => {
    let shouldBeCalled = false;
    let vc = new NAViewController({
      destroy: function () {
        shouldBeCalled = true;
      }
    })

    vc.destroy();
    assert(shouldBeCalled);
  });

  it("not abort even if view does not have destroy", () => {
    let shouldNotBeCalled = true;
    let vc = new NAViewController({
      hoge: function () {
        shouldNotBeCalled = false;
      }
    })

    vc.destroy();
    assert(shouldNotBeCalled);
  });
});
