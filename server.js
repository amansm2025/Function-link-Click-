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
        const { url } = req.body;
        const targetUrl = url || 'https://example.com';
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.goto(targetUrl);
        
        const links = await page.$$('a');
        let clickCount = 0;
        let results = [];
        
        for (let i = 0; i < Math.min(links.length, 5); i++) {
            const linkText = await links[i].evaluate(el => el.textContent.trim());
            const linkHref = await links[i].evaluate(el => el.href);
            
            await links[i].click();
            clickCount++;
            results.push(`Clicked: "${linkText}" (${linkHref})`);
            
            await page.waitForTimeout(500);
        }
        
        await browser.close();
        
        res.json({ 
            success: true, 
            output: `Visited: ${targetUrl}\nClicked ${clickCount} links:\n${results.join('\n')}` 
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