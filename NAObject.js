const observers = Symbol('observers');

class NAObject {
  static EventChange = 'NAObject.EventChange';
  [observers] = [];

  constructor(attrs) {
    Object.assign(this, attrs);
  }

  addObserver(observer) {
    this[observers].push(observer);
  }

  removeObserver(observer) {
    for (let i = this[observers].length - 1; 0 <= i; --i) {
      if (this[observers][i] === observer) {
        this[observers].splice(i, 1);
      }
    }
  }

  notify(event, ...vaArgs) {
    this[observers].slice().forEach(observer => observer.onNotifyEvent(this, event, ...vaArgs));
  }

  triggerChange(...vaArgs) {
    this.notify(NAObject.EventChange, ...vaArgs);
  }
}

export default NAObject;
