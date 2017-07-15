import NAObject from './NAObject';
import NAFormatter from './NAFormatter';

class NABinder {
  constructor(object) {
    if (!(object instanceof NAObject)) {
      throw new Error('object must be instance of NAObject.');
    }

    this.object = object;

    this._observer = this._observer.bind(this);
    this._changeListener = this._changeListener.bind(this);
  }

  bind({to = undefined, keyPath = undefined, formatter = NAFormatter}) {
    if (!to) {
      throw new Error('to argument is required.');
    }
    if (!(to instanceof window.HTMLElement)) {
      throw new Error('to argument must be HTMLElement.');
    }
    if (!keyPath) {
      throw new Error('keyPath argument is required.');
    }
    if (!keyPath.length) {
      throw new Error('keyPath argument is at least 1 charactor.');
    }

    let keys = keyPath.split('.');
    let subject = this.object;

    for (var i = 0; i < keys.length; ++i) {
      let property = keys[i];

      if (i + 1 == keys.length) {
        this.subject = subject;
        this.property = property;
        this.formatter = formatter;
        this.target = to;

        this.subject.addObserver(this, this._observer);
        this.target.addEventListener('change', this._changeListener);

        this._setValueToElement(this.target, this.formatter.objectToNode(this.subject[this.property]));
      }
      else {
        subject = subject[property];
        if (!subject) {
          throw new Error(`property of "${property}" in "${keyPath}" not exists.`);
        }
        if (!(subject instanceof NAObject)) {
          throw new Error(`property of "${property}" in "${keyPath}" must be instance of NAObject.`);
        }
      }
    }

    return this;
  }

  unbind() {
    if (this.subject) {
      this.subject.removeObserver(this);
    }

    if (this.target) {
      this.target.removeEventListener('change', this._changeListener)
    }
  }

  _observer(event, sender, prop, newValue, oldValue) {
    if (this._mutatingSubject) {
      return;
    }

    if (NAObject.Event.PropertyChange == event && prop == this.property) {
      this._setValueToElement(this.target, this.formatter.objectToNode(newValue));
    }
  }

  _changeListener(e) {
    this._mutatingSubject = true;
    this.subject[this.property] = this.formatter.nodeToObject(e.target.value);
    this._mutatingSubject = false;
  }

  _setValueToElement(element, value) {
    switch (element.tagName) {
    case 'INPUT':
    case 'SELECT':
    case 'TEXTAREA':
      element.value = value;
      break;
    default:
      element.innerText = value;
      break;
    }
  }
}

export default NABinder;
