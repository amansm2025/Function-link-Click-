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
    exec('npm run autoclick', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error}`);
            return res.status(500).json({ success: false, error: error.message });
        }
        res.json({ success: true, output: stdout });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});