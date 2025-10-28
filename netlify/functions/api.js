// AE 插件激活服务器 - Netlify Functions + Supabase 版本
const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');

// 密钥配置
const SECRET = process.env.SECRET_KEY || 'MySecretKey2025';
const ADMIN_KEY = process.env.ADMIN_KEY || 'AdminSecret2025';

// Supabase 配置
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://acxecdtnchxxsfqcnxmm.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeGVjZHRuY2h4eHNmcWNueG1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2NjI5NjEsImV4cCI6MjA3NzIzODk2MX0.kx63qyu_FwGDhCqZHs_Cx9Wg8voT3bxkC8KkmS-BZjQ';

// 创建 Supabase 客户端
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 表名
const TABLE_NAME = 'licenses';

/**
 * 初始化数据库表（首次运行时自动创建）
 */
async function initDatabase() {
  try {
    // 检查表是否存在，如果不存在 Supabase 会通过 SQL 编辑器创建
    // 这里我们只是确保能连接
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('count')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('提示：请在 Supabase 中创建 licenses 表');
    }
  } catch (error) {
    console.log('数据库初始化提示:', error.message);
  }
}

// 在模块加载时初始化
initDatabase();

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
      const { count, error } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          status: 'running',
          service: 'AE License Server (Netlify + Supabase)',
          version: '2.0.0',
          database: 'Supabase',
          timestamp: new Date().toISOString(),
          totalLicenses: error ? 0 : count
        })
      };
    }

    // 生成单个激活码
    if (path.startsWith('/gen/') && method === 'GET') {
      const seed = path.split('/gen/')[1];
      const code = genCode(seed);
      
      // 检查是否已存在
      const { data: existing } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('code', code)
        .single();

      if (!existing) {
        // 插入新激活码
        const { error } = await supabase
          .from(TABLE_NAME)
          .insert([{
            code,
            machine_id: null,
            created_at: new Date().toISOString(),
            activated_at: null
          }]);

        if (error) {
          console.error('插入错误:', error);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: '数据库错误', details: error.message })
          };
        }
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
      const records = [];
      
      for (let i = 0; i < count; i++) {
        const seed = `batch_${Date.now()}_${i}_${Math.random()}`;
        const code = genCode(seed);
        
        codes.push(code);
        records.push({
          code,
          machine_id: null,
          created_at: new Date().toISOString(),
          activated_at: null
        });
      }

      // 批量插入
      const { error } = await supabase
        .from(TABLE_NAME)
        .insert(records);

      if (error) {
        console.error('批量插入错误:', error);
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: '数据库错误', details: error.message })
        };
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

      // 查询激活码
      const { data: license, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('code', code)
        .single();

      if (error || !license) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ 
            valid: false, 
            reason: '激活码不存在' 
          })
        };
      }

      if (!license.machine_id) {
        // 首次激活 - 绑定机器码
        const { error: updateError } = await supabase
          .from(TABLE_NAME)
          .update({ 
            machine_id: machineId,
            activated_at: new Date().toISOString()
          })
          .eq('code', code);

        if (updateError) {
          console.error('更新错误:', updateError);
          return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: '数据库错误' })
          };
        }
        
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

      if (license.machine_id === machineId) {
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

      const { data: license, error: findError } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('code', code)
        .single();

      if (findError || !license) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: '激活码不存在' })
        };
      }

      const { error: updateError } = await supabase
        .from(TABLE_NAME)
        .update({ 
          machine_id: null,
          activated_at: null
        })
        .eq('code', code);

      if (updateError) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: '数据库错误' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: '已解除绑定' })
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

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: '数据库错误' })
        };
      }

      // 格式化数据
      const formattedData = data.map(item => ({
        code: item.code,
        machineId: item.machine_id,
        createdAt: item.created_at ? new Date(item.created_at).getTime() : null,
        activatedAt: item.activated_at ? new Date(item.activated_at).getTime() : null
      }));

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          data: formattedData,
          pagination: {
            page,
            limit,
            total: count,
            pages: Math.ceil(count / limit)
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

      const { data: license, error } = await supabase
        .from(TABLE_NAME)
        .select('*')
        .eq('code', code)
        .single();
      
      if (error || !license) {
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
            machineId: license.machine_id || '未绑定',
            isActivated: !!license.machine_id,
            createdAt: license.created_at,
            activatedAt: license.activated_at
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

      const { error } = await supabase
        .from(TABLE_NAME)
        .delete()
        .eq('code', code);

      if (error) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: false, message: '激活码不存在或删除失败' })
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: '激活码已删除' })
      };
    }

    // 统计信息
    if (path === '/stats' && method === 'GET') {
      const { count: total } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true });

      const { count: activated } = await supabase
        .from(TABLE_NAME)
        .select('*', { count: 'exact', head: true })
        .not('machine_id', 'is', null);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          stats: {
            total: total || 0,
            activated: activated || 0,
            unused: (total || 0) - (activated || 0)
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
