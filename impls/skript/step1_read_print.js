const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');

const rl = readline.createInterface({ input, output });

const READ = str => read_str(str);

const EVAL = str => str;

const PRINT = str => pr_str(str);

const rep = (str) => PRINT(EVAL(READ(str)));

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