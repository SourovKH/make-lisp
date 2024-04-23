class MalVector {
  #value
  constructor(args) {
    this.#value = args;
  }

  prStr() {
    return `[${this.#value.map(x => x.prStr()).join(" ")}]`
  }
}

class MalList {
  #value
  constructor(args) {
    this.#value = args;
  }

  prStr() {
    return `(${this.#value.map(x => x.prStr()).join(" ")})`
  }
}

class MalSymbol {
  #value;
  constructor(args) {
    this.#value = args;
  }

  prStr() {
    return this.#value.toString();
  }
}

class MalValue {
  #value
  constructor(args) {
    this.#value = args;
  }

  prStr() {
    return this.#value;
  }
}

module.exports = { MalSymbol, MalValue, MalList, MalVector }