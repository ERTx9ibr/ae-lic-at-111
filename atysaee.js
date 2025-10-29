
// ========== 激活码系统 ==========
(function() {
  'use strict';

  // 配置：服务器地址
  const LICENSE_SERVER = 'https://aelic.netlify.app/.netlify/functions/api';
  
  // 本地存储键名
  const STORAGE_KEYS = {
    LICENSE_CODE: 'ae_license_code',
    MACHINE_ID: 'ae_machine_id',
    ACTIVATION_STATUS: 'ae_activation_status',
    ACTIVATION_TIME: 'ae_activation_time'
  };
  
  // 加密密钥（用于加密缓存文件）
  const ENCRYPT_KEY = 'AE_LICENSE_2025_SECRET_KEY_V1';
  
  // 缓存文件名
  const CACHE_FILE_NAME = '.ae_license_cache';
  
  /**
   * 获取系统类型
   */
  function getOSType() {
    const platform = navigator.platform.toLowerCase();
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (platform.indexOf('win') >= 0 || userAgent.indexOf('windows') >= 0) {
      return 'windows';
    } else if (platform.indexOf('mac') >= 0 || userAgent.indexOf('mac') >= 0) {
      return 'mac';
    }
    return 'unknown';
  }
  
  /**
   * 获取缓存目录路径（根据操作系统）
   */
  function getCacheDirectory() {
    const osType = getOSType();
    
    if (typeof CSInterface !== 'undefined') {
      try {
        const csInterface = new CSInterface();
        const systemPath = csInterface.getSystemPath('userData');
        
        if (systemPath) {
          // Windows: C:\Users\用户名\AppData\Roaming\Adobe\CEP\extensions\...
          // Mac: ~/Library/Application Support/Adobe/CEP/extensions/...
          return systemPath;
        }
      } catch(e) {
        // 静默失败
      }
    }
    
    // 降级方案：使用默认路径
    if (osType === 'windows') {
      return '%APPDATA%\\Adobe\\AE_License\\';
    } else if (osType === 'mac') {
      return '~/Library/Application Support/Adobe/AE_License/';
    }
    
    return './';
  }
  
  /**
   * 简单的AES加密（使用异或和Base64）
   */
  function encryptData(text) {
    try {
      const key = ENCRYPT_KEY;
      let encrypted = '';
      
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        encrypted += String.fromCharCode(charCode);
      }
      
      // Base64编码
      return btoa(encodeURIComponent(encrypted));
    } catch(e) {
      return null;
    }
  }
  
  /**
   * 解密数据
   */
  function decryptData(encrypted) {
    try {
      // Base64解码
      const decoded = decodeURIComponent(atob(encrypted));
      const key = ENCRYPT_KEY;
      let decrypted = '';
      
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i) ^ key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode);
      }
      
      return decrypted;
    } catch(e) {
      return null;
    }
  }
  
  /**
   * 写入缓存文件（使用CSInterface）
   */
  function writeLicenseCache(data) {
    if (typeof CSInterface === 'undefined') {
      return false;
    }
    
    try {
      const csInterface = new CSInterface();
      const cacheDir = getCacheDirectory();
      const filePath = cacheDir + '/' + CACHE_FILE_NAME;
      
      // 准备缓存数据
      const cacheData = {
        code: data.code,
        machineId: data.machineId,
        activatedAt: data.activatedAt || Date.now(),
        version: '1.0'
      };
      
      // 加密数据
      const jsonStr = JSON.stringify(cacheData);
      const encrypted = encryptData(jsonStr);
      
      if (!encrypted) {
        return false;
      }
      
      // 使用 evalScript 调用 ExtendScript 写入文件
      const script = `
        (function() {
          try {
            var file = new File("${filePath.replace(/\\/g, '/')}");
            var folder = file.parent;
            
            // 创建目录（如果不存在）
            if (!folder.exists) {
              folder.create();
            }
            
            // 写入文件
            file.encoding = "UTF-8";
            file.open("w");
            file.write("${encrypted.replace(/"/g, '\\"')}");
            file.close();
            
            "success";
          } catch(e) {
            "error:" + e.toString();
          }
        })();
      `;
      
      csInterface.evalScript(script, function(result) {
        // 静默处理结果
      });
      
      return true;
      
    } catch(e) {
      return false;
    }
  }
  
  /**
   * 读取缓存文件
   */
  function readLicenseCache(callback) {
    if (typeof CSInterface === 'undefined') {
      callback(null);
      return;
    }
    
    try {
      const csInterface = new CSInterface();
      const cacheDir = getCacheDirectory();
      const filePath = cacheDir + '/' + CACHE_FILE_NAME;
      
      // 使用 evalScript 调用 ExtendScript 读取文件
      const script = `
        (function() {
          try {
            var file = new File("${filePath.replace(/\\/g, '/')}");
            
            if (!file.exists) {
              return "not_found";
            }
            
            file.encoding = "UTF-8";
            file.open("r");
            var content = file.read();
            file.close();
            
            return content;
          } catch(e) {
            return "error:" + e.toString();
          }
        })();
      `;
      
      csInterface.evalScript(script, function(result) {
        if (result === 'not_found' || result.indexOf('error:') === 0) {
          callback(null);
          return;
        }
        
        // 解密数据
        const decrypted = decryptData(result);
        if (!decrypted) {
          callback(null);
          return;
        }
        
        try {
          const cacheData = JSON.parse(decrypted);
          callback(cacheData);
        } catch(e) {
          callback(null);
        }
      });
      
    } catch(e) {
      callback(null);
    }
  }
  
  /**
   * 验证缓存文件是否有效
   */
  function validateLicenseCache(cacheData) {
    if (!cacheData) {
      return { valid: false, reason: '缓存文件不存在' };
    }
    
    // 检查必要字段
    if (!cacheData.code || !cacheData.machineId) {
      return { valid: false, reason: '缓存文件数据不完整' };
    }
    
    // 验证机器码
    const currentMachineId = generateMachineId();
    if (cacheData.machineId !== currentMachineId) {
      return { 
        valid: false, 
        reason: '机器码不匹配（此许可证绑定到其他设备）',
        details: `缓存: ${cacheData.machineId}, 当前: ${currentMachineId}`
      };
    }
    
    // 验证成功
    return { 
      valid: true, 
      code: cacheData.code,
      machineId: cacheData.machineId,
      activatedAt: cacheData.activatedAt
    };
  }
  
  /**
   * 删除缓存文件
   */
  function deleteLicenseCache(callback) {
    if (typeof CSInterface === 'undefined') {
      if (callback) callback(false);
      return;
    }
    
    try {
      const csInterface = new CSInterface();
      const cacheDir = getCacheDirectory();
      const filePath = cacheDir + '/' + CACHE_FILE_NAME;
      
      const script = `
        (function() {
          try {
            var file = new File("${filePath.replace(/\\/g, '/')}");
            if (file.exists) {
              file.remove();
              return "success";
            }
            return "not_found";
          } catch(e) {
            return "error:" + e.toString();
          }
        })();
      `;
      
      csInterface.evalScript(script, function(result) {
        if (callback) callback(result === 'success' || result === 'not_found');
      });
      
    } catch(e) {
      if (callback) callback(false);
    }
  }

  /**
   * 获取系统硬件信息（AE 环境）
   * 使用 CSInterface + WebGL 获取更稳定的硬件指纹
   */
  function getSystemHardwareInfo() {
    const info = {
      cpu: 'unknown',
      gpu: 'unknown',
      os: navigator.platform,
      platform: navigator.userAgent
    };

    try {
      // 1. 获取 CPU 核心数
      if (navigator.hardwareConcurrency) {
        info.cpu = 'CPU_' + navigator.hardwareConcurrency + 'cores';
      }

      // 2. 获取 GPU 信息（通过 WebGL）
      const gpuInfo = getWebGLInfo();
      if (gpuInfo && gpuInfo !== 'unknown') {
        info.gpu = gpuInfo;
      }

      // 3. 获取操作系统信息
      if (typeof CSInterface !== 'undefined') {
        try {
          const csInterface = new CSInterface();
          const osInfo = csInterface.getOSInformation();
          if (osInfo) {
            info.os = osInfo;
          }
        } catch(e) {
          // 静默失败
        }
      }

      // 4. 补充平台信息
      info.platform = navigator.platform || 'unknown';
      
      // 5. 获取屏幕分辨率作为辅助特征
      info.screen = screen.width + 'x' + screen.height + '@' + screen.colorDepth + 'bit';

    } catch(e) {
      // 静默失败
    }
    
    return info;
  }

  /**
   * 获取 WebGL 信息作为 GPU 指纹（更详细）
   */
  function getWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          
          // 组合厂商和渲染器信息
          const gpuString = (vendor + '_' + renderer)
            .replace(/\s+/g, '_')
            .replace(/[^a-zA-Z0-9_]/g, '')
            .substring(0, 50); // 限制长度
          
          return gpuString || 'webgl_unknown';
        }
        
        // 如果没有 debug 扩展，使用基本信息
        const vendor = gl.getParameter(gl.VENDOR);
        const renderer = gl.getParameter(gl.RENDERER);
        return (vendor + '_' + renderer).replace(/\s+/g, '_').substring(0, 50);
      }
    } catch(e) {
      // 静默失败
    }
    return 'gpu_unknown';
  }

  /**
   * 生成机器码（基于 CPU 和显卡信息）
   */
  function generateMachineId() {
    // 尝试从本地存储读取已有的机器码
    let machineId = localStorage.getItem(STORAGE_KEYS.MACHINE_ID);
    if (machineId) {
      return machineId;
    }

    // 获取硬件信息并生成新的机器码
    const hwInfo = getSystemHardwareInfo();
    const components = [
      hwInfo.cpu,           // CPU 核心数或型号
      hwInfo.gpu,           // GPU 渲染器信息
      hwInfo.os,            // 操作系统
      hwInfo.platform,      // 平台信息
      hwInfo.screen,        // 屏幕分辨率
      navigator.language,   // 语言
      new Date().getTimezoneOffset().toString()  // 时区
    ];

    // 使用哈希算法生成唯一ID
    const fingerprint = components.join('|');
    const hash = hashCode(fingerprint);
    
    // 生成易读的机器码格式：HW-XXXX-XXXX-XXXX
    const base36 = Math.abs(hash).toString(36).toUpperCase();
    const padded = (base36 + '000000000000').substring(0, 12);
    machineId = 'HW-' + padded.substring(0, 4) + '-' + padded.substring(4, 8) + '-' + padded.substring(8, 12);
    
    // 保存到本地存储
    localStorage.setItem(STORAGE_KEYS.MACHINE_ID, machineId);
    return machineId;
  }

  /**
   * 简单的哈希函数
   */
  function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }

  /**
   * 检查激活状态
   */
  function checkActivationStatus() {
    const code = localStorage.getItem(STORAGE_KEYS.LICENSE_CODE);
    const status = localStorage.getItem(STORAGE_KEYS.ACTIVATION_STATUS);
    return {
      isActivated: status === 'activated',
      code: code || '',
      machineId: generateMachineId()
    };
  }

  /**
   * 验证激活码（联网验证）
   */
  async function verifyLicense(code) {
    const machineId = generateMachineId();
    
    try {
      const response = await fetch(`${LICENSE_SERVER}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          machineId: machineId
        })
      });

      const result = await response.json();
      
      if (result.valid) {
        // 激活成功，保存信息到localStorage
        localStorage.setItem(STORAGE_KEYS.LICENSE_CODE, code.trim().toUpperCase());
        localStorage.setItem(STORAGE_KEYS.ACTIVATION_STATUS, 'activated');
        localStorage.setItem(STORAGE_KEYS.ACTIVATION_TIME, Date.now());
        
        // 写入加密缓存文件（支持离线验证）
        writeLicenseCache({
          code: code.trim().toUpperCase(),
          machineId: machineId,
          activatedAt: Date.now()
        });
        
        return { success: true, message: result.message || '激活成功！' };
      } else {
        return { success: false, message: result.reason || '激活失败' };
      }
    } catch (error) {
      return { success: false, message: '网络连接失败，请检查网络后重试' };
    }
  }
  
  /**
   * 离线验证（使用本地缓存文件）
   */
  function verifyOffline(callback) {
    readLicenseCache(function(cacheData) {
      const validation = validateLicenseCache(cacheData);
      
      if (validation.valid) {
        // 更新localStorage
        localStorage.setItem(STORAGE_KEYS.LICENSE_CODE, validation.code);
        localStorage.setItem(STORAGE_KEYS.ACTIVATION_STATUS, 'activated');
        localStorage.setItem(STORAGE_KEYS.ACTIVATION_TIME, validation.activatedAt);
        
        callback({ 
          success: true, 
          offline: true,
          code: validation.code,
          machineId: validation.machineId,
          message: '离线验证成功'
        });
      } else {
        callback({ 
          success: false, 
          offline: true,
          message: validation.reason 
        });
      }
    });
  }

  /**
   * 创建激活界面UI
   */
  function createActivationUI() {
    // 检查是否已经创建
    if (document.getElementById('ae-activation-panel')) return;

    const panel = document.createElement('div');
    panel.id = 'ae-activation-panel';
    panel.innerHTML = `
      <style>
        #ae-activation-panel * {
          -webkit-tap-highlight-color: transparent;
        }

        #ae-activation-panel {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #6EA963 0%, #4B7341 100%);
          border-radius: 12px !important;
          padding: 25px;
          box-shadow: 0 20px 60px rgba(75, 115, 65, 0.4);
          z-index: 999999;
          min-width: 380px;
          max-width: 420px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          pointer-events: auto !important;
        }

        #ae-activation-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 999998;
          pointer-events: auto;
        }

        .activation-content {
          background: #CED6B6;
          border-radius: 10px !important;
          padding: 25px;
          position: relative;
          z-index: 1000000;
          pointer-events: auto !important;
        }

        .activation-title {
          font-size: 22px;
          font-weight: 700;
          color: #4B7341;
          margin-bottom: 8px;
          text-align: center;
        }

        .activation-subtitle {
          font-size: 13px;
          color: #91945D;
          text-align: center;
          margin-bottom: 20px;
        }

        .machine-id-display {
          background: #B7D4A3;
          padding: 10px 12px;
          border-radius: 6px;
          margin-bottom: 16px;
          font-size: 11px;
          color: #4B7341;
        }

        .machine-id-display strong {
          color: #4B7341;
          font-weight: 600;
        }

        .input-group {
          margin-bottom: 12px;
          position: relative;
          z-index: 1000001;
        }

        .input-group label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #4B7341;
          margin-bottom: 6px;
          pointer-events: none;
        }

        .input-group input {
          width: 100%;
          padding: 10px 12px;
          border: 2px solid #B7D4A3;
          border-radius: 6px !important;
          font-size: 15px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s ease;
          box-sizing: border-box;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
          outline: none !important;
          background: white !important;
          color: #4B7341 !important;
          pointer-events: auto !important;
          cursor: text !important;
          user-select: text !important;
          -webkit-user-select: text !important;
          z-index: 1000001;
          position: relative;
        }

        .input-group input:focus {
          outline: none !important;
          border-color: #6EA963 !important;
          border-radius: 6px !important;
          box-shadow: 0 0 0 3px rgba(110, 169, 99, 0.15) !important;
          background: white !important;
        }

        .input-group input:active {
          border-radius: 6px !important;
        }

        .input-group input::placeholder {
          color: #91945D !important;
        }

        .btn-activate {
          width: 100%;
          padding: 11px;
          background: linear-gradient(135deg, #6EA963 0%, #4B7341 100%);
          color: white;
          border: none;
          border-radius: 6px !important;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 8px;
          outline: none !important;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .btn-activate:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 20px rgba(75, 115, 65, 0.3);
          border-radius: 6px !important;
          background: linear-gradient(135deg, #7BB970 0%, #5A8450 100%);
        }

        .btn-activate:active {
          transform: translateY(0);
          border-radius: 6px !important;
        }

        .btn-activate:focus {
          outline: none !important;
          border-radius: 6px !important;
        }

        .btn-activate:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .btn-check {
          width: 100%;
          padding: 10px;
          background: white;
          color: #6EA963;
          border: 2px solid #6EA963;
          border-radius: 6px !important;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          outline: none !important;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
        }

        .btn-check:hover {
          background: #B7D4A3;
          border-radius: 6px !important;
        }

        .btn-check:focus {
          outline: none !important;
          border-radius: 6px !important;
        }

        .btn-check:active {
          border-radius: 6px !important;
        }

        .status-message {
          margin-top: 12px;
          padding: 10px;
          border-radius: 6px;
          font-size: 13px;
          text-align: center;
          display: none;
        }

        .status-message.success {
          background: #B7D4A3;
          color: #4B7341;
          border: 1px solid #6EA963;
        }

        .status-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .status-message.info {
          background: #B7D4A3;
          color: #4B7341;
          border: 1px solid #91945D;
        }

        .activation-info {
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #B7D4A3;
          font-size: 11px;
          color: #91945D;
          text-align: center;
        }

        .loading-spinner {
          border: 3px solid #B7D4A3;
          border-top: 3px solid #6EA963;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          animation: spin 1s linear infinite;
          display: inline-block;
          margin-right: 8px;
          vertical-align: middle;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .activated-status {
          background: #B7D4A3;
          padding: 16px;
          border-radius: 6px;
          text-align: center;
        }

        .activated-status h3 {
          color: #4B7341;
          margin: 0 0 8px 0;
          font-size: 18px;
        }

        .activated-status p {
          color: #4B7341;
          margin: 4px 0;
          font-size: 13px;
        }
      </style>
      
      <div id="ae-activation-overlay"></div>
      <div class="activation-content">
        <div class="activation-title">Atomx-汉化脚本激活</div>
        <div class="activation-subtitle">请输入您的激活码以继续使用</div>
        
        <div class="machine-id-display">
          <strong>机器码：</strong><span id="machine-id-text"></span>
          <div style="font-size: 11px; color: #999; margin-top: 5px;">
            （激活后将绑定此设备）
          </div>
        </div>

        <div id="activation-form">
          <div class="input-group">
            <label for="license-code-input">激活码</label>
            <input 
              type="text" 
              id="license-code-input" 
              placeholder="请输入激活码"
              maxlength="20"
            />
          </div>

          <button class="btn-activate" id="btn-activate-submit">
            立即激活
          </button>

          <button class="btn-check" id="btn-check-status">
            检查激活状态
          </button>

          <div class="status-message" id="status-message"></div>
        </div>

        <div id="activated-content" style="display: none;">
          <div class="activated-status">
            <h3>✅ 已激活</h3>
            <p><strong>激活码：</strong><span id="activated-code"></span></p>
            <p><strong>机器码：</strong><span id="activated-machine"></span></p>
            <p style="margin-top: 15px; font-size: 12px; color: #666;">
              本软件已成功激活，感谢您的支持！
            </p>
          </div>
          <button class="btn-check" id="btn-reactivate" style="margin-top: 15px;">
            重新激活
          </button>
        </div>

        <div class="activation-info">
          激活码联系QQ：1076914857-或者淘宝客服 | © 2025
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    // 初始化UI
    initActivationUI();
  }

  /**
   * 初始化激活界面逻辑
   */
  function initActivationUI() {
    const machineId = generateMachineId();
    const status = checkActivationStatus();

    // 显示机器码
    document.getElementById('machine-id-text').textContent = machineId;

    // 检查是否已激活
    if (status.isActivated) {
      showActivatedStatus(status);
    }

    // 绑定激活按钮事件
    document.getElementById('btn-activate-submit').addEventListener('click', handleActivation);

    // 绑定检查状态按钮
    document.getElementById('btn-check-status').addEventListener('click', handleCheckStatus);

    // 绑定重新激活按钮
    document.getElementById('btn-reactivate').addEventListener('click', () => {
      document.getElementById('activation-form').style.display = 'block';
      document.getElementById('activated-content').style.display = 'none';
      document.getElementById('license-code-input').value = '';
      hideMessage();
    });

    // 回车键激活
    document.getElementById('license-code-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleActivation();
      }
    });

    // 点击遮罩层不关闭（必须激活才能使用）
    document.getElementById('ae-activation-overlay').addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      showMessage('请先完成激活才能使用本软件', 'error');
    });

    // 阻止激活面板上的点击事件冒泡到遮罩层
    const panel = document.getElementById('ae-activation-panel');
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // 确保输入框可以获取焦点和输入
    const input = document.getElementById('license-code-input');
    input.addEventListener('mousedown', (e) => {
      e.stopPropagation();
    });
    input.addEventListener('click', (e) => {
      e.stopPropagation();
      input.focus();
    });
    
    // 防止输入框被禁用
    setTimeout(() => {
      input.removeAttribute('disabled');
      input.removeAttribute('readonly');
      input.focus();
    }, 100);
  }

  /**
   * 处理激活操作
   */
  async function handleActivation() {
    const input = document.getElementById('license-code-input');
    const btn = document.getElementById('btn-activate-submit');
    const code = input.value.trim();

    if (!code) {
      showMessage('请输入激活码', 'error');
      return;
    }

    // 显示加载状态
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span>正在验证...';

    // 验证激活码
    const result = await verifyLicense(code);

    // 恢复按钮
    btn.disabled = false;
    btn.innerHTML = '立即激活';

    if (result.success) {
      showMessage(result.message, 'success');
      setTimeout(() => {
        const status = checkActivationStatus();
        showActivatedStatus(status);
      }, 1500);
    } else {
      showMessage(result.message, 'error');
    }
  }

  /**
   * 处理检查状态操作
   */
  async function handleCheckStatus() {
    const status = checkActivationStatus();
    
    if (!status.code) {
      showMessage('尚未输入激活码', 'info');
      return;
    }

    const btn = document.getElementById('btn-check-status');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span>检查中...';

    // 重新验证
    const result = await verifyLicense(status.code);

    btn.disabled = false;
    btn.innerHTML = '检查激活状态';

    if (result.success) {
      showMessage('激活状态正常', 'success');
      setTimeout(() => {
        showActivatedStatus(status);
      }, 1500);
    } else {
      showMessage(result.message, 'error');
      // 清除本地激活状态
      localStorage.removeItem(STORAGE_KEYS.ACTIVATION_STATUS);
    }
  }

  /**
   * 显示已激活状态
   */
  function showActivatedStatus(status) {
    document.getElementById('activation-form').style.display = 'none';
    document.getElementById('activated-content').style.display = 'block';
    document.getElementById('activated-code').textContent = status.code;
    document.getElementById('activated-machine').textContent = status.machineId;
    
    // 2秒后自动关闭激活面板
    setTimeout(() => {
      closeActivationPanel();
    }, 2000);
  }
  
  /**
   * 关闭激活面板
   */
  function closeActivationPanel() {
    const panel = document.getElementById('ae-activation-panel');
    const overlay = document.getElementById('ae-activation-overlay');
    
    if (panel) panel.remove();
    if (overlay) overlay.remove();
  }

  /**
   * 显示消息
   */
  function showMessage(message, type) {
    const msgEl = document.getElementById('status-message');
    msgEl.textContent = message;
    msgEl.className = `status-message ${type}`;
    msgEl.style.display = 'block';
  }

  /**
   * 隐藏消息
   */
  function hideMessage() {
    const msgEl = document.getElementById('status-message');
    msgEl.style.display = 'none';
  }

  /**
   * 启动时检查激活状态
   */
  function initLicenseCheck() {
    // 优先尝试离线验证（使用缓存文件）
    verifyOffline(function(offlineResult) {
      if (offlineResult.success) {
        // 离线验证成功，在后台尝试联网验证
        setTimeout(() => {
          verifyLicense(offlineResult.code).then(result => {
            if (!result.success) {
              // 检查是否是网络错误（断网情况）
              const isNetworkError = result.message && (
                result.message.indexOf('网络') >= 0 || 
                result.message.indexOf('连接失败') >= 0 ||
                result.message.indexOf('NetworkError') >= 0 ||
                result.message.indexOf('Failed to fetch') >= 0
              );
              
              if (!isNetworkError) {
                // 真正的验证失败（激活码不存在或机器码不匹配）
                deleteLicenseCache();
                localStorage.removeItem(STORAGE_KEYS.ACTIVATION_STATUS);
                localStorage.removeItem(STORAGE_KEYS.LICENSE_CODE);
                localStorage.removeItem(STORAGE_KEYS.ACTIVATION_TIME);
                alert('许可证验证失败！\n\n原因：' + result.message + '\n\n请重新激活软件。');
                createActivationUI();
              }
            }
          }).catch(e => {
            // 网络异常，静默处理
          });
        }, 2000);
        
      } else {
        // 离线验证失败，检查localStorage
        const status = checkActivationStatus();
        
        if (!status.isActivated) {
          // 未激活，5秒后显示激活界面
          setTimeout(() => {
            createActivationUI();
          }, 5000);
        } else {
          // localStorage显示已激活，但缓存文件无效，尝试联网验证
          verifyLicense(status.code).then(result => {
            if (!result.success) {
              localStorage.removeItem(STORAGE_KEYS.ACTIVATION_STATUS);
              setTimeout(() => {
                createActivationUI();
              }, 5000);
            }
          }).catch(error => {
            setTimeout(() => {
              createActivationUI();
            }, 5000);
          });
        }
      }
    });
  }

  // 全局函数：手动显示激活界面（用于菜单调用）
  window.showActivationPanel = function() {
    createActivationUI();
  };

  // 全局函数：获取激活状态（供其他模块调用）
  window.getActivationStatus = function() {
    return checkActivationStatus();
  };

  // 页面加载完成后执行激活检查
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLicenseCheck);
  } else {
    initLicenseCheck();
  }

})();
