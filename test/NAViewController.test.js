import assert from 'assert';
import NAViewController from '../src/NAViewController';

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
});
