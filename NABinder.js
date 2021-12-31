import NAObject from './NAObject';
import NAArray from './NAArray';

class NABinder {
  constructor(object) {
    this.object = object;
    this.binderItems = [];
  }

  bind({to, keyPath, adapter = DefaultAdapter, oneway = false}) {
    this.binderItems.push(new NABinderItem(this.object).bind({to, keyPath, adapter, oneway}));
    return this;
  }

  unbind() {
    this.binderItems.forEach((binderItem) => binderItem.unbind());
    this.binderItems.splice(0, this.binderItems.length);
  }
}

class NABinderItem {
  constructor(object) {
    if (!object.__observableContext) {
      throw new Error('object must have __observableContext.');
    }

    this.object = object;

    this._observer = this._observer.bind(this);
    this._changeListener = this._changeListener.bind(this);
  }

  bind({to, keyPath, adapter, oneway}) {
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

    this.keyPath = keyPath;
    this.adapter = adapter;
    this.oneway = oneway;
    this.target = to;

    if (!this.oneway) {
      this.target.addEventListener('change', this._changeListener);
    }

    this.object.addObserver(this, this._observer);

    let {subject, property} = this._subjectWithProperty();
    this.adapter.setValueToNode(subject[property], this.target);

    return this;
  }

  unbind() {
    this.object.removeObserver(this);

    if (!this.oneway) {
      this.target.removeEventListener('change', this._changeListener)
    }
  }

  _subjectWithProperty() {
    let keys = this.keyPath.split('.');
    let subject = this.object;

    for (var i = 0; i < keys.length; ++i) {
      let property = keys[i];

      if (i + 1 == keys.length) {
        return {subject, property};
      }
      else {
        subject = subject[property];
        if (!subject) {
          throw new Error(`property of "${property}" in "${keyPath}" not exists.`);
        }
        if (!subject.__observableContext) {
          throw new Error(`property of "${property}" in "${keyPath}" must have __observableContext.`);
          throw new Error('object must have __observableContext.');
        }
      }
    }
  }

  _observer(event, {sender, keyPath, value}) {
    if (this._mutatingSubject) {
      return;
    }

    if (sender === this.object && keyPath == this.keyPath && [NAObject.EventChange, NAArray.EventChange].includes(event)) {
      this.adapter.setValueToNode(value, this.target);
    }
  }

  _changeListener(e) {
    let {subject, property} = this._subjectWithProperty();

    this._mutatingSubject = true;
    subject[property] = this.adapter.valueFromNode(e.target);
    this._mutatingSubject = false;
  }
}

const DefaultAdapter = {
  valueFromNode: function (node) {
    return node.value;
  },
  setValueToNode: function (value, node) {
    switch (node.tagName) {
    case 'INPUT':
    case 'SELECT':
    case 'TEXTAREA':
      node.value = value;
      break;
    default:
      node.innerText = value;
      break;
    }
  }
};

NABinder.DefaultAdapter = DefaultAdapter;

export default NABinder;
