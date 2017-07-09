import _ from 'lodash';
import Model from './na-model';

export default class View {
  constructor(container) {
    this.container = container;
    this.listeners = {};

    if (this.template) {
      this.container.innerHTML = this.template();
    }
  }

  bind(model) {
    if (this.model) {
      this.model.removeObserver(this);
      // TODO unbind events
    }

    this.model = model;
    this.model.addObserver(this, this.onNotify);

    this.boundElements = this.container.querySelectorAll('*[na-bind]');

    for (var element of this.boundElements) {
      let attr = element.getAttribute('na-bind');

      switch (element.tagName) {
      case 'P':
        element.innerText = this.model[attr];
        break;
      case 'INPUT':
        element.value = this.model[attr];
        this.listeners[attr] = (e) => {
          this.model[attr] = e.target.value;
        };
        element.addEventListener('change', this.listeners[attr]);
        break;
      }
    }
  }

  onNotify(sender, event, prop, newValue, oldValue) {
  }
}
