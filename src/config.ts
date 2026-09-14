/**
 * 站点全局配置 —— 改名字、简介、导航、社交链接，改这一个文件就够了
 *
 * 品牌定位：个人品牌主页（personal brand home）
 *   视觉母题是「引力」——轨道、光点、引力波；
 *   配色以白与蓝为底，阳光感的明亮彩色作点缀。
 *
 * ⚠️ 下面凡是我标注「占位」的地方，都是搭站时填的临时值，请换成你自己的。
 */

export const SITE = {
  /** 站点标题（浏览器标签、页脚都用它） */
  title: 'lzz的引力小屋',
  /** 左上角 logo 区的品牌字（短一点更耐看，太长会把导航挤变形） */
  logoText: '引力小屋',
  /** 品牌小标签，显示在 logo 旁边（留空则不显示） */
  logoBadge: 'lzz',
  /** 副标题 / 打字机标语（会循环播放） */
  taglines: [
    'GRAVITY · CODE · DESIGN',
    '把喜欢的一切，都吸进这间小屋',
    'lzz 的数字引力场',
    '> WELCOME TO MY ORBIT_',
  ],
  /** SEO 描述 */
  description:
    'lzz的引力小屋 —— 一个把代码、设计、影像与日常碎片都吸进来的个人品牌主页。',
  /** 昵称（关于页与侧边栏展示）（占位） */
  author: 'lzz',
  /** 关于页的角色小字（占位，按自己的方向改） */
  role: 'CREATOR & DEVELOPER',
  /** 头像里显示的字（没放头像图片时的兜底） */
  avatarText: 'lzz',
  /**
   * Hero 区的品牌宣言 —— 首页大标题下面那句话，是「品牌首页」的门面，请务必自己写一遍。
   * 现在这句是我按「引力小屋」这个名字铺的通用文案。
   */
  brandLead: '一个把代码、设计、影像和日常碎片都吸进来的小空间。',
  /** Hero 区顶部的小标签（可留空） */
  heroKicker: 'GRAVITY CABIN · SINCE 2026',
  /** 部署后的线上地址（用于绝对链接 / RSS / sitemap） */
  url: 'https://lzz-cabin.pages.dev',
  /** 首页每页显示多少篇文章 */
  postsPerPage: 8,

  /**
   * 天气卡显示的地点名 —— 只是个「牌子」，想怎么写就怎么写，不参与定位。
   * 用户指定：只保留武汉江夏区。
   */
  cityLabel: '武汉 · 江夏',
  /**
   * 天气卡的定位坐标。填了就跳过城市名解析，最准。
   * 江夏区（纸坊一带）：北纬 30.3755、东经 114.3147。
   *
   * 为什么不用城市名？实测 Open-Meteo 的城市库里没有「江夏区」，
   * 搜「江夏」只会返回广东清远、安徽合肥、江西赣州那几个同名小地方 —— 会定位到几百公里外。
   * 所以这里写死坐标。想换地方，去 https://open-meteo.com 搜到坐标替换即可。
   */
  latitude: '30.3755',
  longitude: '114.3147',
  /**
   * 备用城市名：只在上面坐标被清空时才会用到。
   * 注意这个接口对写法挑（实测「武汉」能查到、「武汉市」查不到）。
   */
  city: '武汉',
} as const;

/** 导航栏第一项（固定是首页） */
export const NAV_MAIN = { text: '首页', href: '/', icon: 'home' } as const;

/**
 * 导航栏的可展开分组 —— 想加/删导航项就改这里。
 * items 为空数组时，这个分组不会渲染出来。
 * external: true 的项会新窗口打开。
 */
export const NAV_GROUPS = [
  {
    text: '链接',
    icon: 'link',
    items: [
      // GitHub 是真实地址。想加抖音 / B 站，照着下面注释的格式写一行即可。
      { text: 'GitHub', href: 'https://github.com/yt-222', icon: 'github', external: true },
      // { text: '哔哩哔哩', href: 'https://space.bilibili.com/你的UID', icon: 'bilibili', external: true },
      // { text: '抖音', href: 'https://www.douyin.com/user/你的ID', icon: 'douyin', external: true },
    ],
  },
  {
    text: '空间',
    icon: 'grid',
    items: [
      { text: '光影画廊', href: '/gallery/', icon: 'image', external: false },
      { text: '碎片日记', href: '/diary/', icon: 'pen', external: false },
      { text: '项目', href: '/projects/', icon: 'box', external: false },
      { text: '归档', href: '/archive/', icon: 'archive', external: false },
      { text: '标签', href: '/tags/', icon: 'tag', external: false },
      { text: '关于', href: '/about/', icon: 'user', external: false },
    ],
  },
];

/**
 * 社交链接（侧边栏「找到我」、关于页的联系方式都用它）。
 * href 留空字符串的项会被自动隐藏 —— 不会渲染成死链接。
 */
export const SOCIAL_LINKS = [
  { name: 'GitHub', href: 'https://github.com/yt-222', icon: 'github' },
  { name: '哔哩哔哩', href: '', icon: 'bilibili' },
  { name: '抖音', href: '', icon: 'douyin' },
  { name: '邮箱', href: '', icon: 'mail' },
] as const;

/** 只保留填了地址的社交项 */
export const ACTIVE_SOCIAL_LINKS = SOCIAL_LINKS.filter((s) => s.href.trim().length > 0);

/** 首页公告框的文案。留空则整个公告框不显示。 */
export const ANNOUNCEMENT = '';

/**
 * 首页「引力信号」三条 —— 品牌主页用来一句话说清「我是谁 / 做什么 / 给谁看」。
 * ⚠️ 全部是我铺的占位文案，请改成你自己的（不想显示就把这个数组改成 []）。
 */
export const PILLARS = [
  {
    icon: 'orbit',
    title: '我在做什么',
    desc: '写代码、做界面、拍点照片，把过程随手记下来。',
  },
  {
    icon: 'spark',
    title: '这里有什么',
    desc: '技术笔记、项目复盘、影像碎片，以及一些没头没尾的念头。',
  },
  {
    icon: 'signal',
    title: '为什么叫引力',
    desc: '好的东西会被互相吸引 —— 这间屋子只负责把它们聚在一起。',
  },
] as const;

/**
 * 关于页「技能」格子（占位数据，请按自己的情况改）
 */
export const SKILLS = [
  { icon: '△', name: 'JavaScript', level: '熟练' },
  { icon: '◇', name: 'TypeScript', level: '掌握' },
  { icon: '□', name: 'Astro', level: '掌握' },
  { icon: '⬡', name: 'CSS / 动画', level: '热爱' },
  { icon: '◆', name: 'Python', level: '熟悉' },
  { icon: '◎', name: '嵌入式', level: '折腾中' },
] as const;

/**
 * 关于页「此刻正在」列表（占位数据，请按自己的情况改）
 * dot 可选值：blue / amber / coral / mint（对应参考色板里的四个点缀色）
 */
export const NOW_ITEMS = [
  { dot: 'blue', text: '维护这间引力小屋' },
  { dot: 'amber', text: '写点学习笔记' },
  { dot: 'coral', text: '喝一杯热咖啡' },
] as const;

export interface ProjectItem {
  /** 项目名 */
  name: string;
  /** 一句话说明 */
  desc: string;
  /** 标签 */
  tags: string[];
  /** 卡片上的符号或 emoji */
  icon: string;
  /** 项目地址，留空则卡片不可点 */
  href?: string;
  /** featured: true 的会显示在最上方的大卡片里 */
  featured?: boolean;
}

/**
 * 项目列表 —— 现在是空的，页面会显示一句引导。
 * 想加项目，把下面的示例取消注释、照格式写就行：
 *
 *   {
 *     name: 'lzz的引力小屋',
 *     desc: '你正在浏览的这个网站，Astro + 纯 CSS，部署在 Cloudflare Pages。',
 *     tags: ['Astro', 'CSS', 'Cloudflare'],
 *     icon: '★',
 *     href: 'https://lzz-cabin.pages.dev',
 *     featured: true,
 *   },
 */
export const PROJECTS: ProjectItem[] = [];

/**
 * 光影画廊 —— 不需要在这里登记照片。
 * 把图片丢进 public/gallery/<相册名>/ 目录即可，构建时会自动扫描成相册。
 * 相册的标题、日期、说明写在下面的 ALBUMS 里（按目录名对应），不写也能用。
 */
export interface AlbumMeta {
  /** 相册说明 */
  desc?: string;
  /** 拍摄/创建日期，格式 2026-09-14 */
  date?: string;
}

export const ALBUMS: Record<string, AlbumMeta> = {
  // 示例：目录叫 public/gallery/江夏的黄昏/，就写
  // '江夏的黄昏': { desc: '在纸坊江边拍的，那天的云很好看。', date: '2026-09-14' },
};
