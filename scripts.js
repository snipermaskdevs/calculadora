let currentOperation = '';
let currentValue = '0';
let firstValue = null;
const historyList = document.getElementById('historyList');

// Limite para números grandes
const MAX_VALUE = 1e10;
const MIN_VALUE = -1e10;

function appendValue(value) {
    if (currentValue === '0') {
        currentValue = value;
    } else {
        currentValue += value;
    }
    updateOutput();
}

function setOperation(operation) {
    if (currentValue) {
        firstValue = parseFloat(currentValue);
        currentValue = '';
        currentOperation = operation;
        updateOutput();
    }
}

function calculateResult() {
    if (firstValue !== null && currentValue) {
        let secondValue = parseFloat(currentValue);

        // Verificação de limite de valores para evitar overflow
        if (Math.abs(firstValue) > MAX_VALUE || Math.abs(secondValue) > MAX_VALUE) {
            currentValue = 'Erro: Número muito grande';
            updateOutput();
            return;
        }

        // Operações com verificação de divisão por zero
        let result;
        switch (currentOperation) {
            case '+':
                result = firstValue + secondValue;
                break;
            case '-':
                result = firstValue - secondValue;
                break;
            case '*':
                result = firstValue * secondValue;
                break;
            case '/':
                if (secondValue === 0) {
                    currentValue = 'Erro: Divisão por zero';
                    updateOutput();
                    return;
                }
                result = firstValue / secondValue;
                break;
        }

        // Checando se o resultado ultrapassou o limite máximo
        if (Math.abs(result) > MAX_VALUE) {
            currentValue = 'Erro: Resultado muito grande';
        } else {
            // Remove casas decimais se o resultado for inteiro
            currentValue = Number(result) % 1 === 0 ? result.toFixed(0) : result.toFixed(4);
        }

        addToHistory(`${firstValue} ${currentOperation} ${secondValue} = ${currentValue}`);
        firstValue = null;
        currentOperation = '';
        updateOutput();
    }
}

function appendFunction(func) {
    try {
        const result = eval(`${func}(${currentValue})`);
        if (result === Infinity || result === -Infinity || isNaN(result)) {
            throw new Error('Resultado inválido');
        }
        currentValue = result.toFixed(4);
        addToHistory(`${func}(${currentValue})`);
        updateOutput();
    } catch (error) {
        currentValue = 'Erro';
        updateOutput();
    }
}

function appendSqrt() {
    // Verificar se o valor é um número válido
    const num = parseFloat(currentValue);
    if (num < 0) {
        currentValue = 'Erro: Raiz quadrada de número negativo';
    } else {
        currentValue = Math.sqrt(num).toFixed(4); // Calcula a raiz quadrada
    }
    updateOutput();
    addToHistory(`√${currentValue}`);
}

function appendSquare() {
    // Verifica se o número é válido e calcula o quadrado
    const num = parseFloat(currentValue);
    if (isNaN(num)) {
        currentValue = 'Erro: Valor inválido';
    } else {
        currentValue = Math.pow(num, 2).toFixed(4); // Calcula o quadrado de x
    }
    updateOutput();
    addToHistory(`${currentValue}²`);
}

function updateOutput() {
    document.getElementById('output').textContent = currentValue;
}

function addToHistory(entry) {
    const listItem = document.createElement('li');
    listItem.textContent = entry;
    historyList.appendChild(listItem);
}

function clearOutput() {
    currentValue = '0';
    updateOutput();
}

function plotGraph() {
    const ctx = document.getElementById('graphCanvas').getContext('2d');
    let xValues = [];
    let yValues = [];

    for (let x = -10; x <= 10; x += 0.1) {
        xValues.push(x);
        yValues.push(Math.sin(x));
    }

    const data = {
        labels: xValues,
        datasets: [{
            label: 'Gráfico de Seno',
            data: yValues,
            borderColor: 'rgb(75, 192, 192)',
            borderWidth: 1,
            fill: false
        }]
    };

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom'
                }
            }
        }
    });
}
