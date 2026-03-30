// One-Click Dev 原型预览服务器
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const HTML_FILE = path.join(__dirname, 'one-click-dev-prototype.html');

const server = http.createServer((req, res) => {
    // 只服务根路径
    if (req.url === '/' || req.url === '/index.html') {
        fs.readFile(HTML_FILE, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Error loading HTML file');
                return;
            }
            
            res.writeHead(200, {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'no-cache',
                'X-Frame-Options': 'SAMEORIGIN',
                'X-Content-Type-Options': 'nosniff'
            });
            res.end(content);
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`
🚀 One-Click Dev 原型服务器已启动！
    
📁 文件位置: ${HTML_FILE}
🌐 访问地址: http://localhost:${PORT}
    
✨ 功能特色:
• 完整的UI/UX设计，响应式布局
• SEO优化（标题、描述、结构化数据）
• GEO优化（位置、语言、时区检测）
• 交互式聊天演示
• 动画和过渡效果
• 暗色主题支持
    
📱 响应式断点:
• 移动端: < 768px
• 平板端: 768px - 1024px
• 桌面端: > 1024px
    
🔍 SEO特性:
• 语义化HTML结构
• 完整的meta标签
• Open Graph和Twitter Card
• Schema.org结构化数据
• 语义化标题层级
    
🌍 GEO特性:
• 多语言支持
• 时区感知
• 位置服务集成
• 区域化内容适配
    
按 Ctrl+C 停止服务器
`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n👋 服务器正在关闭...');
    server.close(() => {
        console.log('✅ 服务器已关闭');
        process.exit(0);
    });
});