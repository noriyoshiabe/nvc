import NAObject from './NAObject';

class NAViewController extends NAObject {
  constructor(view) {
    super({view});
  }

  viewWillAppear() {
  }

  viewDidAppear() {
  }

  viewWillDisappear() {
  }

  viewDidDisappear() {
  }

  destroy() {
    this.view && this.view.destroy && this.view.destroy();
  }
}

export default NAViewController;
