import NAObject from './NAObject';

class NAView extends NAObject {
  bindItems = new Map();

  constructor(source) {
    super({element: elementFromSource(source)});

    let propertyElements = this.element.querySelectorAll('*[na-view-property]');

    for (var element of propertyElements) {
      if (this._isRootElementNearestAncestorView(element)) {
        let propertyName = element.getAttribute('na-view-property');

        if (this[propertyName]) {
          throw new Error(`Property name [${propertyName}] conflicts.`);
        }

        this[propertyName] = element;
      }
    }

    let viewElements = this.element.querySelectorAll('*[na-view]');
    for (var element of viewElements) {
      if (this._isRootElementNearestAncestorView(element)) {
        let viewName = element.getAttribute('na-view');

        if (this[viewName]) {
          throw new Error(`Property name [${viewName}] conflicts.`);
        }

        this[viewName] = new NAView(element);
      }
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  bind(viewName, {to, keyPath, adapter = BindAdapter, oneway = false}) {
    this.unbind(viewName);
    this.bindItems.set(viewName, new BindItem({node: this[viewName], object: to, keyPath, adapter, oneway}).bind());
  }

  unbind(viewName) {
    let item = this.bindItems.get(viewName)?.unbind();
    if (item) {
      this.bindItems.delete(viewName);
    }
  }

  unbindAll() {
    this.bindItems.forEach((bindItem, a, b) => bindItem.unbind());
    this.bindItems.clear();
  }

  _isRootElementNearestAncestorView(element) {
    element = element.parentNode;

    while (null != element) {
      if (this.element == element) {
        return true;
      }

      if (element.hasAttribute('na-view')) {
        return false;
      }

      element = element.parentNode;
    }

    throw new Error(`Should never be reached.`);
  }
}

const elementFromSource = (source) => {
  switch (typeof source) {
  case 'string':
    let element = window.document.createElement('div');
    element.innerHTML = source;
    if (1 == element.children.length) {
      let firstChild = element.children[0];
      element.removeChild(firstChild);
      return firstChild;
    }
    else {
      return element;
    }
  case 'object':
    if (!(source instanceof window.Node)) {
      throw new Error('Unsupported source type');
    }

    switch (source.tagName) {
    case 'TEMPLATE':
      let documentFragemnt = window.document.importNode(source.content, true);
      if (1 == documentFragemnt.children.length) {
        return documentFragemnt.firstElementChild;
      }
      else {
        let element = window.document.createElement('div');
        element.appendChild(documentFragemnt);
        return element;
      }
    default:
      return source;
    }
  default:
    throw new Error('Unsupported source type');
  }
}

class BindItem {
  constructor({node, object, keyPath, adapter, oneway}) {
    this.node = node;
    this.object = object;
    this.keys = keyPath.split('.');
    this.adapter = adapter;
    this.oneway = oneway;

    this._observer = this._observer.bind(this);
    this._changeListener = this._changeListener.bind(this);
  }

  bind() {
    let {subject, property} = this._subjectWithProperty();
    this.adapter.setValueToNode(subject[property], this.node);

    this.object.addObserver(this, this._observer);

    if (!this.oneway) {
      this.node.addEventListener('change', this._changeListener);
    }

    return this;
  }

  unbind() {
    this.object.removeObserver(this);

    if (!this.oneway) {
      this.node.removeEventListener('change', this._changeListener)
    }

    return this;
  }

  _subjectWithProperty() {
    let subject = this.object;

    for (var i = 0; i < this.keys.length; ++i) {
      let property = this.keys[i];

      if (i + 1 == this.keys.length) {
        return {subject, property};
      }
      else {
        subject = subject[property];
        if (!subject) {
          throw new Error(`property of "${property}" in "${this.keys.join('.')}" not exists.`);
        }
      }
    }
  }

  _observer(sender, event) {
    if (this._mutatingSubject) {
      return;
    }
    if (NAObject.EventChange != event) {
      return;
    }

    let {subject, property} = this._subjectWithProperty();
    this.adapter.setValueToNode(subject[property], this.node);
  }


  _changeListener(e) {
    let {subject, property} = this._subjectWithProperty();
    this._mutatingSubject = true;
    subject[property] = this.adapter.valueFromNode(e.target);
    this.object.triggerChange();
    this._mutatingSubject = false;
  }
}

class BindAdapter {
  static valueFromNode(node) {
    return node.value;
  }

  static setValueToNode(value, node) {
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
}

NAView.BindAdapter = BindAdapter;

export default NAView;
