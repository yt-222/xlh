/**
 * 站点全局配置 —— 想改名字、简介、社交链接，改这一个文件就够了
 */
export const SITE = {
  /** 站点标题（浏览器标签、导航栏都用它） */
  title: 'XLH 的个人站',
  /** 副标题 / 打字机标语（会循环播放） */
  taglines: [
    'CODE. DESIGN. LIFE.',
    '记录 · 折腾 · 分享',
    'HELLO, WORLD!',
    '> READY._',
  ],
  /** SEO 描述 */
  description: '一名热爱折腾的开发者，在这里记录学习笔记、项目复盘和日常碎碎念。',
  /** 关于页展示的昵称 */
  author: 'XLH',
  /** 关于页的角色小字 */
  role: 'DEVELOPER & LEARNER',
  /** 头像里显示的字（没有图片时的兜底） */
  avatarText: 'XLH',
  /** 部署后的线上地址（用于 RSS / sitemap） */
  url: 'https://xlh.example.com',
  /** 首页每页显示多少篇文章 */
  postsPerPage: 8,
} as const;

/** 导航栏链接 —— 想加页面在这里加一行 */
export const NAV_LINKS = [
  { text: '首页', href: '/', icon: 'home' },
  { text: '归档', href: '/archive/', icon: 'archive' },
  { text: '标签', href: '/tags/', icon: 'tag' },
  { text: '关于', href: '/about/', icon: 'user' },
] as const;

/** 关于页 / 页脚的社交链接 —— 换成你自己的就行 */
export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/', icon: 'github' },
  { name: 'Bilibili', href: 'https://space.bilibili.com/', icon: 'bilibili' },
  { name: '邮箱', href: 'mailto:your@email.com', icon: 'mail' },
] as const;

/** 关于页「技能」格子 */
export const SKILLS = [
  { icon: '△', name: 'JavaScript', level: '熟练' },
  { icon: '◇', name: 'TypeScript', level: '掌握' },
  { icon: '□', name: 'Astro', level: '掌握' },
  { icon: '⬡', name: 'CSS / 动画', level: '热爱' },
  { icon: '◆', name: 'Python', level: '熟悉' },
  { icon: '◎', name: '嵌入式', level: '折腾中' },
] as const;

/** 关于页「此刻正在」列表 */
export const NOW_ITEMS = [
  { dot: 'pink', text: '维护这个博客' },
  { dot: 'cyan', text: '写点学习笔记' },
  { dot: 'purple', text: '喝一杯热咖啡' },
] as const;
