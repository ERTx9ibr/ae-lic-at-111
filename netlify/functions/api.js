// AE 插件激活服务器 - Netlify Functions 版本
// 注意：Netlify 环境需要使用外部数据库（如 Supabase）

const crypto = require('crypto');

// 密钥配置
const SECRET = process.env.SECRET_KEY || 'MySecretKey2025';
const ADMIN_KEY = process.env.ADMIN_KEY || 'AdminSecret2025';

// ⚠️ 重要：Netlify Functions 上 SQLite 无法持久化
// 建议使用 Supabase、MongoDB Atlas 或 Upstash
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
 * 主处理函数
 */
exports.handler = async (event, context) => {
  // CORS 头
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  };

  // 处理 OPTIONS 请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  const path = event.path.replace('/.netlify/functions/api', '');
  const method = event.httpMethod;
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    // 首页 - 服务器状态
    if (path === '' || path === '/') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'running',
          service: 'AE License Server (Netlify)',
          version: '1.0.0',
          timestamp: new Date().toISOString(),
          notice: '⚠️ 使用内存存储，重启后数据会丢失。生产环境请使用 Supabase 或 MongoDB Atlas'
        })
      };
    }

    // 生成单个激活码
    if (path.startsWith('/gen/') && method === 'GET') {
      const seed = path.split('/gen/')[1];
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
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ 
          seed, 
          code, 
          message: '激活码生成成功' 
        })
      };
    }

    // 批量生成激活码
    if (path === '/gen/batch' && method === 'POST') {
      const { count, adminKey } = body;
      
      if (adminKey !== ADMIN_KEY) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: '无权限' })
        };
      }

      if (!count || count < 1 || count > 100) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '数量必须在1-100之间' })
        };
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          count: codes.length,
          codes,
          message: `成功生成 ${codes.length} 个激活码`
        })
      };
    }

    // 验证激活接口
    if (path === '/verify' && method === 'POST') {
      const { machineId, code } = body;
      
      if (!machineId || !code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ 
            valid: false, 
            reason: '缺少参数' 
          })
        };
      }

      const license = licenses[code];

      if (!license) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            valid: false, 
            reason: '激活码不存在' 
          })
        };
      }

      if (!license.machineId) {
        // 首次激活 - 绑定机器码
        license.machineId = machineId;
        license.activatedAt = Date.now();
        
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            valid: true, 
            bound: true, 
            message: '首次激活成功' 
          })
        };
      }

      if (license.machineId === machineId) {
        // 已绑定同一台电脑
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            valid: true, 
            bound: true, 
            message: '验证成功（同一设备）' 
          })
        };
      } else {
        // 被其他机器绑定
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            valid: false, 
            bound: true, 
            reason: '激活码已绑定到其他电脑' 
          })
        };
      }
    }

    // 解绑激活码
    if (path === '/unbind' && method === 'POST') {
      const { code, adminKey } = body;
      
      if (adminKey !== ADMIN_KEY) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: '无权限' })
        };
      }

      const license = licenses[code];
      if (license) {
        license.machineId = null;
        license.activatedAt = null;
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: '已解除绑定' })
        };
      }

      return {
        statusCode: 404,
        headers,
        body: JSON.stringify({ error: '激活码不存在' })
      };
    }

    // 查询所有激活码
    if (path === '/admin/list' && method === 'POST') {
      const { adminKey, page = 1, limit = 50 } = body;
      
      if (adminKey !== ADMIN_KEY) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: '无权限' })
        };
      }

      const allLicenses = Object.values(licenses);
      const start = (page - 1) * limit;
      const end = start + limit;
      const data = allLicenses.slice(start, end);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data,
          pagination: {
            page,
            limit,
            total: allLicenses.length,
            pages: Math.ceil(allLicenses.length / limit)
          }
        })
      };
    }

    // 查询单个激活码
    if (path === '/admin/check' && method === 'POST') {
      const { code, adminKey } = body;
      
      if (adminKey !== ADMIN_KEY) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: '无权限' })
        };
      }

      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '缺少激活码参数' })
        };
      }

      const license = licenses[code];
      
      if (!license) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ found: false, message: '激活码不存在' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          found: true,
          data: {
            code: license.code,
            machineId: license.machineId || '未绑定',
            isActivated: !!license.machineId,
            createdAt: license.createdAt ? new Date(license.createdAt).toISOString() : null,
            activatedAt: license.activatedAt ? new Date(license.activatedAt).toISOString() : null
          }
        })
      };
    }

    // 删除激活码
    if (path === '/admin/delete' && method === 'POST') {
      const { code, adminKey } = body;
      
      if (adminKey !== ADMIN_KEY) {
        return {
          statusCode: 403,
          headers,
          body: JSON.stringify({ error: '无权限' })
        };
      }

      if (!code) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ error: '缺少激活码参数' })
        };
      }

      if (licenses[code]) {
        delete licenses[code];
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, message: '激活码已删除' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: false, message: '激活码不存在' })
      };
    }

    // 统计信息
    if (path === '/stats' && method === 'GET') {
      const allLicenses = Object.values(licenses);
      const activated = allLicenses.filter(l => l.machineId).length;
      const unused = allLicenses.filter(l => !l.machineId).length;

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          stats: {
            total: allLicenses.length,
            activated,
            unused
          }
        })
      };
    }

    // 404
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ 
        error: '未找到该接口',
        path 
      })
    };

  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: '服务器内部错误',
        message: error.message 
      })
    };
  }
};

