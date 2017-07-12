function NAArray() {
  let array = Reflect.construct(Array, arguments, NAArray);

  array._observers = [];

  array._proxy = new Proxy(array, {
    set: function(target, prop, value) {
      var oldValue = target[prop];
      var oldLength = target.length;

      Reflect.set(target, prop, value);

      switch (prop) {
      case 'length':
        target._notify(NAArray.Event.LengthChange, this._proxy, prop, target.length, oldLength);
        break;
      default:
        if (!isNaN(prop) && !target._mutatingSelf) {
          target._notify(NAArray.Event.Replace, this._proxy, Number(prop), value, oldValue);
        }
      }

      return true;
    },
  });

  return array._proxy;
}

Reflect.setPrototypeOf(NAArray.prototype, Array.prototype);
Reflect.setPrototypeOf(NAArray, Array);

const Event = {
  Add: 'NAArray:Add',
  Remove: 'NAArray:Remove',
  Replace: 'NAArray:Replace',
  Sort: 'NAArray:Sort',
  LengthChange: 'NAArray:LengthChange',
};
NAArray.Event = Event;

Object.assign(NAArray.prototype, {
  addObserver: function (observer, func) {
    this._observers.push({observer: observer, func: func})
  },

  removeObserver: function (observer) {
    let index = this._observers.indexOf(observer);
    for (let i = this._observers.length; 0 <= i; --i) {
      if (this._observers[i].observer === observer) {
        this._observers.splice(i, 1);
      }
    }
  },

  copyWithin: function (target, start, end) {
    throw new Error('copyWithin() is not suppoted on NAArray.');
  },

  fill: function (value, start, end) {
    throw new Error('fill() is not suppoted on NAArray.');
  },

  pop: function () {
    this._mutatingSelf = true;
    let last = Array.prototype.pop.call(this);
    this._mutatingSelf = false;

    if (last) {
      this._notify(NAArray.Event.Remove, this._proxy, this.length, last);
    }
    return last;
  },

  push: function (vaArgs) {
    let index = this.length;

    this._mutatingSelf = true;
    let ret = Array.prototype.push.call(this, arguments);
    this._mutatingSelf = false;

    for (let i = 0; i < arguments.length; ++i) {
      this._notify(NAArray.Event.Add, this._proxy, index++, arguments[i]);
    }

    return ret;
  },

  reverse: function () {
    this._mutatingSelf = true;
    Array.prototype.reverse.call(this);
    this._mutatingSelf = false;

    this._notify(NAArray.Event.Sort, this._proxy);
    return this._proxy;
  },

  shift: function () {
    this._mutatingSelf = true;
    let first = Array.prototype.shift.call(this);
    this._mutatingSelf = false;

    if (first) {
      this._notify(NAArray.Event.Remove, this._proxy, 0, first);
    }
    return first;
  },

  sort: function (comparator) {
    this._mutatingSelf = true;
    Array.prototype.sort.call(this, comparator);
    this._mutatingSelf = false;

    this._notify(NAArray.Event.Sort, this._proxy);
    return this._proxy;
  },

  splice: function (index, howMany, vaArgs) {
    let _index = 0 > index ? this.length + index : index;
    _index = Math.max(0, _index);
    _index = Math.min(this.length, _index);

    let _willNotifyRemoved = [];
    let _howMany = howMany;
    for (let i = _index; i < this.length && 0 < _howMany; ++i, _howMany--) {
      _willNotifyRemoved.push(this[i]);
    }

    this._mutatingSelf = true;
    let ret = Array.prototype.splice.call(this, arguments);
    this._mutatingSelf = false;

    for (let i = 0; i < _willNotifyRemoved.length; ++i) {
      this._notify(NAArray.Event.Remove, this._proxy, _index + i, _willNotifyRemoved[i]);
    }

    for (let i = 2; i < arguments.length; ++i) {
      this._notify(NAArray.Event.Add, this._proxy, _index + i - 2, arguments[i]);
    }

    return ret;
  },

  unshift: function (vaArgs) {
    let index = 0;

    this._mutatingSelf = true;
    let ret = Array.prototype.unshift.call(this, arguments);
    this._mutatingSelf = false;

    for (let i = 0; i < arguments.length; ++i) {
      this._notify(NAArray.Event.Add, this._proxy, index++, arguments[i]);
    }

    return ret;
  },

  _notify: function (event, vaArgs) {
    for (let i = 0; i < this._observers.length; ++i) {
      let elem = this._observers[i]
      elem.func.apply(elem.observer, arguments)
    }
  },
});

export default NAArray;
