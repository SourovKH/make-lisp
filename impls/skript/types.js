class MalVector {
  constructor(args) {
    this.value = args;
  }

  prStr() {
    return `[${this.value.map((x) => x.prStr()).join(" ")}]`;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  length() {
    return this.value.length;
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
    return `(${this.value.map((x) => x.prStr()).join(" ")})`;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  length() {
    return this.value.length;
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
    return this.value + "";
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
    return this.value + "";
  }

  equals(other) {
    return this.value === other.value;
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
    return "nil";
  }

  length() {
    return 0;
  }

  equals(other) {
    if (other instanceof MalNil) return true;
    return false;
  }
}

class MalFunction {
  constructor(func) {
    this.value = func;
  }

  prStr() {
    return "#<function>";
  }
}

class MalKeyword {
  constructor(value) {
    this.value = value;
  }

  prStr() {
    return `:${this.value}`;
  }

  equals(other) {
    return this.value === other.value;
  }
}

module.exports = {
  MalSymbol,
  MalValue,
  MalList,
  MalVector,
  MalNil,
  MalString,
  MalBoolean,
  MalFunction,
  MalKeyword,
};
