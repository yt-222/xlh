export interface PostItem {
  /** URL 片段，如 'hello-world' 或 'tech/vite' */
  id: string;
  title: string;
  date: Date;
  dateText: string;
  excerpt: string;
  category: string;
  tags: string[];
  pinned: boolean;
  cover?: string;
}

export interface TagItem {
  name: string;
  count: number;
}

/** 把 Markdown 正文里的一小段提出来当摘要 */
export function makeExcerpt(body: string | undefined, fallback = ''): string {
  if (!body) return fallback;
  return (
    body
      // 去掉代码块、图片、标题、链接语法等噪音
      .replace(/```[\s\S]*?```/g, '')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/<[^>]+>/g, '')
      .replace(/^#{1,6}\s+.*$/gm, '')
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/[*_`>~-]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 90)
  );
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
