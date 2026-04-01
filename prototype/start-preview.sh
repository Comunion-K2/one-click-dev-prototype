#!/bin/bash

# One-Click Dev 原型预览启动脚本

echo "🚀 启动 One-Click Dev 原型预览..."

# 检查Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 错误: Node.js 未安装"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查文件
if [ ! -f "one-click-dev-prototype.html" ]; then
    echo "❌ 错误: 找不到 HTML 文件"
    exit 1
fi

if [ ! -f "preview-server.js" ]; then
    echo "❌ 错误: 找不到服务器文件"
    exit 1
fi

# 启动服务器
echo "📁 项目目录: $(pwd)"
echo "🌐 启动本地服务器..."

node preview-server.js

# 如果服务器意外退出
if [ $? -ne 0 ]; then
    echo "❌ 服务器启动失败"
    echo "可能的原因:"
    echo "1. 端口 3000 已被占用"
    echo "2. Node.js 版本不兼容"
    echo "3. 文件权限问题"
    exit 1
fi