let display = document.getElementById('display');
let statusElement = document.getElementById('status');

function appendNumber(num) {
    display.value += num;
    updateStatus('Ready');
}

function appendOperator(op) {
    if (display.value === '') return;
    
    // Prevent multiple operators in a row
    const lastChar = display.value[display.value.length - 1];
    if (['+', '-', '*', '/'].includes(lastChar)) {
        return;
    }
    
    display.value += op;
    updateStatus('Ready');
}

function clearDisplay() {
    display.value = '';
    updateStatus('Cleared');
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
    updateStatus('Ready');
}

async function calculateResult() {
    try {
        if (display.value === '') return;
        
        updateStatus('Calculating...');
        
        // Send calculation to server
        const response = await fetch('/api/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ expression: display.value })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            display.value = 'Error: ' + data.error;
            updateStatus('Error');
            setTimeout(() => {
                display.value = '';
                updateStatus('Ready');
            }, 2000);
            return;
        }
        
        display.value = data.result;
        updateStatus('✓ Done');
    } catch (error) {
        display.value = 'Error';
        updateStatus('Network Error');
        setTimeout(() => {
            display.value = '';
            updateStatus('Ready');
        }, 2000);
    }
}

function updateStatus(message) {
    if (statusElement) {
        statusElement.textContent = message;
    }
}

// Allow keyboard input
document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendOperator(key);
    } else if (key === '.' || key === ',') {
        appendOperator('.');
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault();
        calculateResult();
    } else if (key === 'Backspace') {
        event.preventDefault();
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});

// Check server health on load
window.addEventListener('load', async () => {
    try {
        const response = await fetch('/api/health');
        const data = await response.json();
        if (data.status === 'OK') {
            updateStatus('Connected');
        }
    } catch (error) {
        updateStatus('Offline');
    }
});
