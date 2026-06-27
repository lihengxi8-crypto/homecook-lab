/**
 * build-cuisine-map.mjs
 * 家常菜实验室 · 中国菜系地图生成脚本
 * --------------------------------------------------------------------------
 * 用权威的省级行政区边界数据（阿里 DataV GeoAtlas 标准底图 100000_full）
 * 生成一张「规范、合规」的中国菜系 SVG 地图：
 *   - 含 台湾省、香港、澳门、海南省，以及 南海诸岛（九段线）。
 *   - 手绘风（复用站点 feTurbulence + feDisplacementMap 滤镜）。
 *   - 八大菜系填色到正确省份，地方菜用区域标签 / 点标签。
 *
 * 数据源（首选）: https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
 *   该数据遵循自然资源部标准地图，省级 FeatureCollection（34 省级区 + 九段线）。
 *
 * 用法:  node scripts/build-cuisine-map.mjs
 *   若本地缺少 assets/data/datav-100000_full.json，会自动下载。
 *
 * 产物:
 *   assets/img/cuisines-map.svg     —— 自包含、响应式 SVG
 *   assets/data/cuisine-geo.json    —— 省份→菜系映射 + 投影参数 + 标签锚点
 */

import fs from 'node:fs';
import path from 'node:path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DATA_DIR = path.join(ROOT, 'assets', 'data');
const IMG_DIR = path.join(ROOT, 'assets', 'img');
const GEO_PATH = path.join(DATA_DIR, 'datav-100000_full.json');
const OUT_SVG = path.join(IMG_DIR, 'cuisines-map.svg');
const OUT_JSON = path.join(DATA_DIR, 'cuisine-geo.json');
const SRC_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json';

/* ----------------------------------------------------------------------- */
/* 0. 读取（必要时下载）GeoJSON                                            */
/* ----------------------------------------------------------------------- */
function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`下载失败 HTTP ${res.statusCode} ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve(dest)));
    }).on('error', (e) => { fs.rmSync(dest, { force: true }); reject(e); });
  });
}

async function loadGeo() {
  if (!fs.existsSync(GEO_PATH)) {
    console.log('· 本地无 GeoJSON，正在从 DataV 下载…');
    await download(SRC_URL, GEO_PATH);
  }
  const raw = JSON.parse(fs.readFileSync(GEO_PATH, 'utf8'));
  console.log(`· GeoJSON 载入完成：${raw.features.length} 个要素`);
  return raw;
}

/* ----------------------------------------------------------------------- */
/* 1. 几何工具                                                             */
/* ----------------------------------------------------------------------- */
const polysOf = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates);

function bboxOfGeom(g) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const poly of polysOf(g))
    for (const ring of poly)
      for (const [x, y] of ring) {
        if (x < x0) x0 = x; if (y < y0) y0 = y;
        if (x > x1) x1 = x; if (y > y1) y1 = y;
      }
  return [x0, y0, x1, y1];
}
function bboxOfRing(ring) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of ring) {
    if (x < x0) x0 = x; if (y < y0) y0 = y;
    if (x > x1) x1 = x; if (y > y1) y1 = y;
  }
  return [x0, y0, x1, y1];
}
const bboxIntersects = (a, b) =>
  a[0] <= b[2] && a[2] >= b[0] && a[1] <= b[3] && a[3] >= b[1];

/* ----------------------------------------------------------------------- */
/* 2. 投影：带标准纬线的等距圆柱（plate carrée @ φ0）                       */
/*    x = (λ - λ0)·cosφ0 ;  y = (φmax - φ)                                  */
/* ----------------------------------------------------------------------- */
const D2R = Math.PI / 180;

// —— 主图取景框（裁掉南海诸岛/九段线，放进右下角小窗）——
const MAIN = { lngMin: 73.5, lngMax: 135.1, latMin: 17.6, latMax: 53.7, phi0: 35 };
const PAD = 26;
const TARGET_W = 940;                 // 主图目标像素宽
const kMain = Math.cos(MAIN.phi0 * D2R);
const SCALE = TARGET_W / ((MAIN.lngMax - MAIN.lngMin) * kMain);
const mainW = (MAIN.lngMax - MAIN.lngMin) * kMain * SCALE;
const mainH = (MAIN.latMax - MAIN.latMin) * SCALE;
const VB_W = Math.round(mainW + PAD * 2);
const VB_H = Math.round(mainH + PAD * 2);

const r1 = (n) => Math.round(n * 10) / 10;       // 1 位小数
const projMain = (lng, lat) => [
  r1(PAD + (lng - MAIN.lngMin) * kMain * SCALE),
  r1(PAD + (MAIN.latMax - lat) * SCALE),
];

// —— 南海诸岛小窗（右下角）——
const INSET = { lngMin: 104.5, lngMax: 123.0, latMin: 2.5, latMax: 25.0, phi0: 14 };
const kInset = Math.cos(INSET.phi0 * D2R);
const INSET_INNER_W = 138;
const insetScale = INSET_INNER_W / ((INSET.lngMax - INSET.lngMin) * kInset);
const insetInnerH = (INSET.latMax - INSET.latMin) * insetScale;
const INSET_PADIN = 8;
const insetOuterW = INSET_INNER_W + INSET_PADIN * 2;
const insetOuterH = insetInnerH + INSET_PADIN * 2 + 14; // 底部留标题
const insetX = PAD + mainW - insetOuterW - 4;   // 右贴边，左缘越过台湾东岸
const insetY = PAD + mainH - insetOuterH - 8;
const projInset = (lng, lat) => [
  r1(insetX + INSET_PADIN + (lng - INSET.lngMin) * kInset * insetScale),
  r1(insetY + INSET_PADIN + (INSET.latMax - lat) * insetScale),
];
const INSET_BBOX = [INSET.lngMin, INSET.latMin, INSET.lngMax, INSET.latMax];

/* ----------------------------------------------------------------------- */
/* 3. 路径生成（合并多边形环；Douglas-Peucker 简化 + 剔除子像素小岛）       */
/* ----------------------------------------------------------------------- */
// Douglas-Peucker（按地理度数容差；亚像素，视觉无损）
function simplify(points, tol) {
  if (points.length <= 5) return points;
  const sq = tol * tol;
  const keep = new Uint8Array(points.length);
  keep[0] = 1; keep[points.length - 1] = 1;
  const stack = [[0, points.length - 1]];
  const segDist2 = (p, a, b) => {
    let x = a[0], y = a[1], dx = b[0] - x, dy = b[1] - y;
    if (dx || dy) {
      const t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);
      if (t > 1) { x = b[0]; y = b[1]; } else if (t > 0) { x += dx * t; y += dy * t; }
    }
    dx = p[0] - x; dy = p[1] - y; return dx * dx + dy * dy;
  };
  while (stack.length) {
    const [s, e] = stack.pop();
    let maxD = 0, idx = -1;
    for (let i = s + 1; i < e; i++) {
      const dd = segDist2(points[i], points[s], points[e]);
      if (dd > maxD) { maxD = dd; idx = i; }
    }
    if (maxD > sq && idx > 0) { keep[idx] = 1; stack.push([s, idx], [idx, e]); }
  }
  const out = [];
  for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
  return out;
}

function ringToSub(ring, proj) {
  let d = '';
  let px = null, py = null;
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = proj(ring[i][0], ring[i][1]);
    if (i === 0) { d += `M${x} ${y}`; px = x; py = y; continue; }
    if (x === px && y === py) continue;           // 去掉投影后重合点
    d += `L${x} ${y}`; px = x; py = y;
  }
  return d ? d + 'Z' : '';
}

// minPx: 主图保留环的最小投影边长；inset 用更小阈值。tol: 简化容差（度）。
function geomToPath(geom, proj, { minPx = 1.4, restrictBBox = null, tol = 0.03 } = {}) {
  // 多边形按外环面积排序，最大者必保留
  const list = polysOf(geom).map((poly) => {
    const b = bboxOfRing(poly[0]);
    return { poly, area: (b[2] - b[0]) * (b[3] - b[1]) };
  }).sort((a, b) => b.area - a.area);

  let d = '';
  list.forEach((item, idx) => {
    for (let r = 0; r < item.poly.length; r++) {
      const ring = item.poly[r];
      const gb = bboxOfRing(ring);
      if (restrictBBox && !bboxIntersects(gb, restrictBBox)) continue;
      // 投影后尺寸
      const w = (gb[2] - gb[0]) * (proj === projMain ? kMain * SCALE : kInset * insetScale);
      const h = (gb[3] - gb[1]) * (proj === projMain ? SCALE : insetScale);
      const keep = (idx === 0 && r === 0) || w >= minPx || h >= minPx;
      if (!keep) continue;
      const simplified = tol > 0 ? simplify(ring, tol) : ring;
      const sub = ringToSub(simplified, proj);
      if (sub) d += sub;
    }
  });
  return d;
}

/* ----------------------------------------------------------------------- */
/* 4. 菜系配置                                                             */
/* ----------------------------------------------------------------------- */
// 暖色水彩调（与站点设计令牌呼应：砖红/姜黄/葱绿/青瓷/梅子/远山蓝…）
const COL = {
  lu: '#E0A93E',        // 鲁 · 姜黄
  chuan: '#C8482E',     // 川 · 辣椒砖红
  yue: '#5F9148',       // 粤 · 葱绿
  su: '#4F8C86',        // 苏 · 青瓷
  min: '#9E586A',       // 闽 · 梅子
  zhe: '#5E7FA0',       // 浙 · 远山蓝
  xiang: '#CC6B3A',     // 湘 · 赤陶
  hui: '#8E7A3C',       // 徽 · 陈酱橄榄
  jing: '#B98A55',      // 京 · 焦糖
  tianjin: '#6B8F7A',   // 津 · 河海松
  dongbei: '#6FA08E',   // 东北 · 松绿
  xibei: '#CE9248',     // 西北/新疆 · 沙漠孜然
  yungui: '#94A24E',    // 云贵 · 山野
  bun: '#B0667A',       // 本帮 · 梅粉
  hainan: '#3FA0A0',    // 海南 · 热带海
  taiwan: '#CDB07E',    // 台 · 浅暖
  neutral: '#F1E4C9',   // 非菜系省份 · 暖米
};
const darken = (hex, f = 0.72) => {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.round(((n >> 16) & 255) * f);
  const g = Math.round(((n >> 8) & 255) * f);
  const b = Math.round((n & 255) * f);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// 省名 → 填色 key（八大菜系 + 整省的地方菜）
const PROV_FILL = {
  '山东省': 'lu',
  '四川省': 'chuan', '重庆市': 'chuan',
  '广东省': 'yue',
  '江苏省': 'su',
  '福建省': 'min',
  '浙江省': 'zhe',
  '湖南省': 'xiang',
  '安徽省': 'hui',
  '北京市': 'jing',
  '天津市': 'tianjin',
  '黑龙江省': 'dongbei', '吉林省': 'dongbei', '辽宁省': 'dongbei',
  '新疆维吾尔自治区': 'xibei',
  '云南省': 'yungui', '贵州省': 'yungui',
  '上海市': 'bun',
  '海南省': 'hainan',
  '台湾省': 'taiwan',
};

// 安全的 class 名（拼音）
const PINYIN = {
  '北京市': 'beijing', '天津市': 'tianjin', '河北省': 'hebei', '山西省': 'shanxi',
  '内蒙古自治区': 'neimenggu', '辽宁省': 'liaoning', '吉林省': 'jilin', '黑龙江省': 'heilongjiang',
  '上海市': 'shanghai', '江苏省': 'jiangsu', '浙江省': 'zhejiang', '安徽省': 'anhui',
  '福建省': 'fujian', '江西省': 'jiangxi', '山东省': 'shandong', '河南省': 'henan',
  '湖北省': 'hubei', '湖南省': 'hunan', '广东省': 'guangdong', '广西壮族自治区': 'guangxi',
  '海南省': 'hainan', '重庆市': 'chongqing', '四川省': 'sichuan', '贵州省': 'guizhou',
  '云南省': 'yunnan', '西藏自治区': 'xizang', '陕西省': 'shaanxi', '甘肃省': 'gansu',
  '青海省': 'qinghai', '宁夏回族自治区': 'ningxia', '新疆维吾尔自治区': 'xinjiang',
  '台湾省': 'taiwan', '香港特别行政区': 'xianggang', '澳门特别行政区': 'aomen',
};

// 标签：八大菜系（带 chip）。anchor = 地理坐标 [lng,lat]（手工微调以避让）。
const GREAT = [
  { key: 'lu',    name: '鲁菜', sub: '山东', anchor: [118.3, 36.4] },
  { key: 'chuan', name: '川菜', sub: '四川', anchor: [103.2, 30.5] },
  { key: 'yue',   name: '粤菜', sub: '广东', anchor: [112.4, 23.5] },
  { key: 'su',    name: '苏菜', sub: '江苏', anchor: [119.9, 33.2] },
  { key: 'min',   name: '闽菜', sub: '福建', anchor: [117.9, 26.2] },
  { key: 'zhe',   name: '浙菜', sub: '浙江', anchor: [120.5, 29.1] },
  { key: 'xiang', name: '湘菜', sub: '湖南', anchor: [111.6, 27.5] },
  { key: 'hui',   name: '徽菜', sub: '安徽', anchor: [116.6, 31.6] },
];

// 标签：地方菜（整省/整片，中号文字）
const REGION = [
  { key: 'dongbei', name: '东北菜', anchor: [125.6, 44.2] },
  { key: 'xibei',   name: '西北·新疆菜', anchor: [85.0, 41.2] },
  { key: 'yungui',  name: '云贵菜', anchor: [103.9, 25.6] },
  { key: 'hainan',  name: '海南菜', anchor: [109.8, 19.3] },
  { key: 'taiwan',  name: '台菜', anchor: [121.4, 21.1] },
];

// 标签：点标记（小号文字 + 引线点）。dx/dy 为像素级文字偏移。
// 注：潮汕、客家是「粤菜」三大流派之一（连同广府菜），并非独立地方菜，
//     故统一用粤菜配色（COL.yue），在广东省内作为流派标注。
const POINTS = [
  { key: 'jing',  name: '京菜',  anchor: [116.4, 40.0], dx: 4,  dy: -8, align: 'start' },
  { key: 'tianjin', name: '天津菜', anchor: [117.2, 39.1], dx: 6, dy: 4, align: 'start' },
  { key: 'bun',   name: '本帮菜', anchor: [121.47, 31.23], dx: 7, dy: 4, align: 'start' },
  { key: 'chaoshan', name: '潮汕菜', anchor: [116.6, 23.4], dx: 6, dy: 4, align: 'start', color: COL.yue },
  { key: 'kejia', name: '客家菜', anchor: [115.0, 24.5], dx: -6, dy: -6, align: 'end', color: COL.yue },
];

/* ----------------------------------------------------------------------- */
/* 5. 组装 SVG                                                             */
/* ----------------------------------------------------------------------- */
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

function build(geo) {
  const features = geo.features;
  const jdFeature = features.find((f) => f.properties.adcode === '100000_JD');
  const provFeatures = features.filter((f) => f.properties.adcode !== '100000_JD');

  // 标签锚点覆盖（部分省 centroid 受飞地/海岛影响而偏移）
  const ANCHOR_OVERRIDE = { '海南省': [109.8, 19.3] };

  // ---- 主图省份 path ----
  const provPaths = [];
  const filledMeta = [];   // 记录被填色省份
  for (const f of provFeatures) {
    const name = f.properties.name;
    const cls = PINYIN[name] || ('p' + f.properties.adcode);
    const fillKey = PROV_FILL[name] || 'neutral';
    const fill = COL[fillKey];
    const isCuisine = fillKey !== 'neutral';
    const d = geomToPath(f.geometry, projMain, { minPx: 1.4 });
    if (!d) continue;
    const op = (name === '重庆市') ? 0.78 : (isCuisine ? 0.9 : 1);
    provPaths.push(
      `<path class="prov ${isCuisine ? 'cuisine' : 'neutral'} pr-${cls}" ` +
      `data-name="${esc(name)}" data-cuisine="${fillKey}" ` +
      `d="${d}" fill="${fill}" fill-opacity="${op}"/>`
    );
    if (isCuisine) filledMeta.push({ name, fillKey, fill });
  }

  // ---- 南海诸岛小窗 ----
  // 5a. 小窗内的省界（仅与小窗 bbox 相交者，淡色，作地理参照）
  const insetProvPaths = [];
  for (const f of provFeatures) {
    const gb = bboxOfGeom(f.geometry);
    if (!bboxIntersects(gb, INSET_BBOX)) continue;
    const name = f.properties.name;
    const fillKey = PROV_FILL[name] || 'neutral';
    const isCuisine = fillKey !== 'neutral';
    const d = geomToPath(f.geometry, projInset, { minPx: 0.6, restrictBBox: INSET_BBOX, tol: 0.06 });
    if (!d) continue;
    insetProvPaths.push(
      `<path d="${d}" fill="${isCuisine ? COL[fillKey] : COL.neutral}" ` +
      `fill-opacity="${isCuisine ? 0.55 : 0.85}"/>`
    );
  }
  // 5b. 九段线（feature JD），描边
  let jdPath = '';
  if (jdFeature) jdPath = geomToPath(jdFeature.geometry, projInset, { minPx: 0, tol: 0.02 });
  // 5c. 南海诸岛点（来自海南要素中位于小窗内的小岛）
  const islandDots = [];
  const hn = provFeatures.find((f) => f.properties.name === '海南省');
  if (hn) {
    for (const poly of polysOf(hn.geometry)) {
      const b = bboxOfRing(poly[0]);
      if (b[3] > 17.4) continue;                 // 仅取南海中的岛礁
      if (!bboxIntersects(b, INSET_BBOX)) continue;
      const [cx, cy] = projInset((b[0] + b[2]) / 2, (b[1] + b[3]) / 2);
      islandDots.push(`<circle cx="${cx}" cy="${cy}" r="0.9"/>`);
    }
  }

  // ---- 标签 ----
  const labelEls = [];
  // 八大菜系 chip
  for (const g of GREAT) {
    const a = g.anchor;
    const [x, y] = projMain(a[0], a[1]);
    const fs = 30, padX = 10, dotR = 5, gap = 9;
    const txt = g.name;
    const textW = txt.length * fs;             // 中文 ~1em/字
    const chipW = padX * 2 + dotR * 2 + gap + textW;
    const chipH = 38;
    const rx = r1(x - chipW / 2), ry = r1(y - chipH / 2);
    const dotCx = r1(rx + padX + dotR), dotCy = r1(ry + chipH / 2);
    const tx = r1(dotCx + dotR + gap);
    labelEls.push(
      `<g class="lab great" data-cuisine="${g.key}">` +
      `<rect x="${rx}" y="${ry}" width="${r1(chipW)}" height="${chipH}" rx="9" class="chip"/>` +
      `<circle cx="${dotCx}" cy="${dotCy}" r="${dotR}" fill="${COL[g.key]}"/>` +
      `<text x="${tx}" y="${dotCy}" class="t-great">${txt}</text>` +
      `</g>`
    );
  }
  // 地方菜（整片）
  for (const g of REGION) {
    const a = g.anchor;
    const [x, y] = projMain(a[0], a[1]);
    labelEls.push(
      `<g class="lab region" data-cuisine="${g.key}">` +
      `<circle cx="${r1(x - (g.name.length * 13))}" cy="${y}" r="4" fill="${darken(COL[g.key], 0.85)}"/>` +
      `<text x="${x}" y="${y}" class="t-region" fill="${darken(COL[g.key], 0.6)}">${g.name}</text>` +
      `</g>`
    );
  }
  // 点标记
  for (const p of POINTS) {
    const a = p.anchor;
    const [x, y] = projMain(a[0], a[1]);
    const col = p.color || COL[p.key] || '#8a5a3c';
    const tx = r1(x + p.dx), ty = r1(y + p.dy);
    labelEls.push(
      `<g class="lab point" data-cuisine="${p.key}">` +
      `<circle cx="${x}" cy="${y}" r="4" fill="${col}" stroke="#FFF8EC" stroke-width="1.4"/>` +
      `<text x="${tx}" y="${ty}" class="t-point" text-anchor="${p.align}">${p.name}</text>` +
      `</g>`
    );
  }

  // ---- 标题 ----
  const titleEls =
    `<g class="title-block">` +
    `<text x="${PAD + 6}" y="${PAD + 34}" class="t-title">中国八大菜系 · 地方风味</text>` +
    `<text x="${PAD + 8}" y="${PAD + 60}" class="t-sub">底图：阿里 DataV · 标准省级行政区划（含台湾 · 南海诸岛）</text>` +
    `</g>`;

  // ---- 小窗外框 + 内容 ----
  const insetClipId = 'insetClip';
  const insetEls =
    `<g class="inset">` +
    `<rect x="${r1(insetX)}" y="${r1(insetY)}" width="${r1(insetOuterW)}" height="${r1(insetOuterH)}" rx="8" class="inset-box"/>` +
    `<clipPath id="${insetClipId}"><rect x="${r1(insetX)}" y="${r1(insetY)}" width="${r1(insetOuterW)}" height="${r1(insetOuterH - 14)}" rx="8"/></clipPath>` +
    `<g clip-path="url(#${insetClipId})">` +
      `<g filter="url(#mapRough)">${insetProvPaths.join('')}` +
      (jdPath ? `<path d="${jdPath}" class="jiuduan"/>` : '') +
      `</g>` +
      `<g class="islands">${islandDots.join('')}</g>` +
    `</g>` +
    `<text x="${r1(insetX + insetOuterW / 2)}" y="${r1(insetY + insetOuterH - 4)}" class="t-inset">南海诸岛</text>` +
    `</g>`;

  // ---- <style> ----
  const css = `
  :root{ --ink:#4A3526; --ink-soft:#6B5848; --line:#D8C2A6; --paper-card:#FBF4E9; --chip:#FFF8EC; }
  .bg-card{ fill:var(--paper-card); }
  .prov{ stroke:#6B4E36; stroke-width:0.7; stroke-linejoin:round; vector-effect:non-scaling-stroke; }
  .prov.neutral{ stroke:#B79B79; }
  .inset-box{ fill:#F7EEDD; stroke:#C9B188; stroke-width:1; }
  .jiuduan{ fill:none; stroke:#9C3A22; stroke-width:1.6; stroke-linejoin:round; stroke-linecap:round; }
  .islands circle{ fill:#9C3A22; }
  text{ font-family:"PingFang SC","Noto Sans SC","Hiragino Sans GB","Microsoft YaHei",system-ui,-apple-system,"Segoe UI",sans-serif; }
  .t-title{ font-size:30px; font-weight:800; fill:#5A3A2A; letter-spacing:1px;
            font-family:"Songti SC","STSong","Noto Serif SC",Georgia,serif; }
  .t-sub{ font-size:15px; fill:#9A8775; }
  .chip{ fill:var(--chip); stroke:var(--line); stroke-width:1; }
  .t-great{ font-size:30px; font-weight:800; fill:#4A3526; dominant-baseline:central; }
  .lab.great .chip{ filter:url(#chipShadow); }
  .t-region{ font-size:26px; font-weight:700; dominant-baseline:central; text-anchor:middle;
             paint-order:stroke; stroke:#FBF4E9; stroke-width:5px; stroke-linejoin:round; }
  .t-point{ font-size:23px; font-weight:600; fill:#4A3526; dominant-baseline:central;
            paint-order:stroke; stroke:#FBF4E9; stroke-width:4.5px; stroke-linejoin:round; }
  .t-inset{ font-size:15px; font-weight:700; fill:#7A5A3A; text-anchor:middle; }
  `;

  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VB_W} ${VB_H}" width="${VB_W}" height="${VB_H}" preserveAspectRatio="xMidYMid meet" style="max-width:100%;height:auto" role="img" aria-label="中国八大菜系与地方风味分布地图（含台湾、南海诸岛）">
  <title>中国八大菜系 · 地方风味分布图</title>
  <desc>基于阿里 DataV 标准省级行政区划底图绘制，包含台湾省与南海诸岛（九段线）。八大菜系（鲁川粤苏闽浙湘徽）按省份填色标注，地方风味以区域/点标签标注。</desc>
  <defs>
    <filter id="mapRough" x="-3%" y="-3%" width="106%" height="106%">
      <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="8" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3.2" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="chipShadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="1.2" stdDeviation="1.4" flood-color="#5A3A2A" flood-opacity="0.18"/>
    </filter>
    <style>${css}</style>
  </defs>

  <rect x="0" y="0" width="${VB_W}" height="${VB_H}" rx="18" class="bg-card"/>
  <g class="provinces" filter="url(#mapRough)">
    ${provPaths.join('\n    ')}
  </g>
  ${insetEls}
  ${titleEls}
  <g class="labels">
    ${labelEls.join('\n    ')}
  </g>
</svg>
`;

  return { svg, filledMeta };
}

/* ----------------------------------------------------------------------- */
/* 6. 导出映射 JSON                                                        */
/* ----------------------------------------------------------------------- */
function buildGeoJson(geo) {
  const provFeatures = geo.features.filter((f) => f.properties.adcode !== '100000_JD');
  const centroidOf = (name) => {
    const f = provFeatures.find((x) => x.properties.name === name);
    return f ? (f.properties.centroid || f.properties.center) : null;
  };
  const labelOf = (lng, lat) => {
    const [x, y] = projMain(lng, lat);
    return { lngLat: [lng, lat], svg: [x, y] };
  };
  const GREAT_PROV = {
    lu: ['山东省'], chuan: ['四川省', '重庆市'], yue: ['广东省'], su: ['江苏省'],
    min: ['福建省'], zhe: ['浙江省'], xiang: ['湖南省'], hui: ['安徽省'],
  };
  const REGION_PROV = {
    dongbei: ['黑龙江省', '吉林省', '辽宁省'], xibei: ['新疆维吾尔自治区'],
    yungui: ['云南省', '贵州省'], hainan: ['海南省'], taiwan: ['台湾省'],
  };
  const cuisines = [];
  for (const g of GREAT)
    cuisines.push({ id: g.key, name: g.name, type: 'great', provinces: GREAT_PROV[g.key], color: COL[g.key], label: labelOf(...g.anchor) });
  for (const g of REGION)
    cuisines.push({ id: g.key, name: g.name, type: 'region', provinces: REGION_PROV[g.key] || [], color: COL[g.key], label: labelOf(...g.anchor) });
  for (const p of POINTS)
    cuisines.push({ id: p.key, name: p.name, type: 'point', color: p.color || COL[p.key] || '#8a5a3c', label: labelOf(...p.anchor) });

  // 省份 → 菜系 + 投影后质心
  const provinces = {};
  for (const f of provFeatures) {
    const name = f.properties.name;
    const c = centroidOf(name);
    provinces[name] = {
      pinyin: PINYIN[name] || null,
      adcode: f.properties.adcode,
      cuisine: PROV_FILL[name] || null,
      fill: COL[PROV_FILL[name] || 'neutral'],
      centroid: c ? { lngLat: c, svg: projMain(c[0], c[1]) } : null,
    };
  }

  return {
    source: {
      name: '阿里 DataV GeoAtlas · 100000_full（标准省级行政区划）',
      url: SRC_URL,
      includesTaiwan: true,
      includesSouthChinaSea: true,
      note: '遵循自然资源部标准地图；含台湾省、香港、澳门、海南省与南海诸岛（九段线）。',
    },
    projection: {
      type: 'equirectangular',
      standardParallelDeg: MAIN.phi0,
      formula: 'x = PAD + (lng-lngMin)*cos(phi0)*SCALE ; y = PAD + (latMax-lat)*SCALE',
      lngMin: MAIN.lngMin, lngMax: MAIN.lngMax, latMin: MAIN.latMin, latMax: MAIN.latMax,
      scalePxPerDeg: r1(SCALE), pad: PAD,
      viewBox: [0, 0, VB_W, VB_H],
    },
    inset: {
      label: '南海诸岛',
      bbox: INSET_BBOX,
      rect: [r1(insetX), r1(insetY), r1(insetOuterW), r1(insetOuterH)],
    },
    palette: COL,
    cuisines,
    provinces,
  };
}

/* ----------------------------------------------------------------------- */
/* 7. 主流程                                                               */
/* ----------------------------------------------------------------------- */
(async () => {
  const geo = await loadGeo();
  fs.mkdirSync(IMG_DIR, { recursive: true });
  fs.mkdirSync(DATA_DIR, { recursive: true });

  const { svg, filledMeta } = build(geo);
  fs.writeFileSync(OUT_SVG, svg, 'utf8');

  const mapping = buildGeoJson(geo);
  fs.writeFileSync(OUT_JSON, JSON.stringify(mapping, null, 2), 'utf8');

  const kb = (fs.statSync(OUT_SVG).size / 1024).toFixed(1);
  console.log(`✓ 写出 ${path.relative(ROOT, OUT_SVG)}  (${kb} KB)`);
  console.log(`✓ 写出 ${path.relative(ROOT, OUT_JSON)}`);
  console.log(`· viewBox = 0 0 ${VB_W} ${VB_H}  | 主图比例 ${r1(SCALE)} px/° | 标准纬线 ${MAIN.phi0}°`);
  console.log(`· 主图地理范围 lng[${MAIN.lngMin},${MAIN.lngMax}] lat[${MAIN.latMin},${MAIN.latMax}]`);
  console.log(`· 填色省份 (${filledMeta.length}): ${filledMeta.map((m) => m.name + '→' + m.fillKey).join(', ')}`);
})().catch((e) => { console.error('构建失败:', e); process.exit(1); });
