let currentInput = "";
let storedResult = 0;
let operator = null;

// when pressing number buttons
function pressNumber(num) {
  currentInput += num;
  console.log("INPUT:", currentInput);
}

// calculate helper
function calculate(a, b, op) {
  if (op === "+") return a + b;
  if (op === "-") return a - b;

  return b;
}

// when pressing + or -
function pressOperator(newOperator) {
  const number = Number(currentInput);

  // first operation
  if (operator === null) {
    storedResult = number;
  } else {
    // continue chain calculation
    storedResult = calculate(
      storedResult,
      number,
      operator
    );
  }

  console.log("RESULT:", storedResult);

  operator = newOperator;
  currentInput = "";
}

// when pressing =
function pressEqual() {
  const number = Number(currentInput);

  storedResult = calculate(
    storedResult,
    number,
    operator
  );

  console.log("FINAL:", storedResult);

  currentInput = "";
  operator = null;
}