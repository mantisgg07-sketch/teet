const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'lib', 'seo-data');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.js'));

const slugs = new Set();
let allCode = [];

files.forEach(f => {
    const p = path.join(dir, f);
    const code = fs.readFileSync(p, 'utf-8');
    allCode.push({ file: f, path: p, code });
    const matches = [...code.matchAll(/slug:\s*'([^']+)'/g)];
    matches.forEach(m => slugs.add(m[1]));
});

const broken = [];
allCode.forEach(item => {
    const matches = [...item.code.matchAll(/url:\s*'([^']+)'/g)];
    matches.forEach(m => {
        let url = m[1].startsWith('/') ? m[1].substring(1) : m[1];
        if (!url.startsWith('tours') && !slugs.has(url)) {
            broken.push({ url: url, file: item.file });
        }
    });
});

console.log(JSON.stringify(broken, null, 2));
