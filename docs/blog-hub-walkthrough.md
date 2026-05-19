# 个人博客系统与分类 Blog Hub 功能实现 Walkthrough

本文档记录了在 `D:\project\minimalist-portfolio` 中实现完整的“博客分类系统”和“博客列表页”所做的工作。

---

## 🛠️ 实现的功能模块

### 1. 博客数据层 (Blog Data Layer)
- **新增 [blog-data.js](file:///D:/project/minimalist-portfolio/blog/blog-data.js)**：为个人博客中心建立了静态结构数据，包含 6 个固定分类和 5 篇测试文章（其中包括真实文章和未上线文章占位）。
- **加载顺序规范**：在所有相关 HTML 中严格按照 `<script src="./blog-data.js"></script>` 后接 `<script src="./blog.js"></script>` 的顺序引入，以防止数据加载与渲染出现冲突。

### 2. 博客入口中心 (Blog Hub Page)
- **新建 [blog/index.html](file:///D:/project/minimalist-portfolio/blog/index.html)**：
  - **英雄展台 (Hero Block)**：双语大标题、磨砂玻璃视觉基底。
  - **分类网格 (Category Grid)**：展示 6 大主分类卡片，具备炫酷的 Hover 高光悬掠效果。
  - **搜索与过滤工具栏 (Search & Filter Section)**：包括毛玻璃搜索框 and 多分类切换 Filter Chips。
  - **文章列表网格 (Posts Grid)**：动态渲染文章卡片，显示分类、标题、摘要、标签、高精度发布秒级时间戳、阅读时间、难度等级以及状态标签。
  - **Empty State 模块**：当搜索或筛选无内容时，实时切换为极简的毛玻璃 Empty 提示区域。

### 3. 主页 Latest Posts Bento 模块优化
- **双语与导航**：更新了主页 Header 的主导航，将“博客”链接更改为直接引向 `blog/index.html`。
- **文章链接转换**：除了第一篇文章保持链接至 `blog/first-post.html`，其余 4 篇未上线的文章卡片统一修正为带 Query 筛选的博客中心地址（如 `blog/index.html?category=ai-learning`、`blog/index.html?category=study-roadmap` 等），点击即可无缝定位跳转。
- **全站 CTA 按钮**：在 Bento Grid 博客区域的底层中心加入了一个精美的 **「查看全部文章 / View All Posts」** CTA 胶囊按钮，支持 hover 高斯模糊缩放动效。

### 4. 博客详情页 (first-post.html & post-template.html) 的规格演进
- **难度与状态 Badges**：在文章 Meta 信息条中补充了 **Difficulty** (Beginner &rarr; Intermediate) 和 **Status** (Growing 或 Published) 徽标。
- **双向路由闭环**：在头部和尾部新增了「返回博客首页 / Back to Blog」与「返回主页」的并排导航操作，增强访问链路体验。
- **相关推荐 (Related Posts)**：正文下方加入了 Related Posts 占位展示，提示“暂无相关文章，后续会持续更新。”。

### 5. JS 安全性与控制台 0 报错设计
- 在 `blog/blog.js` 中对所有 DOM 绑定做了严格的 `null check`，确保文章详情页在加载此 JS 时，由于不含 `#postsGrid` 等节点，控制台不会抛出任何 Exception 错误。
- 增加了 `window.location.search` 路由解析：页面载入时如含 `?category=xxx` 参数，系统会自动点选对应的 Chip、更新文章列表标题，并平滑滚动到列表区。

---

## 📂 涉及与修改的文件列表

1. **[blog/blog-data.js](file:///D:/project/minimalist-portfolio/blog/blog-data.js) [NEW]**
   - 存储 6 类博客的 icon、名称、描述，以及 5 篇博客的各类结构元数据。

2. **[blog/index.html](file:///D:/project/minimalist-portfolio/blog/index.html) [NEW]**
   - 博客中心的主 HTML 入口，支持完整的响应式流式布局。

3. **[blog/blog.css](file:///D:/project/minimalist-portfolio/blog/blog.css) [MODIFY]**
   - 新增了分类卡片、分类计数器、搜索输入、筛选滑块、文章列表卡片、多标签流、难度/状态徽章以及 Empty State 的样式定义，深度定制了在 Light 与 Dark 模式下的毛玻璃半透底色。

4. **[blog/blog.js](file:///D:/project/minimalist-portfolio/blog/blog.js) [MODIFY]**
   - 全新扩展了分类数量动态统计渲染、芯片过滤点选、实时模糊搜索、Query 路由同步以及返回顶部的滚动监听交互。

5. **[index.html](file:///D:/project/minimalist-portfolio/index.html) [MODIFY]**
   - 替换顶栏及抽屉的“博客”链接为 `blog/index.html`，更新 Latest Posts 的卡片为带分类参数的链接，并在底部补充了“查看全部文章”按钮。

6. **[blog/first-post.html](file:///D:/project/minimalist-portfolio/blog/first-post.html) [MODIFY]**
   - 重构了头部与尾部的返回链路，升级了 Meta Bar（包含难度/状态/标签组），添加了 Related Posts 并正确按序载入脚本。

7. **[blog/post-template.html](file:///D:/project/minimalist-portfolio/blog/post-template.html) [MODIFY]**
   - 同步更新了个人博文模板，以保障未来撰写新博客时的标准统一。

---

## 🧪 验证与运行状态
- 在 `D:\project\minimalist-portfolio` 中运行的 Python Web 服务器：
  ```bash
  python -m http.server 8085
  ```
- 经测试，在 `http://localhost:8085/` 下：
  - 点击任何分类卡片，页面会自动过滤对应文章，并平滑滚动至文章列表区；
  - 搜索框能极速地基于字词检索；
  - 当过滤后无对应文章时，Empty State 美观展出；
  - 控制台 0 报错，无 404 文件请求，且 localStorage 中的主题模式在全站路由跳转中保持 100% 同步。
