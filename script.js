const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');
const overlay = document.getElementById('overlay');
const payBtn = document.getElementById('payBtn');
const cancelBtn = document.getElementById('cancelBtn');
const paymentStep = document.getElementById('paymentStep');
const processingStep = document.getElementById('processingStep');

let current = '0';
let previous = null;
let operator = null;
let resetNext = false;
let pendingResult = null;

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
        runCalculation();
    }
    previous = current;
    operator = op;
    resetNext = true;
}

function runCalculation() {
    if (operator === null || previous === null) return null;
    const a = parseFloat(previous);
    const b = parseFloat(current);
    let result;

    switch (operator) {
        case '+': result = a + b; break;
        case '-': result = a - b; break;
        case '*': result = a * b; break;
        case '/': result = b === 0 ? 'Error' : a / b; break;
        default: return null;
    }

    operator = null;
    previous = null;
    resetNext = true;
    return result;
}

function clearAll() {
    current = '0';
    previous = null;
    operator = null;
    resetNext = false;
    pendingResult = null;
}

function toggleSign() {
    current = (parseFloat(current) * -1).toString();
}

function toPercent() {
    current = (parseFloat(current) / 100).toString();
}

function showPaywall() {
    paymentStep.classList.remove('hidden');
    processingStep.classList.add('hidden');
    overlay.classList.add('show');
}

function hidePaywall() {
    overlay.classList.remove('show');
}

payBtn.addEventListener('click', () => {
    paymentStep.classList.add('hidden');
    processingStep.classList.remove('hidden');

    setTimeout(() => {
        hidePaywall();
        if (pendingResult !== null) {
            current = pendingResult.toString();
            pendingResult = null;
            updateDisplay();
        }
    }, 2000);
});

cancelBtn.addEventListener('click', () => {
    hidePaywall();
});

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
            updateDisplay();
        } else if (btn.classList.contains('operator') && value) {
            setOperator(value);
            updateDisplay();
        } else if (action === 'equals') {
            const result = runCalculation();
            if (result !== null) {
                pendingResult = result;
                showPaywall();
            }
        } else if (action === 'clear') {
            clearAll();
            updateDisplay();
        } else if (action === 'sign') {
            toggleSign();
            updateDisplay();
        } else if (action === 'percent') {
            toPercent();
            updateDisplay();
        }
    });
});

updateDisplay();
