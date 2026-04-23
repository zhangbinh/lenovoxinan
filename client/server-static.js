import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 8080;
const distDir = path.resolve(process.cwd(), 'dist');

// 读取_redirects文件
let redirects = [];
const redirectsPath = path.join(distDir, '_redirects');
if (fs.existsSync(redirectsPath)) {
  const redirectsContent = fs.readFileSync(redirectsPath, 'utf-8');
  redirects = redirectsContent
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => {
      const [from, to, status] = line.split(/\s+/);
      return { from, to, status: status || 200 };
    });
  console.log('已加载重定向规则:', redirects.length, '条');
}

// 读取netlify.toml文件（简化版，只读取headers）
let headersConfig = {};
const netlifyTomlPath = path.join(distDir, 'netlify.toml');
if (fs.existsSync(netlifyTomlPath)) {
  const netlifyTomlContent = fs.readFileSync(netlifyTomlPath, 'utf-8');
  console.log('netlify.toml内容:');
  console.log(netlifyTomlContent);

  // 简单的TOML解析（只提取headers部分）
  const headersMatch = netlifyTomlContent.match(/\[\[headers\]\].*?for\s*=\s*"([^"]+)"/s);
  if (headersMatch) {
    const cspMatch = netlifyTomlContent.match(/Content-Security-Policy\s*=\s*"([^"]+)"/);
    const xFrameMatch = netlifyTomlContent.match(/X-Frame-Options\s*=\s*"([^"]+)"/);

    headersConfig = {
      pattern: headersMatch[1],
      headers: {}
    };

    if (cspMatch) {
      headersConfig.headers['Content-Security-Policy'] = cspMatch[1];
    }
    if (xFrameMatch) {
      headersConfig.headers['X-Frame-Options'] = xFrameMatch[1];
    }

    console.log('已加载headers配置:');
    console.log(headersConfig);
  }
}

// 添加中间件
app.use((req, res, next) => {
  // 添加CSP headers
  if (headersConfig.headers) {
    Object.entries(headersConfig.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
  }
  next();
});

// 处理重定向
app.use((req, res, next) => {
  for (const redirect of redirects) {
    if (redirect.from === '/*' || req.path.match(new RegExp(redirect.from.replace('*', '.*')))) {
      if (redirect.to.startsWith('/')) {
        return res.sendFile(path.join(distDir, redirect.to.replace(/^\//, '')));
      }
    }
  }
  next();
});

// 静态文件服务
app.use(express.static(distDir));

// SPA路由支持（对于React Router）
app.get('*', (req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`\n====================================`);
  console.log(`本地静态服务器已启动`);
  console.log(`访问地址: http://localhost:${port}`);
  console.log(`根目录: ${distDir}`);
  console.log(`====================================\n`);

  console.log('配置信息:');
  console.log('- 重定向规则:', redirects.length, '条');
  console.log('- Headers配置:', Object.keys(headersConfig.headers || {}).length, '个');

  if (headersConfig.headers['Content-Security-Policy']) {
    console.log('\nCSP策略:');
    console.log(headersConfig.headers['Content-Security-Policy']);
    console.log('\n✅ CSP策略已启用');
  } else {
    console.log('\n⚠️  未配置CSP策略');
  }

  console.log('\n提示: 在浏览器中打开 http://localhost:' + port + ' 测试');
  console.log('按 Ctrl+C 停止服务器\n');
});
