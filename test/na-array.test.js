import assert from 'power-assert';
import _ from 'lodash';
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
  let array;
  let events;
  beforeEach(() => {
    array = new NAArray(1,2,3);
    events = [];
    array.addObserver(this, (event, sender, index, value) => {
      events.push(event);
    });
  });

  it("Not support copyWithin", () => {
    assert.throws(() => { array.copyWithin(0,2); }, Error);
  });

  it("Not Support fill", () => {
    assert.throws(() => { array.fill(1, 0, 100); }, Error);
  });

  it("pop", () => {
    assert(3 == array.pop());
    assert(2 == array.length);
    assert(2 == _.last(array));
    assert(_.isEqual(events, [NAArray.Event.LengthChange, NAArray.Event.Remove]));
  });

  it("push", () => {
    array.push(1, 2);
    assert(5 == array.length);
    assert(2 == _.last(array));
    assert(_.isEqual(events, [NAArray.Event.LengthChange, NAArray.Event.Add, NAArray.Event.Add]));
  });

  it("reverse", () => {
    array.reverse();
    assert(3 == _.first(array));
    assert(1 == _.last(array));
    assert(_.isEqual(events, [NAArray.Event.Sort]));
  });

  it("shift", () => {
    assert(1 == array.shift());
    assert(2 == array.length);
    assert(2 == _.first(array));
    assert(_.isEqual(events, [NAArray.Event.LengthChange, NAArray.Event.Remove]));
  });

  it("splice insert", () => {
    array.splice(1, 0, 100, 200);
    assert(5 == array.length);
    assert(_.isEqual([1,100,200,2,3], array));
    assert(_.isEqual(events, [NAArray.Event.LengthChange, NAArray.Event.Add, NAArray.Event.Add]));
  });

  it("splice remove", () => {
    array.splice(1, 1);
    assert(2 == array.length);
    assert(_.isEqual([1,3], array));
    assert(_.isEqual(events, [NAArray.Event.LengthChange, NAArray.Event.Remove]));
  });

  it("splice remove and insert", () => {
    array.splice(1, 1, 100);
    assert(3 == array.length);
    assert(_.isEqual([1,100, 3], array));
    assert(_.isEqual(events, [NAArray.Event.Remove, NAArray.Event.Add]));
  });

  it("unshift", () => {
    array.unshift(100, 200);
    assert(100 == _.first(array));
    assert(5 == array.length);
    assert(_.isEqual(events, [NAArray.Event.LengthChange, NAArray.Event.Add, NAArray.Event.Add]));
  });
});
