const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint for calculations
app.post('/api/calculate', (req, res) => {
  try {
    const { expression } = req.body;
    
    if (!expression) {
      return res.status(400).json({ error: 'Expression is required' });
    }
    
    // Basic validation to prevent dangerous expressions
    if (!/^[\d+\-*/.().\s]*$/.test(expression)) {
      return res.status(400).json({ error: 'Invalid expression' });
    }
    
    // Evaluate the expression
    const result = eval(expression);
    
    // Round to avoid floating point errors
    const finalResult = Math.round(result * 100000000) / 100000000;
    
    res.json({ result: finalResult, expression: expression });
  } catch (error) {
    res.status(400).json({ error: 'Invalid calculation: ' + error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Calculator server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Calculator app running on http://localhost:${PORT}`);
});
