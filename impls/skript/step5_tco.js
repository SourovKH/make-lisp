const readline = require("node:readline");
const { stdin: input, stdout: output } = require("node:process");
const { read_str } = require("./reader");
const { pr_str } = require("./printer");
const {
  MalList,
  MalSymbol,
  MalVector,
  MalNil,
  MalFunction,
} = require("./types");
const { Env } = require("./Env");
const { ns } = require("./core");

const rl = readline.createInterface({ input, output });

const loadCore = (replEnv) => {
  Object.entries(ns).forEach(([func, body]) => {
    replEnv.set(func, body);
  });
};

const eval_ast = (ast, replEnv) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const handler = replEnv.get(ast.value);
      if (!handler) throw new Error("no value found");
      return handler;
    case ast instanceof MalList:
      return new MalList(ast.value.map((x) => EVAL(x, replEnv)));
    case ast instanceof MalVector:
      return new MalVector(ast.value.map((x) => EVAL(x, replEnv)));
    default:
      return ast;
  }
};

const setBindings = (bindings, replEnv) => {
  for (let index = 0; index < bindings.length; index += 2) {
    const key = bindings[index].value;
    const value = EVAL(bindings[index + 1], replEnv);
    replEnv.set(key, value);
  }
};
const handleDef = (ast) => {
  const [_, key, value] = ast.value;
  const evaluatedValue = EVAL(value, repl_env);
  repl_env.set(key.value, evaluatedValue);

  return evaluatedValue;
};

const handleLet = (ast, replEnv) => {
  [_, bindings, exp] = ast.value;
  if (!exp) return new MalNil();
  const newEnv = new Env(replEnv);
  setBindings(bindings.value, newEnv);

  return { exp, newEnv };
};

const handleIf = (ast, replEnv) => {
  const [_, condition, ifExpression, elseExpression] = ast.value;
  const evaluatedCond = EVAL(condition, replEnv);

  if (evaluatedCond.value) return ifExpression;
  return elseExpression ? elseExpression : new MalNil();
};

const handleDo = (ast, replEnv) => {
  const [_, ...expressions] = ast.value;
  expressions.slice(0, -1).map((exp) => eval_ast(exp, replEnv)).at(-1);

  return expressions.at(-1);
};

const handleFunction = (ast, replEnv) => {
  const [_, bindings, body] = ast.value;

  const newEnv = new Env(replEnv);
  return new MalFunction(bindings, body, newEnv);
};

const READ = (str) => read_str(str);

const EVAL = (ast, replEnv) => {
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, replEnv);

    if (ast instanceof MalList || ast instanceof MalVector) {
      if (ast.isEmpty()) return ast;
    }

    const [symbol] = ast.value;
    switch (true) {
      case symbol.value === "def!":
        const envAfterDef = handleDef(ast);
        return envAfterDef;
      case symbol.value === "let*":
        const { exp, newEnv } = handleLet(ast, replEnv);
        ast = exp;
        replEnv = newEnv;
        break;
      case symbol.value === "do": return handleDo(ast, replEnv);
      case symbol.value === "if":
        ast = handleIf(ast, replEnv);
        break;
      case symbol.value === "fn*":
        return handleFunction(ast, replEnv);
      default:
        const [fn, ...args] = eval_ast(ast, replEnv).value;

        if (fn instanceof MalFunction) {
          ast = fn.body;
          const newEnv = Env.functionalEnv(fn.env, fn.binding.value, args);
          replEnv = newEnv;
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const PRINT = (ast) => pr_str(ast);
const rep = (str, repl_env) => PRINT(EVAL(READ(str), repl_env));

const repl_env = new Env();
loadCore(repl_env);

const repl = () => {
  rl.question("user> ", (answer) => {
    try {
      rep(answer, repl_env);
    } catch (e) {
      console.error(e);
    }
    repl();
  });
};
rep("(def! not (fn* (a) (if a false true)))", repl_env);
repl();
