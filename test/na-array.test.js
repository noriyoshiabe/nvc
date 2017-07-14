import assert from 'power-assert';
import NAArray from '../src/na-array';

describe("notify", () => {
  it("length", (done) => {
    let array = new NAArray();
    array.addObserver(this, (event, sender, newLength, oldLength) => {
      if (NAArray.Event.LengthChange === event) {
        assert(sender === array);
        assert(newLength == 1);
        assert(oldLength == 0);
        done();
      }
    })
    array.push(1);
  });

  it("add", (done) => {
    let array = new NAArray(1.0, 2.0);
    array.addObserver(this, (event, sender, index, value) => {
      if (NAArray.Event.Add === event) {
        assert(sender === array);
        assert(index == 2);
        assert(value == 3.0);
        done();
      }
    })
    array.push(3.0);
  });

  it("remove", (done) => {
    let array = new NAArray(1.0, 2.0);
    array.addObserver(this, (event, sender, index, value) => {
      if (NAArray.Event.Remove === event) {
        assert(sender === array);
        assert(index == 1);
        assert(value == 2.0);
        done();
      }
    })
    array.pop();
  });

  it("replace", (done) => {
    let array = new NAArray(1.0, 2.0, 3.0);
    array.addObserver(this, (event, sender, index, newValue, oldValue) => {
      if (NAArray.Event.Replace === event) {
        assert(sender === array);
        assert(index == 1);
        assert(newValue == 5.0);
        assert(oldValue == 2.0);
        done();
      }
    })
    array[1] = 5.0;
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

describe("function", () => {
  it("Not support copyWithin", () => {
    let array = new NAArray(1,2,3);
    assert.throws(() => { array.copyWithin(0,2); }, Error);
  });

  it("Not Support fill", () => {
    let array = new NAArray(1,2,3);
    assert.throws(() => { array.fill(1, 0, 100); }, Error);
  });

  ...
});
