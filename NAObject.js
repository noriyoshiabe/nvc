const observers = Symbol('observers');

class NAObject {
  static EventChange = 'NAObject.EventChange';

  constructor(attrs) {
    Object.assign(this, attrs);
    this[observers] = [];
  }

  addObserver(receiver, callback) {
    this[observers].push({receiver, callback});
  }

  removeObserver(receiver) {
    for (let i = this[observers].length - 1; 0 <= i; --i) {
      if (this[observers][i].receiver === receiver) {
        this[observers].splice(i, 1);
      }
    }
  }

  notify(event, vaArgs) {
    this[observers].slice().forEach(observer => observer.callback.bind(observer.receiver)(this, ...arguments));
  }

  triggerChange(vaArgs) {
    this.notify(NAObject.EventChange, ...arguments);
  }
}

export default NAObject;
