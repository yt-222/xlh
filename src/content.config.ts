import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 文章集合：往 src/content/blog/ 里丢 .md 文件就会自动变成一篇文章
 * 文件名的层级就是 URL，例如 src/content/blog/tech/vite.md -> /post/tech/vite/
 */
const blogCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    /** 封面图，放在 public/ 下就写 /xxx.png */
    cover: z.string().optional(),
    /** 列表页的摘要，不写就自动截取正文前 80 字 */
    excerpt: z.string().optional(),
    /** 分类，用于侧边栏统计 */
    category: z.string().default('未分类'),
    tags: z.array(z.string()).default([]),
    /** 置顶 */
    pinned: z.boolean().default(false),
    /** 草稿：true 时不会出现在任何列表里，方便本地先写着 */
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};
