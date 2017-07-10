import _ from 'lodash';

function NAArray() {
  let array = Reflect.construct(Array, arguments, NAArray);

  array._observers = [];

  array._proxy = new Proxy(array, {
    set: function(target, prop, value) {
      var oldValue = target[prop];
      Reflect.set(target, prop, value);
      if (!target._inSort) {
        switch (prop) {
        case 'length':
          target._notify(NAArray.Event.LengthChange, this._proxy, prop, value, oldValue);
          break;
        default:
          if (!isNaN(prop)) {
            target._notify(NAArray.Event.ElementChange, this._proxy, Number(prop));
          }
        }

        // TODO Consider notification strategy for view refresh
        //      reuse or interchange dom
      }
      return true;
    },
  });

  return array._proxy;
}

Reflect.setPrototypeOf(NAArray.prototype, Array.prototype);
Reflect.setPrototypeOf(NAArray, Array);

NAArray.Event = {
  LengthChange: 'NAArray:Event:LengthChange',
  ElementChange: 'NAArray:Event:ElementChange',
  Sort: 'NAArray:Event:Sort',
};

_.extend(NAArray.prototype, {
  addObserver: function (observer, func) {
    this._observers.push({observer: observer, func: func})
  },

  removeObserver: function (observer) {
    _.remove(this._observers, {observer})
  },

  sort: function (comparator) {
    this._inSort = true;
    Array.prototype.sort.call(this, comparator);
    this._inSort = false;
    this._notify(NAArray.Event.Sort, this._proxy);
  },

  _notify: function (event, vaArgs) {
    for (var i = 0; i < this._observers.length; ++i) {
      var elem = this._observers[i]
      elem.func.apply(elem.observer, arguments)
    }
  },
});

export default NAArray;
