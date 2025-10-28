# 🚀 Netlify.com 快速部署指南

## 第一步：准备代码

### 1.1 初始化 Git 仓库（如果还没有）

```bash
cd /Users/ert888/Desktop/ae-lic-at
git init
git add .
git commit -m "Initial commit: AE License Server"
```

### 1.2 推送到远程仓库

创建一个新的 GitHub 仓库，然后：

```bash
git remote add origin https://github.com/ERTx9ibr/ae-lic-at
git branch -M main
git push -u origin main
```

## 第二步：在 Netlify.com 部署

### 2.1 注册/登录 Netlify

访问 [https://app.netlify.com](https://app.netlify.com) 并登录（可以使用 GitHub 账号直接登录）

### 2.2 导入项目

1. 点击 **"Add new site"** → **"Import an existing project"**
2. 选择 **"GitHub"**（首次使用需要授权）
3. 从列表中选择你的仓库 `ae-lic-at`
4. 点击仓库进入配置页面

### 2.3 配置项目

填写以下信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Site name | `ae-license-server` | 网站名称（可自定义） |
| Branch to deploy | `main` | 部署分支 |
| Base directory | 留空 | 使用根目录 |
| Build command | 留空 | 无需构建 |
| Publish directory | `public` | 发布目录 |
| Functions directory | `netlify/functions` | Serverless 函数目录 |

### 2.4 设置环境变量

点击 **"Advanced"** → **"New variable"**，添加：

```
SECRET_KEY=你的随机密钥_建议30位以上
ADMIN_KEY=你的管理员密钥_建议30位以上
```

> 💡 **提示**：可以使用以下命令生成随机密钥：
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 2.5 部署

1. 点击 **"Deploy site"**
2. 等待部署完成（约 1-2 分钟）
3. 部署成功后，你会看到服务地址，例如：
   ```
   https://ae-license-server.netlify.app
   ```

## 第三步：测试服务器

### 3.1 测试服务器状态

```bash
curl https://你的网站名.netlify.app/.netlify/functions/api
```

应该返回：
```json
{
  "status": "running",
  "service": "AE License Server",
  "version": "1.0.0",
  "timestamp": "..."
}
```

### 3.2 生成测试激活码

```bash
curl https://你的网站名.netlify.app/.netlify/functions/api/gen/test001
```

返回示例：
```json
{
  "seed": "test001",
  "code": "ABC1234567",
  "message": "激活码生成成功"
}
```

## 第四步：配置客户端

### 4.1 修改 atysaee.js

打开 `atysaee.js` 文件，找到第 423 行左右：

```javascript
const LICENSE_SERVER = 'https://your-site.netlify.app';
```

改为：

```javascript
const LICENSE_SERVER = 'https://你的网站名.netlify.app/.netlify/functions/api';
```

**注意：** Netlify 部署的 API 路径是 `/.netlify/functions/api`。

### 4.2 测试激活界面

打开 `test-demo.html` 文件：

1. 点击"打开激活界面"按钮
2. 输入刚才生成的激活码
3. 点击"立即激活"
4. 如果看到"激活成功"，说明一切正常！

## 第五步：使用管理工具

### 5.1 配置管理工具

设置环境变量：

```bash
export SERVER_URL=https://你的网站名.netlify.app/.netlify/functions/api
export ADMIN_KEY=你设置的管理员密钥
```

或者直接在命令中使用。

### 5.2 运行管理工具

```bash
cd /Users/ert888/Desktop/ae-lic-at
npm install node-fetch
node admin-tool.js
```

这将启动交互式管理界面，你可以：
- 生成激活码（单个/批量）
- 查询激活码状态
- 解绑激活码
- 删除激活码
- 查看统计信息

### 5.3 批量生成激活码

也可以直接使用 API：

```bash
curl -X POST https://你的网站名.netlify.app/.netlify/functions/api/gen/batch \
  -H "Content-Type: application/json" \
  -d '{
    "count": 10,
    "adminKey": "你的管理员密钥"
  }'
```

## 常见问题

### Q1: 数据库数据丢失？

**A**: Netlify Functions 是 Serverless 平台，每次请求都是独立的函数执行，本地 SQLite 无法持久化。

**解决方案（必须使用外部数据库）**：
1. 使用 [Supabase](https://supabase.com)（推荐，免费 PostgreSQL）
2. 使用 [MongoDB Atlas](https://www.mongodb.com/atlas)（免费 MongoDB）
3. 使用 [PlanetScale](https://planetscale.com)（免费 MySQL）
4. 使用 [Upstash](https://upstash.com)（Redis，适合简单存储）

### Q2: 如何使用 Supabase 数据库？

1. 访问 [https://supabase.com](https://supabase.com) 注册
2. 创建新项目，选择区域（推荐 Singapore）
3. 获取数据库连接信息（在 Settings → Database）
4. 在 Netlify 环境变量中添加 `DATABASE_URL`
5. 修改函数代码使用 PostgreSQL

### Q3: 激活后重启电脑/清理浏览器，激活失效？

**A**: 机器码是基于硬件信息（CPU、GPU）生成的，正常情况下不会变化。

**解决方案**：
1. 检查浏览器控制台是否有错误
2. 使用管理员接口解绑后重新激活
3. 确认用户没有清除 localStorage

### Q4: CORS 错误？

**A**: 检查服务器是否正确配置了 CORS。

**解决方案**：
服务器已经配置了 `Access-Control-Allow-Origin: *`，如果还有问题，检查：
1. 浏览器控制台的具体错误信息
2. 确认服务器正常运行
3. 确认客户端地址正确

## 进阶配置

### 使用外部数据库（重要！）

Netlify Functions 必须使用外部数据库，推荐使用 Supabase：

#### 步骤 1：创建 Supabase 项目

1. 访问 [https://supabase.com](https://supabase.com) 并注册
2. 点击 **"New Project"**
3. 填写项目信息，选择区域（推荐 Singapore）
4. 等待数据库初始化（约 2 分钟）

#### 步骤 2：获取连接信息

1. 进入项目 → Settings → Database
2. 复制 **Connection string** (URI)
3. 在 Netlify 添加环境变量 `DATABASE_URL`

#### 步骤 3：修改函数代码

修改 `netlify/functions/api.js` 使用 PostgreSQL：

```javascript
const { Pool } = require('pg');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// 创建表（首次运行）
pool.query(`
  CREATE TABLE IF NOT EXISTS licenses (
    code TEXT PRIMARY KEY,
    machineId TEXT,
    createdAt BIGINT,
    activatedAt BIGINT
  )
`).catch(() => {});
```

### 限制 CORS 来源（生产环境推荐）

在 `netlify/functions/api.js` 中修改：

```javascript
headers['Access-Control-Allow-Origin'] = 'https://你的域名.com';
```

### 添加日志记录

安装 Winston 或 Morgan：

```bash
npm install winston morgan
```

然后在 `server.js` 中添加日志中间件。

### 添加速率限制

防止暴力破解：

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 最多100次请求
});

app.use('/verify', limiter);
```

## 监控和维护

### 查看日志

在 Netlify Dashboard 中：
1. 进入你的网站
2. 点击 **"Functions"** 标签查看函数列表
3. 点击具体函数查看调用日志
4. 点击 **"Logs"** 查看实时日志流

### 设置告警

Netlify 提供多种通知方式：
1. 在 Site settings → **Build & deploy** → **Deploy notifications**
2. 可以配置邮件、Slack、Webhook 等
3. 设置部署成功/失败通知

### 定期检查

建议每周检查：
- 服务器运行状态
- 激活码使用情况
- 数据库备份
- 日志中的异常

## 下一步

✅ 服务器已部署
✅ 客户端已配置
✅ 管理工具可用

现在你可以：
1. 📤 分发激活码给用户
2. 📊 监控激活情况
3. 🔧 根据需求调整配置
4. 🚀 集成到你的 AE 插件中

---

**祝部署顺利！** 🎉

如有问题，请查看 `README.md` 中的完整文档。

