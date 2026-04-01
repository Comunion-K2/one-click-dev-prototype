const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001; // 使用不同端口避免冲突
const HTML_FILE = path.join(__dirname, 'one-click-dev-standalone.html');

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Host: ${req.headers.host}`);
    
    // 允许所有CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    
    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    
    // 服务HTML文件
    if (req.url === '/' || req.url.includes('.html')) {
        fs.readFile(HTML_FILE, 'utf8', (err, content) => {
            if (err) {
                console.error('Error:', err);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Server Error');
                return;
            }
            
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache',
                'X-Powered-By': 'Node.js Simple Server'
            });
            res.end(content);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

// 监听所有接口
server.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const interfaces = os.networkInterfaces();
    let localIP = 'localhost';
    
    Object.keys(interfaces).forEach(iface => {
        interfaces[iface].forEach(addr => {
            if (addr.family === 'IPv4' && !addr.internal) {
                localIP = addr.address;
            }
        });
    });
    
    console.log(`
===========================================
🚀 One-Click Dev 无限制服务器已启动！
===========================================

📁 服务文件: ${HTML_FILE}
🌐 本地访问: http://localhost:${PORT}
🌐 网络访问: http://${localIP}:${PORT}

✅ 服务器特性:
• 无主机名限制 - 允许任何域名访问
• 完全CORS支持 - 允许所有来源
• 纯Node.js - 无框架限制
• 实时日志 - 查看所有访问请求

🔧 技术信息:
• 端口: ${PORT}
• 协议: HTTP
• 进程ID: ${process.pid}
• 内存使用: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB

📊 访问日志将显示在下方...
===========================================
`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 正在关闭服务器...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});

// 错误处理
server.on('error', (err) => {
    console.error('服务器错误:', err);
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  端口 ${PORT} 已被占用，尝试端口 ${PORT + 1}`);
        server.listen(PORT + 1, '0.0.0.0');
    }
});