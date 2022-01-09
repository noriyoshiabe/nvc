import NAObject from './NAObject';

class NAView extends NAObject {
  bindItems = new Map();

  constructor(source) {
    super();
    this.element = this.#elementFromSource(source);

    this.element.querySelectorAll('*[na-view-property]').forEach(element => {
      if (this.#isRootElementNearestAncestorView(element)) {
        let propertyName = element.getAttribute('na-view-property');

        if (this[propertyName]) {
          throw new Error(`Property name [${propertyName}] conflicts.`);
        }

        this[propertyName] = element;
      }
    });

    this.element.querySelectorAll('*[na-view]').forEach(element => {
      if (this.#isRootElementNearestAncestorView(element)) {
        let viewName = element.getAttribute('na-view');

        if (this[viewName]) {
          throw new Error(`Property name [${viewName}] conflicts.`);
        }

        this[viewName] = new NAView(element);
      }
    });
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

  #isRootElementNearestAncestorView(element) {
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
  
  #elementFromSource(source) {
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
}

class BindItem {
  constructor({node, object, keyPath, adapter, oneway}) {
    this.node = node;
    this.object = object;
    this.keyPath = keyPath;
    this.keys = keyPath.split('.');
    this.adapter = adapter;
    this.oneway = oneway;
  }

  bind() {
    let {subject, property} = this.#subjectWithProperty();
    this.adapter.setValueToNode(subject[property], this.node);

    this.object.addObserver(this);

    if (!this.oneway) {
      this.node.addEventListener('change', this.#changeListener);
    }

    return this;
  }

  unbind() {
    this.object.removeObserver(this);

    if (!this.oneway) {
      this.node.removeEventListener('change', this.#changeListener);
    }

    return this;
  }

  #subjectWithProperty() {
    let subject = this.object;

    for (var i = 0; i < this.keys.length; ++i) {
      let property = this.keys[i];

      if (i + 1 == this.keys.length) {
        return {subject, property};
      }
      else {
        subject = subject[property];
        if (!subject) {
          throw new Error(`property of "${property}" in "${this.keyPath}" not exists.`);
        }
      }
    }
  }

  onNotifyEvent(sender, event, maybeTriggeredBy, maybeKeyPath) {
    if (NAObject.EventChange != event) {
      return;
    }

    if (maybeTriggeredBy instanceof BindItem) {
      if (maybeTriggeredBy === this || maybeKeyPath != this.keyPath) {
        return;
      }
    }

    let {subject, property} = this.#subjectWithProperty();
    this.adapter.setValueToNode(subject[property], this.node);
  }

  #changeListener = (e) => {
    let {subject, property} = this.#subjectWithProperty();
    subject[property] = this.adapter.valueFromNode(e.target);
    this.object.triggerChange(this, this.keyPath);
  }
}

class BindAdapter {
  static valueFromNode(node) {
    switch (node.tagName) {
    case 'INPUT':
      switch (node.type.toUpperCase()) {
      case 'RADIO':
      case 'CHECKBOX':
        return node.checked ? node.value : null;
      default:
        return node.value;
      }
      break;
    default:
      return node.value;
    }
  }

  static setValueToNode(value, node) {
    switch (node.tagName) {
    case 'INPUT':
      switch (node.type.toUpperCase()) {
      case 'RADIO':
      case 'CHECKBOX':
        node.checked = value == node.value;
        break;
      default:
        node.value = value;
        break;
      }
      break;
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
