// AE 插件激活服务器 - Vercel Serverless 版本
// 注意：Vercel 环境需要使用外部数据库（如 Vercel Postgres）

const crypto = require('crypto');

// 密钥配置
const SECRET = process.env.SECRET_KEY || 'MySecretKey2025';
const ADMIN_KEY = process.env.ADMIN_KEY || 'AdminSecret2025';

// ⚠️ 重要：Vercel 上 SQLite 无法持久化
// 建议使用 Vercel Postgres、Supabase 或 MongoDB Atlas
// 这里使用内存存储作为演示，实际生产环境请替换为数据库

// 临时内存存储（仅用于演示，重启后数据会丢失）
let licenses = {};

/**
 * 生成激活码
 */
function genCode(seed) {
  return crypto
    .createHmac('sha256', SECRET)
    .update(seed)
    .digest('hex')
    .slice(0, 10)
    .toUpperCase();
}

/**
 * 设置 CORS 头
 */
function setCORS(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

/**
 * 主处理函数
 */
module.exports = async (req, res) => {
  setCORS(res);

  // 处理 OPTIONS 请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname.replace('/api', '');
  const method = req.method;

  // 首页 - 服务器状态
  if (pathname === '/' && method === 'GET') {
    return res.json({
      status: 'running',
      service: 'AE License Server (Vercel)',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      notice: '⚠️ 使用内存存储，重启后数据会丢失。生产环境请使用 Vercel Postgres'
    });
  }

  // 生成单个激活码
  if (pathname.startsWith('/gen/') && method === 'GET') {
    const seed = pathname.split('/gen/')[1];
    const code = genCode(seed);
    
    // 保存到内存
    if (!licenses[code]) {
      licenses[code] = {
        code,
        machineId: null,
        createdAt: Date.now(),
        activatedAt: null
      };
    }
    
    return res.json({ 
      seed, 
      code, 
      message: '激活码生成成功' 
    });
  }

  // 批量生成激活码
  if (pathname === '/gen/batch' && method === 'POST') {
    const { count, adminKey } = req.body || {};
    
    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' });
    }

    if (!count || count < 1 || count > 100) {
      return res.status(400).json({ error: '数量必须在1-100之间' });
    }

    const codes = [];
    for (let i = 0; i < count; i++) {
      const seed = `batch_${Date.now()}_${i}_${Math.random()}`;
      const code = genCode(seed);
      
      licenses[code] = {
        code,
        machineId: null,
        createdAt: Date.now(),
        activatedAt: null
      };
      
      codes.push(code);
    }

    return res.json({
      success: true,
      count: codes.length,
      codes,
      message: `成功生成 ${codes.length} 个激活码`
    });
  }

  // 验证激活接口
  if (pathname === '/verify' && method === 'POST') {
    const { machineId, code } = req.body || {};
    
    if (!machineId || !code) {
      return res.status(400).json({ 
        valid: false, 
        reason: '缺少参数' 
      });
    }

    const license = licenses[code];

    if (!license) {
      return res.json({ 
        valid: false, 
        reason: '激活码不存在' 
      });
    }

    if (!license.machineId) {
      // 首次激活 - 绑定机器码
      license.machineId = machineId;
      license.activatedAt = Date.now();
      
      return res.json({ 
        valid: true, 
        bound: true, 
        message: '首次激活成功' 
      });
    }

    if (license.machineId === machineId) {
      // 已绑定同一台电脑
      return res.json({ 
        valid: true, 
        bound: true, 
        message: '验证成功（同一设备）' 
      });
    } else {
      // 被其他机器绑定
      return res.json({ 
        valid: false, 
        bound: true, 
        reason: '激活码已绑定到其他电脑' 
      });
    }
  }

  // 解绑激活码
  if (pathname === '/unbind' && method === 'POST') {
    const { code, adminKey } = req.body || {};
    
    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' });
    }

    const license = licenses[code];
    if (license) {
      license.machineId = null;
      license.activatedAt = null;
      return res.json({ success: true, message: '已解除绑定' });
    }

    return res.status(404).json({ error: '激活码不存在' });
  }

  // 查询所有激活码
  if (pathname === '/admin/list' && method === 'POST') {
    const { adminKey, page = 1, limit = 50 } = req.body || {};
    
    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' });
    }

    const allLicenses = Object.values(licenses);
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = allLicenses.slice(start, end);

    return res.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: allLicenses.length,
        pages: Math.ceil(allLicenses.length / limit)
      }
    });
  }

  // 查询单个激活码
  if (pathname === '/admin/check' && method === 'POST') {
    const { code, adminKey } = req.body || {};
    
    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' });
    }

    if (!code) {
      return res.status(400).json({ error: '缺少激活码参数' });
    }

    const license = licenses[code];
    
    if (!license) {
      return res.json({ found: false, message: '激活码不存在' });
    }

    return res.json({
      found: true,
      data: {
        code: license.code,
        machineId: license.machineId || '未绑定',
        isActivated: !!license.machineId,
        createdAt: license.createdAt ? new Date(license.createdAt).toISOString() : null,
        activatedAt: license.activatedAt ? new Date(license.activatedAt).toISOString() : null
      }
    });
  }

  // 删除激活码
  if (pathname === '/admin/delete' && method === 'POST') {
    const { code, adminKey } = req.body || {};
    
    if (adminKey !== ADMIN_KEY) {
      return res.status(403).json({ error: '无权限' });
    }

    if (!code) {
      return res.status(400).json({ error: '缺少激活码参数' });
    }

    if (licenses[code]) {
      delete licenses[code];
      return res.json({ success: true, message: '激活码已删除' });
    }

    return res.json({ success: false, message: '激活码不存在' });
  }

  // 统计信息
  if (pathname === '/stats' && method === 'GET') {
    const allLicenses = Object.values(licenses);
    const activated = allLicenses.filter(l => l.machineId).length;
    const unused = allLicenses.filter(l => !l.machineId).length;

    return res.json({
      success: true,
      stats: {
        total: allLicenses.length,
        activated,
        unused
      }
    });
  }

  // 404
  return res.status(404).json({ 
    error: '未找到该接口',
    path: pathname 
  });
};

