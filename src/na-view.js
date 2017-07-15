import NAObject from './na-object';

class NAView extends NAObject {
  constructor(source) {
    super({element: ElementFromSource(source)})

    let propertyElements = this.element.querySelectorAll('*[na-view-property]');

    for (var element of propertyElements) {
      let propertyName = element.getAttribute('na-view-property');

      if (this[propertyName]) {
        throw new Error(`Property name [${propertyName}] conflicts.`);
      }

      this[propertyName] = element;
    }
  }

  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

export default NAView;

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
