const calc = require("models/calculator.js");

test("sum", () => {
  const result = calc.sum(2, 2);
  expect(result).toBe(4);
});

test("sum", () => {
  const result = calc.sum(2, 5);
  expect(result).toBe(7);
});
