import _ from 'lodash';

function NAObject(attrs) {
  _.extend(this, attrs);

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

NAObject.Event = {
  PropertyChange: 'NAObject:PropertyChange'
};

_.extend(NAObject.prototype, {
  addObserver: function (observer, func) {
    this._observers.push({observer: observer, func: func})
  },

  removeObserver: function (observer) {
    _.remove(this._observers, {observer})
  },

  _notify: function (event, vaArgs) {
    for (var i = 0; i < this._observers.length; ++i) {
      var elem = this._observers[i]
      elem.func.apply(elem.observer, arguments)
    }
  },
});

export default NAObject;
