/**
 * 「按天取句」的共用逻辑 —— 服务端（构建时）和浏览器（访问时）都用这一份。
 *
 * 为什么要共用：站点是静态生成的，构建时算出的「今天」会被冻进 HTML。
 * 想真正做到「每天更新」，必须由浏览器按访问当天的日期重算一遍。
 * 两侧只要有一点点算法差异，就会出现「打开先看到 A、闪一下变成 B」的跳字。
 */
import { QUOTES, QUOTE_ROTATION_OFFSET, type Quote } from '@/data/quotes';

/** 本地时区的 YYYY-MM-DD（不要用 toISOString，那是 UTC，跨时区会差一天） */
export function dateKey(d: Date): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/**
 * 从 1970-01-01 起算的「第几天」。
 *
 * 用天序号取模，而不是把日期字符串丢进哈希函数 —— 这是有意的：
 * 天序号是连续整数，取模后**每天必然落到不同的句子**，并且会依次把整个
 * 语录库轮一遍才重复。用哈希的话，相邻两天可能撞到同一句，
 * 「每天一言」就出现了连着两天一样、中间又跳过的怪现象。
 */
export function dayNumber(d: Date): number {
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000);
}

/** 取模并保证结果非负（1970 以前是负数） */
export function mod(n: number, len: number): number {
  return ((n % len) + len) % len;
}

/** 某天应该显示第几句 */
export function dailyIndex(d: Date, len: number = QUOTES.length): number {
  return mod(dayNumber(d), len);
}

/** 某天的句子 */
export function dailyQuote(d: Date): Quote {
  return QUOTES[dailyIndex(d)];
}

/** 「9 月 15 日」这种短日期 */
export function shortDate(d: Date): string {
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日`;
}

/** 点「换一句」时往后跳几步（与库长度互质，保证能轮遍全部句子） */
export { QUOTE_ROTATION_OFFSET };
export { QUOTES };
export type { Quote };
