import assert from 'power-assert';
import { NAViewController } from '../nvc';

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
