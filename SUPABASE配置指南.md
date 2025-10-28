# Supabase 配置指南

## 📋 已配置信息

- **Supabase URL**: `https://acxecdtnchxxsfqcnxmm.supabase.co`
- **Supabase Anon Key**: 已内置在代码中
- **项目ID**: `acxecdtnchxxsfqcnxmm`

## 🚀 快速开始

### 1. 在 Supabase 中创建数据表

1. 登录 [Supabase Dashboard](https://app.supabase.com)
2. 选择项目 `acxecdtnchxxsfqcnxmm`
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New Query**
5. 复制 `supabase-setup.sql` 文件中的 SQL 代码
6. 粘贴到编辑器中，点击 **Run** 执行

### 2. 验证表创建成功

1. 点击左侧菜单的 **Table Editor**
2. 应该能看到 `licenses` 表
3. 表结构应该包含以下字段：
   - `id`: BIGSERIAL (主键)
   - `code`: TEXT (激活码，唯一)
   - `machine_id`: TEXT (机器码)
   - `created_at`: TIMESTAMPTZ (创建时间)
   - `activated_at`: TIMESTAMPTZ (激活时间)

### 3. 安装依赖

```bash
npm install
```

这会安装 `@supabase/supabase-js` 等必要的依赖包。

### 4. 配置 Netlify 环境变量

在 Netlify 项目设置中添加环境变量：

1. 进入 Netlify Dashboard
2. 选择你的项目
3. 点击 **Site settings** > **Environment variables**
4. 添加以下变量：

```
SECRET_KEY=MySecretKey2025
ADMIN_KEY=AdminSecret2025
SUPABASE_URL=https://acxecdtnchxxsfqcnxmm.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeGVjZHRuY2h4eHNmcWNueG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjI5NjEsImV4cCI6MjA3NzIzODk2MX0.kx63qyu_FwGDhCqZHs_Cx9Wg8voT3bxkC8KkmS-BZjQ
```

**注意**：建议修改 `SECRET_KEY` 和 `ADMIN_KEY` 为更安全的值！

### 5. 部署到 Netlify

```bash
# 提交更改
git add .
git commit -m "配置 Supabase 数据库"
git push origin main
```

Netlify 会自动检测并部署。

## 🔧 本地测试

如果要在本地测试 Netlify Functions：

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 在项目根目录创建 .env 文件
cp .env.example .env

# 启动本地开发服务器
netlify dev
```

## 📊 数据库管理

### 在 Supabase Dashboard 中管理数据

1. **Table Editor**: 可视化查看和编辑数据
2. **SQL Editor**: 执行自定义 SQL 查询
3. **Database** > **Backups**: 配置自动备份

### 常用 SQL 查询

```sql
-- 查看所有激活码
SELECT * FROM licenses ORDER BY created_at DESC;

-- 查看已激活的激活码
SELECT * FROM licenses WHERE machine_id IS NOT NULL;

-- 查看未使用的激活码
SELECT * FROM licenses WHERE machine_id IS NULL;

-- 统计信息
SELECT 
  COUNT(*) as total,
  COUNT(machine_id) as activated,
  COUNT(*) - COUNT(machine_id) as unused
FROM licenses;

-- 删除所有未激活的激活码
DELETE FROM licenses WHERE machine_id IS NULL;
```

## 🔐 安全建议

1. **修改默认密钥**
   - 将 `SECRET_KEY` 改为强随机字符串
   - 将 `ADMIN_KEY` 改为强随机字符串

2. **配置 Row Level Security (RLS)**
   - 根据实际需求配置更严格的访问策略
   - 参考 [Supabase RLS 文档](https://supabase.com/docs/guides/auth/row-level-security)

3. **API Key 安全**
   - `anon` key 可以在前端使用
   - 敏感操作应使用 `service_role` key（仅在后端使用）

4. **限制 API 访问**
   - 在 Supabase Dashboard 中配置允许的域名
   - 避免 API 被滥用

## 📚 API 接口文档

### 生成激活码
```
GET /gen/{seed}
```

### 批量生成
```
POST /gen/batch
Body: { "count": 10, "adminKey": "your_admin_key" }
```

### 验证激活
```
POST /verify
Body: { "code": "xxx", "machineId": "xxx" }
```

### 管理接口
```
POST /admin/list - 列出所有激活码
POST /admin/check - 查询单个激活码
POST /admin/delete - 删除激活码
POST /unbind - 解绑激活码
```

详细 API 文档请查看 `快速开始.md`。

## ❓ 常见问题

### Q: 如何查看 Supabase 连接日志？
A: 在 Netlify Functions 日志中查看，或在 Supabase Dashboard > Logs 中查看。

### Q: 数据库容量限制？
A: Supabase 免费版提供 500MB 存储，通常足够存储数百万条激活码记录。

### Q: 如何备份数据？
A: 在 Supabase Dashboard > Database > Backups 中配置自动备份，或使用 SQL 导出数据。

### Q: 如何切换到其他数据库？
A: 修改 `netlify/functions/api.js` 中的数据库连接代码即可。

## 🎉 完成

配置完成后，你的激活码服务器将使用 Supabase 作为持久化存储，数据不会因为 Netlify Functions 重启而丢失！

