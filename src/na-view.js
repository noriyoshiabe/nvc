import NAObject from './na-object';

class NAView extends NAObject {
  constructor(source) {
    super({element: ElementFromSource(source)})

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
        this._observeDestroyChild(this[viewName]);
      }
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }

    this.notify(NAView.Event.Destory, this);
  }

  _isRootElementNearestAncestorView(element) {
    element = element.parentNode;

    while (null != element) {
      if (this.element === element) {
        return true;
      }

      if (element.hasAttribute('na-view')) {
        return false;
      }

      element = element.parentNode;
    }

    throw new Error(`Should never be reached.`);
  }

  _observeDestroyChild(child) {
    child.addObserver(this, (event, view) => {
      if (NAView.Event.Destory == event) {
        for (var prop in this) {
          if (this[prop] === view) {
            delete this[prop];
          }
        }
      }
    })
  }
}

const Event = {
  Destroy: 'NAView:Destory',
};
NAView.Event = Event;

function ElementFromSource(source) {
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
      return window.document.importNode(source.content, true);
    default:
      return source;
    }
  default:
    throw new Error('Unsupported source type');
  }
}

export default NAView;
