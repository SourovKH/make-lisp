const { MalList } = require("./types");

class Env {
  outer;
  data;

  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  static functionalEnv(outer, bindings, expressions) {
    const newEnv = new this(outer);
    for(let index in bindings) {
      const bindIndex = +index;
      const binding = bindings[bindIndex];
      const exp = expressions[bindIndex];

      if(binding.value === '&') {
        newEnv.set(bindings[bindIndex + 1].value, new MalList(expressions.slice(bindIndex)))
        break;
      }
      newEnv.set(binding.value, exp)
    }

    return newEnv;
  }

  set(key, value) {
    this.data[key] = value;
  }

  find(key) {
    if (this.data[key]) return this;
    if (this.outer) return this.outer.find(key);
  }

  get(key) {
    const env = this.find(key);
    const value = env?.data[key];
    if (!value) throw new Error(`${key} not found`);
    return value;
  }
}

module.exports = { Env };