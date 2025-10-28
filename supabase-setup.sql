-- Supabase 数据库表创建脚本
-- 在 Supabase Dashboard > SQL Editor 中运行此脚本

-- 创建 licenses 表
CREATE TABLE IF NOT EXISTS licenses (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  machine_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  activated_at TIMESTAMPTZ
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_licenses_code ON licenses(code);
CREATE INDEX IF NOT EXISTS idx_licenses_machine_id ON licenses(machine_id);

-- 添加注释
COMMENT ON TABLE licenses IS 'AE插件激活码表';
COMMENT ON COLUMN licenses.code IS '激活码';
COMMENT ON COLUMN licenses.machine_id IS '绑定的机器码';
COMMENT ON COLUMN licenses.created_at IS '创建时间';
COMMENT ON COLUMN licenses.activated_at IS '激活时间';

-- 启用行级安全（可选，根据需要配置）
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有操作（开发环境）
-- 生产环境请根据实际需求配置更严格的策略
CREATE POLICY "Enable all access for authenticated users" ON licenses
  FOR ALL
  USING (true)
  WITH CHECK (true);

