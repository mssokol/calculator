var displayNumber = '';
var operatorHolder = [];
var operation = '';
var equalLast = false;
var decimalMode = false;
var decimalHolder = '';

const buttons = document.querySelectorAll(".button");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const decimal = document.getElementById("decimal");
const sign = document.getElementById("sign");
const display = document.getElementById("numbers");
const divideTen = document.getElementById("divideTen");

function add(a, b) {
    return a + b;
};

function subtract(a, b) {
    return a - b;
};

function divide(a, b) {
    if(b == 0) {
        display.textContent = "Error";
        displayNumber = '';
        operatorHolder = [];
        return;
    }
    else {
        return a / b;
    }
}

function mulitply(a, b) {
    return a * b;   
}

function operate(op, a, b) {
    switch (op) {
        case 'add' : return add(a, b);
        case 'subtract' : return subtract(a, b); 
        case 'divide' : return divide(a, b); 
        case 'multiply' : return mulitply(a, b); 
        default: return "ERROR";
    }
}

//changes number displayed on screen
function updateDisplay() {
    var displayLength = displayNumber.length;
    var leftDecimal  = displayNumber.split(".")[0];
    var rightDecimal = displayNumber.split(".")[1];

    //clean decimals with less than 8 digits
    if(rightDecimal) {
        if(displayLength > 9 && !displayNumber.includes('e')) {
            rightDecimal = rightDecimal.substring(0, 9 - leftDecimal.length);
            displayNumber = leftDecimal + "." + rightDecimal;
        }
    }
    //converts really big / really small numbers to exponential form
    if(displayNumber > 999999999 || displayNumber < -999999999 || displayNumber.includes('e')) {
        displayNumber = parseFloat(displayNumber).toExponential(6).toString();
    }
    display.textContent = displayNumber;
}

//updates number string to be passed to updateDisplay function
function updateDisplayNumber(e) {
    var number = this.getAttribute("data-key");
    if(!decimalMode) {
        if(operatorHolder.length == 2 && equalLast) {
            displayNumber = '';
            operatorHolder = [];
            operation = '';
        }

        if(display.textContent == 0 && number == 0) {
            return;
        }
        else if(operatorHolder.length == 1 && operation == '') {
            displayNumber = number;
            operatorHolder = [];
            updateDisplay();
        }
        else if(displayNumber.length < 9) { //prevent from adding more than 9 digits and going into infinity mode
            if(display.textContent == 0) {
                displayNumber = number;
            }
            else {
                displayNumber += number;
            }
            updateDisplay();
        }
    }
    else {
        if(displayNumber > 1) {
            let leftDecimal = displayNumber.split(".")[0];
            decimalHolder += number;
            displayNumber = leftDecimal + decimalHolder;
        }
        else {
            decimalHolder += number;
            displayNumber = decimalHolder;
        }
        updateDisplay();
    }
    equalLast = false;
}

//resets button styling after press
function unpress(e) {
    if(this.classList.contains('gray-pressed')) {
        this.classList.remove('gray-pressed');
    }
    else if(this.classList.contains('lightGray-pressed')) {
        this.classList.remove('lightGray-pressed');
    }
    else if(this.classList.contains('orange-pressed')) {
        this.classList.remove('orange-pressed');
    }
}

window.addEventListener('load', (event) => {
    display.textContent = 0;
    displayNumber = '';
});

numbers.forEach(number => {number.addEventListener('click', updateDisplayNumber)})

//update button styling on press
buttons.forEach(button => {button.addEventListener('click', function() {
    if(button.classList.contains('gray')) {
        button.classList.add('gray-pressed');
    }
    else if(button.classList.contains('lightGray')) {
        button.classList.add('lightGray-pressed');
    }
    else if(button.classList.contains('orange')) {
        button.classList.add('orange-pressed');
    }
})})
buttons.forEach(button => {button.addEventListener('transitionend', unpress)});

sign.addEventListener('click', function() {
    let negative = parseFloat(display.textContent) * -1;
    displayNumber = negative.toString();
    updateDisplay(displayNumber);
    if(operatorHolder.length == 2)  { //replaces original operation result with new number 
        operatorHolder.splice(0, 1, displayNumber);
        displayNumber = '';
    }
    equalLast = false;
})

document.querySelector(".clear").addEventListener('click', function() {
    display.textContent = 0;
    operation = '';
    displayNumber = '';
    operatorHolder = [];
    equalLast = false;
    decimalMode = false;
    decimalHolder = '';
})

operators.forEach(operator => {operator.addEventListener('click', function() {
    if(operation == '') {
        operation = this.id;

        if(displayNumber == '') {
            displayNumber = '0';
        }
        
        if(operatorHolder.length == 0) {
            operatorHolder.push(parseFloat(displayNumber));
            displayNumber = '';  
        }
        else {
            operatorHolder.push(parseFloat(displayNumber));
            displayNumber = operate(operation, operatorHolder[0], operatorHolder[1]);
            operatorHolder = [parseFloat(displayNumber)];
            display.textContent = displayNumber;
            displayNumber = '';
        }
    }
    else {
        operation = this.id;
    }
    equalLast = false;
    decimalMode = false;
    decimalHolder = '';
})});

document.getElementById("equal").addEventListener('click', function() {
    if(equalLast) {
        displayNumber = operate(operation, operatorHolder[0], operatorHolder[1]).toString();
        operatorHolder[0] = parseFloat(displayNumber);
        updateDisplay(displayNumber); 
    }
    else {
        if(operatorHolder.length == 2) { 
            operatorHolder.pop(); //remove old operator number in order to add new one
        }
        n = parseFloat(displayNumber);
        operatorHolder.push(n);
        displayNumber = operate(operation, operatorHolder[0], operatorHolder[1]).toString();
        operatorHolder = [parseFloat(displayNumber), n];
        updateDisplay(displayNumber); 
        equalLast = true;
    }
    displayNumber = '';
});

decimal.addEventListener('click', function() {
    if(equalLast || display.textContent == 0) {
        operatorHolder = [];
        decimalHolder += "0";
    }
    if(!decimalMode) {
        decimalMode = true;
        if(decimalHolder == '' || decimalHolder == "0") {
            decimalHolder += ".";
        }
    }
    equalLast = false;
    updateDisplayNumber;
});

divideTen.addEventListener('click', function() {
    operatorHolder = [parseFloat(display.textContent), 10];
    displayNumber = operate('divide', operatorHolder[0], operatorHolder[1]).toString();
    operatorHolder = [parseFloat(displayNumber)];
    updateDisplay();
    decimalMode = false;    
    decimalHolder = '';
    equalLast = true;
});

