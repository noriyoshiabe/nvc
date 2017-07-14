function NAObject(attrs) {
  Object.assign(this, attrs);

  this._observers = [];

  this._proxy = new Proxy(this, {
    set: function(target, prop, value) {
      let oldValue = target[prop];

      Reflect.set(target, prop, value);

      let setterName = prop.charAt(0).toUpperCase() + prop.slice(1);
      if (target[setterName]) {
        target[setterName](value);
      }

      target._notify(NAObject.Event.PropertyChange, target._proxy, prop, value, oldValue);
      return true;
    }
  });

  return this._proxy;
}

const Event = {
  PropertyChange: 'NAObject:PropertyChange'
};
NAObject.Event = Event;

Object.assign(NAObject.prototype, {
  addObserver: function (observer, func) {
    this._observers.push({observer: observer, func: func})
  },

  removeObserver: function (observer) {
    for (let i = this._observers.length - 1; 0 <= i; --i) {
      if (this._observers[i].observer === observer) {
        this._observers.splice(i, 1);
      }
    }
  },

  _notify: function (event, vaArgs) {
    for (var i = 0; i < this._observers.length; ++i) {
      var elem = this._observers[i]
      elem.func.apply(elem.observer, arguments)
    }
  },
});

export default NAObject;
