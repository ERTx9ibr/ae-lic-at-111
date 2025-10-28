// AE 插件一机一码激活服务器
// 支持绑定机器码、联网验证、解绑等

const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const crypto = require('crypto');

const app = express();

// 中间件配置
app.use(bodyParser.json());

// CORS 支持（允许前端跨域访问）
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// 密钥用于生成激活码（不要泄露）
const SECRET = process.env.SECRET_KEY || 'MySecretKey2025';
const ADMIN_KEY = process.env.ADMIN_KEY || 'AdminSecret2025';

// 初始化数据库（Render 上也会自动创建）
const db = new sqlite3.Database('./binds.db');
db.run(`CREATE TABLE IF NOT EXISTS licenses (
  code TEXT PRIMARY KEY,
  machineId TEXT,
  createdAt INTEGER,
  activatedAt INTEGER
)`);

// 工具函数：生成激活码（供管理员使用）
function genCode(seed) {
  return crypto
    .createHmac('sha256', SECRET)
    .update(seed)
    .digest('hex')
    .slice(0, 10)
    .toUpperCase();
}

// ========== API 部分 ==========

// 首页 - 服务器状态
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    service: 'AE License Server',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 管理员生成单个激活码
app.get('/gen/:seed', (req, res) => {
  const code = genCode(req.params.seed);
  db.run('INSERT OR IGNORE INTO licenses(code, createdAt) VALUES(?,?)', [code, Date.now()], function(err) {
    if (err) {
      return res.status(500).json({ error: '生成激活码失败', details: err.message });
    }
    res.json({ seed: req.params.seed, code, message: '激活码生成成功' });
  });
});

// 管理员批量生成激活码
app.post('/gen/batch', (req, res) => {
  const { count, adminKey } = req.body;
  
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: '无权限' });
  }

  if (!count || count < 1 || count > 100) {
    return res.status(400).json({ error: '数量必须在1-100之间' });
  }

  const codes = [];
  let completed = 0;

  for (let i = 0; i < count; i++) {
    const seed = `batch_${Date.now()}_${i}_${Math.random()}`;
    const code = genCode(seed);
    
    db.run('INSERT OR IGNORE INTO licenses(code, createdAt) VALUES(?,?)', [code, Date.now()], function(err) {
      if (!err) {
        codes.push(code);
      }
      completed++;
      
      if (completed === count) {
        res.json({ 
          success: true, 
          count: codes.length, 
          codes,
          message: `成功生成 ${codes.length} 个激活码`
        });
      }
    });
  }
});

// 验证激活接口（AE 调用）
app.post('/verify', (req, res) => {
  const { machineId, code } = req.body;
  if (!machineId || !code)
    return res.status(400).json({ valid: false, reason: '缺少参数' });

  db.get('SELECT * FROM licenses WHERE code=?', [code], (err, row) => {
    if (err) return res.status(500).json({ valid: false, reason: err.message });

    if (!row) {
      return res.json({ valid: false, reason: '激活码不存在' });
    }

    if (!row.machineId) {
      // 首次使用 → 绑定机器
      db.run('UPDATE licenses SET machineId=?, activatedAt=? WHERE code=?',
        [machineId, Date.now(), code]);
      return res.json({ valid: true, bound: true, message: '首次激活成功' });
    }

    if (row.machineId === machineId) {
      // 已绑定同一台电脑
      return res.json({ valid: true, bound: true, message: '验证成功（同一设备）' });
    } else {
      // 被其他机器绑定
      return res.json({ valid: false, bound: true, reason: '激活码已绑定到其他电脑' });
    }
  });
});

// （可选）管理员解绑接口
app.post('/unbind', (req, res) => {
  const { code, adminKey } = req.body;
  if (adminKey !== ADMIN_KEY) return res.status(403).json({ error: '无权限' });

  db.run('UPDATE licenses SET machineId=NULL, activatedAt=NULL WHERE code=?', [code], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: '已解除绑定' });
  });
});

// 管理员查询所有激活码
app.post('/admin/list', (req, res) => {
  const { adminKey, page = 1, limit = 50 } = req.body;
  
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: '无权限' });
  }

  const offset = (page - 1) * limit;

  db.all('SELECT * FROM licenses ORDER BY createdAt DESC LIMIT ? OFFSET ?', 
    [limit, offset], 
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      
      db.get('SELECT COUNT(*) as total FROM licenses', (err, count) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.json({
          success: true,
          data: rows,
          pagination: {
            page,
            limit,
            total: count.total,
            pages: Math.ceil(count.total / limit)
          }
        });
      });
    }
  );
});

// 管理员查询单个激活码状态
app.post('/admin/check', (req, res) => {
  const { code, adminKey } = req.body;
  
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: '无权限' });
  }

  if (!code) {
    return res.status(400).json({ error: '缺少激活码参数' });
  }

  db.get('SELECT * FROM licenses WHERE code=?', [code], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (!row) {
      return res.json({ found: false, message: '激活码不存在' });
    }

    res.json({
      found: true,
      data: {
        code: row.code,
        machineId: row.machineId || '未绑定',
        isActivated: !!row.machineId,
        createdAt: row.createdAt ? new Date(row.createdAt).toISOString() : null,
        activatedAt: row.activatedAt ? new Date(row.activatedAt).toISOString() : null
      }
    });
  });
});

// 管理员删除激活码
app.post('/admin/delete', (req, res) => {
  const { code, adminKey } = req.body;
  
  if (adminKey !== ADMIN_KEY) {
    return res.status(403).json({ error: '无权限' });
  }

  if (!code) {
    return res.status(400).json({ error: '缺少激活码参数' });
  }

  db.run('DELETE FROM licenses WHERE code=?', [code], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    
    if (this.changes === 0) {
      return res.json({ success: false, message: '激活码不存在' });
    }

    res.json({ success: true, message: '激活码已删除' });
  });
});

// 统计信息
app.get('/stats', (req, res) => {
  db.get(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN machineId IS NOT NULL THEN 1 ELSE 0 END) as activated,
      SUM(CASE WHEN machineId IS NULL THEN 1 ELSE 0 END) as unused
    FROM licenses
  `, (err, stats) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({
      success: true,
      stats: {
        total: stats.total || 0,
        activated: stats.activated || 0,
        unused: stats.unused || 0
      }
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ License server running on port ${PORT}`));
