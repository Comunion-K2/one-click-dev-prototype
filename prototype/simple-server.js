const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML_FILE = path.join(__dirname, 'one-click-dev-prototype.html');

const server = http.createServer((req, res) => {
    // 允许所有来源的CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // 只服务根路径
    if (req.url === '/' || req.url === '/index.html' || req.url === '/one-click-dev-prototype.html') {
        fs.readFile(HTML_FILE, 'utf8', (err, content) => {
            if (err) {
                console.error('Error reading HTML file:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading HTML file');
                return;
            }
            
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0',
                'X-Content-Type-Options': 'nosniff',
                'X-Frame-Options': 'SAMEORIGIN'
            });
            res.end(content);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// 监听所有网络接口
server.listen(PORT, '0.0.0.0', () => {
    console.log(`
🚀 One-Click Dev 原型服务器已启动！
    
📁 文件位置: ${HTML_FILE}
🌐 本地访问: http://localhost:${PORT}
🌐 网络访问: http://[你的IP地址]:${PORT}
    
✅ 服务器配置:
• 监听所有网络接口 (0.0.0.0)
• 启用CORS (允许所有来源)
• 支持OPTIONS预检请求
• 无主机名限制
    
📱 现在可以通过ngrok访问了！
    
按 Ctrl+C 停止服务器
`);
});

// 获取本地IP地址
const os = require('os');
const networkInterfaces = os.networkInterfaces();
let localIP = '未知';

Object.keys(networkInterfaces).forEach(interfaceName => {
    networkInterfaces[interfaceName].forEach(interface => {
        if (interface.family === 'IPv4' && !interface.internal) {
            localIP = interface.address;
        }
    });
});

console.log(`📡 本地IP地址: ${localIP}:${PORT}`);

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 服务器正在关闭...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});