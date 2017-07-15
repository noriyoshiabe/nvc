function NAObject(attrs) {
  Object.assign(this, attrs);

  this._observers = [];
  this._callingSetters = {};

  this.proxy = new Proxy(this, {
    set: function(target, prop, value) {
      let setterName = 'set' + prop.charAt(0).toUpperCase() + prop.slice(1);

      if (target[setterName] && !target._callingSetters[setterName]) {
        target._callingSetters[setterName] = true;
        target[setterName](value);
        delete target._callingSetters[setterName];
        return true;
      }

      let oldValue = target[prop];
      Reflect.set(target, prop, value);
      target.notify(NAObject.Event.PropertyChange, target.proxy, prop, value, oldValue);
      return true;
    }
  });

  return this.proxy;
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

  notify: function (event, vaArgs) {
    for (var i = 0; i < this._observers.length; ++i) {
      var elem = this._observers[i]
      elem.func.apply(elem.observer, arguments)
    }
  },
});

export default NAObject;
