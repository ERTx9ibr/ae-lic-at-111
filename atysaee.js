// zh-hook.js — runtime UI translation helper for EasyEdit Viewer
// 注：在 index.html 加载所有 bundle 脚本后再引入此文件
(function () {
  'use strict';

  /**
   * 英文 → 中文 对照表
   * 在此处持续补充需要翻译的短语/单词。
   */
  const translations = {
    // 主界面
    // 脚本主界面
"Need more packages?": "需要更多素材包吗?",
"Get it in": "在",
"Atom Market": "Atom Market 获取",
"CHOOSE THE PACKAGE": "选择素材包",
"OR INSTALL": "或安装",
"NEW PACKAGE": "新素材包",
"Delete this package?": "删除此素材包？",
"DELETE": "删除",
"CANCEL": "取消",
"PRELOADING": "预加载中",
"Customizer": "自定义工具",
"Toolbar": "工具栏",
"Video Tutorials": "视频教程",
"Favorites": "收藏夹",
"Find items": "查找项目",
"You have no favorite items.": "你还没有收藏任何项目.",
"« Back": "« 返回",
"SEE ON THE WEBSITE": "在网站上查看",
"Auto-play": "自动播放",
"Get Started": "开始使用",
"Install the first package": "安装第一个素材包",
"Watch the video tutorials": "观看视频教程",
"Learn useful tips & guides for": "学习实用技巧和指南，帮助你",
"working with packages": "使用预设包进行创作",
"Browse the file (*.atom)": "浏览文件（*.atom）",
"or use drag and drop": "或使用拖放方式",
"Open the Atom market to get more": "打开 Atom 市场获取更多",
"free & premium items": "免费和高级资源",
"Get more packages": "获取更多素材包",
"Need help? Contact the": "需要帮助? 请联系",
"help center": "帮助中心",
"Installation Method": "安装方法",
"[Default]": "[默认]",
"Copy files": "复制文件",
"Copying the files to the extension directory": "将文件复制到扩展目录",
"Slower than without copying, but your files will be safe": "比不复制慢, 但您的文件将是安全的",
"[Portable]": "[便携式]",
"Do not copy": "请勿复制",
"Run the package in the current directory without copying": "在当前目录中运行包而不复制",
"Much faster, but you shouldn't change the package path": "速度更快, 但你不应该改变包路径",
"Continue": "同意",
"Save and don't ask again": "保存后不再询问",
"VALIDATION": "验证",
"No installed packages": "没有安装任何素材包",
"Just drag and drop": "只需拖放",
"or": "或",
"browse": "浏览",
"to install": "安装",
"HIDE ALL NOTIFY": "隐藏全部通知",
"STORE": "商店",
"NO NOTIFICATIONS": "没有通知",
"UNABLE TO LOAD": "无法加载",
"NO CONTENT DUE TO SERVER ERRORS": "由于服务器错误，无法显示内容",
"Social Media Pack": "社交媒体包",
"Trendy Graphics": "潮流图形",
"CrispyCut Transitions": "CrispyCut 转场",
"BASE Montage Library": "BASE 蒙太奇库",
"Base Library": "基础库",
"Spunkram Library": "Spunkram 库",
"Seamless Loop Kinetic Posters 2": "无缝循环动感海报 2",
"Quick Start": "快速开始",
"Volume: ": "音量: ",
"Less": "缩小",
"More": "放大",
"Auto-resizing": "自动调整大小",
"SUCCESSFULLY": "成功",
"The package is installed. Enjoy!": "素材包已安装，尽情使用！",
"AUTO-HIDE": "自动隐藏",
"Consolidate Duplicates": "合并重复项",
"Resize Items": "调整项目大小",
"Close Source Clips": "关闭源剪辑",
"WRONG SOFTWARE": "软件不兼容",
"This item only for": "此项目仅适用于",
"software": "软件",
"CLICK TO CLOSE": "点击关闭",
"Add Footage to the sequence": "将素材添加到序列中",
"Add to favorite": "添加到收藏",
"Remove": "移除",
"APPLY": "应用",
"Your favorites:": "你的收藏：",
"CORRUPTED PACKAGE": "损坏的安装包",
"THIS PACKAGE IS CORRUPTED": "此安装包已损坏",
"REINSTALL AND TRY AGAIN": "请重新安装后再试",
"Restoring An Extension": "恢复扩展",
"RELOAD EXTENSION": "重新加载扩展",
"RESET ALL SETTINGS": "重置所有设置",
"REMOVE PACKAGE FILES": "删除包文件",
"Render Options": "渲染选项",
"Use System Fonts": "使用系统字体",
"(Reload Required)": "（需要重新加载）",
"GPU Supports": "GPU 支持",
"Continue anyway": "仍然继续",
"(skip issues)": "（跳过问题）",
"Audio Visualization": "音频可视化",
"(need reload to see changes)": "（需要重新加载才能看到更改）",
"Disabled": "禁用",
"No": "无",
"Waveform": "波形",
"Line Bars": "线条柱状",
"Visual": "可视化",
"File System": "文件系统",
"Portable packages by default": "默认使用便携式包",
"(do not copy package files when installation)": "（安装时不复制包文件）",
"Ask about the method every time": "每次都询问安装方式",
"API Server": "API服务器",
"Main API Server": "主API服务器",
"Proxy Server #1": "代理服务器#1",
"Use custom path for packages by subscription": "为订阅包使用自定义路径",
"No Visual": "无可视内容",
"Latest version": "最新版本",
"Atom version:": "Atom版本:",
"SORT BY": "排序方式",
"Default": "默认",
"Any App": "任意应用",
"Current App": "当前应用",
"Name: A-Z": "名称: A-Z",
"Name: Z-A": "名称: Z-A",
"Report Issue": "报告问题",
"Fix Font Problems": "修复字体问题",
"Get the AtomX panel for projects": "获取项目的 AtomX 面板",
"Reload Panel": "重新加载面板",
"Debugger": "调试器",
"Settings": "设置",
"Test Mode": "测试模式",
"Dev Panel": "开发者面板",
"READ DOCS": "阅读文档",
"BUG REPORT": "错误报告",
"LAUNCHED WITH FULL WORKING CAPACITY": "已以完整工作性能启动",
"THE PACKAGE": "该包",
"TEST MODE ON": "测试模式已开启",
"CLICK HERE": "点击此处",
"TO EXIT TEST MODE": "退出测试模式",
"AtomX Extension © get-atomx.com": "@影视后期系统教学-汉化-B站",
  };

  // 新增: 规范化函数与映射，提升匹配鲁棒性（忽略大小写与多余空白）
  function _normalize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/\s+/g, ' ') // 连续空白压缩为单空格
      .trim();
  }

  const _normalizedMap = {};
  for (const [k, v] of Object.entries(translations)) {
    _normalizedMap[_normalize(k)] = v;
  }

  /**
   * 翻译纯字符串（用于拦截 attr 设置等）。
   * @param {string} str
   * @returns {string}
   */
  function translateString(str) {
    if (!str || typeof str !== 'string') return str;
    const trimmed = str.trim();
    if (translations[trimmed]) return translations[trimmed];
    const norm = _normalize(trimmed);
    if (_normalizedMap[norm]) return _normalizedMap[norm];
    for (const [k, v] of Object.entries(translations)) {
      if (trimmed.toLowerCase().startsWith(k.toLowerCase())) {
        return v + trimmed.slice(k.length);
      }
    }
    return str;
  }

  /**
   * 将文本节点替换为中文（若存在翻译）。
   * @param {Node} node - 文本节点
   */
  function translateTextNode(node) {
    if (!node || node.nodeType !== Node.TEXT_NODE) return;

    let text = node.nodeValue;
    if (!text) return;

    let replaced = false;

    // 1) 精确匹配整个文本（去首尾空白）
    const trimmed = text.trim();
    if (translations[trimmed]) {
      text = text.replace(trimmed, translations[trimmed]);
      replaced = true;
    } else {
      // 1.1) 尝试大小写/空白不敏感匹配
      const norm = _normalize(trimmed);
      if (_normalizedMap[norm]) {
        text = text.replace(trimmed, _normalizedMap[norm]);
        replaced = true;
      }
    }

    if (replaced) {
      node.nodeValue = text;
    }
  }

  /**
   * 翻译元素常用可见属性（placeholder 等）。
   * @param {HTMLElement} el
   */
  function translateAttributes(el) {
    if (!el || el.nodeType !== Node.ELEMENT_NODE) return;
    // 增加对自定义 "tooltip"、"label"、"Label" 等属性的翻译支持
    // 注意：同时支持大小写，因为 MenuItem 等自定义元素可能区分大小写
    const attrNames = ['placeholder', 'title', 'alt', 'aria-label', 'value', 'tooltip',];
    for (const name of attrNames) {
      if (!el.hasAttribute(name)) continue;
      let val = el.getAttribute(name);
      if (!val) continue;

      // 精确匹配
      if (translations[val]) {
        el.setAttribute(name, translations[val]);
        continue;
      }

      // 新增: 非敏感匹配
      const normVal = _normalize(val);
      if (_normalizedMap[normVal]) {
        el.setAttribute(name, _normalizedMap[normVal]);
        continue;
      }
    }
  }

  /**
   * 翻译 CEP 面板菜单 XML（<Menu><MenuItem .../></Menu>）。
   * 将所有 MenuItem 的 Label/label 属性进行翻译。
   */
  function translateMenuXML(xmlStr) {
    if (typeof xmlStr !== 'string' || !xmlStr.trim()) return xmlStr;
    try {
      const parser = new DOMParser();
      const xml = parser.parseFromString(xmlStr, 'text/xml');
      const items = xml.getElementsByTagName('MenuItem');
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        // 同时处理大小写属性名
        if (item.hasAttribute('Label')) {
          const v = item.getAttribute('Label');
          item.setAttribute('Label', translateString(v));
        }
        if (item.hasAttribute('label')) {
          const v = item.getAttribute('label');
          item.setAttribute('label', translateString(v));
        }
      }
      const serializer = new XMLSerializer();
      return serializer.serializeToString(xml);
    } catch (e) {
      // 解析失败则使用保守的正则替换方案
      return xmlStr.replace(/(\bLabel\s*=\s*")[^"]*(")/g, (m, p1, p2) => {
        const raw = m.slice(p1.length, -p2.length);
        return p1 + translateString(raw) + p2;
      });
    }
  }

  /**
   * 翻译 CEP 菜单 JSON（setContextMenuByJSON 常用）。
   */
  function translateMenuJSON(menu) {
    try {
      let obj = menu;
      if (typeof menu === 'string') obj = JSON.parse(menu);
      const walk = (node) => {
        if (!node || typeof node !== 'object') return;
        if (typeof node.label === 'string') node.label = translateString(node.label);
        if (Array.isArray(node.menu)) node.menu.forEach(walk);
        // 兼容数组作为根
        if (Array.isArray(node)) node.forEach(walk);
      };
      walk(obj);
      return typeof menu === 'string' ? JSON.stringify(obj) : obj;
    } catch {
      return menu;
    }
  }

  /**
   * 遍历节点树翻译文本与属性
   */
  function deepTranslate(node) {
    if (!node) return;
    translateTextNode(node);
    if (node.nodeType === Node.ELEMENT_NODE) translateAttributes(node);
    node.childNodes.forEach((child) => deepTranslate(child));
  }

  /**
   * 遍历 root 下所有文本节点并尝试翻译。
   * @param {Node} root
   */
  function scan(root) {
    if (!root) return;
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
    while (walker.nextNode()) {
      translateTextNode(walker.currentNode);
    }
  }

  /**
   * 监听 DOM 变化，实时翻译新增元素。
   */
  function observeMutations() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'childList') {
          m.addedNodes.forEach((n) => deepTranslate(n));
        } else if (m.type === 'characterData') {
          translateTextNode(m.target);
        } else if (m.type === 'attributes') {
          translateAttributes(m.target);
        }
      });
    });
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      attributes: true,
      subtree: true,
    });
  }

  /**
   * 入口函数
   */
  function init() {
    try {

      // hook jQuery attr 设置，实时翻译 tooltip 动态字符串
      if (window.jQuery && !window.jQuery.fn.__zhHooked) {
        const $ = window.jQuery;
        const origAttr = $.fn.attr;
        $.fn.attr = function (name, value) {
          if (name === 'tooltip' && typeof value === 'string') {
            value = translateString(value);
          }
          return value === undefined
            ? origAttr.call(this, name)
            : origAttr.call(this, name, value);
        };
        $.fn.__zhHooked = true;
      }

      // hook CEP 面板菜单 API：将 XML/JSON 标签翻译后再注入
      if (window.CSInterface && !window.__zhHookedCSIMenu) {
        const proto = window.CSInterface && window.CSInterface.prototype;
        if (proto) {
          if (typeof proto.setPanelFlyoutMenu === 'function') {
            const _origSetFlyout = proto.setPanelFlyoutMenu;
            proto.setPanelFlyoutMenu = function (menu) {
              try {
                if (typeof menu === 'string') {
                  menu = translateMenuXML(menu);
                }
              } catch {}
              return _origSetFlyout.call(this, menu);
            };
          }
          if (typeof proto.setContextMenu === 'function') {
            const _origSetCtx = proto.setContextMenu;
            proto.setContextMenu = function (menu) {
              try {
                if (typeof menu === 'string') menu = translateMenuXML(menu);
              } catch {}
              return _origSetCtx.call(this, menu);
            };
          }
          if (typeof proto.setContextMenuByJSON === 'function') {
            const _origSetCtxJSON = proto.setContextMenuByJSON;
            proto.setContextMenuByJSON = function (menu) {
              try {
                menu = translateMenuJSON(menu);
              } catch {}
              return _origSetCtxJSON.call(this, menu);
            };
          }
        }
        window.__zhHookedCSIMenu = true;
      }

      deepTranslate(document.body);
      observeMutations();
      console.log('[zh-hook] Translation initialized');
    } catch (err) {
      console.error('[zh-hook] Failed to initialize:', err);
    }
  }

  // 在 DOM 就绪后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

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
        console.log('获取系统路径失败:', e);
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
      console.error('加密失败:', e);
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
      console.error('解密失败:', e);
      return null;
    }
  }
  
  /**
   * 写入缓存文件（使用CSInterface）
   */
  function writeLicenseCache(data) {
    if (typeof CSInterface === 'undefined') {
      console.warn('CSInterface 不可用，无法写入缓存文件');
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
        console.error('数据加密失败');
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
        if (result === 'success') {
          console.log('✅ 许可证缓存文件已写入:', filePath);
        } else {
          console.error('❌ 写入缓存文件失败:', result);
        }
      });
      
      return true;
      
    } catch(e) {
      console.error('写入缓存文件异常:', e);
      return false;
    }
  }
  
  /**
   * 读取缓存文件
   */
  function readLicenseCache(callback) {
    if (typeof CSInterface === 'undefined') {
      console.warn('CSInterface 不可用，无法读取缓存文件');
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
        if (result === 'not_found') {
          console.log('缓存文件不存在');
          callback(null);
          return;
        }
        
        if (result.indexOf('error:') === 0) {
          console.error('读取缓存文件失败:', result);
          callback(null);
          return;
        }
        
        // 解密数据
        const decrypted = decryptData(result);
        if (!decrypted) {
          console.error('解密缓存文件失败');
          callback(null);
          return;
        }
        
        try {
          const cacheData = JSON.parse(decrypted);
          console.log('✅ 成功读取许可证缓存文件');
          callback(cacheData);
        } catch(e) {
          console.error('解析缓存文件失败:', e);
          callback(null);
        }
      });
      
    } catch(e) {
      console.error('读取缓存文件异常:', e);
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
      console.warn('CSInterface 不可用，无法删除缓存文件');
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
        if (result === 'success') {
          console.log('✅ 缓存文件已删除:', filePath);
          if (callback) callback(true);
        } else if (result === 'not_found') {
          console.log('缓存文件不存在');
          if (callback) callback(true);
        } else {
          console.error('删除缓存文件失败:', result);
          if (callback) callback(false);
        }
      });
      
    } catch(e) {
      console.error('删除缓存文件异常:', e);
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
          console.log('CSInterface 获取失败:', e);
        }
      }

      // 4. 补充平台信息
      info.platform = navigator.platform || 'unknown';
      
      // 5. 获取屏幕分辨率作为辅助特征
      info.screen = screen.width + 'x' + screen.height + '@' + screen.colorDepth + 'bit';

    } catch(e) {
      console.log('硬件信息获取失败:', e);
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
      console.log('WebGL 获取失败:', e);
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
      console.log('使用已保存的机器码:', machineId);
      return machineId;
    }

    // 获取硬件信息
    const hwInfo = getSystemHardwareInfo();
    
    console.log('=== 硬件信息采集 ===');
    console.log('CPU:', hwInfo.cpu);
    console.log('GPU:', hwInfo.gpu);
    console.log('OS:', hwInfo.os);
    console.log('屏幕:', hwInfo.screen);
    
    // 生成新的机器码（基于硬件特征）
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
    
    console.log('=== 机器码生成成功 ===');
    console.log('机器码:', machineId);
    console.log('指纹:', fingerprint);
    
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
      console.error('激活验证失败:', error);
      return { success: false, message: '网络连接失败，请检查网络后重试' };
    }
  }
  
  /**
   * 离线验证（使用本地缓存文件）
   */
  function verifyOffline(callback) {
    console.log('🔍 尝试离线验证...');
    
    readLicenseCache(function(cacheData) {
      const validation = validateLicenseCache(cacheData);
      
      if (validation.valid) {
        console.log('✅ 离线验证成功');
        
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
        console.log('❌ 离线验证失败:', validation.reason);
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
        <div class="activation-title">🔐 软件激活</div>
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
          需要帮助？请联系技术支持 | © 2025
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
    
    if (panel) {
      panel.remove();
    }
    if (overlay) {
      overlay.remove();
    }
    
    console.log('✅ 激活面板已关闭');
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
    console.log('🚀 启动激活检查系统...');
    
    // 优先尝试离线验证（使用缓存文件）
    verifyOffline(function(offlineResult) {
      if (offlineResult.success) {
        // 离线验证成功
        console.log('✅ 离线验证通过，软件可正常使用');
        console.log('📝 激活码:', offlineResult.code);
        console.log('🖥️  机器码:', offlineResult.machineId);
        
        // 在后台尝试联网验证（验证服务器是否有此激活码）
        setTimeout(() => {
          console.log('🌐 后台验证激活码有效性...');
          verifyLicense(offlineResult.code).then(result => {
            if (result.success) {
              console.log('✅ 在线验证成功，激活码有效');
            } else {
              // 检查是否是网络错误（断网情况）
              const isNetworkError = result.message && (
                result.message.indexOf('网络') >= 0 || 
                result.message.indexOf('连接失败') >= 0 ||
                result.message.indexOf('NetworkError') >= 0 ||
                result.message.indexOf('Failed to fetch') >= 0
              );
              
              if (isNetworkError) {
                // 网络不可用，跳过验证
                console.log('🔌 网络不可用，跳过在线验证，继续使用离线模式');
                console.log('💡 提示：下次联网时会自动验证激活码有效性');
              } else {
                // 真正的验证失败（激活码不存在或机器码不匹配）
                console.error('❌ 服务器验证失败:', result.message);
                console.warn('⚠️ 本地缓存文件可能已失效或被篡改');
                
                // 清除本地缓存文件
                deleteLicenseCache(function(deleted) {
                  if (deleted) {
                    console.log('🗑️  已清除本地缓存文件');
                  }
                });
                
                // 清除 localStorage
                localStorage.removeItem(STORAGE_KEYS.ACTIVATION_STATUS);
                localStorage.removeItem(STORAGE_KEYS.LICENSE_CODE);
                localStorage.removeItem(STORAGE_KEYS.ACTIVATION_TIME);
                
                // 弹出激活界面
                alert('许可证验证失败！\n\n原因：' + result.message + '\n\n请重新激活软件。');
                createActivationUI();
              }
            }
          }).catch(e => {
            // 异常捕获（例如代码错误）
            console.log('🔌 网络异常，跳过在线验证，继续使用离线模式');
            console.log('异常信息:', e);
          });
        }, 2000);
        
      } else {
        // 离线验证失败，检查localStorage
        console.log('❌ 离线验证失败:', offlineResult.message);
        
        const status = checkActivationStatus();
        
        if (!status.isActivated) {
          // 未激活，显示激活界面
          console.log('⏰ 未检测到有效许可证，激活界面将在 5 秒后显示...');
          setTimeout(() => {
            console.log('🔐 显示激活界面');
            createActivationUI();
          }, 5000);
        } else {
          // localStorage显示已激活，但缓存文件无效，尝试联网验证
          console.log('🌐 尝试联网验证...');
          
          verifyLicense(status.code).then(result => {
            if (!result.success) {
              console.warn('⚠️ 联网验证失败，请重新激活');
              localStorage.removeItem(STORAGE_KEYS.ACTIVATION_STATUS);
              setTimeout(() => {
                createActivationUI();
              }, 5000);
            } else {
              console.log('✅ 联网验证成功');
            }
          }).catch(error => {
            console.error('❌ 联网验证异常:', error);
            console.log('⚠️ 无法验证许可证，请确保网络连接正常');
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
  
  // 全局函数：查看缓存文件信息（调试用）
  window.debugLicenseCache = function() {
    console.log('=== 许可证缓存调试信息 ===');
    console.log('操作系统:', getOSType());
    console.log('缓存目录:', getCacheDirectory());
    console.log('缓存文件名:', CACHE_FILE_NAME);
    console.log('机器码:', generateMachineId());
    
    readLicenseCache(function(cacheData) {
      if (cacheData) {
        console.log('缓存数据:', cacheData);
        const validation = validateLicenseCache(cacheData);
        console.log('验证结果:', validation);
      } else {
        console.log('缓存文件不存在或读取失败');
      }
    });
  };
  
  // 全局函数：清除缓存文件（调试用）
  window.clearLicenseCache = function() {
    console.log('🗑️  开始清除所有激活信息...');
    
    // 删除缓存文件
    deleteLicenseCache(function(deleted) {
      if (deleted) {
        console.log('✅ 缓存文件已删除');
      }
      
      // 清空 localStorage
      localStorage.removeItem(STORAGE_KEYS.LICENSE_CODE);
      localStorage.removeItem(STORAGE_KEYS.MACHINE_ID);
      localStorage.removeItem(STORAGE_KEYS.ACTIVATION_STATUS);
      localStorage.removeItem(STORAGE_KEYS.ACTIVATION_TIME);
      console.log('✅ localStorage 已清空');
      console.log('✅ 所有激活信息已清除，请重新启动软件');
    });
  };

  // 页面加载完成后执行激活检查
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLicenseCheck);
  } else {
    initLicenseCheck();
  }

})();