// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const equalsButton = document.getElementById('equals');
const decimalButton = document.getElementById('decimal');
const percentButton = document.getElementById('percent');

// Calculator state
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let resetScreen = false;

// Functions
function updateDisplay() {
    currentOperandElement.textContent = formatDisplayNumber(currentOperand);
    
    if (operation != null) {
        previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`;
    } else {
        previousOperandElement.textContent = '';
    }
}

function formatDisplayNumber(number) {
    const stringNumber = number.toString();
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
        integerDisplay = '0';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', {
            maximumFractionDigits: 0
        });
    }
    
    if (decimalDigits != null) {
        return `${integerDisplay}.${decimalDigits}`;
    } else {
        return integerDisplay;
    }
}

function appendNumber(number) {
    if (resetScreen) {
        currentOperand = '';
        resetScreen = false;
    }
    
    if (number === '.' && currentOperand.includes('.')) return;
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '0') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    // Map to prettier symbols for display
    let displayOp;
    switch(op) {
        case '+': displayOp = '+'; break;
        case '-': displayOp = '-'; break;
        case '×': displayOp = '×'; break;
        case '÷': displayOp = '÷'; break;
        default: displayOp = op;
    }
    
    operation = displayOp;
    previousOperand = currentOperand;
    resetScreen = true;
    updateDisplay();
}

function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clear();
                return;
            }
            computation = prev / current;
            break;
        case '%':
            computation = prev % current;
            break;
        default:
            return;
    }
    
    currentOperand = computation.toString();
    operation = undefined;
    previousOperand = '';
    updateDisplay();
}

function calculatePercent() {
    currentOperand = (parseFloat(currentOperand) / 100).toString();
    updateDisplay();
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteNumber() {
    if (currentOperand.length === 1 || (currentOperand.length === 2 && currentOperand.includes('-'))) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

// Event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        appendNumber(button.textContent);
    });
});

operatorButtons.forEach(button => {
    if (['add', 'subtract', 'multiply', 'divide'].includes(button.id)) {
        button.addEventListener('click', () => {
            chooseOperation(button.textContent);
        });
    }
});

clearButton.addEventListener('click', clear);
deleteButton.addEventListener('click', deleteNumber);
equalsButton.addEventListener('click', () => {
    calculate();
    resetScreen = true;
});
decimalButton.addEventListener('click', () => appendNumber('.'));
percentButton.addEventListener('click', calculatePercent);

// Keyboard support
document.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    }
    if (e.key === '+' || e.key === '-') {
        chooseOperation(e.key);
    }
    if (e.key === '*') {
        chooseOperation('×');
    }
    if (e.key === '/') {
        e.preventDefault();
        chooseOperation('÷');
    }
    if (e.key === '%') {
        calculatePercent();
    }
    if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
        resetScreen = true;
    }
    if (e.key === 'Backspace') {
        deleteNumber();
    }
    if (e.key === 'Escape' || e.key === 'Delete') {
        clear();
    }
});

// Initialize display
updateDisplay();
