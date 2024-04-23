const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalValue, MalList, MalSymbol, MalVector } = require('./types');

const rl = readline.createInterface({ input, output });

const repl_env = {
  '+': (a, b) => new MalValue(a + b),
  '-': (a, b) => new MalValue(a - b),
  '*': (a, b) => new MalValue(a * b),
  '/': (a, b) => new MalValue(a / b),
}

const eval_ast = (ast, replEnv) => {
  switch (true) {
    case ast instanceof MalSymbol:
      const handler = replEnv[ast.value];
      if (!handler) throw new Error('no value found')
      return new MalValue(handler);
    case ast instanceof MalList:
      return new MalList(ast.value.map(x => EVAL(x, replEnv)))
    case ast instanceof MalVector:
      return new MalVector(ast.value.map(x => EVAL(x, replEnv)))
    default: return ast;
  }
}

const READ = str => read_str(str);

const EVAL = (ast, replEnv) => {
  if (!(ast instanceof MalList)) return eval_ast(ast, replEnv);

  if (ast instanceof MalList || ast instanceof MalVector) {
    if(ast.isEmpty()) return ast;
  }

  const [fn, ...args] = eval_ast(ast, replEnv).value;
  return fn.value.apply(null, args.map(x => x.value));
};

const PRINT = ast => pr_str(ast);

const rep = (str) => PRINT(EVAL(READ(str), repl_env));

const repl = () => {
  rl.question('user> ', (answer) => {
    try {
      rep(answer);
    }
    catch (e) {
      console.error(e);
    }
    repl();
  });
}

repl();