const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static('.'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'function.html'));
});

app.post('/trigger-autoclick', async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        // Navigate to a test page
        await page.goto('https://example.com');
        
        // Click on links (example)
        const links = await page.$$('a');
        let clickCount = 0;
        
        for (let i = 0; i < Math.min(links.length, 3); i++) {
            await links[i].click();
            clickCount++;
            await page.waitForTimeout(1000);
        }
        
        await browser.close();
        
        res.json({ 
            success: true, 
            output: `Clicked ${clickCount} links successfully` 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});