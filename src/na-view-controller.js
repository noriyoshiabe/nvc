import NAObject from './na-object';

class NAViewController extends NAObject {
  constructor(view) {
    super({view});
  }

  destroy() {
    this.view && this.view.destroy && this.view.destroy();
  }
}

export default NAViewController;
