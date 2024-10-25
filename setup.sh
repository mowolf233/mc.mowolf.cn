#!/bin/bash

# 步骤 1: 检查Node.js版本（>= 20）
echo "检查 Node.js 版本..."
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo "Node.js 版本小于20，正在更新..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
    else
        echo "Node.js 已安装，版本满足要求。"
    fi
else
    echo "Node.js 未安装，正在安装..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# 步骤 2: 检查 npm 是否安装
echo "检查 npm 是否安装..."
if ! command -v npm >/dev/null 2>&1; then
    echo "npm 未安装，正在安装..."
    sudo apt-get install -y npm
else
    echo "npm 已安装。"
fi

# 步骤 3: 检查 git 是否安装
echo "检查 git 是否安装..."
if ! command -v git >/dev/null 2>&1; then
    echo "git 未安装，正在安装..."
    sudo apt-get install -y git
else
    echo "git 已安装。"
fi

# 步骤 4: 克隆项目
echo "正在克隆项目..."
git clone https://github.com/bangbang93/openbmclapi
cd openbmclapi || exit

# 步骤 5: 创建空的 .env 文件
echo "创建空的 .env 文件..."
touch .env

# 步骤 6: 安装依赖
echo "安装依赖..."
npm ci

# 步骤 7: 编译项目
echo "编译项目..."
npm run build

# 步骤 8: 运行项目
echo "运行项目..."
node dist/index.js

# 步骤 9: 报错检查
echo "脚本无法检测报错状态，请检查是否有“CLUSTER_ID is not set”的报错，如果有，代表一切正常，如果报错不同，请查看https://kkgithub.com/bangbang93/openbmclapi文档"
