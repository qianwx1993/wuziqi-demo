# 五子棋网页游戏 🎮

一个经典的五子棋双人对战网页游戏，使用原生 HTML/CSS/JavaScript + Canvas 开发。

![五子棋游戏](https://img.shields.io/badge/版本-v1.0.0-blue) ![MIT License](https://img.shields.io/badge/license-MIT-green) ![HTML5](https://img.shields.io/badge/HTML5-Canvas-orange)

## ✨ 功能特性

- 🎯 **标准棋盘**: 15×15 标准五子棋棋盘
- 👥 **双人对战**: 支持双人同屏对战
- 🔄 **悔棋功能**: 可撤销上一步操作
- 🎨 **精美界面**: 仿木纹棋盘设计，渐变背景
- ⚡ **流畅体验**: Canvas 渲染，快速响应
- 📱 **响应式**: 适配不同屏幕尺寸

## 🚀 快速开始

### 在线体验

直接访问 [GitHub Pages](https://qianwx1993.github.io/wuziqi-demo/) 即可开始游戏。

### 本地运行

#### 方法一：使用 Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### 方法二：使用 Node.js

```bash
# 安装 http-server
npm install -g http-server

# 启动服务
http-server -p 8000
```

#### 方法三：直接打开

直接在浏览器中打开 `index.html` 文件即可运行。

## 🎮 游戏规则

1. **黑棋先行**: 游戏开始时，黑棋先手
2. **轮流落子**: 双方轮流在棋盘交叉点放置棋子
3. **五子连珠**: 横、竖、斜任意方向连成五子即获胜
4. **胜负判定**: 先连成五子的一方获胜

## 🛠️ 技术栈

- **HTML5 Canvas**: 棋盘和棋子渲染
- **原生 JavaScript (ES6+)**: 游戏逻辑
- **CSS3**: 界面样式和动画
- **模块化设计**: ES6 模块化代码组织

## 📁 项目结构

```
wuziqi-demo/
├── index.html          # 主页面
├── assets/
│   ├── css/
│   │   └── main.css    # 样式文件
│   └── js/
│       ├── config.js   # 配置模块
│       ├── board.js    # 棋盘渲染模块
│       ├── rules.js    # 规则判定模块
│       ├── game.js     # 游戏控制模块
│       └── main.js     # 入口文件
├── package.json        # 项目配置
├── README.md          # 项目说明
└── 需求文档.md        # 产品需求文档
```

## 🎯 核心功能

### 棋盘渲染
- Canvas 绘制 15×15 标准棋盘
- 5 个星位点标记
- 木纹色背景设计

### 游戏控制
- 点击落子（20px 容差）
- 重新开始
- 悔棋功能

### 胜负判定
- 四方向检测（横、竖、主对角线、副对角线）
- 五子连珠判定
- 获胜弹窗提示

## 🔧 开发说明

### 运行类型检查

```bash
npm run typecheck
```

### 构建项目

```bash
npm run build
```

### 启动开发服务器

```bash
npm run serve
```

## 📊 性能指标

| 指标 | 目标值 |
|-----|--------|
| 首次加载时间 | ≤ 1 秒 |
| 点击响应时间 | ≤ 50 毫秒 |
| 渲染帧率 | 60 FPS |
| 内存占用 | ≤ 10 MB |

## 🌐 浏览器兼容性

| 浏览器 | 最低版本 |
|-------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

## 🗺️ 未来规划

- [ ] 人机对战 AI
- [ ] 落子音效
- [ ] 游戏计时
- [ ] 在线联机对战
- [ ] 游戏回放功能
- [ ] PWA 支持

## 📝 许可证

本项目采用 [MIT](LICENSE) 许可证。

## 👨‍💻 作者

AI Assistant

## 🙏 致谢

感谢所有为本项目提供帮助的朋友！

---

**欢迎 Star ⭐ 和 Fork 🍴！**

如有问题或建议，欢迎提交 [Issue](https://github.com/qianwx1993/wuziqi-demo/issues)。
