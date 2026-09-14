/**
 * 碎片日记的数据
 *
 * 现在是一个本地数组，页面直接读它 —— 所以你改完文件重新构建就能看到。
 * 想让它变成「打开页面就能发一条」的动态功能，朋友那套是这么做的：
 *   Cloudflare Pages Functions + D1 数据库，暴露一个 /api/diary 接口，
 *   页面改成 fetch 那个接口即可。数据格式和下面完全一致，
 *   到时候只要把 import 换成 fetch，页面不用重写。
 */

export interface DiaryEntry {
  /** 日期，格式 2026-09-14 */
  date: string;
  /** 内容，支持换行 */
  text: string;
  /** 表情或心情符号，可省略 */
  mood?: string;
}

export const DIARY: DiaryEntry[] = [
  // 想写就先照这样加一条（取消注释、改内容即可）：
  // { date: '2026-09-14', text: '把博客改成了朋友那种样式，导航也分成了下拉。', mood: '🌙' },
];
