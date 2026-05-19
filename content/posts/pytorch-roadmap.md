---
title: "从零开始的 PyTorch 学习之路与大模型微调初探"
slug: "pytorch-roadmap"
category: "AI Learning"
categoryId: "ai-learning"
tags:
  - PyTorch
  - Deep Learning
  - Fine-tuning
  - LLM
date: "2026-05-20 03:30:54"
readTime: "10 min read"
difficulty: "Beginner → Intermediate"
status: "Growing"
excerpt: "记录从 PyTorch 基础张量操作入手，直至完成一个小规模大语言模型（LLM）微调实验的完整学习日志与实践心得。"
cover: ""
---

在本科大三阶段，当你完成了微积分、线性代数和概率论等基础数学课程，准备真正动手接触“人工智能”时，你面对的第一个选择通常是：**选择哪一个深度学习框架？**

对于学术界和目前的生成式 AI 开发而言，**PyTorch** 无疑是事实上的黄金标准。在这篇文章中，我将梳理我本科以来的 PyTorch 学习路线，拆解其核心数学模型，并进一步探讨目前非常热门的“大语言模型微调（Fine-Tuning）”技术。

## 一、为什么从 PyTorch 开始？

在各大高校和开源社区中，最常用的两个主流框架是 TensorFlow 和 PyTorch。与 TensorFlow 较早版本采用的“静态图”（即先声明计算图，再执行 Session 注入数据）不同，PyTorch 最大的魅力在于**命令式设计与动态计算图（Eager Execution）**。

> “在 PyTorch 中，编写神经网络就像编写普通的 Python 代码一样自然。你可以随时使用标准的 Python debugger 进行断点调试，观察数据的流向。这种‘所见即所得’的体验对初学者友好至极。”

同时，目前 90% 以上的大模型（LLM）前沿研究和开源权重（如 Meta 的 LLaMA、Stability AI 的 Stable Diffusion）均基于 PyTorch 构建，掌握 PyTorch 意味着能直接无缝运行最新的学术成果。

## 二、本科生深度学习学习路线

作为人工智能专业的本科生，我建议的学习路径分为四个阶段：

1. **数学基础夯实**：掌握线性代数（矩阵乘法、奇异值分解）以及多元函数求导（反向传播的本质是链式法则）。
2. **动手编写基础算子**：不使用任何框架，纯靠 NumPy 手写单层感知机与反向传播。
3. **PyTorch 框架学习**：深入理解 Tensor、Autograd 以及常用模块（nn.Module）。
4. **实战经典网络**：从 LeNet 开始，复现 ResNet，最后进入 NLP 领域的 Transformer 架构。

## 三、张量 (Tensor) 的核心概念

在 PyTorch 中，几乎所有的数据流动都以 `Tensor`（张量）为载体。从概念上理解，张量是标量、向量和矩阵向更高维度的推广：

* **0维张量**：标量（Scalar），比如单个数字 `5`。
* **1维张量**：向量（Vector），比如特征数组 `[1.2, 0.4, -0.9]`。
* **2维张量**：矩阵（Matrix），比如灰度图像矩阵。
* **N维张量**：例如批次彩色图像 `[BatchSize, Channels, Height, Width]`。

与普通的 NumPy Array 相比，PyTorch Tensor 拥有两大王牌：**GPU 硬件加速** 与 **自动微分（Autograd）支持**。

## 四、自动求导 (Autograd) 是什么？

神经网络的训练本质上是求解损失函数对模型参数的梯度，并通过梯度下降不断修正参数的过程。在 PyTorch 中，当我们在创建张量时声明 `requires_grad=True`，PyTorch 就会自动在后台建立一个“计算图”来追踪针对该张量的所有算术运算。

当我们对最终的结果（例如损失 Loss）调用 <code>.backward()</code> 时，自动求导引擎就会沿着这个计算图的方向进行反向传播，将每一个中间参数的梯度精确计算出来，保存在对应 Tensor 的 <code>.grad</code> 属性中。这极大地解脱了开发者手动推导复杂偏微分方程的痛苦。

## 五、一个最小 PyTorch 训练示例

下面是一个完整的、可以在本地运行的最小 PyTorch 线性回归训练示例。通过这几行代码，你可以清晰看到数据准备、模型前向传播、计算 Loss、反向传播及优化器更新的完整闭环：

```python
import torch
import torch.nn as nn
import torch.optim as optim

# 1. 模拟生成真实的数据：y = 3x + 2 + 噪声
x = torch.randn(100, 1)
y_true = 3 * x + 2 + torch.randn(100, 1) * 0.1

# 2. 定义一个简单的单层线性 model
class LinearRegression(nn.Module):
    def __init__(self):
        super(LinearRegression, self).__init__()
        self.linear = nn.Linear(1, 1) # 输入维度1，输出维度1

    def forward(self, x):
        return self.linear(x)

# 3. 实例化模型、定义损失函数与优化器
model = LinearRegression()
criterion = nn.MSELoss() # 均方误差
optimizer = optim.SGD(model.parameters(), lr=0.01) # 随机梯度下降

# 4. 开启训练循环
for epoch in range(100):
    # 前向传播
    y_pred = model(x)
    loss = criterion(y_pred, y_true)

    # 梯度清零、反向传播与权重更新
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    if (epoch + 1) % 20 == 0:
        print(f"Epoch [{epoch+1}/100], Loss: {loss.item():.4f}")

# 最终学到的模型参数
for name, param in model.named_parameters():
    print(f"Parameter {name}: {param.data.numpy()}")
```

## 六、大模型微调到底在调什么？

当我们跨过基础网络，进入 LLM（大语言模型）时代时，“预训练（Pre-training）”由于耗费成百上千张 GPU 芯片，对本科生和普通实验室而言几乎是天文数字。因此，主流的研究和实践都会选择**微调（Fine-Tuning）**。

所谓大模型微调，就是在一个已经经过海量通用数据训练完毕的预训练大模型（基座模型，如 LLaMA-7B）上，输入我们自己特定领域的高质量问答语料，对模型参数进行微小的调整，使其能够具备特定领域的专业知识或符合特定的对话语气（Alignment 监督对齐）。

## 七、LoRA、全量微调与提示词工程的区别

在面对不同的下游任务时，我们有三种不同权重的调优选择：

- [x] **提示词工程 (Prompt Engineering)**：不改变任何模型参数，通过设计精妙的输入直接引导模型输出（成本极低，上限不高）。
- [x] **LoRA (低秩适应微调)**：冻结基座模型的全部原始参数，在旁边并联两个极低维度（低秩）的矩阵，仅训练这两个小矩阵。显存占用极小，单张消费级显卡（如 RTX 4090）即可微调 7B 模型。
- [ ] **全量微调 (Full Fine-tuning)**：将模型的所有参数全部解冻，重新用海量显卡进行计算更新。效果最好，但需要企业级的算力集群。

## 八、给初学者的学习建议

作为过来人，给同样在学习人工智能的大一、大二或大三学弟学妹们几点避坑指南：

* **不要只当“调包侠”**：至少手写一次反向传播和自注意力机制，理解矩阵维度的变换，否则论文稍微修改就会无从下手。
* **善于利用 PyTorch 官方文档**：Google 搜索时多看官方 API 文档，理解每一个参数的含义（例如 `keepdim`, `dim` 运作机制）。
* **拥抱开源社区**：去 GitHub 上阅读优秀的开源实现（如 HuggingFace transformers 源码），了解企业级的代码编写规范。
