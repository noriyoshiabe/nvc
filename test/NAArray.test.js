import assert from 'power-assert';
import { NAArray } from '../nvc';

describe("notify", () => {
  it("length", (done) => {
    let array = new NAArray();
    array.addObserver(this, (event, {sender, keyPath, value, oldValue}) => {
      if (NAArray.EventChange === event && keyPath == 'length') {
        assert(sender === array);
        assert(value === 1);
        assert(oldValue === 0);
        done();
      }
    })
    array.push(1);
  });
});

describe("remove observer", () => {
  it("not callback", () => {
    let array = new NAArray();
    array.addObserver(this, () => {
      shoudNotBeReached
    });
    array.removeObserver(this);
    array.push(1);
  });
});
