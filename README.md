# 家常菜实验室 · HomeCook Lab

> 用科学思维学做中餐家常菜：**先懂原理，再练技法，最后才谈创新**。

一个**纯静态**（零依赖、零构建）的学习网站。把中餐家常菜拆成可理解、可复用、可创新的知识全景图，通俗易懂又有科普深度。支持深色模式、站内搜索、术语悬浮、互动工具与离线打开。

## 学习全景（五篇）

| # | 篇章 | 内容 |
|---|------|------|
| 01 | **底层原理** `principles.html` | 热传递、美拉德反应、蛋白质变性、淀粉糊化、乳化勾芡、鲜味协同、盐糖酸碱醇 |
| 02 | **预处理** `prep.html` | 刀工（逆纹切）、腌制上浆、盐溶蛋白、小苏打致嫩、焯水、控水沥干 |
| 03 | **调味与酱料** `sauces.html` | 五味平衡、复合酱料图鉴、增鲜增香上色勾芡、味型公式（糖醋/鱼香等）、兑碗汁 |
| 04 | **火候与技法** `techniques.html` | 干热/湿热坐标系、油温几成热、炒煎炸烹、蒸煮炖焖烧卤、勾芡时机、锅气 |
| 05 | **实操·保存·创新** `practice.html` | 流程模板、翻车排查、味道补救、危险温度区间与食品安全、变量化创新 |

## 工具箱（衍生页）

| 页面 | 作用 |
|------|------|
| `dishes.html` | **案例菜库**：经典家常菜，双向链接到所用的原理/预处理/技法/味型 |
| `ingredients.html` | **食材百科**：按大类系统梳理——猪牛鸡羊的部位特点与适用菜系（含「嫩↔耐炖」部位地图）、蔬菜种类与对应烹饪方式，以及水产、蛋奶豆、主食淀粉、干货调味基底 |
| `gear.html` | **厨具百科**：按大类系统梳理——锅具（锅型与材质，含「导热↔蓄热」对比图）、刀具（刀型与钢材保养，含「锋利↔耐用」对比图）、加热电器（微波炉/空气炸锅/烤箱/电磁炉等的加热原理）、备料控温辅助工具 |
| `tools.html` | **厨房工具**：味型配比计算器 · 温度互动图 · 创新组合器 |
| `glossary.html` | **术语表**：按分类检索，正文中相关术语自动加链接 + 悬浮释义 |

## 全站特性

- 🌗 **深色模式**：右上角一键切换，偏好记忆在本地。
- 🔎 **站内搜索**：按 `/` 唤起，覆盖篇章 / 小节 / 术语 / 食材 / 厨具 / 菜谱。
- 🌱 **首页知识树**：手绘风思维导图，点节点直达对应篇章。
- ✅ **已掌握标记**：每篇可标记进度，首页卡片显示徽章（本地存储）。
- 🎥 **参考视频**：每篇底部精选检索词，一键跳到 B 站 / YouTube 搜索结果。
- 🖍️ **统一插图**：首页题图与各篇题图为同一手绘风格，配合内联 SVG 原理图。

## 本地预览

```bash
# 方式一：直接双击 index.html 用浏览器打开即可（纯静态，可离线）

# 方式二：起一个本地服务器（推荐）
cd ~/Projects/homecook-lab
python3 -m http.server 8000
# 浏览器访问 http://localhost:8000
```

## 部署上线

本项目是**根目录即站点**的纯静态文件，任意静态托管都能直接用，无需构建命令、无需输出目录。

### A. GitHub Pages（免费、最常用）

```bash
cd ~/Projects/homecook-lab
git add -A && git commit -m "feat: homecook-lab static site"

# 若 gh 已登录（gh auth login）可一条命令建库并推送：
gh repo create homecook-lab --public --source=. --remote=origin --push

# 然后开启 Pages（部署分支 main / 根目录）：
gh api -X POST repos/{owner}/homecook-lab/pages -f source.branch=main -f source.path=/
# 几分钟后访问 https://<用户名>.github.io/homecook-lab/
```

> 也可在 GitHub 网页端：Settings → Pages → Source 选 `main` / `/ (root)`。

### B. Netlify（拖拽即上线）

- 打开 https://app.netlify.com/drop ，把整个 `homecook-lab` 文件夹拖进去即可。
- 或 CLI：`npx netlify-cli deploy --dir=. --prod`

### C. Vercel

```bash
npx vercel --prod
# 框架预设选「Other」，输出目录留空（根目录即站点）
```

### D. Cloudflare Pages

- 连接 Git 仓库后，**构建命令留空**，**输出目录填 `/`（或 `.`）**。

## 目录结构

```
homecook-lab/
├── index.html            # 首页：知识树 + 学习全景 + 路线图
├── principles.html       # 01 底层原理
├── prep.html             # 02 预处理
├── sauces.html           # 03 调味与酱料
├── techniques.html       # 04 火候与技法
├── practice.html         # 05 实操·保存·创新
├── dishes.html           # 案例菜库
├── ingredients.html      # 食材百科（部位/种类系统梳理）
├── gear.html             # 厨具百科（锅具/刀具/电器/辅助）
├── tools.html            # 互动厨房工具
├── glossary.html         # 术语表
└── assets/
    ├── css/style.css     # 温暖厨房风设计系统（含深色模式）
    ├── js/
    │   ├── data.js       # 数据层：术语/食材/菜谱/味型/组合器/视频/搜索索引
    │   └── main.js       # 导航&页脚注入、搜索、深色模式、术语悬浮、题图/视频注入等
    └── img/              # 手绘风插图（WebP，已压缩）
```

## 设计与技术说明

- **风格**：温暖厨房风（暖米白底、砖红/酱棕/姜黄/葱绿配色、衬线标题、手写体点缀）。
- **零依赖**：纯 HTML/CSS/原生 JS，可 `file://` 直接打开，便于长期维护与离线使用。
- **统一注入**：导航、页脚、章节题图、参考视频均由 `main.js` 按 `SITE` / `window.HCL` 配置注入，**改一处全站同步**。
- **原理示意图**：手写风内联 SVG（`feTurbulence` 抖动滤镜 + 手写字体），清晰、可无限缩放。
- **数据驱动**：术语表、食材百科（`foodGuide`）、厨具百科（`gear`）、菜库、工具、搜索索引集中在 `assets/js/data.js`，新增食材/部位/厨具只需往对应数组里加一条数据，页面与搜索自动生效。

## 内容组件约定（写新内容时复用）

- 绿色「原理」框：`<div class="note science">` —— 讲机制、供深挖。
- 黄色「贴士」框：`<div class="note tip">` —— 实操经验。
- 红色「翻车」框：`<div class="note warn">` —— 易踩的坑。
- 机制高亮：`<span class="mech">…</span>`。

---

自用学习项目 · 慢工出细活 🍲
