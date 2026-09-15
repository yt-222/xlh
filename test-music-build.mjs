#!/usr/bin/env node
/**
 * build-music.mjs 的自测：造两个合成音频文件，验证
 *   ① ID3v2 文本标签解析（含中文 UTF-16）
 *   ② 内嵌封面抽取
 *   ③ 文件名「歌手 - 歌名」兜底
 *   ④ 同名 .lrc 歌词配对
 * 跑完自动清理，不污染曲库目录。
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MUSIC = path.join(HERE, 'public', 'music');
const MANIFEST = path.join(MUSIC, 'manifest.json');
/* 记下跑测试前的清单内容，跑完原样还原 ——
   否则每次自测都会写进新的 generatedAt，把 git 工作树弄脏。 */
const prevManifest = fs.existsSync(MANIFEST) ? fs.readFileSync(MANIFEST, 'utf8') : null;

/* ---------- 构造 ID3v2.3 标签 ---------- */
function utf16leFrame(id, text) {
  const body = Buffer.concat([
    Buffer.from([0x01]), // 编码：UTF-16 with BOM
    Buffer.from([0xff, 0xfe]), // BOM (LE)
    Buffer.from(text, 'utf16le'),
    Buffer.from([0x00, 0x00]),
  ]);
  return frame(id, body);
}

function latinFrame(id, text) {
  const body = Buffer.concat([Buffer.from([0x00]), Buffer.from(text, 'latin1'), Buffer.from([0x00])]);
  return frame(id, body);
}

function frame(id, body) {
  const head = Buffer.alloc(10);
  head.write(id, 0, 4, 'latin1');
  head.writeUInt32BE(body.length, 4); // v2.3 是普通大端
  head.writeUInt16BE(0, 8);
  return Buffer.concat([head, body]);
}

function apicFrame(pngBuf) {
  const body = Buffer.concat([
    Buffer.from([0x00]), // 编码 latin1
    Buffer.from('image/jpeg', 'latin1'),
    Buffer.from([0x00]),
    Buffer.from([0x03]), // picture type: front cover
    Buffer.from([0x00]), // 空描述
    pngBuf,
  ]);
  return frame('APIC', body);
}

function id3Tag(frames) {
  const body = Buffer.concat(frames);
  const head = Buffer.alloc(10);
  head.write('ID3', 0, 3, 'latin1');
  head.writeUInt8(3, 3); // major
  head.writeUInt8(0, 4);
  head.writeUInt8(0, 5); // flags
  // syncsafe 长度
  const n = body.length;
  head[6] = (n >> 21) & 0x7f;
  head[7] = (n >> 14) & 0x7f;
  head[8] = (n >> 7) & 0x7f;
  head[9] = n & 0x7f;
  return Buffer.concat([head, body]);
}

/* 一小段假 JPEG（只要够大、能被原样写出即可） */
const fakeJpg = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), Buffer.alloc(600, 0x42), Buffer.from([0xff, 0xd9])]);
/* 音频体随便填点非零数据 */
const filler = Buffer.alloc(2048, 0x11);

const made = [];

/* ① 有完整 ID3（含内嵌封面）+ 同名 lrc */
const t1 = '测试歌手 - 测试歌名.mp3';
fs.writeFileSync(
  path.join(MUSIC, t1),
  Buffer.concat([
    id3Tag([
      utf16leFrame('TIT2', '逆流成河'),
      utf16leFrame('TPE1', '张碧晨'),
      latinFrame('TALB', 'AlbumX'),
      apicFrame(fakeJpg),
    ]),
    filler,
  ])
);
fs.writeFileSync(path.join(MUSIC, '测试歌手 - 测试歌名.lrc'), '[00:01.20]第一句歌词\n[00:05.50]第二句歌词\n');
made.push(t1, '测试歌手 - 测试歌名.lrc');

/* ② 无标签、无封面、无歌词，纯靠文件名 */
const t2 = 'Nobody - No Tags Here.mp3';
fs.writeFileSync(path.join(MUSIC, t2), Buffer.concat([Buffer.from([0xff, 0xfb, 0x90, 0x00]), filler]));
made.push(t2);

/* ③ 平台加密下载格式：不该进清单，但必须给出明确提示（不能静默忽略） */
const t3 = '测试加密曲.mgg';
fs.writeFileSync(path.join(MUSIC, t3), Buffer.from('MGG-DUMMY-NOT-REAL-AUDIO'));
made.push(t3);

console.log('=== 造好测试文件，开始跑 build-music.mjs ===\n');
let out = '';
try {
  out = execFileSync(process.execPath, [path.join(HERE, 'build-music.mjs')], { cwd: HERE, encoding: 'utf8' });
  console.log(out);
} catch (e) {
  out = (e.stdout || '') + (e.stderr || '');
  console.log(out);
}

/* ---------- 校验 ---------- */
const manifest = JSON.parse(fs.readFileSync(path.join(MUSIC, 'manifest.json'), 'utf8'));
const byName = Object.fromEntries(manifest.tracks.map((t) => [t.file, t]));

const results = [
  ['识别出 2 首', manifest.tracks.length === 2],
  ['ID3 中文歌名正确（UTF-16）', byName[t1] && byName[t1].name === '逆流成河'],
  ['ID3 歌手正确', byName[t1] && byName[t1].artist === '张碧晨'],
  ['ID3 专辑正确', byName[t1] && byName[t1].album === 'AlbumX'],
  ['内嵌封面被抽取并写入路径', byName[t1] && /^covers\//.test(byName[t1].cover)],
  ['封面文件真的落盘', byName[t1] && fs.existsSync(path.join(MUSIC, byName[t1].cover))],
  ['封面内容与内嵌一致', byName[t1] && fs.readFileSync(path.join(MUSIC, byName[t1].cover)).equals(fakeJpg)],
  ['歌词配对成功', byName[t1] && byName[t1].lrc === '测试歌手 - 测试歌名.lrc'],
  ['无标签文件用文件名拆分歌手', byName[t2] && byName[t2].artist === 'Nobody'],
  ['无标签文件用文件名拆分歌名', byName[t2] && byName[t2].name === 'No Tags Here'],
  ['加密格式文件不进清单', !manifest.tracks.some((t) => t.file === t3)],
  ['加密格式有明确提示（点名到文件）', out.includes('加密下载') && out.includes(t3)],
];

console.log('\n=== 自测结果 ===');
let bad = 0;
for (const [label, ok] of results) {
  console.log((ok ? '  OK  ' : '  失败 ') + label);
  if (!ok) bad++;
}

/* ---------- 清理 ---------- */
for (const f of made) {
  const p = path.join(MUSIC, f);
  if (fs.existsSync(p)) fs.unlinkSync(p);
}
const covDir = path.join(MUSIC, 'covers');
if (fs.existsSync(covDir)) {
  for (const f of fs.readdirSync(covDir)) fs.unlinkSync(path.join(covDir, f));
  fs.rmdirSync(covDir);
}
/* 还原跑测试前的清单（连字节都要一致，别留下时间戳差异） */
if (prevManifest !== null) fs.writeFileSync(MANIFEST, prevManifest);
else fs.rmSync(MANIFEST, { force: true });
console.log('\n  测试文件已清理，manifest 已还原为测试前的内容');
console.log(`\n${results.length - bad}/${results.length} 通过`);
process.exit(bad ? 1 : 0);
