import assert from 'power-assert';
import { NAObject } from '../nvc';

describe("property change", () => {
  it("callback", (done) => {
    let object = new NAObject({hoge: {}});
    object.addObserver(this, (event, {sender, keyPath, value, oldValue}) => {
      assert(event === NAObject.EventChange);
      assert(sender === object);
      assert(keyPath === 'hoge.test');
      assert(value === 1);
      assert(oldValue === undefined);
      done();
    });

    object.hoge.test = 1;
  });
});

describe("remove observer", () => {
  it("not callback", () => {
    let object = new NAObject();
    object.addObserver(this, () => {
      shoudNotBeReached
    });
    object.removeObserver(this);
    object.test = 1;
  });
});
