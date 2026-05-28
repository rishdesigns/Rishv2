const fs = require('fs');
const path = require('path');
const http = require('http');

const dataFilePath = path.join(__dirname, '../data/selectedWorkProjects.js');

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/api/projects') {
        try {
            const content = fs.readFileSync(dataFilePath, 'utf8');
            // Extract IDs to find the max ID
            const ids = [...content.matchAll(/id:\s*(\d+)/g)].map(m => parseInt(m[1]));
            const maxId = ids.length > 0 ? Math.max(...ids) : 0;
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ maxId }));
        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    if (req.method === 'POST' && req.url === '/api/projects') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const newProject = JSON.parse(body);
                const content = fs.readFileSync(dataFilePath, 'utf8');
                
                // Find the insertion point: the last `];` before `// Helper function`
                const marker = '// Helper function to get project by slug';
                const markerIndex = content.indexOf(marker);
                
                if (markerIndex === -1) {
                    throw new Error('Could not find marker to insert data in selectedWorkProjects.js');
                }
                
                const beforeMarker = content.substring(0, markerIndex);
                const lastBracketIndex = beforeMarker.lastIndexOf('];');
                
                if (lastBracketIndex === -1) {
                    throw new Error('Could not find closing bracket of array.');
                }
                
                // Ensure newProject properties are ordered nicely, we stringify it
                const newProjectStr = JSON.stringify(newProject, null, 4);
                
                // Indent with 4 spaces to match the array indentation
                const indentedStr = newProjectStr.split('\n').map(line => '    ' + line).join('\n');
                
                // Also check if there's a comma before the last bracket
                // If not, we just append it with a comma
                
                // Find the actual content inside the array right before the bracket
                let contentBeforeBracket = content.substring(0, lastBracketIndex).trimEnd();
                // If it doesn't end with a comma, add one
                if (!contentBeforeBracket.endsWith(',')) {
                    contentBeforeBracket += ',';
                }
                
                const newContent = contentBeforeBracket + '\n' + indentedStr + '\n];\n\n' + content.substring(markerIndex);
                                 
                fs.writeFileSync(dataFilePath, newContent, 'utf8');
                
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error(err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: err.message }));
            }
        });
        return;
    }

    // Serve static files
    let filePath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url);
    const extname = path.extname(filePath);
    let contentType = 'text/html';
    switch (extname) {
        case '.js': contentType = 'text/javascript'; break;
        case '.css': contentType = 'text/css'; break;
        case '.json': contentType = 'application/json'; break;
        case '.png': contentType = 'image/png'; break;
        case '.jpg': contentType = 'image/jpg'; break;
        case '.svg': contentType = 'image/svg+xml'; break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if(error.code == 'ENOENT') {
                res.writeHead(404);
                res.end('File Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`CMS Server running at http://localhost:${PORT}/`);
    console.log(`Press Ctrl+C to stop.`);
});
