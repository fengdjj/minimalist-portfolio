/**
 * blog-data.js - Centralized blog categories and posts data.
 * Attached to window object for browser accessibility without import/export.
 */

window.blogCategories = [
    {
        id: "ai-learning",
        name: "AI Learning",
        description: "深度学习、PyTorch、大模型微调",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v12"/><path d="M8 10h8"/><path d="M8 14h8"/></svg>`
    },
    {
        id: "python-notes",
        name: "Python Notes",
        description: "Python 基础、爬虫、数据处理",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`
    },
    {
        id: "cs-fundamentals",
        name: "CS Fundamentals",
        description: "数据结构、操作系统、计算机网络",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`
    },
    {
        id: "project-logs",
        name: "Project Logs",
        description: "PromptAtlas、个人博客、工具开发记录",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`
    },
    {
        id: "study-roadmap",
        name: "Study Roadmap",
        description: "考研、实习准备、学习计划",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>`
    },
    {
        id: "life-reflection",
        name: "Life & Reflection",
        description: "阶段总结、学习焦虑、成长记录",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`
    }
];

window.blogPosts = [
    {
        id: "pytorch-roadmap",
        title: "从零开始的 PyTorch 学习之路与大模型微调初探",
        excerpt: "针对本科阶段人工智能学习者的 PyTorch 核心概念整理，以及大模型参数微调（LoRA）的机制初探。",
        category: "AI Learning",
        categoryId: "ai-learning",
        tags: ["PyTorch", "Deep Learning", "Fine-tuning", "LLM"],
        date: "2026-05-20 03:30:54",
        readTime: "10 min read",
        difficulty: "Beginner → Intermediate",
        status: "Growing",
        url: "./first-post.html",
        history: [
            { time: "2026-05-20 12:45:10", desc: "优化 PyTorch 代码示例与部分公式排版" },
            { time: "2026-05-20 03:30:54", desc: "首次发布: 博客文章初稿上线" }
        ]
    },
    {
        id: "portfolio-blog-build",
        title: "个人博客从 0 到 1：我如何搭建自己的 AI 学习型作品集",
        excerpt: "记录我如何把一个 Bento Grid 个人主页升级成带分类、搜索、主题同步和文章系统的 AI 学习型作品集。",
        category: "Project Logs",
        categoryId: "project-logs",
        tags: ["Portfolio", "Blog", "HTML", "CSS", "JavaScript", "Developer Hub"],
        date: "2026-05-20 03:54:11",
        readTime: "8 min read",
        difficulty: "Beginner",
        status: "Growing",
        url: "./portfolio-blog-build.html",
        history: [
            { time: "2026-05-20 03:54:11", desc: "首次发布: 博客开发复盘日志正式上线" }
        ]
    }
];
