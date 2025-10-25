// সমর্থিত ফাংশন
const functions: Record<string, Function> = {
  sin: Math.sin,
  cos: Math.cos,
  tan: Math.tan,
  sinh: Math.sinh,
  cosh: Math.cosh,
  tanh: Math.tanh,
  log: Math.log10,
  ln: Math.log,
  sqrt: Math.sqrt,
  abs: Math.abs,
  factorial: (n: number) => {
    if(n < 0) throw new Error("Negative factorial");
    let res = 1;
    for(let i = 2; i <= n; i++) res *= i;
    return res;
  }
};

export function evaluateExpression(expr: string): string {
  if(!expr) return "0";

  // π ও e প্রতিস্থাপন
  const sanitized = expr
    .replace(/π/g, "Math.PI")
    .replace(/e/g, "Math.E")
    .replace(/mod/g, "%");

  // Function names প্রতিস্থাপন
  const funcExpr = sanitized.replace(/\b(sin|cos|tan|sinh|cosh|tanh|log|ln|sqrt|abs|factorial)\(/g, "functions.$1(");

  try {
    // eslint-disable-next-line no-new-func
    const result = Function("functions", `return ${funcExpr}`)(functions);
    return String(Number(result.toFixed(8)));
  } catch (err) {
    return "Error";
  }
}
