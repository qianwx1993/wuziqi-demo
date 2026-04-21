# Bash 命令
- npm run build: 构建项目
- npm run typecheck: 运行类型检查器

# 代码风格
- 使用 ES 模块 (import/export) 语法，而不是 CommonJS (require)
- 尽可能解构导入 (例如 import {
    foo } from 'bar')
- 代码加上中文注释

# 工作流程
- 完成一系列代码更改后，请确保进行类型检查
- 为了性能考虑，优先运行单个测试，而不是整个测试套件
