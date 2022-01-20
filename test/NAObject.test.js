import assert from 'assert';
import NAObject from '../src/NAObject';

describe("trigger change", () => {
  it("callback", (done) => {
    let object = new NAObject();
    object.addObserver({
      onNotify(sender, event) {
        assert(sender === object);
        assert(event === NAObject.EventChange);
        done();
      }
    });
    object.triggerChange();
  });
});

describe("remove observer", () => {
  it("not callback", () => {
    let object = new NAObject();
    let observer = {
      onNotify() {
        shoudNotBeReached
      }
    };
    object.addObserver(observer);
    object.removeObserver(observer);
    object.triggerChange();
  });
});
