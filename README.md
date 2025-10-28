# AE 插件激活码系统

一个完整的激活码验证系统，支持一机一码绑定、联网验证、解绑等功能。

## 🎯 功能特性

### 服务器端 (server.js)
- ✅ 激活码生成（单个/批量）
- ✅ 激活码验证与机器码绑定
- ✅ 一机一码限制
- ✅ 管理员解绑功能
- ✅ 激活码管理（查询、删除）
- ✅ 统计信息查看
- ✅ CORS 跨域支持
- ✅ SQLite 数据库持久化

### 客户端 (atysaee.js)
- ✅ 精美的激活界面 UI
- ✅ 机器码自动生成（基于浏览器指纹）
- ✅ 激活状态本地存储
- ✅ 联网验证激活码
- ✅ 自动检查激活状态
- ✅ 激活失败提示

## 📦 目录结构

```
ae-lic-at/
├── server.js          # 服务器端主文件
├── atysaee.js        # 客户端激活界面
├── package.json      # 项目依赖
├── .env.example      # 环境变量示例
└── README.md         # 说明文档
```

## 🚀 部署到 Render.com

### 步骤 1: 准备代码

1. 确保所有文件已提交到 Git 仓库
2. 推送代码到 GitHub/GitLab/Bitbucket

### 步骤 2: 在 Render.com 创建服务

1. 访问 [Render.com](https://render.com) 并登录
2. 点击 "New +" → "Web Service"
3. 连接你的 Git 仓库
4. 配置服务：
   - **Name**: `ae-license-server` (或自定义名称)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: 选择 Free 或付费方案

### 步骤 3: 设置环境变量

在 Render.com 的服务设置中添加环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `SECRET_KEY` | 你的密钥（随机字符串） | 用于生成激活码 |
| `ADMIN_KEY` | 你的管理密钥 | 用于管理员操作 |

> ⚠️ **重要**: 请修改默认密钥，使用强随机字符串！

### 步骤 4: 部署

1. 点击 "Create Web Service"
2. 等待部署完成（约 2-5 分钟）
3. 获取你的服务器地址：`https://your-service.onrender.com`

### 步骤 5: 更新客户端配置

打开 `atysaee.js` 文件，修改服务器地址：

```javascript
const LICENSE_SERVER = 'https://your-service.onrender.com'; // 替换为实际地址
```

## 🔧 本地开发

### 安装依赖

```bash
npm install
```

### 启动服务器

```bash
npm start
```

服务器将运行在 `http://localhost:3000`

### 测试 API

使用 curl 或 Postman 测试：

```bash
# 检查服务器状态
curl http://localhost:3000/

# 生成激活码
curl http://localhost:3000/gen/test123

# 查看统计信息
curl http://localhost:3000/stats
```

## 📖 API 接口文档

### 1. 服务器状态

```
GET /
```

返回服务器运行状态。

### 2. 生成单个激活码

```
GET /gen/:seed
```

参数：
- `seed`: 种子值（任意字符串）

示例：
```bash
curl https://your-server.onrender.com/gen/user001
```

### 3. 批量生成激活码

```
POST /gen/batch
Content-Type: application/json

{
  "count": 10,
  "adminKey": "你的管理员密钥"
}
```

### 4. 验证激活码（客户端调用）

```
POST /verify
Content-Type: application/json

{
  "code": "激活码",
  "machineId": "机器码"
}
```

### 5. 解绑激活码

```
POST /unbind
Content-Type: application/json

{
  "code": "激活码",
  "adminKey": "你的管理员密钥"
}
```

### 6. 查询所有激活码

```
POST /admin/list
Content-Type: application/json

{
  "adminKey": "你的管理员密钥",
  "page": 1,
  "limit": 50
}
```

### 7. 查询单个激活码

```
POST /admin/check
Content-Type: application/json

{
  "code": "激活码",
  "adminKey": "你的管理员密钥"
}
```

### 8. 删除激活码

```
POST /admin/delete
Content-Type: application/json

{
  "code": "激活码",
  "adminKey": "你的管理员密钥"
}
```

### 9. 统计信息

```
GET /stats
```

## 💡 使用示例

### 管理员操作

#### 1. 批量生成 10 个激活码

```bash
curl -X POST https://your-server.onrender.com/gen/batch \
  -H "Content-Type: application/json" \
  -d '{
    "count": 10,
    "adminKey": "你的管理员密钥"
  }'
```

#### 2. 查询激活码状态

```bash
curl -X POST https://your-server.onrender.com/admin/check \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABC123",
    "adminKey": "你的管理员密钥"
  }'
```

#### 3. 解绑激活码

```bash
curl -X POST https://your-server.onrender.com/unbind \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ABC123",
    "adminKey": "你的管理员密钥"
  }'
```

### 用户操作

用户只需：
1. 在激活界面输入激活码
2. 点击"立即激活"按钮
3. 系统自动验证并绑定机器码

## 🎨 客户端集成

在你的 HTML 文件中引入 `atysaee.js`：

```html
<!DOCTYPE html>
<html>
<head>
  <title>AE 插件</title>
</head>
<body>
  <!-- 你的应用内容 -->
  
  <!-- 引入激活系统 -->
  <script src="atysaee.js"></script>
  
  <script>
    // 可选：手动显示激活界面
    // window.showActivationPanel();
    
    // 可选：获取激活状态
    // const status = window.getActivationStatus();
    // console.log(status);
  </script>
</body>
</html>
```

## 🔒 安全建议

1. **修改默认密钥**：务必在部署时修改 `SECRET_KEY` 和 `ADMIN_KEY`
2. **使用 HTTPS**：Render.com 自动提供 HTTPS
3. **限制 CORS**：生产环境建议限制允许的来源域名
4. **备份数据库**：定期备份 `binds.db` 文件
5. **监控日志**：关注 Render.com 的日志面板

## 📝 注意事项

### Render.com Free Plan 限制

- 15 分钟无活动后自动休眠
- 首次请求可能需要等待 10-30 秒唤醒
- 每月 750 小时免费运行时间
- 数据库文件在重启后可能丢失（建议使用外部数据库）

### 数据持久化

Render.com 的 Free Plan 不保证文件系统持久化。如需生产环境使用，建议：

1. 升级到付费方案
2. 或使用外部数据库（如 PostgreSQL、MongoDB）

## 🛠️ 故障排查

### 问题 1: 激活失败，提示网络连接失败

**解决方案**：
1. 检查 `atysaee.js` 中的服务器地址是否正确
2. 确认 Render.com 服务是否正常运行
3. 检查浏览器控制台是否有 CORS 错误

### 问题 2: 激活码无法生成

**解决方案**：
1. 检查环境变量是否设置正确
2. 查看 Render.com 日志面板
3. 确认数据库是否正常初始化

### 问题 3: 机器码每次都不一样

**解决方案**：
- 浏览器指纹可能会因为浏览器更新、插件变化而改变
- 建议在激活时提示用户不要清除浏览器数据

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系方式

如有问题，请联系技术支持。

---

**祝使用愉快！** 🎉

