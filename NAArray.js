import { makeObservable } from './internal';

class NAArray extends Array {
  static EventChange = 'NAArray.EventChange';

  constructor(vaArgs) {
    super(...arguments);
    return makeObservable(this, {event: NAArray.EventChange});
  }
}

export default NAArray;
