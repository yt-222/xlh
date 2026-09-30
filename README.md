# 个人博客

基于 [Astro](https://astro.build) 的静态个人博客。写 Markdown 就是写文章，构建出来是纯静态 HTML，可以直接托管在 GitHub Pages / Cloudflare Pages / Vercel 等任意静态托管上。

## 特性

- **Markdown 驱动** —— 往 `src/content/blog/` 丢 `.md` 文件就是一篇新文章，自动出现在首页
- **日夜双主题** —— 右上角切换，选择会记住，首屏无闪白
- **标签 + 分类** —— 自动统计，支持按标签筛选文章
- **归档时间线** —— 按年份回顾历史文章
- **文章详情** —— 上/下一篇导航、阅读进度条、返回顶部
- **代码高亮** —— 构建时生成，无需前端 JS
- **响应式** —— 手机端有独立布局
- **零配置部署** —— 推送即部署，自动处理子路径

## 快速开始

需要 Node 18 以上（推荐 20 / 22）。

```bash
# 安装依赖
npm install

# 启动本地开发服务器（默认 http://localhost:4321）
npm run dev

# 打包静态文件到 dist/
npm run build

# 本地预览打包结果
npm run preview
```

## 目录结构

```
.
├── astro.config.mjs          # Astro 配置（base / site 由部署流程注入）
├── src/
│   ├── config.ts             # ★ 站点信息、导航、社交链接、技能，全在这里改
│   ├── content.config.ts     # 文章字段定义（frontmatter 有哪些字段）
│   ├── content/blog/         # ★ 你的文章都放这里
│   ├── layouts/Layout.astro  # 全局 HTML 骨架、主题切换、阅读进度
│   ├── components/
│   │   ├── NavBar.astro      # 顶部导航
│   │   ├── HeroBanner.astro  # 首页大标题 + 打字机标语
│   │   ├── PostCard.astro    # 文章卡片
│   │   ├── Sidebar.astro     # 侧边栏（名片 / 分类 / 标签 / 技能）
│   │   ├── SakuraEffect.astro# 背景飘落花瓣
│   │   └── Footer.astro
│   ├── pages/
│   │   ├── index.astro       # 首页
│   │   ├── post/[...id].astro# 文章详情
│   │   ├── tags/index.astro  # 标签总览
│   │   ├── tags/[tag].astro  # 单个标签下的文章
│   │   ├── archive.astro     # 归档时间线
│   │   ├── about.astro       # 关于
│   │   └── 404.astro
│   ├── styles/global.css     # ★ 全部样式与配色变量
│   └── utils/                # 文章排序、标签统计、路径处理等工具
├── public/                   # 静态资源，图片、favicon 放这里
└── .github/workflows/deploy.yml  # 推送后自动构建并部署
```

## 写一篇新文章

在 `src/content/blog/` 下新建 `.md` 文件，文件名就是 URL：

```
src/content/blog/我的笔记.md   →   /post/我的笔记/
src/content/blog/tech/vite.md  →   /post/tech/vite/
```

开头写配置块，正文用 Markdown：

```markdown
---
title: '文章标题'
date: 2026-09-14
excerpt: '列表页显示的摘要，不写会自动截取正文'
category: '学习笔记'
tags: ['前端', 'Astro']
cover: '/images/cover.png'   # 可选，图片放 public/ 下
pinned: false                # true 会置顶到首页最前
draft: false                 # true 时不会出现在线上
---

## 二级标题

正文内容……
```

字段含义详见 `src/content.config.ts`，排版示例见 `src/content/blog/markdown-guide.md`（这篇本身也是一篇示例文章，可以参照或直接删掉）。

## 改成你自己的

打开 **`src/config.ts`**，把里面的内容换成你的：

- `title` / `taglines` / `description` —— 站点名称和标语
- `author` / `role` / `avatarText` —— 关于页的名片
- `SOCIAL_LINKS` —— GitHub、Bilibili、邮箱等链接
- `SKILLS` / `NOW_ITEMS` —— 技能格子和「此刻正在」

想换配色，改 `src/styles/global.css` 最上面的 `:root` 变量（夜主题）和 `html.day-theme`（日主题），一共十几个颜色值。

## 日常同步（改完就推 GitHub）

工作区根目录放了两个批处理，双击即可：

| 双击 | 做了什么 |
| --- | --- |
| `push-blog.bat` | 暂存改动 → 提交 → 推到 GitHub |
| `publish-blog.bat` | 上面全部 → 再构建并部署到 Cloudflare Pages |

也可以在命令行里带参数跑：

```bash
node push-blog.mjs                  # 提交 + 推 GitHub（默认）
node push-blog.mjs --deploy         # 再加构建 + 部署上线
node push-blog.mjs --msg "改了什么"  # 自定义提交说明（默认是「更新博客 日期 时间」）
node push-blog.mjs --check          # 推送前先跑一遍产物自检 verify.mjs
node push-blog.mjs --dry            # 只看有哪些改动，什么都不动
node push-blog.mjs --no-push        # 只提交到本地，不推送
```

> ⚠️ **推 GitHub ≠ 站点更新。** Cloudflare Pages 项目 `lzz-cabin` 没有绑定 Git
> （历史部署全是 `ad_hoc` 直传，不带 commit 号），所以 `push-blog.bat` 跑完，
> `lzz-cabin.pages.dev` 上看到的仍是旧内容。要站点跟着变，用 `publish-blog.bat`，
> 或者单独跑 `node deploy_lzz_cabin.mjs`。

> 推送偶尔偏慢属正常：仓库是从远端「字节级重建」出来的浅仓库，
> `.git/hooks/pre-push` 会在推送前自动执行 `git fetch --unshallow` 补全历史
> （服务端拒绝来自浅仓库的推送）。补完一次之后就快了，实测约 7 秒。

## 部署

### 方式一：GitHub Pages（推送即部署）

1. 把代码推到一个 GitHub 仓库（比如 `xlh`）：

   ```bash
   git init
   git add .
   git commit -m "init: 博客初始化"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

2. 打开仓库 **Settings → Pages**，把 **Source** 改成 **GitHub Actions**。
3. 回到 **Actions** 页面，等自动构建完成（约 1~2 分钟）。
4. 访问 `https://你的用户名.github.io/仓库名/`。

> 仓库名如果是 `你的用户名.github.io`（用户主页仓库），地址就是根路径 `https://你的用户名.github.io/`。
> 部署流程会自动识别这两种情况并设置正确的路径前缀，不用手动改配置。

### 方式二：Cloudflare Pages（国内访问更稳）— **本项目已采用**

当前状态：**站点的构建产物同时部署在两个地方**，共用下面这一份源码，只是构建参数不同：

| | GitHub Pages | Cloudflare Pages |
| --- | --- | --- |
| 地址 | `https://yt-222.github.io/xlh/` | `https://lzz-cabin.pages.dev` |
| 路径前缀 | `/xlh`（子路径，自动处理） | `/`（根路径） |
| 谁来构建 | 仓库里的 Actions | 本地一键脚本（手动触发） |
| 国内访问 | 一般 | 明显更稳 |

#### 一键部署（推荐）

双击工作区根目录的 **`deploy_cloudflare.bat`** 即可。它会先用 Astro 构建（自动传 `BASE_PATH=/` 和 `SITE_URL=https://lzz-cabin.pages.dev`），再用 wrangler 把 `dist/` 传上 Cloudflare Pages 项目 `lzz-cabin`。

也可以在命令行里跑：

```bash
node deploy_lzz_cabin.mjs             # 构建 + 部署
node deploy_lzz_cabin.mjs --no-build  # 跳过构建，直接部署现有 dist
node deploy_lzz_cabin.mjs --dry-run   # 只列出会上传的文件，不联网
```

凭证从根目录的 `cloudflare_key.txt` 读取（`CLOUDFLARE_API_TOKEN`、`CLOUDFLARE_ACCOUNT_ID`、`PROJECT_NAME`）。

> ⚠️ 不要直接跑 `deploy_cloudflare.js` —— 它默认部署根目录的 `blog/`（旧版纯静态博客），会把线上站点覆盖回去。要走 `deploy_lzz_cabin.mjs`。

#### 想改成"推送即部署"？

在 [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **创建** → **Pages** → 连接 Git 仓库，选这个仓库，构建配置填：

- **构建命令**：`npm run build`
- **输出目录**：`dist`
- **环境变量**：不需要（根路径部署）

之后每次 `git push` 就会自动构建部署，不用再手动跑脚本。代价是需要在浏览器里完成一次 GitHub 授权（OAuth），这一步无法用脚本代办。

## 参照朋友站补上的模块

这一版是对着 [fanyouhao.top](https://fanyouhao.top/) 的结构做的，具体补了这些：

### 导航栏改成分组下拉

「首页」+「链接 ▾」+「空间 ▾」两段式，和朋友的站一致。改 `src/config.ts` 的 `NAV_GROUPS`
即可增删；某个分组的 `items` 为空数组时，这一组不会渲染出来。带 `external: true` 的项新窗口打开。

### 首页侧边栏的三个小工具

| 组件 | 数据来自哪 | 说明 |
| --- | --- | --- |
| 天气卡 | `SITE.city` 或 `SITE.latitude/longitude` | 走 [Open-Meteo](https://open-meteo.com) 免费接口，**不需要 API key**，纯浏览器端请求 |
| 写作轨迹 | 文章的真实发布日期 | 类似 GitHub 贡献图的日历热力图，发得越多格子越深，下面列最近三篇 |
| 公告框 | `ANNOUNCEMENT` | 留空则整块不渲染 |

> 城市名那个接口对写法有点挑（实测「武汉」查得到、「武汉市」查不到；「荆州」查不到、「荆州市」查得到），
> 所以代码里会把几种写法依次试一遍。想 100% 稳就直接填 `SITE.latitude` / `SITE.longitude`。

### 三个新页面

| 页面 | 内容来源 | 怎么填 |
| --- | --- | --- |
| `/gallery/` 光影画廊 | 构建时自动扫描 `public/photos/` | 建一个子目录 = 一个相册，把图片丢进去就行；说明和日期可选填在 `ALBUMS` |
| `/projects/` 项目 | `src/config.ts` 的 `PROJECTS` | 加一条对象；标 `featured: true` 的进上方大卡片 |
| `/diary/` 碎片日记 | `src/data/diary.ts` 的 `DIARY` | 加 `{ date, text }`，`mood` 可选 |

这三个页面现在**都是空状态**（显示填写引导）——刻意不塞假内容，等你自己放东西进去。

想升级成动态的（打开页面就能发内容）可以照朋友那套做：Cloudflare Pages Functions + D1 数据库，
`/diary/` 页面把 `import { DIARY }` 换成 `fetch('/api/diary')` 即可，数据结构一模一样。

### 样式文件分工

- `src/styles/global.css` —— 设计令牌（`:root` 与 `html.day-theme`）+ 基础组件
- `src/styles/components.css` —— 这一批新增的模块（导航下拉、天气卡、热力图、画廊、项目、日记）

两个文件都在 `Layout.astro` 里引入，构建后会合并成一个 CSS，不用手动管。

## 后续可以加的东西

当前是基础版本，想继续扩展的话，几个方向：

| 想加的功能 | 大致做法 |
| --- | --- |
| 文章分页 | 用 `src/pages/page/[page].astro` + `getStaticPaths` 生成分页路由 |
| RSS 订阅 | 安装 `@astrojs/rss`，在 `src/pages/rss.xml.js` 里输出 |
| 站点地图 | 安装 `@astrojs/sitemap`，加进 `astro.config.mjs` 的 integrations |
| 相册 / 画廊 | 新建一个 content collection（参考 `src/content.config.ts` 里的 blog 定义） |
| 项目展示页 | 在 `src/pages/projects/` 下建页面，数据可以写在 `src/config.ts` |
| 评论 | Cloudflare Pages Functions + D1 数据库，或接 Giscus / Waline |
| 搜索 | Pagefind（构建后生成索引）或 Fuse.js 前端搜索 |
| 统计 | 接入 Umami / 51LA 等轻量分析 |

## 常见问题

**文章没出现？**
检查 `draft` 是不是 `true`，以及 frontmatter 的 `date` 格式是否是 `2026-09-14`。

**中文标签的链接会不会有问题？**
URL 里会自动做百分号编码，正常访问，不用特殊处理。

**图片放哪？**
放 `public/` 目录（如 `public/images/a.png`），文章里用 `/images/a.png` 引用。文章里可以直接写 Markdown 图片语法。

**想改文章 URL 的风格？**
改文件名就行，URL 由文件路径决定。

**构建报错说找不到 `package-lock.json`？**
本地跑一次 `npm install` 会生成它，记得一起提交（部署流程里已做兼容回退，但建议提交锁文件以保证依赖版本稳定）。

## 许可

个人项目，随意取用。
