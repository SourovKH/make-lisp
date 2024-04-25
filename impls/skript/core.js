const { pr_str } = require("./printer");
const {MalValue, MalBoolean, MalList, MalNil, MalString} = require("./types");

const ns = {
  "+": (...args) => args.reduce((a, b) => new MalValue(a.value + b.value)),
  "-": (...args) => args.reduce((a, b) => new MalValue(a.value - b.value)),
  "*": (...args) => args.reduce((a, b) => new MalValue(a.value * b.value)),
  "/": (...args) => args.reduce((a, b) => new MalValue(a.value / b.value)),
  "<": (a, b) => new MalBoolean(a.value < b.value),
  ">": (a, b) => new MalBoolean(a.value > b.value),
  ">=": (a, b) => new MalBoolean(a.value >= b.value),
  "<=": (a, b) => new MalBoolean(a.value <= b.value),
  "=": (a, b) => new MalBoolean(a.equals(b)),
  "list": (...list) => new MalList(list),
  "list?": (args) => new MalBoolean(args instanceof MalList),
  "empty?": (list) => new MalBoolean(list.length() === 0),
  "count": (list) => new MalValue(list.length()),
  "prn": (value) => new MalNil(pr_str(value, false)),
}

module.exports = { ns };