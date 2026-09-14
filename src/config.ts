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
  /** 小站「开张」日期 —— 页脚运行时间从这天开始数（格式 YYYY-MM-DD） */
  siteBirthday: '2026-08-23',

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
 * 项目列表 —— 已按真实在做的三件事填好（顺序即显示顺序）。
 * featured: true 的那一个会显示在最上方的大卡片里。
 */
export const PROJECTS: ProjectItem[] = [
  {
    name: 'lzz的引力小屋',
    desc: '你正在看的这个网站：Astro 静态生成 + 手写设计令牌，落叶动效、音乐播放器、灯箱画廊一应俱全，部署在 Cloudflare Pages。',
    tags: ['Astro', 'CSS', 'Cloudflare Pages'],
    icon: '🪐',
    href: 'https://lzz-cabin.pages.dev',
    featured: true,
  },
  {
    name: 'K230 RTSP 无线视频流',
    desc: '基于嘉楠 K230（CanMV v1.4.3，YAHBOOM 开发板）的摄像头推流：H.264 硬件 VENC 编码走 RTSP 无线传输，配套自写的 Python/Tkinter/OpenCV 播放器，窗口大小可调。',
    tags: ['K230', 'RTSP', 'H.264', 'Python', 'OpenCV'],
    icon: '📡',
  },
  {
    name: 'WorkBuddy 毛玻璃皮肤',
    desc: '给 WorkBuddy 桌面端做的一整套界面定制：解包 app.asar 注入 CSS 皮肤，13 张精选壁纸库，一行命令完成替换与回滚的 apply_button.bat。',
    tags: ['Electron', 'asar', 'CSS', '批处理'],
    icon: '🎨',
  },
];

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

/**
 * 画廊相册说明 —— 按相册 key（build-images.mjs 自动分组的目录名）配一句话。
 * 这些话会显示在每个相册标题下面。没写的相册就什么都不显示。
 * ⚠️ 下面是我按时间写的通用描述，你完全可以改成当天真正的故事。
 */
export const ALBUM_DESCS: Record<string, string> = {
  '2026-08': '2026 年的夏末，随手按下的一些快门。',
  '2023-07': '2023 年 7 月，被镜头留住的那几天。',
  '2022-11': '2022 年深秋的几张。',
  '2021-12': '2021 年冬天，这批里数量最多的一组。',
  '2021-04': '2021 年春天的片段。',
  '2020-08': '2020 年的夏天，时间最早的一批。',
  misc: '散落的、没赶上归队的几张。',
  unclassified: '没说清拍摄时间的几张，但值得留下。',
};

/** 画廊页头部引言 */
export const GALLERY_LEAD =
  '快门是最便宜的时间机器。这里按拍摄时间归组，存着这些年的天空、街道和一些舍不得删的瞬间。';

/**
 * 音乐播放器配置 —— 参考 momonyako 的 Meting 方案：
 * 打开页面时什么都不加载，第一次点播放/展开才去拉歌单，不影响首屏速度。
 *
 * server: 音乐平台（netease 网易云 / tencent QQ 音乐）
 * type:   playlist 歌单 / song 单曲 / album 专辑
 * id:     歌单 id。默认是网易云「热歌榜」，换成你自己的歌单 id 即可
 *         （网页版网易云打开歌单，地址栏 playlist?id= 后面那串数字）。
 *
 * 主接口挂了会自动换备用接口，三个都挂了就回落到 LOCAL_PLAYLIST。
 */
export const MUSIC = {
  server: 'netease',
  type: 'playlist',
  id: '3778678',
  apis: [
    'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r',
    'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id',
    'https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id',
  ],
  /** 默认音量 0~1，会记住用户上次调的 */
  volume: 0.7,
  /** 歌单加载失败时的兜底曲目（本地直链，永远能播） */
  localPlaylist: [
    {
      name: 'SoundHelix Song 1',
      artist: 'SoundHelix',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      cover: '',
    },
  ],
} as const;

/**
 * 鼠标点击时蹦出来的小词（Butterfly 风格的点击彩蛋）。
 * 随便改，建议 2~4 个字以内，太短太长都不好看。
 */
export const CLICK_WORDS = [
  '引力', '✦', '阳光', '🌿', '热爱', '✨', 'biu', 'keep', '小屋', 'lucky', '向上', '∞',
] as const;
