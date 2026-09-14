/**
 * 本地搜索的数据源 —— 构建时生成 /search.json（Butterfly 的 local-search 同款思路）。
 * 全文检索在客户端做，站点不需要任何后端。
 */
import { getAllPosts } from '@/utils/content';

export async function GET() {
  const posts = await getAllPosts();
  const index = posts.map((p) => ({
    title: p.title,
    url: `/post/${p.id}/`,
    excerpt: p.excerpt,
    category: p.category,
    tags: p.tags,
    date: p.dateText,
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}
