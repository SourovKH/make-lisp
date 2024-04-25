const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalList, MalSymbol, MalVector, MalNil, MalFunction } = require('./types');
const { Env } = require('./Env');
const { ns } = require('./core');

const rl = readline.createInterface({ input, output });

const loadCore = (replEnv) => {
  Object.entries(ns).forEach(([func, body]) => {
    replEnv.set(func, body);
  })
}

const eval_ast = (ast, replEnv) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const handler = replEnv.get(ast.value);
      if (!handler) throw new Error('no value found')
      return handler;
    case ast instanceof MalList:
      return new MalList(ast.value.map(x => EVAL(x, replEnv)))
    case ast instanceof MalVector:
      return new MalVector(ast.value.map(x => EVAL(x, replEnv)))
    default: return ast;
  }
}

const setBindings = (bindings, replEnv) => {
  for (let index = 0; index < bindings.length; index += 2) {
    const key = bindings[index].value;
    const value = EVAL(bindings[index + 1], replEnv);
    replEnv.set(key, value);
  }
}
const handleDef = (ast, replEnv) => {
  const [_, key, value] = ast.value;
  const evaluatedValue = EVAL(value, replEnv);
  replEnv.set(key.value, evaluatedValue);

  return evaluatedValue;
}

const handleLet = (ast, replEnv) => {
  [_, bindings, exp] = ast.value;
  if (!exp) return new MalNil();
  const newEnv = new Env(replEnv);
  setBindings(bindings.value, newEnv);

  return EVAL(exp, newEnv);
}

const handleIf = (ast, replEnv) => {
  const [_, condition, ifExpression, elseExpression] = ast.value;
  const evaluatedCond = EVAL(condition, replEnv);
  if (evaluatedCond.value) return EVAL(ifExpression, replEnv)
  return elseExpression ? EVAL(elseExpression, replEnv) : new MalNil;
}

const handleDo = (ast, replEnv) => {
  const [_, ...expressions] = ast.value;
  return eval_ast(new MalList(expressions), replEnv).value.at(-1);
}

const handleFunction = (ast, replEnv) => {
  const [_, bindings, body] = ast.value;

  const newFunction = (args) => {
    const newEnv = Env.functionalEnv(replEnv, bindings.value, args);
    return EVAL(body, newEnv);
  }

  return new MalFunction(newFunction);
}

const READ = str => read_str(str);

const EVAL = (ast, replEnv) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, replEnv);

  if (ast instanceof MalList || ast instanceof MalVector) {
    if (ast.isEmpty()) return ast;
  }

  const [symbol] = ast.value;
  switch (true) {
    case (symbol.value === 'def!'):
      return handleDef(ast, replEnv);
    case (symbol.value === 'let*'):
      return handleLet(ast, replEnv);
    case (symbol.value === 'do'):
      return handleDo(ast, replEnv);
    case (symbol.value === 'if'):
      return handleIf(ast, replEnv);
    case (symbol.value === "fn*"):
      return handleFunction(ast, replEnv);
  }

  const [fn, ...args] = eval_ast(ast, replEnv).value;

  if (fn instanceof MalFunction) {
    const func = fn.value;
    return func(args);
  }
  return fn.apply(null, args);
};

const PRINT = ast => pr_str(ast);
const rep = (str, repl_env) => PRINT(EVAL(READ(str), repl_env));

const repl_env = new Env();
loadCore(repl_env);

const repl = () => {
  rl.question('user> ', (answer) => {
    try {
      rep(answer, repl_env);
    }
    catch (e) {
      console.error(e);
    }
    repl();
  });
}
rep('(def! not (fn* (a) (if a false true)))', repl_env);
repl();