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
 *
 * 现在的结构是「首页 · 链接 · 空间 · 关于」四个并列。
 * 「关于」从「空间」里单独拆了出来：它俩性质不同 —— 空间是「去哪逛」，
 * 关于是「你是谁 + 怎么支持你」，混在一起会让人找不着。
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
    ],
  },
  {
    text: '关于',
    icon: 'user',
    items: [
      { text: '打赏', href: '/reward/', icon: 'heart', external: false },
      { text: '关于我', href: '/about/', icon: 'user', external: false },
    ],
  },
];

/**
 * 打赏页配置。
 *
 * ⚠️ 收款码请自己放：把两张图放到 `public/reward/` 下（例如 wechat.png / alipay.png），
 * 再把文件名填到下面的 href。**留空时会显示一个占位框 + 放置说明**，
 * 而不是渲染一张假二维码 —— 二维码牵扯真钱，我不会替你生成。
 *
 * 收款码建议：微信「我 → 服务 → 收付款 → 二维码收款 → 保存收款码」，
 * 支付宝「收钱 → 保存图片」；保存下来的图裁掉多余白边即可。
 */
export const REWARD = {
  /** 页面顶部引言 */
  lead: '如果这里的东西帮到过你，可以请我喝一杯。',
  /** 微信收款码图片路径（相对 public），留空则显示占位框 */
  wechat: '',
  /** 支付宝收款码图片路径（相对 public），留空则显示占位框 */
  alipay: '',
  /**
   * 「钱花在哪」的说明 —— 写清楚比说「感谢支持」有用得多。
   * 这几条是我按这个站的实际情况写的，你可以改。
   */
  reasons: [
    { icon: '🖥', title: '服务器与域名', desc: '站点的托管、图床和后续可能用到的域名，都要真金白银。' },
    { icon: '⌨️', title: '折腾新东西', desc: '开发板、传感器、硬盘空间 —— 写进项目里的那些玩意儿都得先买回来。' },
    { icon: '☕', title: '一杯热的', desc: '深夜改 bug 时的续命物资，这个最实在。' },
  ],
  /** 底部小字（留空则不显示） */
  note: '打赏完全自愿。这里的内容会一直免费开放，不打赏也能看全部文章。',
} as const;

/**
 * Live2D 看板娘配置。
 *
 * 库和模型都放在 `public/live2d/` 里自托管（不依赖任何第三方 CDN）——
 * 这不是洁癖：官方模型 CDN `model.oml2d.com` 在 2026-09 已被赌博站劫持，
 * jsdelivr 在国内也时通时断。资源来源与压缩方式见 `fetch-live2d-assets.mjs`。
 */
export const LIVE2D = {
  /** 总开关。关掉后整块不会加载，连 979KB 的库都不会下 */
  enable: true,
  /** 模型清单地址（相对 public 根） */
  modelPath: 'live2d/models/snow_miku/model.json',
  /** 库地址（相对 public 根） */
  libPath: 'live2d/oh-my-live2d.min.js',
  /**
   * 模型缩放与位置。
   *
   * ⚠️ 这两个值不是随手填的，是量出来的 —— 别凭感觉改。
   *
   * 坑在于「模型画布尺寸」和「人物实际占多大」是两件完全不同的事：
   * snow_miku 自带画布 4000×3200，但人物只占其中一块，而且还偏在一边。
   * 最初按画布比例填了 0.16，结果实际渲染 640×512（几乎是舞台的两倍），
   * 人物被裁得只剩上半身。
   *
   * 正确做法是拿 Live2D 的 drawable 顶点算人物的紧包围盒
   * （库内部画 hitArea 用的就是这个换算：`x * localTransform.a + tx`）：
   *   人物包围盒 = 2367.7 × 3108.9，起点 (749.5, 39.9)
   * 于是「身高占满舞台 94%、水平居中、底部留 4px」反解出：
   *   scale = 300.8 / 3108.9 ≈ 0.0968
   *   position = [-37, 11]
   * 想复核或换模型时跑 `probe-l2d-fit-size.mjs`，它会重新量一遍并打印建议值。
   *
   * position 是模型原点相对舞台左上角的偏移（px），同样跟着 scale 变，改一个要重算另一个。
   */
  scale: 0.0968,
  position: [-37, 11],
  /** 舞台（人物所在的透明盒子）大小，单位 px */
  stage: { width: 300, height: 320 },
  /**
   * 舞台距底部的距离。**这个值是为了躲开左下角的音乐播放器**：
   * 播放器固定在 left:20px / bottom:20px，占地 54×54，
   * 舞台贴到底会正好压住它，所以整体上移到播放器头顶（54 + 20 = 74）。
   */
  stageBottom: 76,
  /** 入场/出场过渡时长（ms） */
  transitionTime: 1200,
  /**
   * 关掉库自带的状态条。
   *
   * 它就是左侧那条竖排小条（「加载中 / 加载成功 / 加载失败」），
   * 默认停在视口左缘只露出一小截，在浅色页面上看着像没渲染完的残片。
   * 反馈入口我们已经有更好的：头顶的气泡负责说话，休息后有自己的唤醒按钮。
   * 另外模型是自托管的，加载失败属于构建期问题，构建后自检会拦下来。
   */
  hideStatusBar: true,
  /** 移动端是否显示。默认 false —— 手机上没地方放，而且省流量 */
  mobileDisplay: false,
  /**
   * 她会说的话。除欢迎语外，其余在闲置状态轮流出现。
   * 另外「每日一言」会跟着侧栏那张卡片走，不在这里配。
   */
  welcome: '你好呀，我是这间小屋的雪初音～',
  idleLines: [
    '今天也要好好加油哦 ✨',
    '要不要去画廊看看？',
    '写点东西吧，灵感会跑掉的',
    '记得起来动一动，别一直坐着',
    '这里的每一处都能点，随便试试？',
    '累了就歇会儿，进度不会怪你',
  ],
} as const;

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
 * 音源优先级：自托管曲库 → 在线歌单 → 内置兜底
 *
 * ⚠️ 关于「会员歌曲只能放 1 分钟 / 干脆播不了」（这点很关键）：
 * 在线歌单走的是第三方 Meting 公开接口，它以**匿名身份**去平台取播放地址，
 * 拿不到你的账号 —— 也就是说，你的 QQ 音乐会员权益在这里用不上。
 * 会员限定曲目会直接取不到音频流，播放器会自动跳到下一首并把它标灰。
 * 想让这些歌在站内完整播放，唯一稳的办法是「自托管」：
 * 把你自己的音频文件放进 public/music/，再跑 `npm run music` 生成清单。
 */
export const MUSIC = {
  /** 在线音源：tencent = QQ音乐，netease = 网易云 */
  server: 'tencent',
  type: 'playlist',
  /**
   * 歌单 id。换成你自己的：
   * QQ音乐网页版打开歌单，地址栏 `id=` 后面那串数字（歌单要设为公开）。
   */
  id: '7011264340',
  /**
   * Meting 接口，按顺序尝试。2026-09 实测：
   *   moeyao 最快最稳 · injahow 时好时坏 · i-meto 基本已挂（留作最后兜底）
   */
  apis: [
    'https://api.moeyao.cn/meting/?server=:server&type=:type&id=:id',
    'https://api.injahow.cn/meting/?server=:server&type=:type&id=:id',
    'https://api.i-meto.com/meting/api?server=:server&type=:type&id=:id&r=:r',
  ],
  /** 默认音量 0~1，会记住用户上次调的 */
  volume: 0.7,

  /* ---------- 自托管曲库（优先级最高，100% 完整可播） ---------- */
  /** 曲库清单路径（相对 public 根）。放好歌后跑 `npm run music` 自动生成 */
  localManifest: 'music/manifest.json',
  /** 音频文件所在目录（相对 public 根） */
  localDir: 'music',

  /** 在线歌单都拿不到时的兜底曲目（永远能播） */
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
