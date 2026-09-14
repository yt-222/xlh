import { getCollection, type CollectionEntry } from 'astro:content';
import type { PostItem, TagItem } from './posts';
import { formatDate, makeExcerpt } from './posts';

/** 取全部文章（排除草稿），置顶优先，其余按日期倒序 */
export async function getAllPosts(): Promise<PostItem[]> {
  const entries = await getCollection('blog', ({ data }: CollectionEntry<'blog'>) => !data.draft);

  return entries
    .sort((a: CollectionEntry<'blog'>, b: CollectionEntry<'blog'>) => {
      if (a.data.pinned !== b.data.pinned) return a.data.pinned ? -1 : 1;
      return b.data.date.valueOf() - a.data.date.valueOf();
    })
    .map((entry: CollectionEntry<'blog'>) => ({
      id: entry.id,
      title: entry.data.title,
      date: entry.data.date,
      dateText: formatDate(entry.data.date),
      excerpt: entry.data.excerpt || makeExcerpt(entry.body),
      category: entry.data.category,
      tags: entry.data.tags,
      pinned: entry.data.pinned,
      cover: entry.data.cover,
    }));
}

/** 统计标签出现次数，按热度排序 */
export function collectTags(posts: PostItem[]): TagItem[] {
  const map = new Map<string, number>();
  posts.forEach((p) => p.tags.forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** 统计分类出现次数 */
export function collectCategories(posts: PostItem[]): TagItem[] {
  const map = new Map<string, number>();
  posts.forEach((p) => map.set(p.category, (map.get(p.category) || 0) + 1));
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}
