import NAObject from './NAObject';

class NAViewController extends NAObject {
  constructor(view) {
    super({view});
  }

  destroy() {
    this.view?.destroy?.();
  }
}

export default NAViewController;
