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

  it("setter override", () => {
    class Hoge extends NAObject {
      setTestVal(val) {
        assert(this.testVal === undefined);
        assert(val == 3);
        this.proxy.testVal = val;
        assert(this.testVal == 3);
      }
    }

    let hoge = new Hoge();
    let event;
    let prop;
    hoge.addObserver(this, (_event, _sender, _prop) => {
      event = _event;
      prop = _prop;
    });
    hoge.testVal = 3;

    assert(event == NAObject.Event.PropertyChange);
    assert(prop == 'testVal');
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
