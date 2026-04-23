#!/usr/bin/env python3
from http.server import HTTPServer, SimpleHTTPRequestHandler
import os
import sys
from pathlib import Path

# 设置工作目录
dist_dir = os.path.join(os.path.dirname(__file__), 'dist')
os.chdir(dist_dir)

# 读取配置
class NetlifyHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.headers_config = self.load_netlify_config()
        super().__init__(*args, **kwargs)

    def load_netlify_config(self):
        """加载netlify.toml配置"""
        config = {}
        netlify_toml = Path('netlify.toml')

        if netlify_toml.exists():
            content = netlify_toml.read_text()
            print('\n=== netlify.toml 内容 ===')
            print(content)
            print('==========================\n')

            # 简单解析CSP配置
            if 'Content-Security-Policy' in content:
                import re
                csp_match = re.search(r'Content-Security-Policy\s*=\s*"([^"]+)"', content)
                if csp_match:
                    config['Content-Security-Policy'] = csp_match.group(1)
                    print('✅ 已加载CSP策略')
                    print(f'CSP: {csp_match.group(1)[:100]}...\n')

            if 'X-Frame-Options' in content:
                import re
                xframe_match = re.search(r'X-Frame-Options\s*=\s*"([^"]+)"', content)
                if xframe_match:
                    config['X-Frame-Options'] = xframe_match.group(1)
                    print(f'✅ 已加载X-Frame-Options: {xframe_match.group(1)}\n')
        else:
            print('⚠️  未找到 netlify.toml 文件\n')

        return config

    def end_headers(self):
        """添加自定义headers"""
        # 添加CSP headers
        for key, value in self.headers_config.items():
            self.send_header(key, value)

        # 添加CORS headers（用于测试）
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')

        super().end_headers()

    def do_GET(self):
        # SPA路由支持
        requested_file = self.path.lstrip('/')

        # 如果是文件请求且文件存在，返回文件
        if os.path.exists(requested_file) and os.path.isfile(requested_file):
            return super().do_GET()

        # 否则返回index.html（SPA路由）
        self.path = '/'
        return super().do_GET()

if __name__ == '__main__':
    port = 8080

    print('\n' + '='*50)
    print('本地静态服务器已启动（模拟Netlify环境）')
    print('='*50)
    print(f'📂 根目录: {dist_dir}')
    print(f'🌐 访问地址: http://localhost:{port}')
    print('='*50)

    server = HTTPServer(('0.0.0.0', port), NetlifyHandler)
    print('\n🚀 服务器正在运行...')
    print('💡 提示: 在浏览器中打开 http://localhost:' + str(port))
    print('🛑 按 Ctrl+C 停止服务器\n')

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\n\n👋 服务器已停止')
        sys.exit(0)
