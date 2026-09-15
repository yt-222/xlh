#!/usr/bin/env node
/**
 * 自托管曲库清单生成器
 * =====================================================================
 * 为什么需要它？
 *   在线歌单走第三方 Meting 公开接口，以匿名身份取播放地址，拿不到你的账号，
 *   所以 QQ音乐/网易云的「会员限定」曲目会直接取不到音频流（只能放 1 分钟或干脆失败）。
 *   想让这些歌在站内完整播放，唯一稳的办法是自托管：
 *   把你自己的音频文件放进 public/music/，本脚本扫描后生成 manifest.json，
 *   播放器会优先读它（100% 完整可播、不依赖任何第三方接口）。
 *
 * 用法：
 *   npm run music          扫描 public/music/ 并生成/更新 manifest.json
 *   npm run music:dry      只打印识别结果，不写文件（先看看认没认对）
 *
 * 识别规则（按优先级）：
 *   1. music/meta.json 里按文件名写的显式信息 —— 最准，可覆盖以下所有
 *   2. 音频文件内嵌的 ID3 标签（title / artist / album / 内嵌封面）
 *   3. 文件名约定："歌手 - 歌名.mp3"；没有 " - " 就当整串是歌名
 *
 * 封面与歌词（放在 music/ 目录里即可，脚本自动配对）：
 *   封面：<同名>.jpg/.png/.webp  →  其次 cover.jpg / folder.jpg（整张专辑共用）
 *   歌词：<同名>.lrc             →  其次 music/lyrics/<同名>.lrc
 *
 * ⚠ 加密下载格式放进来没用，脚本会认出来并提醒你：
 *   QQ音乐 .mgg / .mflac / .mmp4、网易云 .ncm、酷狗 .kgm / .kgma 等，
 *   都带版权锁、只有对应客户端能解，**改后缀名无效**。
 *   需要先解密转成 mp3 / flac / ogg / m4a 再放进来。仅限个人自用，别传播。
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MUSIC_DIR = path.join(HERE, 'public', 'music');
const MANIFEST = path.join(MUSIC_DIR, 'manifest.json');
const META_FILE = path.join(MUSIC_DIR, 'meta.json');
const DRY = process.argv.includes('--dry-run') || process.argv.includes('--dry');

const AUDIO_EXT = ['.mp3', '.m4a', '.aac', '.flac', '.wav', '.ogg', '.opus', '.wma'];
const IMG_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

const fmtSize = (b) =>
  b >= 1024 * 1024 ? (b / 1024 / 1024).toFixed(1) + ' MB' : (b / 1024).toFixed(0) + ' KB';

/* ---------------------------------------------------------------------------
   ID3v2 标签解析（只取文本帧 + 内嵌封面，够用且不引依赖）
   结构：'ID3' + 版本(2) + 标志(1) + 同步安全长度(4) + 若干帧
   --------------------------------------------------------------------------- */
function syncsafe(buf, off) {
  return ((buf[off] & 0x7f) << 21) | ((buf[off + 1] & 0x7f) << 14) | ((buf[off + 2] & 0x7f) << 7) | (buf[off + 3] & 0x7f);
}

function decodeText(buf, enc) {
  try {
    if (enc === 0) return buf.toString('latin1').replace(/\0+$/, '').trim();
    if (enc === 1) return buf.toString('utf16le').replace(/\0+$/, '').replace(/^\uFEFF/, '').trim();
    if (enc === 2) {
      // UTF-16BE：Node 没有直接支持，交换字节序后按 LE 解
      const swapped = Buffer.from(buf);
      for (let i = 0; i + 1 < swapped.length; i += 2) {
        const t = swapped[i];
        swapped[i] = swapped[i + 1];
        swapped[i + 1] = t;
      }
      return swapped.toString('utf16le').replace(/\0+$/, '').replace(/^\uFEFF/, '').trim();
    }
    return buf.toString('utf8').replace(/\0+$/, '').trim();
  } catch {
    return '';
  }
}

/** 读 ID3v2：返回 { title, artist, album, picture:{mime,buf} } */
function readId3v2(buf) {
  const out = { title: '', artist: '', album: '', picture: null };
  if (buf.length < 10 || buf.toString('latin1', 0, 3) !== 'ID3') return out;

  const major = buf[3];
  const flags = buf[5];
  let pos = 10;
  // 同步安全整数
  let tagSize = syncsafe(buf, 6);
  if (flags & 0x40) {
    // 扩展头部，跳过（4 或 6 字节）
    if (major >= 4) tagSize -= 0;
    pos += major >= 4 ? 4 : 6;
  }
  const end = Math.min(buf.length, 10 + tagSize);

  while (pos + 10 <= end) {
    const id = buf.toString('latin1', pos, pos + 4);
    if (!/^[A-Z0-9]{4}$/.test(id)) break;

    let size;
    if (major >= 4) size = syncsafe(buf, pos + 4);
    else size = buf.readUInt32BE(pos + 4);

    const frameStart = pos + 10;
    const frameEnd = frameStart + size;
    if (size <= 0 || frameEnd > buf.length) break;

    const data = buf.subarray(frameStart, frameEnd);

    if (id === 'TIT2') out.title = decodeText(data.subarray(1), data[0]);
    else if (id === 'TPE1') out.artist = decodeText(data.subarray(1), data[0]);
    else if (id === 'TALB') out.album = decodeText(data.subarray(1), data[0]);
    else if (id === 'APIC' && !out.picture) {
      let p = 1;
      let mimeEnd = data.indexOf(0, p);
      if (mimeEnd < 0) mimeEnd = p;
      const mime = data.toString('latin1', p, mimeEnd) || 'image/jpeg';
      p = mimeEnd + 1 + 1; // 跳过 mime\0 + picture type
      // 描述字段（按编码，通常 latin1 或 utf8），跳过它
      if (data[p - 1] !== undefined) {
        const enc = data[0];
        if (enc === 1 || enc === 2) {
          // 双字节编码：找到 \0\0
          while (p + 1 < data.length && !(data[p] === 0 && data[p + 1] === 0)) p += 2;
          p += 2;
        } else {
          const descEnd = data.indexOf(0, p);
          p = descEnd < 0 ? p : descEnd + 1;
        }
      }
      if (p < data.length - 100) out.picture = { mime, buf: Buffer.from(data.subarray(p)) };
    }

    pos = frameEnd;
  }
  return out;
}

/** ID3v1 兜底（文件末尾 128 字节，老 MP3 常见） */
function readId3v1(buf) {
  const out = { title: '', artist: '' };
  if (buf.length < 128) return out;
  const tail = buf.subarray(buf.length - 128);
  if (tail.toString('latin1', 0, 3) !== 'TAG') return out;
  const clean = (s) => s.replace(/\0.*$/, '').trim();
  out.title = clean(tail.toString('latin1', 3, 33));
  out.artist = clean(tail.toString('latin1', 33, 63));
  return out;
}

/** 只读文件头部，不把整个音频读进内存（几十 MB 的歌很多） */
function readHead(file, bytes) {
  const fd = fs.openSync(file, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    const n = Math.min(bytes, size);
    const buf = Buffer.alloc(n);
    fs.readSync(fd, buf, 0, n, 0);
    return buf;
  } finally {
    fs.closeSync(fd);
  }
}

function readTail(file, bytes) {
  const fd = fs.openSync(file, 'r');
  try {
    const size = fs.fstatSync(fd).size;
    const n = Math.min(bytes, size);
    const buf = Buffer.alloc(n);
    fs.readSync(fd, buf, 0, n, size - n);
    return buf;
  } finally {
    fs.closeSync(fd);
  }
}

/* ---------------------------------------------------------------------------
   主流程
   --------------------------------------------------------------------------- */
if (!fs.existsSync(MUSIC_DIR)) {
  fs.mkdirSync(MUSIC_DIR, { recursive: true });
}

const entries = fs.readdirSync(MUSIC_DIR, { withFileTypes: true });
/* 各平台的「加密下载」格式：文件本身是加了版权锁的，只有对应客户端能解，改后缀无效。
   识别出来是为了给一句明确提示，而不是让它们被静默忽略。 */
const LOCKED_EXT = [
  '.mgg', '.mgg1', '.mggl', '.mflac', '.mmp4', // QQ 音乐
  '.ncm', // 网易云
  '.kgm', '.kgma', // 酷狗
  '.qmc0', '.qmc2', '.qmc3', '.qmcflac', '.qmcogg', // 旧版 QMC 系列
  '.tm0', '.tm2', '.tkm', // 版权限制内容
];
const lockedFiles = entries
  .filter((e) => e.isFile() && LOCKED_EXT.includes(path.extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, 'zh-CN'));

const audioFiles = entries
  .filter((e) => e.isFile() && AUDIO_EXT.includes(path.extname(e.name).toLowerCase()))
  .map((e) => e.name)
  .sort((a, b) => a.localeCompare(b, 'zh-CN'));

/* 加密下载格式的提示（两个分支都要说，别让用户以为脚本坏了） */
function warnLocked() {
  if (!lockedFiles.length) return;
  console.log('\n  ⚠ 发现 ' + lockedFiles.length + ' 个「加密下载」文件，脚本无法处理：');
  lockedFiles.slice(0, 5).forEach((f) => console.log('      ' + f));
  if (lockedFiles.length > 5) console.log('      …还有 ' + (lockedFiles.length - 5) + ' 个');
  console.log('    这类文件（.mgg/.mflac/.mmp4/.ncm/.kgm…）带版权锁，只有对应客户端能解，');
  console.log('    改后缀名无效。先用工具解密转成 mp3/flac/ogg/m4a 再放进来，才会被收录。');
  console.log('    仅限个人自用，不要传播。\n');
}

if (!audioFiles.length) {
  console.log('\n  public/music/ 里还没有可用的音频文件。\n');
  console.log('  把你想在站内完整播放的歌复制进来（mp3 / m4a / flac / wav / ogg 都行），');
  console.log('  再跑一次 `npm run music` 就会生成清单。');
  console.log('  文件名建议写成「歌手 - 歌名.mp3」，脚本会自动拆开填进播放器。');
  warnLocked();
  if (!DRY && !fs.existsSync(MANIFEST)) {
    // 写一个空清单占位，免得播放器控制台一直报 404
    fs.writeFileSync(
      MANIFEST,
      JSON.stringify({ generatedAt: new Date().toISOString(), count: 0, tracks: [] }, null, 2)
    );
    console.log('  已写入空清单 public/music/manifest.json（播放器会自动回落到在线歌单）\n');
  }
  process.exit(0);
}
warnLocked();

/* 手动信息表：{ "文件名.mp3": { name, artist, album, cover, lrc } } */
let meta = {};
if (fs.existsSync(META_FILE)) {
  try {
    meta = JSON.parse(fs.readFileSync(META_FILE, 'utf8'));
    console.log(`  读取 meta.json：${Object.keys(meta).length} 条手动信息`);
  } catch (e) {
    console.error('  ⚠ meta.json 解析失败，已忽略：' + e.message);
  }
}

/* 整张专辑共用的封面 */
const sharedCover = entries.find(
  (e) => e.isFile() && /^(cover|folder|album)\.(jpe?g|png|webp|avif)$/i.test(e.name)
);

console.log('\n=== 扫描 public/music/ ===');
console.log(`  音频文件 ${audioFiles.length} 个` + (sharedCover ? ` · 共用封面 ${sharedCover.name}` : ''));

const tracks = [];
const existing = new Set(entries.filter((e) => e.isFile()).map((e) => e.name));
let totalBytes = 0;
let withCover = 0;
let withLrc = 0;
let guessed = 0;
const coversDir = path.join(MUSIC_DIR, 'covers');
const shouldWriteCovers = !DRY;

for (const file of audioFiles) {
  const full = path.join(MUSIC_DIR, file);
  const size = fs.statSync(full).size;
  totalBytes += size;

  const base = file.replace(/\.[^.]+$/, '');
  const manual = meta[file] || {};

  /* --- 标签：ID3v2 → ID3v1 → 文件名 --- */
  let tag = { title: '', artist: '', album: '', picture: null };
  try {
    tag = readId3v2(readHead(full, 1024 * 1024));
    if (!tag.title) {
      const v1 = readId3v1(readTail(full, 128));
      tag.title = tag.title || v1.title;
      tag.artist = tag.artist || v1.artist;
    }
  } catch (e) {
    console.error(`  ⚠ ${file} 标签解析失败（用文件名兜底）：${e.message}`);
  }

  /* --- 文件名约定：「歌手 - 歌名」 --- */
  let name = tag.title;
  let artist = tag.artist;
  if (!name) {
    guessed++;
    const m = base.match(/^(.+?)\s*[-–—_]\s*(.+)$/);
    if (m) {
      artist = artist || m[1].trim();
      name = m[2].trim();
    } else {
      name = base;
    }
  }

  /* --- 封面：同名图 → 内嵌 → 共用 --- */
  let cover = '';
  const sidecar = ['', ...IMG_EXT].reduce((found, ext) => found || (ext && existing.has(base + ext) ? base + ext : ''), '');
  if (sidecar) {
    cover = sidecar;
  } else if (tag.picture && tag.picture.buf.length > 200) {
    const ext = /png/i.test(tag.picture.mime) ? '.png' : /webp/i.test(tag.picture.mime) ? '.webp' : '.jpg';
    const coverName = 'covers/' + base + ext;
    const coverPath = path.join(MUSIC_DIR, coverName);
    if (shouldWriteCovers) {
      fs.mkdirSync(coversDir, { recursive: true });
      // 内容相同就跳过重写，保持产物稳定（避免无谓的 git diff / 缓存失效）
      const old = fs.existsSync(coverPath) ? fs.readFileSync(coverPath) : null;
      if (!old || !old.equals(tag.picture.buf)) fs.writeFileSync(coverPath, tag.picture.buf);
    }
    cover = coverName;
  } else if (sharedCover) {
    cover = sharedCover.name;
  }
  if (cover) withCover++;

  /* --- 歌词：同名 .lrc → lyrics/ 子目录 --- */
  let lrc = '';
  if (existing.has(base + '.lrc')) lrc = base + '.lrc';
  else if (existing.has('lyrics/' + base + '.lrc')) lrc = 'lyrics/' + base + '.lrc';
  else if (fs.existsSync(path.join(MUSIC_DIR, 'lyrics', base + '.lrc'))) lrc = 'lyrics/' + base + '.lrc';
  if (lrc) withLrc++;

  tracks.push({
    name: manual.name || name || base,
    artist: manual.artist || artist || '',
    album: manual.album || tag.album || '',
    file,
    cover: manual.cover || cover,
    lrc: manual.lrc || lrc,
    size,
  });
}

/* --- 报告 --- */
console.log('');
tracks.forEach((t, i) => {
  const tagInfo = [t.artist || '未知歌手', t.album].filter(Boolean).join(' · ');
  const badges = [t.cover ? '封面' : '', t.lrc ? '歌词' : ''].filter(Boolean);
  console.log(
    `  ${String(i + 1).padStart(2)}. ${t.name}` +
      (badges.length ? '  [' + badges.join('+') + ']' : '') +
      `\n      ${tagInfo}   ${fmtSize(t.size)}`
  );
});

const manifest = {
  generatedAt: new Date().toISOString(),
  count: tracks.length,
  totalSize: totalBytes,
  tracks: tracks.map(({ size, ...rest }) => rest),
};

console.log('');
console.log(`  合计 ${tracks.length} 首 · ${fmtSize(totalBytes)}`);
console.log(`  封面 ${withCover}/${tracks.length} · 歌词 ${withLrc}/${tracks.length}`);
if (guessed) console.log(`  其中 ${guessed} 首没读到内嵌标签，用文件名推断（可用 meta.json 手工修正）`);

if (DRY) {
  console.log('\n  --dry-run：没有写任何文件。去掉 --dry-run 即正式生成。\n');
} else {
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2));
  console.log(`\n  已生成 public/music/manifest.json`);
  console.log('  播放器会优先读它 —— 这些歌不依赖任何第三方接口，永远完整可播。');
  console.log('  部署后即生效（记得把音频文件也一起部署上去）。\n');
}
