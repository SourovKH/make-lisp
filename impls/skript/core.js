const {MalValue, MalBoolean, MalList} = require("./types");

const ns = {
  "+": (...args) => args.reduce((a, b) => new MalValue(a.value + b.value)),
  "-": (...args) => args.reduce((a, b) => new MalValue(a.value - b.value)),
  "*": (...args) => args.reduce((a, b) => new MalValue(a.value * b.value)),
  "/": (...args) => args.reduce((a, b) => new MalValue(a.value / b.value)),
  "<": (a, b) => new MalBoolean(a.value < b.value),
  ">": (a, b) => new MalBoolean(a.value > b.value),
  ">=": (a, b) => new MalBoolean(a.value >= b),
  "<=": (a, b) => new MalBoolean(a.value <= b),
  "=": (a, b) => new MalBoolean(a.equals(b)),
  "list": (...list) => new MalList(list),
  "list?": (args) => new MalBoolean(args instanceof MalList),
  "empty?": (list) => new MalBoolean(list.value.length === 0),
  "count": (list) => new MalValue(list.value.length)
}

module.exports = { ns };