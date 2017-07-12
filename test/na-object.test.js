import assert from 'power-assert';
import NAObject from '../src/na-object';

describe("property change", () => {
  it("callback", () => {
    let object = new NAObject();
    object.addObserver(this, (event, sender, prop, newValue, oldValue) => {
      assert(event === NAObject.Event.PropertyChange);
      assert(sender === object);
      assert(prop === 'test');
      assert(newValue === 1);
      assert(oldValue === undefined);
    });

    object.test = 1;
  });
});
