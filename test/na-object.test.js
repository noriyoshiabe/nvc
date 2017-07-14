import assert from 'power-assert';
import NAObject from '../src/na-object';

describe("property change", () => {
  it("callback", (done) => {
    let object = new NAObject();
    object.addObserver(this, (event, sender, prop, newValue, oldValue) => {
      assert(event === NAObject.Event.PropertyChange);
      assert(sender === object);
      assert(prop === 'test');
      assert(newValue === 1);
      assert(oldValue === undefined);
      done();
    });

    object.test = 1;
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
