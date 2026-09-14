---
title: '怎么写一篇文章（Markdown 排版示例）'
date: 2026-09-06
excerpt: '这篇既是一篇说明，也是一份排版参照。想加新文章时，可以把这个文件复制过去改。'
category: '教程'
tags: ['Markdown', '写作']
---

这篇文章的作用有两个：说明怎么写新文章，顺便把所有支持的排版都演示一遍。

## 一、新建文章

在 `src/content/blog/` 目录下新建一个 `.md` 文件，文件名会变成 URL 的一部分。

比如 `src/content/blog/vite-notes.md` → 访问地址是 `/post/vite-notes/`。也支持子目录，`src/content/blog/tech/vite.md` → `/post/tech/vite/`。

## 二、开头的配置块（frontmatter）

文件最上方两条 `---` 之间就是文章的元信息：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `date` | 是 | 日期，写成 `2026-09-06` |
| `excerpt` | 否 | 列表页摘要，不写会自动截取正文 |
| `category` | 否 | 分类，默认「未分类」 |
| `tags` | 否 | 标签数组，如 `['前端', '笔记']` |
| `cover` | 否 | 封面图，放 `public/` 下就写 `/图片名.png` |
| `pinned` | 否 | `true` 会置顶到首页最前 |
| `draft` | 否 | `true` 时本地能看，但不会出现在线上 |

## 三、正文排版

### 3.1 标题

用 `##` 表示二级标题、`###` 表示三级标题。**不要再写一级标题**，因为文章标题已经是页面里的 h1 了。

### 3.2 强调

*斜体*用单个星号，**粗体**用两个星号，`行内代码`用反引号。

### 3.3 代码块

带上语言名就能自动高亮：

```ts
interface Post {
  title: string;
  date: Date;
  tags: string[];
}

const posts: Post[] = [];
export default posts;
```

### 3.4 引用

> 引用适合放结论、别人的话或者自己想说但不想写进正文的备注。
>
> 支持多段。

### 3.5 列表

- 无序列表用短横线
- 要嵌套就缩进两个空格
  - 像这样

1. 有序列表直接写数字
2. 后面的数字写错也没关系

### 3.6 图片

把图片丢进 `public/` 目录，然后用 `/文件名` 引用：

```markdown
![图片说明](/cat.png)
```

### 3.7 嵌入 B 站视频

去 B 站播放页点「分享 → 嵌入代码」，把 iframe 直接粘进来就行，样式会自动适配成 16:9：

```html
<iframe src="//player.bilibili.com/player.html?bvid=BV1GJ411x7h7" scrolling="no" border="0" frameborder="no" allowfullscreen="true"></iframe>
```

### 3.8 分隔线

三个短横线就是一条分隔线：

---

## 四、写完怎么发布

```bash
git add .
git commit -m "post: 新文章标题"
git push
```

推送之后，GitHub Actions 会自动构建并部署，等一两分钟刷新网站就能看到。
