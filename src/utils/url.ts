/**
 * 路径前缀适配
 *
 * 站点部署在根路径时 BASE 是 '/'，部署在 GitHub Pages 子路径（如仓库名 xlh
 * → https://用户名.github.io/xlh/）时 BASE 是 '/xlh/'。
 * 所有站内链接都过一遍 withBase()，两种部署方式就都能正常跳转。
 */
const BASE = import.meta.env.BASE_URL || '/';

export function withBase(path = '/'): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

/** 判断导航高亮：把 base 前缀去掉再比 */
export function stripBase(pathname: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const result = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return result.startsWith('/') ? result : `/${result}`;
}

export const isHome = (pathname: string) => stripBase(pathname) === '/';
