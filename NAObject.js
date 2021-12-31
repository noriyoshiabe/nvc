import { makeObservable } from './internal';

class NAObject {
  static EventChange = 'NAObject.EventChange';

  constructor(object) {
    Object.assign(this, object);
    return makeObservable(this, {event: NAObject.EventChange});
  }
}

export default NAObject;
