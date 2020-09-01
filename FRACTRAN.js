function step(n, fracContext) {
  for (var f of fracContext) {
    if (n % f[1] == 0) {
      return n * f[0] / f[1];
    }
  }
  return NaN;
}

function parse(prog) {
  prog = prog.replace(/\s/g, "");
  var start = parseInt(prog.split(";")[0]) || NaN;
  var program = prog.split(";")[1].split(",");
  var result = [start];
  for (var i of program) {
    result.push(i.split("/"))
  }
  return result;
}