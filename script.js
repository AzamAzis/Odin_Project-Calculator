function operationResult() {
	if (result === null) return;
	waitingForSecondOperand = false;
	const fullNumber = result.toString().split(".");
	const integer = fullNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const decimal = fullNumber.length > 1 ? fullNumber.slice(1).join("") : null;

	if (decimal !== null) {
		preview.value = `${integer}.${decimal}`;
	} else if (result === Infinity || result === -Infinity) {
		preview.value = "Cat is judging u";
	} else {
		preview.value = integer;
	}
}

function finalResult() {
	finalOperation = true;
}

// ||OPERAND
let firstOperand = null;

// ||OPERATOR
let mathOperator = null;

// ||RESULT
let result = null;
let finalOperation = false;

let waitingForSecondOperand = false;


// ||OPERATE
function operation() {
	const rawNumber = preview.value.replace(/[^\d.-]/g, "");
	if (rawNumber === "") return;

	let currentNumber = Number(rawNumber);

	if (Number.isNaN(currentNumber)) currentNumber = 0;

	if (waitingForSecondOperand) return;

	if (firstOperand === null) {
		firstOperand = currentNumber;
	} else {
		switch (mathOperator) {
			case "+":
				firstOperand = firstOperand + currentNumber;
				break;
			case "-":
				firstOperand = firstOperand - currentNumber;
				break;
			case "x":
				firstOperand = firstOperand * currentNumber;
				break;
			case "÷":
				firstOperand = firstOperand / currentNumber;
				break;
		}
	}

	result = Math.round((firstOperand) * 1e9) / 1e9;

	// ||HANDLE RESULT AND PREVIEW
	operationResult();

	mathOperator = this.value;

		if (mathOperator === "+" || mathOperator === "-") {
		applyPercent = true;
	} else {
		applyPercent = false;
	}

	waitingForSecondOperand = true;
	newNumberArray = result.toString().split("");

	// ||RESET DISPLAY
	arrayNumbers.length = 0;
}

// ||SCREEN
const preview = document.querySelector(".preview");
preview.focus();

// ||BUTTON
const buttons = document.querySelectorAll(".button");
const numbers = document.querySelectorAll(".number");
const clear = document.querySelector(".clear");
const equal = document.querySelector(".equal");
const negate = document.querySelector(".negate");
const operators = document.querySelectorAll(".operator");
const percent = document.querySelector(".percent");
const backSpace = document.querySelector(".backspace");

// ||STORE INPUT NUMBER
let arrayNumbers = [];
let newNumberArray;

// ||INPUT NUMBER FROM BUTTON
function inputNumberButton() {
	if (finalOperation) {
		firstOperand = null;
		finalOperation = false;
	}
	waitingForSecondOperand = false;
	// ||STORE PREVIOUS VALUE LENGTH AND PREVIOUS CURSOR POSITION
	let cursorPosition = preview.selectionStart;
	const previousLength = preview.value.length;

	// ||PREVENT MULTIPLE ZERO IN FRONT OF A DIGIT IN ARRAY[0] AND
	// ||PREVENT MULTIPLE DECIMAL DOT
	if (
		(arrayNumbers[0] === "0" &&
			this.value === "0" &&
			arrayNumbers.length === 1) ||
		(this.value === "." && arrayNumbers.includes("."))
	)
		return;

	// ||INPUT NUMBER TO ARRAY
	const rawNumber = preview.value.slice(0, cursorPosition).replace(/,/g, "");
	const rawCursor = rawNumber.length;

	arrayNumbers.splice(rawCursor, 0, this.value);

	// ||CREATE NEW ARRAY FOR HANDLING DOT AND COMMA
	const newArrayNum = arrayNumbers.join("").split(".");

	// ||SPLIT BETWEEN INTEGER AND DECIMAL
	let integer = newArrayNum[0];
	const decimal = newArrayNum.length > 1 ? newArrayNum.slice(1).join("") : null;

	// ||HANDLING COMMA
	integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	// ||HANDLE DECIMAL DOT
	if (decimal !== null) {
		preview.value = `${integer}.${decimal}`;
	} else {
		preview.value = integer;
	}

	// ||THE CURRENT VALUE LENGTH AND THE CURRENT CURSOR POSITION
	const currentLength = preview.value.length;
	cursorPosition = cursorPosition + (currentLength - previousLength);
	preview.setSelectionRange(cursorPosition, cursorPosition);
}

// ||INPUT NUMBER FROM KEYBOARD
function inputNumberKeyboard(event) {
	waitingForSecondOperand = false;

	preview.focus();
	let cursorPosition = this.selectionStart;
	const originalLength = this.value.length;

	if (
		(event.data === "." && arrayNumbers.includes(".")) ||
		(event.data === "0" && arrayNumbers[0] === "0" && arrayNumbers.length === 1)
	)
		return;

	if (event.data === null) {
		// ||DELETE NUMBER
		const rawNumber = this.value
			.slice(0, cursorPosition)
			.replace(/,/g, "").length;
		arrayNumbers.splice(rawNumber, 1);
	} else if (event.data === "." || Number.isInteger(+event.data)) {
		// ||INPUT NUMBER
		const rawNumber = this.value
			.slice(0, cursorPosition - 1)
			.replace(/,/g, "").length;
		arrayNumbers.splice(rawNumber, 0, event.data);
	} else if (event.data === "-" && cursorPosition === 1) {
		arrayNumbers.unshift("-");
	}

	const fullNumber = arrayNumbers.join("").split(".");
	let integer = fullNumber[0];
	integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

	const decimal = fullNumber.length > 1 ? fullNumber.slice(1).join("") : null;

	if (decimal !== null) {
		this.value = `${integer}.${decimal}`;
	} else {
		this.value = integer;
	}

	const newLength = this.value.length;
	cursorPosition = cursorPosition + (newLength - originalLength);
	this.setSelectionRange(cursorPosition, cursorPosition);
}

// ||DELETE NUMBER
function deleteNumber() {
	let cursorPosition = preview.selectionStart;
	const originalLength = preview.value.length;
	const previousCursor = cursorPosition - 1;

	waitingForSecondOperand = false;

	if (previousCursor === -1) return;

	const rawNumber = preview.value
		.slice(0, previousCursor)
		.replace(/,/g, "").length;

if (arrayNumbers.length === 0) {
	newNumberArray.splice(rawNumber, 1);

	const newFullNumber = newNumberArray.join("").split(".");
	const newInteger = newFullNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const newDecimal =
		newFullNumber.length > 1 ? newFullNumber.slice(1).join("") : null;

	if (newDecimal !== null) {
		preview.value = `${newInteger}.${newDecimal}`;
	} else {
		preview.value = newInteger;
	}

	firstOperand = Number(preview.value.replace(/[^\d.]/g, ""));
	if (firstOperand === 0) firstOperand = null;

	const newLength = preview.value.length;
	cursorPosition = cursorPosition + (newLength - originalLength);
	preview.setSelectionRange(cursorPosition, cursorPosition);
} else {
	// ||DELETE OPERATION RESULT
	result = arrayNumbers;
	arrayNumbers.splice(rawNumber, 1);

	const fullNumber = arrayNumbers.join("").split(".");
	const integer = fullNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const decimal = fullNumber.length > 1 ? fullNumber.slice(1).join("") : null;

	if (decimal !== null) {
		preview.value = `${integer}.${decimal}`;
	} else {
		preview.value = integer;
	}

	const newLength = preview.value.length;
	cursorPosition = cursorPosition + (newLength - originalLength);
	preview.setSelectionRange(cursorPosition, cursorPosition);
	}
}

function negateNumber() {
	if (arrayNumbers.includes("-")) {
		arrayNumbers.shift();
		preview.value = preview.value.slice(1);
	} else {
		arrayNumbers.unshift("-");
		preview.value = `-${preview.value}`;
	}
}

// ||APPLY PERCENT
let applyPercent = false;

function percents() {
	if (!applyPercent) {
		const fullNumber = parseFloat(arrayNumbers.join(""));
		const newNumber = !Number.isNaN(fullNumber) ? fullNumber : result;
		const dividedByHundred = Math.round((newNumber / 100) * 1e9) / 1e9;

		arrayNumbers = dividedByHundred.toString().split("");
		firstOperand = dividedByHundred;
		result = dividedByHundred;
	} else if (firstOperand !== null && applyPercent === true) {
		const percentResult =
			Math.round(
				(Number(newNumberArray.join("")) * preview.value / 100) * 1e9) / 1e9;

		arrayNumbers = percentResult.toString().split("");
	}

	const newFullNumber = arrayNumbers.join("").split(".");
	const integer = newFullNumber[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	const decimal =
		newFullNumber.length > 1 ? newFullNumber.slice(1).join("") : null;

	if (decimal !== null) {
		preview.value = `${integer}.${decimal}`;
	} else {
		preview.value = integer;
	}
}

// ||BUTTONS
buttons.forEach((button) => {
	button.addEventListener("pointerdown", (event) => {
		// ||PREVENT FOCUS RESET
		event.preventDefault();
		preview.focus();
	});
});

// ||INPUT NUMBER
numbers.forEach((number) => {
	number.addEventListener("click", inputNumberButton);
});
preview.addEventListener("input", inputNumberKeyboard);

// ||PREVENT MULTIPLE 0 BEFORE A DIGIT
preview.addEventListener("keydown", (event) => {
	if (
		(event.target.value === "0" &&
			event.key === "0" &&
			event.target.value.length === 1) ||
		(event.target.value.includes(".") && event.key === ".")
	)
		event.preventDefault();
});

// ||CLEAR BUTTON
clear.addEventListener("click", () => {
	arrayNumbers.length = 0;
	firstOperand = null;
	mathOperator = null;
	result = null;
});

// ||DELETE BUTTON
backSpace.addEventListener("click", deleteNumber);

// ||POSITIVE AND NEGATIVE NUMBER / NEGATE BUTTON
negate.addEventListener("click", negateNumber);

// ||PERCENT
percent.addEventListener("click", percents);

// ||OPERATORS
operators.forEach((operator) => {
	operator.addEventListener("click", operation);
});

// ||EQUAL BUTTON
equal.addEventListener("click", operationResult);
equal.addEventListener("click", finalResult);
