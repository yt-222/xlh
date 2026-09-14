/**
 * 壁纸 → 站点图片流水线
 *
 *   cd xlh-blog
 *   node build-images.mjs            # 处理并输出
 *   node build-images.mjs --dry-run  # 只列计划，不写文件
 *
 * 放在 xlh-blog/ 里面而不是工作区根目录，是因为它需要 import 'sharp'，
 * Node 的模块解析是按「脚本所在位置」向上找 node_modules 的 ——
 * 放根目录会找不到项目里装的 sharp。
 *
 * 每张原图产出 3 个产物（不是只压一个大的）：
 *   <slug>-<hash>-thumb.webp   400px  网格缩略图（保持原比例）
 *   <slug>-<hash>-1600.avif    1600px 现代浏览器优先格式
 *   <slug>-<hash>-1600.webp    1600px 兜底 + 灯箱大图
 *
 * 为什么分三档：网格页一屏可能有 20 张图，若只有 1600px 一个大图，
 * 浏览器为了显示 200px 的缩略图要下 20 张 1600px —— 那才是真正的性能杀手。
 *
 * 为什么文件名带内容哈希：这样缓存才能安全地设成一年不可变（immutable，见 public/_headers）。
 * 只要原图或压缩参数变了，哈希就变、URL 就变，浏览器自动取新的，不必手动清 CDN 缓存。
 *
 * 输出：public/media/<相册>/  +  src/data/photos.json
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

/** 脚本自身所在目录 = xlh-blog 根目录 */
const HERE = path.dirname(fileURLToPath(import.meta.url));

const SRC = 'D:/One Drive/OneDrive/图片/本机照片/图片壁纸';
const OUT_MEDIA = path.join(HERE, 'public', 'media');
const OUT_MANIFEST = path.join(HERE, 'src', 'data', 'photos.json');

const DRY = process.argv.includes('--dry-run');

/* ---------------- 从文件名推断拍摄时间 ---------------- */

function guessTime(name) {
  const base = name.replace(/\.[^.]+$/, '');

  // IMG_20230703_203938 / TempDragFile_20260822_100404(1)
  const ymd = base.match(/(20\d{2})(\d{2})(\d{2})(?:[_\-](\d{2})(\d{2})(\d{2}))?/);
  if (ymd) {
    const [, Y, M, D, h = '12', mi = '00', s = '00'] = ymd;
    const t = new Date(+Y, +M - 1, +D, +h, +mi, +s);
    if (!Number.isNaN(t.getTime())) return t.getTime();
  }

  // 13 位毫秒时间戳（可带前缀，如 pic_quark_1593698202955）
  const d13 = base.match(/(\d{13})/);
  if (d13) {
    const t = new Date(+d13[1]);
    if (t.getFullYear() >= 2000 && t.getFullYear() <= 2100) return t.getTime();
  }

  // 14 位：17138761395933 → 前 13 位是毫秒时间戳
  const d14 = base.match(/^(\d{14})$/);
  if (d14) {
    const t = new Date(+d14[1].slice(0, 13));
    if (t.getFullYear() >= 2000 && t.getFullYear() <= 2100) return t.getTime();
  }

  // 18 位：2018122622485452362 → 前 8 位是日期
  const d18 = base.match(/^(\d{8})\d{10}$/);
  if (d18) {
    const s = d18[1];
    const t = new Date(+s.slice(0, 4), +s.slice(4, 6) - 1, +s.slice(6, 8));
    if (!Number.isNaN(t.getTime())) return t.getTime();
  }

  return null;
}

function bucketOf(ts) {
  if (ts === null) return { key: 'unclassified', title: '未标注日期', sort: '0000-00' };
  const d = new Date(ts);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return { key: `${y}-${m}`, title: `${y} 年 ${m} 月`, sort: `${y}-${m}` };
}

function slugify(name, i) {
  const base = name
    .replace(/\.[^.]+$/, '')
    .replace(/[^\w\-]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '')
    .replace(/-{2,}/g, '-')
    .toLowerCase();
  return (base || 'photo') + '-' + String(i).padStart(2, '0');
}

/** 写出一个产物 → 按内容算哈希重命名 → 返回 { 文件名, 字节数 } */
async function emit(make, dir, slug, suffix, ext) {
  const tmp = path.join(dir, `${slug}-x.${ext}`);
  await make().toFile(tmp);
  const buf = fs.readFileSync(tmp);
  const hash = crypto.createHash('sha256').update(buf).digest('hex').slice(0, 8);
  const name = `${slug}-${hash}-${suffix}.${ext}`;
  fs.renameSync(tmp, path.join(dir, name));
  return { name, size: buf.length };
}

/* ---------------- 主流程 ---------------- */

if (!fs.existsSync(SRC)) {
  console.error(`源目录不存在：${SRC}`);
  process.exit(1);
}

const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

console.log(`源目录: ${SRC}`);
console.log(`待处理 ${files.length} 张\n`);

const byBucket = new Map();
for (const f of files) {
  const ts = guessTime(f);
  const b = bucketOf(ts);
  if (!byBucket.has(b.key)) byBucket.set(b.key, { ...b, files: [] });
  byBucket.get(b.key).files.push({ name: f, ts });
}

const rawBuckets = [...byBucket.values()];

/* 只有一两张照片的年月不值得单独成册 —— 否则导航栏会排出一堆空相册。
   少于 MIN_PER_ALBUM 张的组统一并进「零散影像」，组内仍按时间排。 */
const MIN_PER_ALBUM = 2;
const misc = { key: 'misc', title: '零散影像', sort: '0000-01', files: [] };

const buckets = [];
for (const b of rawBuckets) {
  if (b.files.length < MIN_PER_ALBUM) misc.files.push(...b.files);
  else buckets.push(b);
}
if (misc.files.length) buckets.push(misc);
const mergedCount = rawBuckets.length - buckets.length + (misc.files.length ? 1 : 0);

buckets.sort((a, b) => b.sort.localeCompare(a.sort));

console.log('=== 分组计划 ===');
let planned = 0;
for (const b of buckets) {
  b.files.sort((x, y) => (x.ts || 0) - (y.ts || 0) || x.name.localeCompare(y.name));
  planned += b.files.length;
  console.log(`  ${b.title.padEnd(14)} ${String(b.files.length).padStart(2)} 张  → public/media/${b.key}/`);
}
if (mergedCount > 0) {
  console.log(`  （${mergedCount} 个零散分组已并入「零散影像」）`);
}
console.log(`  合计 ${planned} 张\n`);

if (DRY) {
  console.log('（--dry-run，未写入任何文件）');
  process.exit(0);
}

fs.mkdirSync(OUT_MEDIA, { recursive: true });

const manifest = [];
let srcBytes = 0;
let outBytes = 0;
let done = 0;

for (const b of buckets) {
  const dir = path.join(OUT_MEDIA, b.key);
  fs.mkdirSync(dir, { recursive: true });

  const photos = [];
  for (const [i, item] of b.files.entries()) {
    const full = path.join(SRC, item.name);
    const slug = slugify(item.name, i);
    srcBytes += fs.statSync(full).size;

    try {
      /* rotate() 不带参数 = 按 EXIF 方向自动摆正，手机竖拍照片必须做这步 */
      const meta = await sharp(full, { failOn: 'none' }).rotate().metadata();
      const isPortrait = (meta.height || 1) > (meta.width || 1);

      const thumb = await emit(
        () =>
          sharp(full, { failOn: 'none' })
            .rotate()
            /* fit: 'inside' —— 保持原比例，长边缩到 400。
               不要用 cover 裁正方形：个人照片被裁掉边角不划算，
               而且画廊用瀑布流排布，本来就允许高度不一。 */
            .resize(400, 400, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 72, effort: 4 }),
        dir, slug, 'thumb', 'webp'
      );

      const avif = await emit(
        () =>
          sharp(full, { failOn: 'none' })
            .rotate()
            .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
            .avif({ quality: 52, effort: 4 }),
        dir, slug, '1600', 'avif'
      );

      const webp = await emit(
        () =>
          sharp(full, { failOn: 'none' })
            .rotate()
            .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
            .webp({ quality: 78, effort: 4 }),
        dir, slug, '1600', 'webp'
      );

      /* 取 webp 的实际尺寸做宽高比占位（缩略图同比例，用哪个都一样） */
      const wm = await sharp(path.join(dir, webp.name)).metadata();

      outBytes += thumb.size + avif.size + webp.size;

      photos.push({
        slug,
        w: wm.width,
        h: wm.height,
        portrait: isPortrait,
        thumb: `/media/${b.key}/${thumb.name}`,
        avif: `/media/${b.key}/${avif.name}`,
        webp: `/media/${b.key}/${webp.name}`,
        alt: `${b.title} 第 ${i + 1} 张`,
      });
    } catch (e) {
      console.log(`  ✗ ${item.name}: ${e.message.slice(0, 110)}`);
    }

    if (++done % 10 === 0) console.log(`  已处理 ${done}/${planned}`);
  }

  if (photos.length) {
    manifest.push({ key: b.key, title: b.title, count: photos.length, photos });
  }
}

fs.writeFileSync(OUT_MANIFEST, JSON.stringify(manifest, null, 2), 'utf8');

console.log(`
=== 完成 ===
相册数   : ${manifest.length}
图片数   : ${done}
原图合计 : ${(srcBytes / 1048576).toFixed(1)} MB
产物合计 : ${(outBytes / 1048576).toFixed(1)} MB（缩略图 + avif + webp 三份）
压缩比   : ${(srcBytes / outBytes).toFixed(1)}×
清单     : src/data/photos.json
`);
