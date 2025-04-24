
function isdigit(str){
    return /^\d+$/.test(str);
}

function scandigit(str) {
  out = ""
  for (let i = 0; i < str.length; i++) {
    if (isdigit(str[i])) {
      out += str[i]
      continue
    }
    return {
      out: out,
      remaining: str.slice(i)
    }
  }
  return {out: str, remaining: []}
}

function tokenize(str) {
  let tokens = [];
  while (str.length !== 0) {
    if (isdigit(str[0])) {
      let { out, remaining } = scandigit(str);
      tokens.push(+out);
      str = remaining;
    } else if (str[0] === '#') {
      if (str[1] === '#') {
        tokens.push("##");
        str = str.slice(2);
      } else {
        str = "";
      }
    } else {
      tokens.push(str[0]);
      str = str.slice(1);
    }
}
  return tokens;
}

function parse_date(tokens) {
  const year = 2000 + parseInt(next_tok(tokens), 10);
  next_tok(tokens);
  const month = parseInt(next_tok(tokens), 10) - 1;
  next_tok(tokens);
  const day = parseInt(next_tok(tokens), 10);

  return new Date(year, month, day);
}

function parse_span(tokens) {
  let first_time = new Date();
  let hours = next_tok(tokens);
  next_tok(tokens);
  let minutes = next_tok(tokens);
  first_time.setUTCHours(hours, minutes, 0, 0);

  next_tok(tokens);

  let second_time = new Date();
  hours = next_tok(tokens);
  next_tok(tokens);
  minutes = next_tok(tokens);
  second_time.setUTCHours(hours, minutes, 0, 0);
  return {start: first_time, end: second_time};
}

function next_tok(tokens) {
  let tok = tokens.shift(tokens);
  loop: while(true) {
    switch (tokens[0]) {
      case ' ': break;
      case '\t': break;
      default: break loop;
    }
    tokens.shift();
  }
  return tok;
}

function parse(str) {
  let entries = [];
  let tokens = tokenize(str);
  while (tokens.length !== 0) {
    let token = next_tok(tokens);
    if (token == "##") {
      let date = parse_date(tokens);
      let spans = [];
      while (typeof(tokens[0]) === "number") {
        spans.push(parse_span(tokens));
      }
      let items = [];
      let line = "";
      while (tokens[0] !== undefined && tokens[0] !== '##') {
        switch (tokens[0]) {
          case '\n':
            tokens.shift();
            items.push(line);
            line = "";
            break;
          default:
            line += tokens[0];
            tokens.shift();
        }
      }
      entries.push({
        date: date,
        spans: spans,
        items: items,
      });
    }
  }

  return entries;
}

module.exports = {
  parse: parse,
}
