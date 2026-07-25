const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let current = '0';
let previous = null;
let operator = null;
let resetNext = false;

function updateDisplay() {
    display.textContent = current;
}

function inputDigit(digit) {
    if (current === '0' || resetNext) {
        current = digit;
        resetNext = false;
    } else {
        current += digit;
    }
}

function inputDecimal() {
    if (resetNext) {
        current = '0';
        resetNext = false;
    }
    if (!current.includes('.')) {
        current += '.';
    }
}

function setOperator(op) {
    if (operator && !resetNext) {
        calculate();
    }
    previous = current;
    operator = op;
    resetNext = true;
}

function calculate() {
    if (operator === null || previous === null) return;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b === 0 ? 'Error' : a / b; break;
        default: return;
    }

    current = result.toString();
    operator = null;
    previous = null;
    resetNext = true;
}

function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    resetNext = false;
}

function toggleSign() {
    current = (parseFloat(current) * -1).toString();
}

function toPercent() {
    current = (parseFloat(current) / 100).toString();
}

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const value = btn.dataset.value;
        const action = btn.dataset.action;

        if (value && !btn.classList.contains('operator')) {
            if (value === '.') {
                inputDecimal();
            } else {
                inputDigit(value);
            }
        } else if (btn.classList.contains('operator') && value) {
            setOperator(value);
        } else if (action === 'equals') {
            calculate();
        } else if (action === 'clear') {
            clearAll();
        } else if (action === 'sign') {
            toggleSign();
        } else if (action === 'percent') {
            toPercent();
        }

        updateDisplay();
    });
});

updateDisplay();
