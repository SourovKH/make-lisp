const { MalValue, MalSymbol, MalList, MalVector, MalNil, MalString } = require("./types");

class Reader {
  #position
  #tokens

  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  peek() {
    return this.#tokens[this.#position];
  }

  next() {
    const currentToken = this.peek();
    this.#position = ++this.#position;
    return currentToken;
  }
}

const read_atom = (reader) => {
  const currentToken = reader.peek();
  if (currentToken.match(/[0-9]+/g))
    return new MalValue(parseInt(currentToken));

  if (/^".*"$/.test(currentToken))
    return new MalString(currentToken);

  if (currentToken.match(/[\Wa-zA-Z]+/g))
    return new MalSymbol(currentToken);

  if (currentToken === 'true' || currentToken === 'false') {
    return MalValue(currentToken === 'true');
  }

  return new MalValue(currentToken);
}

const read_list = (reader) => {
  const ast = [];

  while (reader.next()) {
    const token = reader.peek();
    if (!token) throw new Error("unbalanced");

    if (token === ')') return new MalList([...ast]);

    ast.push(read_form(reader));
  }
}

const read_vector = (reader) => {
  const ast = [];

  while (reader.next()) {
    const token = reader.peek();
    if (!token) throw new Error("unbalanced");

    if (token === ']') return new MalVector([...ast]);

    ast.push(read_form(reader));
  }
}

const read_form = (reader) => {
  const token = reader.peek();

  switch (token) {
    case '(':
      return read_list(reader);

    case '[':
      return read_vector(reader);

    default: return read_atom(reader);
  }
}

const tokenize = (str) => {
  const regex = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  return [...str.matchAll(regex)].slice(0, -1).map(match => match.at(1));
}

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
}

module.exports = { read_str };