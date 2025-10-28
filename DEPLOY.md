# 🚀 Render.com 快速部署指南

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
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

## 第二步：在 Render.com 部署

### 2.1 注册/登录 Render.com

访问 [https://render.com](https://render.com) 并登录

### 2.2 创建新的 Web Service

1. 点击 Dashboard 中的 **"New +"** 按钮
2. 选择 **"Web Service"**
3. 连接你的 GitHub 账号（如果还没连接）
4. 选择你刚才推送的仓库

### 2.3 配置服务

填写以下信息：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| Name | `ae-license-server` | 服务名称（可自定义） |
| Region | `Singapore` 或最近的区域 | 选择离用户最近的服务器 |
| Branch | `main` | Git 分支 |
| Root Directory | 留空 | 默认根目录 |
| Environment | `Node` | 运行环境 |
| Build Command | `npm install` | 构建命令 |
| Start Command | `npm start` | 启动命令 |
| Instance Type | `Free` | 免费套餐 |

### 2.4 设置环境变量

点击 **"Advanced"**，然后添加环境变量：

```
SECRET_KEY=你的随机密钥_建议30位以上
ADMIN_KEY=你的管理员密钥_建议30位以上
```

> 💡 **提示**：可以使用以下命令生成随机密钥：
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 2.5 部署

1. 点击 **"Create Web Service"**
2. 等待部署完成（约 2-5 分钟）
3. 部署成功后，你会看到服务地址，例如：
   ```
   https://ae-license-server.onrender.com
   ```

## 第三步：测试服务器

### 3.1 测试服务器状态

```bash
curl https://你的服务器地址.onrender.com/
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
curl https://你的服务器地址.onrender.com/gen/test001
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
const LICENSE_SERVER = 'https://your-server.onrender.com';
```

改为：

```javascript
const LICENSE_SERVER = 'https://你的实际服务器地址.onrender.com';
```

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
export SERVER_URL=https://你的服务器地址.onrender.com
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
curl -X POST https://你的服务器地址.onrender.com/gen/batch \
  -H "Content-Type: application/json" \
  -d '{
    "count": 10,
    "adminKey": "你的管理员密钥"
  }'
```

## 常见问题

### Q1: 部署后访问很慢或超时？

**A**: Render.com 免费套餐在 15 分钟无活动后会休眠，首次访问需要等待 10-30 秒唤醒。

**解决方案**：
1. 升级到付费套餐（$7/月起）
2. 使用 Uptime Robot 等服务定期 ping 你的服务器保持活跃
3. 使用其他不休眠的托管服务

### Q2: 激活后重启电脑/清理浏览器，激活失效？

**A**: 机器码是基于浏览器指纹生成的，清理浏览器数据会改变指纹。

**解决方案**：
1. 提示用户不要清理浏览器数据
2. 使用管理员接口解绑后重新激活
3. 改进机器码生成逻辑，使用更稳定的特征

### Q3: 数据库数据丢失？

**A**: Render.com 免费套餐不保证文件系统持久化。

**解决方案**：
1. 升级到付费套餐
2. 使用外部数据库（PostgreSQL、MongoDB）
3. 定期备份数据库文件

### Q4: CORS 错误？

**A**: 检查服务器是否正确配置了 CORS。

**解决方案**：
服务器已经配置了 `Access-Control-Allow-Origin: *`，如果还有问题，检查：
1. 浏览器控制台的具体错误信息
2. 确认服务器正常运行
3. 确认客户端地址正确

## 进阶配置

### 限制 CORS 来源（生产环境推荐）

在 `server.js` 中修改：

```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://你的域名.com');
  // ... 其他配置
});
```

### 使用外部数据库

如果需要持久化数据，可以：

1. 在 Render.com 创建 PostgreSQL 数据库
2. 安装 `pg` 包：`npm install pg`
3. 修改 `server.js` 使用 PostgreSQL

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

在 Render.com Dashboard 中：
1. 进入你的服务
2. 点击 "Logs" 标签
3. 实时查看服务器日志

### 设置告警

Render.com 提供邮件通知：
1. 进入服务设置
2. 配置 "Notifications"
3. 设置部署失败、服务崩溃等告警

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

