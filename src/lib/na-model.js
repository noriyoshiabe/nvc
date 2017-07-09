import _ from 'lodash';

export default class Model {
  static Event = {
    PropertyChange: 'Model:Event:PropertyChange'
  };

  properties() {
    return [];
  }

  constructor(attrs) {
    this._observers = [];
    this._attrs = _.pick(attrs, this.properties());
    _.extend(_.pick(attrs, _.difference(_.keys(attrs), this.properties())));

    _.each(this.properties(), (key) => {
      Object.defineProperty(this, key, {
        set: (v) => {
          let old = this._attrs[key];
          this._attrs[key] = v;
          this._notify(Model.Event.PropertyChange, key, v, old);
        },
        get: () => {
          return this._attrs[key];
        }
      });
    });
  }

  addObserver(observer, func) {
    this._observers.push({observer: observer, func: func.bind(observer)})
  }

  removeObserver(observer) {
    _.remove(this._observers, {observer})
  }

  _notify(event, prop, newValue, oldValue) {
    _.each(this._observers, (elem) => {
      elem.func(this, event, prop, newValue, oldValue);
    });
  }
}
