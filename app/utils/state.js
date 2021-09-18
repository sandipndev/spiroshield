class State {
  constructor() {
    this._processing = false;
  }
  get processing() {
    return this._processing;
  }
  set processing(processing) {
    this._processing = processing;
  }
}

const st = new State();
module.exports = st;
