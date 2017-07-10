import _ from 'lodash';

function Model(attrs) {
  _.extend(this, attrs);

  this._observers = [];

  this._proxy = new Proxy(this, {
    set: function(target, prop, value) {
      var oldValue = target[prop];
      Reflect.set(target, prop, value);
      target._notify(Model.Event.PropertyChange, target._proxy, prop, value, oldValue);
      return true;
    }
  });

  return this._proxy;
}

Model.Event = {
  PropertyChange: 'Model:Event:PropertyChange'
};

_.extend(Model.prototype, {
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

export default Model;
