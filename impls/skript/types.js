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

  equals(other) {
    return (
      this.value.length === other.value.length &&
      this.value.every((e, i) => e.equals(other.value[i]))
    );
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

  equals(other) {
    return (
      this.value.length === other.value.length &&
      this.value.every((e, i) => e.equals(other.value[i]))
    );
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

  equals(other) {
    return this.value === other.value;
  }
}

class MalBoolean {
  constructor(value) {
    this.value = value;
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
    return this.value;
  }

  equals(other) {
    return this.value === other.value;
  }
}

class MalNil {
  prStr() {
    return 'Nil';
  }
}

class MalFunction {
  constructor(binding, expression) {
    this.binding = binding;
    this.expression = expression;
  }

  prStr() {
    return '#<function>'
  }
}

module.exports = { MalSymbol, MalValue, MalList, MalVector, MalNil, MalString, MalBoolean, MalFunction }