# ⚡ Vercel 部署快速指南

## 🎯 重要提示

Vercel 使用 Serverless 架构，与传统服务器不同：

### ✅ 优势
- 部署快速（1-2分钟）
- 全球 CDN 加速
- 免费额度充足
- 自动 HTTPS

### ⚠️ 限制
- **SQLite 无法持久化**（必须使用外部数据库）
- 每次请求是独立的函数调用
- 免费版有调用次数限制

## 🚀 快速部署步骤

### 1. 推送代码到 GitHub

```bash
cd /Users/ert888/Desktop/ae-lic-at
git add .
git commit -m "Add Vercel support"
git push
```

### 2. 访问 Vercel

1. 打开 [https://vercel.com](https://vercel.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add New..."** → **"Project"**
4. 选择 `ae-lic-at` 仓库
5. 点击 **"Import"**

### 3. 配置环境变量

在部署配置页面添加：

```
SECRET_KEY=你的随机密钥
ADMIN_KEY=你的管理员密钥
```

生成随机密钥：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. 点击 Deploy

等待 1-2 分钟，部署完成！

### 5. 获取地址

部署成功后，你会看到类似：
```
https://ae-license-server.vercel.app
```

### 6. 测试 API

```bash
# 测试服务器
curl https://你的项目名.vercel.app/api

# 生成激活码
curl https://你的项目名.vercel.app/api/gen/test001
```

### 7. 更新客户端

修改 `atysaee.js` 第 423 行：

```javascript
const LICENSE_SERVER = 'https://你的项目名.vercel.app/api';
```

## ⚠️ 重要：数据持久化

当前版本使用**内存存储**，重启后数据会丢失！

### 解决方案：使用 Vercel Postgres

#### 步骤 1：创建数据库

1. 进入 Vercel 项目
2. 点击 **"Storage"** 标签
3. 点击 **"Create Database"**
4. 选择 **"Postgres"**
5. 选择区域（推荐 Singapore）
6. 点击 **"Create"**

#### 步骤 2：修改代码

Vercel 会自动添加环境变量 `POSTGRES_URL`

修改 `api/index.js`：

```javascript
// 在文件开头添加
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 初始化表（只需执行一次）
pool.query(`
  CREATE TABLE IF NOT EXISTS licenses (
    code TEXT PRIMARY KEY,
    machineId TEXT,
    createdAt BIGINT,
    activatedAt BIGINT
  )
`).catch(err => console.log('Table exists'));

// 然后替换所有内存操作为数据库查询
```

#### 步骤 3：安装依赖

在 `package.json` 中添加：

```json
{
  "dependencies": {
    "pg": "^8.11.0"
  }
}
```

然后重新部署：
```bash
git add .
git commit -m "Add PostgreSQL support"
git push
```

Vercel 会自动重新部署。

## 📊 免费额度

Vercel 免费版：
- ✅ 100GB 带宽/月
- ✅ 100 次部署/天
- ✅ Serverless 函数执行时间充足
- ✅ 完全够用！

## 🎯 快速命令

```bash
# 生成激活码
curl https://你的项目.vercel.app/api/gen/test001

# 批量生成
curl -X POST https://你的项目.vercel.app/api/gen/batch \
  -H "Content-Type: application/json" \
  -d '{"count": 10, "adminKey": "你的密钥"}'

# 查询状态
curl -X POST https://你的项目.vercel.app/api/admin/check \
  -H "Content-Type: application/json" \
  -d '{"code": "ABC123", "adminKey": "你的密钥"}'

# 统计信息
curl https://你的项目.vercel.app/api/stats
```

## 💡 提示

1. 第一次访问可能需要几秒唤醒函数
2. 后续访问会很快
3. 建议使用 Vercel Postgres 确保数据安全
4. 可以绑定自定义域名

## 🆘 遇到问题？

1. 查看 Vercel Dashboard 的 **Functions** 日志
2. 查看 **Deployments** 的构建日志
3. 确认环境变量设置正确
4. 检查 API 路径是否包含 `/api` 前缀

---

**开始使用吧！** 🎉

