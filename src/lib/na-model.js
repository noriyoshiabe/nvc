import _ from 'lodash';

function Model(attrs) {
  _.extend(this, attrs);

  this._observers = [];

  this._proxy = new Proxy(this, {
    set: function(target, prop, value) {
      var oldValue = target[prop];
      Reflect.set(target, prop, value);
      target._notify(Model.Event.PropertyChange, prop, value, oldValue);
    }
  });

  return this._proxy;
}

Model.Event = {
  PropertyChange: 'Model:Event:PropertyChange'
};

_.extend(Model.prototype, {
  addObserver: function (observer, func) {
    this._observers.push({observer: observer, func: func.bind(observer)})
  },

  removeObserver: function (observer) {
    _.remove(this._observers, {observer})
  },

  _notify: function (event, prop, newValue, oldValue) {
    _.each(this._observers, (elem) => {
      elem.func(this._proxy, event, prop, newValue, oldValue);
    });
  },
});

export default Model;
