import assert from 'power-assert';
import { NAObject } from '../nvc';

describe("trigger change", () => {
  it("callback", (done) => {
    let object = new NAObject();
    object.addObserver(this, (sender, event) => {
      assert(sender === object);
      assert(event === NAObject.EventChange);
      done();
    });
    object.triggerChange();
  });
});

describe("remove observer", () => {
  it("not callback", () => {
    let object = new NAObject();
    object.addObserver(this, () => {
      shoudNotBeReached
    });
    object.removeObserver(this);
    object.triggerChange();
  });
});
