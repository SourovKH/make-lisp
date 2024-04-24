class MalVector {
  constructor(args) {
    this.value = args;
  }

  prStr() {
    return `[${this.value.map(x => x.prStr()).join(" ")}]`
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalList {
  constructor(args) {
    this.value = args;
  }

  prStr() {
    return `(${this.value.map(x => x.prStr()).join(" ")})`
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalSymbol {
  constructor(args) {
    this.value = args;
  }

  prStr() {
    return this.value.toString();
  }
}

class MalValue {
  constructor(args) {
    this.value = args;
  }

  prStr() {
    return this.value + '';
  }
}

class MalString {
  constructor(value) {
    this.value = value;
  }

  prStr() {
    return this.value.map(a => a.prStr()).join("");
  }
}

class MalNil {
  prStr() {
    return 'Nil';
  }
}

module.exports = { MalSymbol, MalValue, MalList, MalVector, MalNil, MalString }