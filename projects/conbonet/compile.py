#!/usr/bin/env python3

import os
import shutil
from pathlib import Path

def ensure_dir(directory):
    """确保目录存在，如果不存在则创建"""
    Path(directory).mkdir(parents=True, exist_ok=True)

def copy_static_files():
    """复制所需的静态文件"""
    # 创建静态文件目录
    static_dir = 'static'
    css_dir = os.path.join(static_dir, 'css')
    js_dir = os.path.join(static_dir, 'js')
    
    ensure_dir(css_dir)
    ensure_dir(js_dir)
    
    # 复制 Bulma CSS
    shutil.copy('node_modules/bulma/css/bulma.min.css', 
                os.path.join(css_dir, 'bulma.min.css'))
    
    # 复制 Font Awesome
    shutil.copy('node_modules/@fortawesome/fontawesome-free/css/all.min.css',
                os.path.join(css_dir, 'fontawesome.all.min.css'))
    shutil.copy('node_modules/@fortawesome/fontawesome-free/js/all.min.js',
                os.path.join(js_dir, 'fontawesome.all.min.js'))

def main():
    """主函数"""
    # 安装依赖
    os.system('npm install bulma @fortawesome/fontawesome-free')
    
    # 复制静态文件
    copy_static_files()
    
    print("编译完成！")

if __name__ == '__main__':
    main() 