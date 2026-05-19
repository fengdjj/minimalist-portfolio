# Minimalist Portfolio Blog Hub

这是李文昊的个人作品集与 AI 学习型博客门户，使用纯 HTML、CSS、JavaScript 构建。

## 🌐 Live Demo / 在线预览

你可以通过以下公网地址直接在线浏览该作品集与博客系统：

👉 [https://fengdjj.github.io/minimalist-portfolio/](https://fengdjj.github.io/minimalist-portfolio/)


## ✨ 功能列表

- **Bento Grid 首页**：精美的卡片布局，配有毛玻璃高光悬浮微动效。
- **Blog Hub**：集中展示博客文章的汇总中心。
- **分类系统**：划分 6 大专业分类（AI Learning、Python Notes、CS Fundamentals、Project Logs、Study Roadmap、Life & Reflection）。
- **搜索与筛选**：动态、无刷新的模糊字词搜索与分类 Chip 芯片实时联动过滤。
- **深浅色主题同步**：基于 `localStorage` 的全站明暗模式平滑切换，无页面闪烁。
- **文章 TOC**：文章页面自动高亮显示侧边目录大纲。
- **代码复制按钮**：代码块右上角一键复制，完美提升阅读体验。
- **响应式设计**：适配 PC、平板、手机等全尺寸屏幕布局。
- **文档归档**：历史开发日志及任务路线在 `docs/` 完美收纳。

## 📂 项目结构

```text
minimalist-portfolio/
├── index.html                # 个人作品集 Bento Grid 首页
├── styles.css                # 首页及通用设计系统样式表
├── script.js                 # 首页动效与导航交互脚本
├── avatar.jpg                # 个人头像媒体资源
├── README.md                 # 项目使用与运行说明文档
├── blog/                     # 博客系统子文件夹
│   ├── index.html            # Blog Hub 博客分类列表页
│   ├── blog-data.js          # 博客文章统一结构化数据层
│   ├── blog.css              # 博客中心与博文详情页样式表
│   ├── blog.js               # 博客筛选、搜索、TOC 及工具交互逻辑
│   ├── first-post.html       # 真实博文一：《从零开始的 PyTorch 学习之路与大模型微调初探》
│   ├── portfolio-blog-build.html # 真实博文二：《个人博客从 0 到 1：我如何搭建自己的 AI 学习型作品集》
│   └── post-template.html    # 标准博文模板页
└── docs/                     # 开发规约与总结文档目录
    ├── blog-hub-task.md
    └── blog-hub-walkthrough.md
```

## 🚀 本地运行方式

你可以使用 Python 自带的轻量级 HTTP 服务器在本地启动预览：

```bash
cd D:\project\minimalist-portfolio
python -m http.server 8085
```

## 🌐 访问地址

启动服务器后，在浏览器中输入以下地址即可访问：

[http://localhost:8085/](http://localhost:8085/)
