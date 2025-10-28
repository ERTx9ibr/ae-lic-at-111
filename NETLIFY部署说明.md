# ⚡ Netlify 部署快速指南

## 🎯 优势

### ✅ Netlify 的优点
- 部署快速（1-2分钟）
- 全球 CDN 加速
- 免费额度充足（每月 100GB 带宽）
- 自动 HTTPS
- 简单易用

### ⚠️ 限制
- **SQLite 无法持久化**（必须使用外部数据库）
- Serverless 函数有执行时间限制
- 免费版有调用次数限制

## 🚀 5分钟快速部署

### 步骤 1：推送代码到 GitHub

```bash
cd /Users/ert888/Desktop/ae-lic-at
git add .
git commit -m "Add Netlify support"
git push
```

### 步骤 2：访问 Netlify

1. 打开 [https://app.netlify.com](https://app.netlify.com)
2. 使用 GitHub 账号登录
3. 点击 **"Add new site"** → **"Import an existing project"**
4. 选择 **"GitHub"**
5. 选择 `ae-lic-at` 仓库

### 步骤 3：配置部署

**Site settings:**
- Site name: `ae-license-server`（自定义）
- Branch: `main`
- Build command: 留空
- Publish directory: `public`
- Functions directory: `netlify/functions`

**Environment variables:**（点击 "Advanced" → "New variable"）
```
SECRET_KEY=你的随机密钥
ADMIN_KEY=你的管理员密钥
```

生成随机密钥：
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 步骤 4：部署

1. 点击 **"Deploy site"**
2. 等待 1-2 分钟
3. 部署成功！

### 步骤 5：获取地址

部署成功后，你会看到：
```
https://ae-license-server.netlify.app
```

### 步骤 6：测试 API

```bash
# 测试服务器
curl https://你的网站名.netlify.app/.netlify/functions/api

# 生成激活码
curl https://你的网站名.netlify.app/.netlify/functions/api/gen/test001
```

### 步骤 7：更新客户端

修改 `atysaee.js` 第 423 行：

```javascript
const LICENSE_SERVER = 'https://你的网站名.netlify.app/.netlify/functions/api';
```

## ⚠️ 重要：数据持久化

当前版本使用**内存存储**，函数重启后数据会丢失！

### 推荐方案：Supabase（免费 PostgreSQL）

#### 1. 创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com)
2. 注册并创建新项目
3. 选择区域：Singapore
4. 等待 2 分钟初始化

#### 2. 获取数据库连接

1. 进入项目 → Settings → Database
2. 复制 **Connection string** (URI format)
3. 格式类似：`postgresql://postgres:[password]@[host]:5432/postgres`

#### 3. 在 Netlify 添加环境变量

1. 进入 Netlify 网站设置
2. Site settings → Environment variables
3. 添加：`DATABASE_URL=你的Supabase连接字符串`
4. 保存并重新部署

#### 4. 修改函数代码

编辑 `netlify/functions/api.js`，在文件开头添加：

```javascript
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 初始化表
pool.query(`
  CREATE TABLE IF NOT EXISTS licenses (
    code TEXT PRIMARY KEY,
    machineId TEXT,
    createdAt BIGINT,
    activatedAt BIGINT
  )
`).catch(() => console.log('Table exists'));
```

然后替换所有内存操作为数据库查询。

#### 5. 安装依赖

在 `package.json` 中添加：

```json
{
  "dependencies": {
    "pg": "^8.11.0"
  }
}
```

重新部署：
```bash
git add .
git commit -m "Add PostgreSQL support"
git push
```

## 📊 免费额度

Netlify 免费版：
- ✅ 100GB 带宽/月
- ✅ 300 分钟构建时间/月
- ✅ 125K Serverless 请求/月
- ✅ 完全够个人项目使用！

## 🎯 常用命令

```bash
# 生成激活码
curl https://你的网站.netlify.app/.netlify/functions/api/gen/test001

# 批量生成
curl -X POST https://你的网站.netlify.app/.netlify/functions/api/gen/batch \
  -H "Content-Type: application/json" \
  -d '{"count": 10, "adminKey": "你的密钥"}'

# 查询状态
curl -X POST https://你的网站.netlify.app/.netlify/functions/api/admin/check \
  -H "Content-Type: application/json" \
  -d '{"code": "ABC123", "adminKey": "你的密钥"}'

# 统计信息
curl https://你的网站.netlify.app/.netlify/functions/api/stats
```

## 💡 提示

1. **首次访问**可能需要几秒初始化函数
2. **自定义域名**：在 Site settings → Domain management
3. **查看日志**：Functions 标签 → 点击函数 → View logs
4. **环境变量**：修改后需要重新部署才生效

## 🆘 常见问题

### Q: 部署失败？

**A**: 检查以下几点：
1. `netlify.toml` 文件存在
2. `netlify/functions/api.js` 文件存在
3. `public` 目录存在
4. 环境变量设置正确

### Q: 函数调用失败？

**A**: 查看 Functions 日志：
1. Netlify Dashboard → Functions 标签
2. 点击 api 函数
3. 查看 Function log

### Q: 数据丢失？

**A**: 必须使用外部数据库！推荐：
- Supabase（PostgreSQL，免费）
- MongoDB Atlas（MongoDB，免费）
- Upstash（Redis，免费）

### Q: 如何查看实时日志？

**A**: 
1. Netlify Dashboard → Functions
2. 点击 api 函数
3. 查看 Real-time logs

## 🎉 完成！

现在你可以：
1. 📤 生成激活码分发给用户
2. 📊 通过 API 管理激活码
3. 🚀 集成到你的 AE 插件

---

**享受使用吧！** 🎉

需要帮助？查看 `DEPLOY.md` 完整文档。

