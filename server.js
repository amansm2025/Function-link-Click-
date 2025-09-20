const express = require('express');
const { exec } = require('child_process');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'function.html'));
});

app.post('/trigger-autoclick', (req, res) => {
    // Simulate autoclick functionality
    console.log('Autoclick triggered!');
    res.json({ success: true, output: 'Autoclick simulation completed' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});