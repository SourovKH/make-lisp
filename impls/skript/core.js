const {MalValue, MalBoolean} = require("./types");
const ld = require('lodash');

const add = (...args) => new MalValue(args.reduce((a, b) => a + b));
const subtract = (...args) => new MalValue(args.reduce((a, b) => a - b));
const multiply = (...args) => new MalValue(args.reduce((a, b) => a * b));
const divide = (...args) => new MalValue(args.reduce((a, b) => a / b));
const lessThan = (a, b) => new MalBoolean(a < b);
const greaterThan = (a, b) => new MalBoolean(a > b);
const greaterThanEq = (a, b) => new MalBoolean(a >= b);
const lessThanEq = (a, b) => new MalBoolean(a <= b);
const equals = (a, b) => new MalBoolean(ld.isEqual(a, b));

const ns = {
  "+": add,
  "-": subtract,
  "*": multiply,
  "/": divide,
  "<": lessThan,
  ">": greaterThan,
  ">=": greaterThanEq,
  "<=": lessThanEq,
  "=": equals
}

module.exports = { ns };