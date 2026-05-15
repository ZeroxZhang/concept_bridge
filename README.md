# Concept Bridge (概念之桥) 🌌

[English](#english) | [中文](#中文)

---

<a name="english"></a>
## 🌌 Concept Bridge

**Concept Bridge** is an interactive Web application that visualizes the "semantic network" and "vector space relationships" between different concepts in a 3D environment. Powered by Large Language Models (LLMs), it finds the logical bridge between any two independent concepts and presents them as a "Particle Universe".

### ✨ Core Features

1. **Concept Bridging**: Enter two concepts (e.g., "Universe" and "Consciousness"), and the LLM will generate a logical deduction path passing through 3-4 key intermediate concepts, rendered as a 3D path.
2. **Infinite Expansion**: Click any suspended concept node in the 3D space, and the system will automatically query the LLM to generate 3 core sub-concepts, branching out into a new network.
3. **Sci-Fi Visuals**: 
   - Deep cosmic starfield background.
   - Nodes are rendered as rotating 3D particle clouds instead of solid shapes.
   - Differentiated coloring (Cyan for main concepts, White for intermediate/branches).
4. **Physics Engine**: Built on a Force-Directed graph, offering realistic physics feedback when dragging nodes (stretching, pulling, and springing back).
5. **Interactive Explanations**: Hover over any node to reveal an AI-generated concise explanation of that concept.

### 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **3D Engine**: `react-force-graph-3d`, Three.js
- **Backend/API**: Next.js API Routes, OpenAI SDK
- **AI Model**: DeepSeek-V4-Flash

### 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/ZeroxZhang/concept_bridge.git
   cd concept_bridge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory and add your API keys:
   ```env
   DEEPSEEK_API_KEY=your_api_key_here
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   DEEPSEEK_MODEL=deepseek-v4-flash
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

<a name="中文"></a>
## 🌌 概念之桥 (Concept Bridge)

**概念之桥** 是一个在 3D 空间中可视化概念与概念之间“语义网络”和“向量空间关系”的交互式 Web 应用。它通过大语言模型（LLM）寻找两个独立概念之间的逻辑桥梁，并以极具科幻感的“粒子宇宙”形式呈现。

### ✨ 核心功能

1. **概念寻桥**：输入两个概念（例如“宇宙”与“意识”），大模型将推演并生成一条经过 3-4 个中间独立关键概念的逻辑路径，并在 3D 空间中连接它们。
2. **概念发散（无限延展）**：点击 3D 宇宙中的任意概念节点，系统会自动生成该概念的 3 个核心子概念或具体分支领域，并在空间中“生长”出新的网络分支。
3. **科幻视觉美学**：
   - 深邃的动态宇宙星空背景。
   - 节点由数百个独立微粒组成的 3D 粒子云团（取代了传统的纯色实心球），且各自拥有独立的自转动画。
   - 差异化的节点颜色区分（端点主轴词为科幻青色，过程与分支词为纯白色）。
4. **真实物理反馈**：基于力导向图（Force-Directed）引擎，拖拽节点时具有真实的弹簧牵引与回弹感。
5. **概念释义浮窗**：鼠标悬停在任意节点上，即可查看由 AI 生成的该词汇的简短精准解释。

### 🛠️ 技术栈

- **前端**：Next.js 15 (App Router), React 19, Tailwind CSS
- **3D 渲染**：`react-force-graph-3d`, Three.js
- **后端接口**：Next.js API Routes, OpenAI SDK
- **AI 大模型**：DeepSeek-V4-Flash

### 🚀 如何运行

1. **克隆项目**
   ```bash
   git clone https://github.com/ZeroxZhang/concept_bridge.git
   cd concept_bridge
   ```

2. **安装依赖**
   ```bash
   npm install
   ```

3. **配置环境变量**
   在项目根目录创建 `.env.local` 文件，并填入你的大模型 API 配置：
   ```env
   DEEPSEEK_API_KEY=你的_API_KEY
   DEEPSEEK_BASE_URL=https://api.deepseek.com
   DEEPSEEK_MODEL=deepseek-v4-flash
   ```
   *(注：本项目采用前后端分离架构，API Key 仅在服务端调用，彻底杜绝前端泄露风险)*

4. **启动开发服务器**
   ```bash
   npm run dev
   ```
   在浏览器中打开 [http://localhost:3000](http://localhost:3000) 即可开始探索隐空间！