#!/usr/bin/env node
// 激活码管理工具
// 用法：node admin-tool.js <command> [options]

const readline = require('readline');

// 配置
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3000';
const ADMIN_KEY = process.env.ADMIN_KEY || 'AdminSecret2025';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function apiRequest(endpoint, method = 'GET', body = null) {
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${SERVER_URL}${endpoint}`, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('❌ 请求失败:', error.message);
    return null;
  }
}

async function generateSingle() {
  const seed = await question('请输入种子值（用于生成激活码）: ');
  console.log('\n🔄 正在生成激活码...\n');
  
  const result = await apiRequest(`/gen/${seed}`);
  
  if (result) {
    console.log('✅ 激活码生成成功！');
    console.log(`📋 激活码: ${result.code}`);
    console.log(`🌱 种子值: ${result.seed}\n`);
  }
}

async function generateBatch() {
  const countStr = await question('请输入生成数量（1-100）: ');
  const count = parseInt(countStr);

  if (isNaN(count) || count < 1 || count > 100) {
    console.log('❌ 数量必须在 1-100 之间\n');
    return;
  }

  console.log(`\n🔄 正在生成 ${count} 个激活码...\n`);
  
  const result = await apiRequest('/gen/batch', 'POST', {
    count,
    adminKey: ADMIN_KEY
  });

  if (result && result.success) {
    console.log(`✅ 成功生成 ${result.count} 个激活码！\n`);
    console.log('📋 激活码列表：');
    result.codes.forEach((code, index) => {
      console.log(`${index + 1}. ${code}`);
    });
    console.log('');
  }
}

async function checkCode() {
  const code = await question('请输入要查询的激活码: ');
  console.log('\n🔄 正在查询...\n');
  
  const result = await apiRequest('/admin/check', 'POST', {
    code: code.trim().toUpperCase(),
    adminKey: ADMIN_KEY
  });

  if (result) {
    if (result.found) {
      console.log('✅ 激活码信息：');
      console.log(`📋 激活码: ${result.data.code}`);
      console.log(`💻 机器码: ${result.data.machineId}`);
      console.log(`📊 状态: ${result.data.isActivated ? '已激活 ✓' : '未激活 ○'}`);
      console.log(`🕐 创建时间: ${result.data.createdAt || '未知'}`);
      console.log(`🕐 激活时间: ${result.data.activatedAt || '未激活'}\n`);
    } else {
      console.log('❌ 激活码不存在\n');
    }
  }
}

async function unbindCode() {
  const code = await question('请输入要解绑的激活码: ');
  const confirm = await question(`⚠️  确认解绑激活码 ${code} 吗？(y/n): `);

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ 已取消\n');
    return;
  }

  console.log('\n🔄 正在解绑...\n');
  
  const result = await apiRequest('/unbind', 'POST', {
    code: code.trim().toUpperCase(),
    adminKey: ADMIN_KEY
  });

  if (result && result.success) {
    console.log('✅ 解绑成功！\n');
  }
}

async function deleteCode() {
  const code = await question('请输入要删除的激活码: ');
  const confirm = await question(`⚠️  确认删除激活码 ${code} 吗？(y/n): `);

  if (confirm.toLowerCase() !== 'y') {
    console.log('❌ 已取消\n');
    return;
  }

  console.log('\n🔄 正在删除...\n');
  
  const result = await apiRequest('/admin/delete', 'POST', {
    code: code.trim().toUpperCase(),
    adminKey: ADMIN_KEY
  });

  if (result) {
    if (result.success) {
      console.log('✅ 删除成功！\n');
    } else {
      console.log(`❌ ${result.message}\n`);
    }
  }
}

async function listCodes() {
  const pageStr = await question('请输入页码（默认1）: ');
  const page = parseInt(pageStr) || 1;

  console.log('\n🔄 正在查询...\n');
  
  const result = await apiRequest('/admin/list', 'POST', {
    adminKey: ADMIN_KEY,
    page,
    limit: 20
  });

  if (result && result.success) {
    console.log(`📋 激活码列表（第 ${result.pagination.page}/${result.pagination.pages} 页）:\n`);
    
    if (result.data.length === 0) {
      console.log('暂无数据\n');
    } else {
      result.data.forEach((item, index) => {
        const status = item.machineId ? '✓ 已激活' : '○ 未激活';
        console.log(`${index + 1}. ${item.code} - ${status}`);
        if (item.machineId) {
          console.log(`   机器码: ${item.machineId}`);
        }
      });
      console.log(`\n总计: ${result.pagination.total} 个激活码\n`);
    }
  }
}

async function showStats() {
  console.log('🔄 正在获取统计信息...\n');
  
  const result = await apiRequest('/stats');

  if (result && result.success) {
    console.log('📊 激活码统计：');
    console.log(`   总计: ${result.stats.total} 个`);
    console.log(`   已激活: ${result.stats.activated} 个`);
    console.log(`   未使用: ${result.stats.unused} 个\n`);
  }
}

async function main() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║     AE 激活码管理工具 v1.0           ║');
  console.log('╚════════════════════════════════════════╝\n');
  console.log(`服务器地址: ${SERVER_URL}\n`);

  while (true) {
    console.log('请选择操作：');
    console.log('1. 生成单个激活码');
    console.log('2. 批量生成激活码');
    console.log('3. 查询激活码状态');
    console.log('4. 解绑激活码');
    console.log('5. 删除激活码');
    console.log('6. 列出所有激活码');
    console.log('7. 查看统计信息');
    console.log('0. 退出\n');

    const choice = await question('请输入选项: ');

    switch (choice.trim()) {
      case '1':
        await generateSingle();
        break;
      case '2':
        await generateBatch();
        break;
      case '3':
        await checkCode();
        break;
      case '4':
        await unbindCode();
        break;
      case '5':
        await deleteCode();
        break;
      case '6':
        await listCodes();
        break;
      case '7':
        await showStats();
        break;
      case '0':
        console.log('\n👋 再见！\n');
        rl.close();
        process.exit(0);
      default:
        console.log('\n❌ 无效选项，请重新选择\n');
    }
  }
}

// 运行
main().catch(err => {
  console.error('❌ 错误:', err);
  rl.close();
  process.exit(1);
});

