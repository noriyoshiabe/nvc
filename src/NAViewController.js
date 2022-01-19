import NAObject from './NAObject';

class NAViewController extends NAObject {
  constructor(view) {
    super();
    this.view = view;
  }

  destroy() {
    this.view?.destroy?.();
  }
}

export default NAViewController;
