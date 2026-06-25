/* =========================================================
   翻车诊断页 · 手绘美术资源（纯静态，零依赖）
   - meta : 每个品类分组的主色 / 英文名 / hero 大图路径
            art 为空时用内联线稿占位；AI 出图恢复后把对应
            分组的 art 填成 'assets/img/ts-hero-xxx.webp' 即可
            自动替换为水彩大图，无需改动其它代码。
   - hero : 分组横幅的手绘线稿占位（viewBox 240×150，
            主描边用 currentColor = 分组主色）
   - icon : 每个症状的小缩略图标（viewBox 40×40）
   风格对齐站内插画：棕线描 + 圆角线帽 + 平涂淡彩。
   ========================================================= */
(function () {
  const meta = {
    'stirfry':         { accent: '#C0492B', en: 'Stir-frying',         art: '' },
    'fry':             { accent: '#C77A2E', en: 'Pan-fry & Deep-fry',  art: '' },
    'steam-stew':      { accent: '#4F8C86', en: 'Steam & Braise',      art: '' },
    'thicken-coat':    { accent: '#7C8C3A', en: 'Starch Glaze',        art: '' },
    'marinate-blanch': { accent: '#9E586A', en: 'Marinate & Blanch',   art: '' },
    'rice-noodle-egg': { accent: '#C18A2A', en: 'Rice · Noodle · Egg', art: '' },
    'seasoning':       { accent: '#B0667A', en: 'Seasoning',           art: '' },
  };

  // 统一外壳：默认棕/主色描边、圆角线帽、内部各元素可覆盖 stroke / fill
  const S = (vb, inner) =>
    '<svg viewBox="' + vb + '" width="100%" height="100%" fill="none" ' +
    'stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" ' +
    'stroke-linecap="round" aria-hidden="true" focusable="false">' + inner + '</svg>';

  /* ---------- 分组 hero 占位线稿 ---------- */
  const hero = {
    'stirfry': S('0 0 240 150', `
      <path d="M96 44 C90 34 104 30 96 18" stroke-width="2"/>
      <path d="M118 40 C112 30 126 26 118 14" stroke-width="2"/>
      <path d="M140 44 C134 34 148 30 140 18" stroke-width="2"/>
      <path d="M90 60 C110 40 134 40 152 58" stroke-dasharray="1 7" stroke-width="2"/>
      <ellipse cx="104" cy="46" rx="5" ry="3" fill="#9bbf6a" stroke="#5a7a36" stroke-width="1.6"/>
      <ellipse cx="124" cy="42" rx="5.5" ry="3.2" fill="#e3a594" stroke="#a33f2c" stroke-width="1.6"/>
      <ellipse cx="142" cy="48" rx="4.6" ry="3" fill="#ecc36a" stroke="#b8862f" stroke-width="1.6"/>
      <path d="M70 70 C70 96 92 112 120 112 C148 112 170 96 170 70 Z" fill="#f3ddc6"/>
      <path d="M70 70 H170"/>
      <path d="M170 76 C188 70 196 74 206 70" stroke-width="2.6"/>
      <ellipse cx="104" cy="82" rx="7" ry="3.6" fill="#9bbf6a" stroke="#5a7a36" stroke-width="1.6"/>
      <ellipse cx="124" cy="86" rx="8" ry="4" fill="#e3a594" stroke="#a33f2c" stroke-width="1.6"/>
      <ellipse cx="140" cy="80" rx="6" ry="3.4" fill="#ecc36a" stroke="#b8862f" stroke-width="1.6"/>
      <path d="M104 118 C100 126 108 128 104 136 C112 132 114 124 108 118" stroke="#d9603c" stroke-width="2"/>
      <path d="M118 120 C114 130 124 132 120 140 C129 135 130 126 124 120" stroke="#e08b3a" stroke-width="2"/>
      <path d="M132 118 C128 126 136 128 132 136 C140 132 142 124 136 118" stroke="#d9603c" stroke-width="2"/>`),

    'fry': S('0 0 240 150', `
      <path d="M96 50 C90 42 102 38 96 30" stroke-width="2"/>
      <path d="M120 48 C114 40 126 36 120 28" stroke-width="2"/>
      <path d="M60 78 H170 V86 C170 98 160 106 148 106 H82 C70 106 60 98 60 86 Z" fill="#e9cfa8"/>
      <path d="M170 84 C196 80 208 86 224 80" stroke-width="3"/>
      <ellipse cx="100" cy="89" rx="20" ry="9" fill="#bcd0d0" stroke="#3f6463" stroke-width="2"/>
      <ellipse cx="140" cy="91" rx="15" ry="7.5" fill="#e3a594" stroke="#a33f2c" stroke-width="2"/>
      <circle cx="82" cy="100" r="3" stroke="#d9a83a" stroke-width="1.6"/>
      <circle cx="120" cy="101" r="2.4" stroke="#d9a83a" stroke-width="1.6"/>
      <circle cx="156" cy="99" r="3" stroke="#d9a83a" stroke-width="1.6"/>
      <path d="M150 60 L192 28" stroke-width="3"/>
      <path d="M138 58 L156 50 L166 64 L148 72 Z" fill="#cdb499"/>`),

    'steam-stew': S('0 0 240 150', `
      <path d="M70 36 C64 28 76 24 70 16" stroke-width="2"/>
      <path d="M92 32 C86 24 98 20 92 12" stroke-width="2"/>
      <path d="M114 36 C108 28 120 24 114 16" stroke-width="2"/>
      <ellipse cx="92" cy="48" rx="46" ry="10" fill="#e3c79a"/>
      <path d="M46 48 V70 M138 48 V70"/>
      <ellipse cx="92" cy="70" rx="46" ry="10" fill="#dcbf8e"/>
      <path d="M46 70 V92 M138 70 V92"/>
      <path d="M46 92 C46 102 138 102 138 92" fill="#d4b585"/>
      <path d="M158 88 C158 104 168 112 184 112 C200 112 210 104 210 88 Z" fill="#cdb499"/>
      <path d="M152 88 H216" stroke-width="2.6"/>
      <path d="M166 88 C166 80 202 80 202 88" fill="#d9c4a8"/>
      <circle cx="184" cy="78" r="2.4"/>`),

    'thicken-coat': S('0 0 240 150', `
      <ellipse cx="150" cy="40" rx="22" ry="12" fill="#e9dcc2"/>
      <path d="M168 36 C188 30 196 40 210 34" stroke-width="3"/>
      <path d="M138 50 C136 64 140 74 138 88" stroke="#caa86a" stroke-width="2.4"/>
      <path d="M150 50 C152 64 148 76 150 90" stroke="#caa86a" stroke-width="2.4"/>
      <path d="M70 80 H190 C186 104 168 116 130 116 C92 116 74 104 70 80 Z" fill="#ecd9b8"/>
      <path d="M64 80 H196" stroke-width="3"/>
      <path d="M96 94 C112 90 148 90 164 94" stroke="#fff" stroke-width="3" opacity="0.7"/>`),

    'marinate-blanch': S('0 0 240 150', `
      <path d="M40 76 H110 C107 96 92 106 75 106 C58 106 43 96 40 76 Z" fill="#eaddc7"/>
      <path d="M34 76 H116" stroke-width="2.6"/>
      <ellipse cx="64" cy="84" rx="12" ry="6" fill="#e3a594" stroke="#a33f2c" stroke-width="2"/>
      <ellipse cx="86" cy="88" rx="11" ry="5.5" fill="#dc9b8a" stroke="#a33f2c" stroke-width="2"/>
      <circle cx="76" cy="70" r="1.6" fill="currentColor"/>
      <circle cx="94" cy="73" r="1.6" fill="currentColor"/>
      <path d="M138 78 H214 C211 100 196 110 176 110 C156 110 141 100 138 78 Z" fill="#cfe0e0" stroke="#3f6463" stroke-width="2.2"/>
      <path d="M132 78 H220" stroke="#3f6463" stroke-width="2.6"/>
      <path d="M150 88 C156 84 162 92 168 87 C174 83 182 90 188 86" stroke="#5a7a36" stroke-width="2"/>
      <circle cx="160" cy="98" r="2.4" stroke="#7aa0a0" stroke-width="1.6"/>
      <circle cx="184" cy="99" r="2" stroke="#7aa0a0" stroke-width="1.6"/>
      <path d="M170 70 C164 62 176 58 170 50" stroke="#3f6463" stroke-width="1.8"/>`),

    'rice-noodle-egg': S('0 0 240 150', `
      <path d="M40 84 H104 C101 104 86 114 72 114 C58 114 43 104 40 84 Z" fill="#f3ead9"/>
      <path d="M34 84 H110" stroke-width="2.6"/>
      <path d="M52 76 C58 72 70 72 76 76" stroke="#caa86a" stroke-width="2"/>
      <ellipse cx="128" cy="92" rx="16" ry="19" fill="#fff4e6" stroke-width="2.4"/>
      <circle cx="128" cy="94" r="8" fill="#f0c34a" stroke="#b8862f" stroke-width="2"/>
      <path d="M150 84 H214 C211 104 196 114 182 114 C168 114 153 104 150 84 Z" fill="#f0d98a"/>
      <path d="M146 84 H218" stroke-width="2.6"/>
      <path d="M160 78 C168 73 196 73 204 78" stroke="#b8862f" stroke-width="1.6"/>
      <path d="M176 32 L196 82 M186 30 L202 82" stroke-width="3"/>
      <path d="M182 60 C188 56 196 62 200 58" stroke="#caa05a" stroke-width="2"/>`),

    'seasoning': S('0 0 240 150', `
      <path d="M52 70 H78 L75 110 H55 Z" fill="#efe6d6" stroke-width="2.2"/>
      <path d="M55 70 V60 H75 V70" stroke-width="2.2"/>
      <circle cx="62" cy="55" r="1.3" fill="currentColor"/>
      <circle cx="68" cy="55" r="1.3" fill="currentColor"/>
      <path d="M92 74 V58 C92 55 96 53 96 48 H108 C108 53 112 55 112 58 V74 Z" fill="#a8662a" stroke="#6a3a18" stroke-width="2.2"/>
      <path d="M96 44 H108 V48 H96 Z" fill="#6a3a18" stroke="#6a3a18"/>
      <path d="M126 74 V56 C126 52 130 50 130 46 H140 C140 50 144 52 144 56 V74 Z" fill="#e8cf9a" stroke-width="2.2"/>
      <rect x="128" y="62" width="14" height="8" fill="#fff" stroke="#a8843a" stroke-width="1.2"/>
      <ellipse cx="178" cy="102" rx="36" ry="9" fill="#ecd9b8" stroke-width="2.2"/>
      <ellipse cx="170" cy="100" rx="12" ry="5" fill="#d98a4a" stroke="#a8602a" stroke-width="1.8"/>
      <path d="M198 80 C208 76 212 84 222 80" stroke-width="2.6"/>
      <ellipse cx="198" cy="82" rx="7" ry="4" fill="#e9dcc2"/>`),
  };

  /* ---------- 症状缩略图标 ---------- */
  const icon = {
    /* 炒菜 · 滑炒 */
    'meat-tough': S('0 0 40 40', `
      <path d="M9 21 C9 14 15 10 22 11 C30 12 33 18 31 25 C29 31 21 33 15 30 C11 28 9 24 9 21 Z" fill="#e3a594" stroke="#a33f2c" stroke-width="2"/>
      <path d="M13 19 C16 17 20 17 23 19" stroke="#a33f2c" stroke-width="1.4"/>
      <path d="M14 24 C17 26 21 26 24 24" stroke="#a33f2c" stroke-width="1.4"/>
      <circle cx="26" cy="21" r="2.2" fill="#fff3ea" stroke="#a33f2c" stroke-width="1.2"/>`),
    'watery': S('0 0 40 40', `
      <path d="M8 18 H32 C31 27 26 31 20 31 C14 31 9 27 8 18 Z" fill="#cfe0e0" stroke="#3f6463" stroke-width="2"/>
      <path d="M6 18 H34" stroke="#3f6463" stroke-width="2"/>
      <path d="M12 23 C15 21 18 25 21 23 C24 21 27 25 29 23" stroke="#3f6463" stroke-width="1.5"/>
      <path d="M22 26 C25 24 28 27 26 29 C24 30 22 28 22 26 Z" fill="#9bbf6a" stroke="#5a7a36" stroke-width="1.3"/>`),
    'garlic-bitter': S('0 0 40 40', `
      <path d="M20 12 C15 16 14 24 18 29 C20 31 24 31 26 29 C30 24 25 16 20 12 Z" fill="#f3ead9" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M20 13 V29 M16 20 C18 23 18 26 17 28 M24 20 C22 23 22 26 23 28" stroke="#7a4a2e" stroke-width="1.2"/>
      <path d="M20 12 C19 9 22 8 20 5" stroke="#7a4a2e" stroke-width="1.6"/>
      <path d="M27 14 C30 12 31 9 29 6" stroke="#3a2a22" stroke-width="1.6" stroke-dasharray="1 3"/>`),
    'greens-yellow': S('0 0 40 40', `
      <path d="M21 8 C12 11 8 21 11 32 C21 31 30 24 30 13 C30 10 26 8 21 8 Z" fill="#d8d178" stroke="#9a8a3a" stroke-width="2"/>
      <path d="M19 11 C18 19 17 26 13 31" stroke="#9a8a3a" stroke-width="1.5"/>
      <path d="M19 16 L24 14 M18 22 L24 20" stroke="#9a8a3a" stroke-width="1.2"/>`),
    'no-wokhei': S('0 0 40 40', `
      <path d="M7 18 H33 C33 26 27 31 20 31 C13 31 7 26 7 18 Z" fill="#d9b48a" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M33 20 H38" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M14 13 C16 10 13 9 15 6" stroke="#c0492b" stroke-width="1.6"/>
      <path d="M21 13 C23 10 20 9 22 6" stroke="#c0492b" stroke-width="1.6"/>
      <path d="M28 13 C30 10 27 9 29 6" stroke="#c0492b" stroke-width="1.6"/>`),
    'stick-pan': S('0 0 40 40', `
      <path d="M7 22 H29 V25 C29 28 26 30 22 30 H14 C10 30 7 28 7 25 Z" fill="#c9b59a" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M29 24 H39" stroke="#7a4a2e" stroke-width="2.4"/>
      <path d="M13 22 C13 18 16 17 18 19 C20 21 23 20 23 22 Z" fill="#e3a594" stroke="#a33f2c" stroke-width="1.8"/>
      <path d="M15 22 V26 M19 22 V27" stroke="#a33f2c" stroke-width="1.2"/>`),

    /* 煎 · 炸 */
    'stick-break': S('0 0 40 40', `
      <path d="M6 20 C12 12 24 12 29 20 C24 28 12 28 6 20 Z" fill="#bcd0d0" stroke="#3f6463" stroke-width="2"/>
      <path d="M29 20 L36 14 L34 20 L36 26 Z" fill="#bcd0d0" stroke="#3f6463" stroke-width="2"/>
      <circle cx="13" cy="18.5" r="1.4" fill="#3f6463"/>
      <path d="M17 16 C19 18 19 22 17 24" stroke="#3f6463" stroke-width="1.3"/>`),
    'soggy': S('0 0 40 40', `
      <path d="M11 16 C14 12 26 12 29 16" stroke="#b8862f" stroke-width="2"/>
      <path d="M13 16 C12 22 14 27 13 31" stroke="#e0b24e" stroke-width="3"/>
      <path d="M18 15 C18 22 18 27 18 31" stroke="#e0b24e" stroke-width="3"/>
      <path d="M23 16 C24 22 22 27 23 31" stroke="#e0b24e" stroke-width="3"/>
      <path d="M28 16 C28 22 27 27 28 31" stroke="#e0b24e" stroke-width="3"/>
      <path d="M9 31 H31" stroke="#7a4a2e" stroke-width="2"/>`),
    'burnt-raw': S('0 0 40 40', `
      <circle cx="20" cy="20" r="12" fill="#e9d9c0" stroke="#5a3a26" stroke-width="2.4"/>
      <path d="M20 8 A12 12 0 0 1 20 32" stroke="#3a2418" stroke-width="3"/>
      <circle cx="18" cy="20" r="4.6" fill="#f6cf9a" stroke="#b8862f" stroke-width="1.6"/>`),
    'oil-splatter': S('0 0 40 40', `
      <path d="M20 14 C24 19 25 23 22 26 C20 28 17 27 16 24 C15 21 17 18 20 14 Z" fill="#f0c96a" stroke="#b8862f" stroke-width="2"/>
      <circle cx="9" cy="13" r="1.8" fill="#f0c96a" stroke="#b8862f" stroke-width="1.2"/>
      <circle cx="31" cy="12" r="1.6" fill="#f0c96a" stroke="#b8862f" stroke-width="1.2"/>
      <circle cx="30" cy="28" r="2" fill="#f0c96a" stroke="#b8862f" stroke-width="1.2"/>
      <circle cx="10" cy="29" r="1.5" fill="#f0c96a" stroke="#b8862f" stroke-width="1.2"/>`),
    'batter-falls': S('0 0 40 40', `
      <ellipse cx="20" cy="18" rx="9" ry="7" fill="#e3a594" stroke="#a33f2c" stroke-width="2"/>
      <path d="M11 18 C11 12 29 12 29 18" stroke="#e6c98e" stroke-width="2.4"/>
      <path d="M16 25 C16 29 14 30 15 33 M24 25 C24 29 26 30 25 33" stroke="#e6c98e" stroke-width="2"/>`),

    /* 蒸 · 炖 */
    'steamed-egg-holes': S('0 0 40 40', `
      <path d="M7 17 H33 C32 26 26 31 20 31 C14 31 8 26 7 17 Z" fill="#f7e7b0" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 17 H35" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="15" cy="22" r="1.6" fill="#fff" stroke="#caa64a" stroke-width="1"/>
      <circle cx="22" cy="24" r="1.8" fill="#fff" stroke="#caa64a" stroke-width="1"/>
      <circle cx="26" cy="21" r="1.3" fill="#fff" stroke="#caa64a" stroke-width="1"/>
      <circle cx="19" cy="20" r="1.2" fill="#fff" stroke="#caa64a" stroke-width="1"/>`),
    'steamed-fish': S('0 0 40 40', `
      <path d="M6 23 C12 16 24 16 29 23 C24 30 12 30 6 23 Z" fill="#bcd0d0" stroke="#3f6463" stroke-width="2"/>
      <path d="M29 23 L36 18 L34 23 L36 28 Z" fill="#bcd0d0" stroke="#3f6463" stroke-width="2"/>
      <circle cx="13" cy="22" r="1.3" fill="#3f6463"/>
      <path d="M14 12 C16 9 13 8 15 5 M22 11 C24 8 21 7 23 4" stroke="#9bb3b3" stroke-width="1.6"/>`),
    'stew-tough': S('0 0 40 40', `
      <path d="M9 20 C9 28 13 32 20 32 C27 32 31 28 31 20 Z" fill="#cdb499" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M7 20 H33" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M13 20 C13 15 27 15 27 20" fill="#d9c4a8" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="20" cy="14" r="1.8" fill="#7a4a2e"/>
      <path d="M7 23 H4 M33 23 H36" stroke="#7a4a2e" stroke-width="2"/>`),
    'soup-not-milky': S('0 0 40 40', `
      <path d="M7 18 H33 C32 27 26 31 20 31 C14 31 8 27 7 18 Z" fill="#eee3cf" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 18 H35" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M14 12 C16 9 13 8 15 5 M24 12 C26 9 23 8 25 5" stroke="#bfae8a" stroke-width="1.6"/>
      <circle cx="16" cy="23" r="1.4" fill="#fff" stroke="#c8b48a" stroke-width="1"/>
      <circle cx="23" cy="24" r="1.6" fill="#fff" stroke="#c8b48a" stroke-width="1"/>`),
    'soup-cloudy': S('0 0 40 40', `
      <path d="M7 18 H33 C32 27 26 31 20 31 C14 31 8 27 7 18 Z" fill="#d8c6a6" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 18 H35" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="14" cy="23" r="1.1" fill="#9c7a4a"/>
      <circle cx="19" cy="25" r="1.3" fill="#9c7a4a"/>
      <circle cx="24" cy="22" r="1" fill="#9c7a4a"/>
      <circle cx="27" cy="25" r="1.1" fill="#9c7a4a"/>`),
    'hongshao-dull': S('0 0 40 40', `
      <rect x="11" y="13" width="18" height="15" rx="3" fill="#b6602f" stroke="#7a3a1e" stroke-width="2"/>
      <path d="M11 18 H29 M11 23 H29" stroke="#e8c49a" stroke-width="1.8"/>
      <circle cx="16" cy="16" r="1.2" fill="#fff" opacity="0.8"/>`),

    /* 勾芡 · 上浆 */
    'sauce-broken': S('0 0 40 40', `
      <ellipse cx="15" cy="14" rx="7" ry="4.5" fill="#e9dcc2" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M21 13 C27 11 30 16 32 13" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M13 18 C13 23 11 25 12 29 M17 18 C17 22 19 24 18 28" stroke="#caa86a" stroke-width="1.8"/>`),
    'sauce-lumpy': S('0 0 40 40', `
      <path d="M8 19 H32 C31 27 26 31 20 31 C14 31 9 27 8 19 Z" fill="#ede0c6" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M6 19 H34" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="16" cy="24" r="2.6" fill="#d8b87a" stroke="#a8843a" stroke-width="1.4"/>
      <circle cx="23" cy="25" r="3" fill="#d8b87a" stroke="#a8843a" stroke-width="1.4"/>
      <circle cx="26" cy="22" r="1.8" fill="#d8b87a" stroke="#a8843a" stroke-width="1.4"/>`),
    'sauce-thin': S('0 0 40 40', `
      <path d="M8 19 H32 C31 27 26 31 20 31 C14 31 9 27 8 19 Z" fill="#f0e8d4" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M6 19 H34" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M12 24 C15 22 18 26 21 24 C24 22 27 26 29 24" stroke="#c8a86a" stroke-width="1.5"/>`),
    'coating-off': S('0 0 40 40', `
      <path d="M10 16 C16 13 26 14 30 18 C27 25 16 27 11 23 C9 21 9 18 10 16 Z" fill="#e3a594" stroke="#a33f2c" stroke-width="2"/>
      <path d="M9 14 C16 10 27 11 32 16" stroke="#e6c98e" stroke-width="2" stroke-dasharray="2 3"/>`),

    /* 腌制 · 焯水 */
    'no-flavor': S('0 0 40 40', `
      <path d="M7 19 H33 C32 27 26 31 20 31 C14 31 8 27 7 19 Z" fill="#eaddc7" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 19 H35" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M13 22 C16 20 20 21 22 23 C20 26 15 26 13 24 Z" fill="#e3a594" stroke="#a33f2c" stroke-width="1.6"/>
      <circle cx="25" cy="23" r="0.9" fill="#7a4a2e"/>
      <circle cx="27" cy="25" r="0.9" fill="#7a4a2e"/>`),
    'marinade-tough': S('0 0 40 40', `
      <path d="M10 20 C10 14 16 11 22 12 C29 13 31 19 29 24 C27 29 19 30 14 27 C11 25 10 23 10 20 Z" fill="#dc9b8a" stroke="#a33f2c" stroke-width="2"/>
      <circle cx="15" cy="9" r="1.1" fill="#fff" stroke="#a8a098" stroke-width="0.8"/>
      <circle cx="22" cy="7" r="1.1" fill="#fff" stroke="#a8a098" stroke-width="0.8"/>
      <circle cx="28" cy="10" r="1.1" fill="#fff" stroke="#a8a098" stroke-width="0.8"/>`),
    'veg-yellow-blanch': S('0 0 40 40', `
      <path d="M16 22 H24 L23 30 H17 Z" fill="#cdb98a" stroke="#7a4a2e" stroke-width="1.8"/>
      <circle cx="14" cy="16" r="5" fill="#c9c46a" stroke="#8a7a30" stroke-width="1.8"/>
      <circle cx="22" cy="13" r="5.5" fill="#c9c46a" stroke="#8a7a30" stroke-width="1.8"/>
      <circle cx="27" cy="17" r="4.5" fill="#c9c46a" stroke="#8a7a30" stroke-width="1.8"/>
      <circle cx="19" cy="19" r="4.5" fill="#c9c46a" stroke="#8a7a30" stroke-width="1.8"/>`),
    'nutrient-loss': S('0 0 40 40', `
      <path d="M8 20 H32 C31 28 26 31 20 31 C14 31 9 28 8 20 Z" fill="#cfe0e0" stroke="#3f6463" stroke-width="2"/>
      <path d="M6 20 H34" stroke="#3f6463" stroke-width="2"/>
      <path d="M16 25 C19 23 22 27 25 24" stroke="#5a7a36" stroke-width="1.6"/>
      <circle cx="15" cy="15" r="1.2" stroke="#7aa0a0" stroke-width="1.2"/>
      <circle cx="20" cy="12" r="1.5" stroke="#7aa0a0" stroke-width="1.2"/>
      <circle cx="25" cy="15" r="1.1" stroke="#7aa0a0" stroke-width="1.2"/>`),
    'meat-foam': S('0 0 40 40', `
      <path d="M8 21 H32 C31 29 26 32 20 32 C14 32 9 29 8 21 Z" fill="#e8dcc6" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M6 21 H34" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="12" cy="20" r="2" fill="#fff" stroke="#c2b08a" stroke-width="1.2"/>
      <circle cx="17" cy="19" r="2.4" fill="#fff" stroke="#c2b08a" stroke-width="1.2"/>
      <circle cx="22" cy="20" r="2" fill="#fff" stroke="#c2b08a" stroke-width="1.2"/>
      <circle cx="27" cy="19" r="2.2" fill="#fff" stroke="#c2b08a" stroke-width="1.2"/>`),

    /* 米饭 · 面食 · 蛋 */
    'rice-undercooked': S('0 0 40 40', `
      <path d="M7 18 H33 C32 27 26 31 20 31 C14 31 8 27 7 18 Z" fill="#f3ead9" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 18 H35" stroke="#7a4a2e" stroke-width="2"/>
      <g stroke="#caa86a" stroke-width="1.6">
        <path d="M13 22 L15 23 M18 24 L20 25 M23 22 L25 23 M16 27 L18 27.6 M22 27 L24 27.6"/>
      </g>`),
    'rice-mushy': S('0 0 40 40', `
      <path d="M7 18 H33 C32 27 26 31 20 31 C14 31 8 27 7 18 Z" fill="#ece0cc" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 18 H35" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M12 23 C15 21 17 25 20 23 C23 21 25 25 28 23" stroke="#c2a772" stroke-width="2"/>`),
    'rice-hard-again': S('0 0 40 40', `
      <path d="M7 20 H33 C32 28 26 32 20 32 C14 32 8 28 7 20 Z" fill="#f3ead9" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 20 H35" stroke="#7a4a2e" stroke-width="2"/>
      <g stroke="#7aa0c0" stroke-width="1.4">
        <path d="M20 6 V15 M16 8 L24 13 M24 8 L16 13"/>
      </g>`),
    'noodles-clump': S('0 0 40 40', `
      <ellipse cx="20" cy="22" rx="13" ry="9" fill="#f0d98a" stroke="#b8862f" stroke-width="2"/>
      <path d="M9 20 C13 17 17 23 21 20 C25 17 29 23 31 20 M9 25 C13 22 17 28 21 25 C25 22 29 28 31 25" stroke="#b8862f" stroke-width="1.4"/>`),
    'egg-hard-peel': S('0 0 40 40', `
      <ellipse cx="18" cy="22" rx="10" ry="12" fill="#fff4e6" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M28 14 L34 11 L33 17 Z" fill="#efe6d6" stroke="#7a4a2e" stroke-width="1.6"/>
      <path d="M12 18 C15 16 18 18 16 21" stroke="#d8c4a8" stroke-width="1.2"/>`),
    'egg-green-yolk': S('0 0 40 40', `
      <circle cx="20" cy="20" r="12" fill="#fbf3e6" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="20" cy="20" r="5.5" fill="#f0c34a" stroke="#b8862f" stroke-width="1.6"/>
      <circle cx="20" cy="20" r="7.6" stroke="#7a8a5a" stroke-width="2" stroke-dasharray="1 1.6"/>`),

    /* 调味 */
    'too-salty': S('0 0 40 40', `
      <path d="M13 16 H27 L25.5 32 H14.5 Z" fill="#efe6d6" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M15 16 V12 H25 V16" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="18" cy="9.5" r="0.9" fill="#7a4a2e"/>
      <circle cx="22" cy="9.5" r="0.9" fill="#7a4a2e"/>
      <circle cx="20" cy="8" r="0.9" fill="#7a4a2e"/>
      <path d="M18 22 H22 M17 26 H23" stroke="#c2b08a" stroke-width="1.4"/>`),
    'bitter': S('0 0 40 40', `
      <path d="M12 10 C10 12 11 15 13 16 C12 24 18 31 26 30 C30 29 31 24 29 21 C31 14 25 8 18 10 C16 10.5 14 9 12 10 Z" fill="#8fb24e" stroke="#5a7a36" stroke-width="2"/>
      <path d="M16 15 C18 21 22 26 27 27 M20 12 C21 19 24 24 28 25" stroke="#5a7a36" stroke-width="1.2"/>`),
    'flat-taste': S('0 0 40 40', `
      <path d="M8 18 H32 C31 27 26 31 20 31 C14 31 9 27 8 18 Z" fill="#eee3cf" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M6 18 H34" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M13 24 H27" stroke="#b0a489" stroke-width="2" stroke-dasharray="1 3"/>`),
    'sour-unbalanced': S('0 0 40 40', `
      <path d="M16 8 H24 V12 C24 13 26 15 26 19 V30 C26 31 25 32 24 32 H16 C15 32 14 31 14 30 V19 C14 15 16 13 16 12 Z" fill="#e8cf9a" stroke="#7a4a2e" stroke-width="2"/>
      <rect x="16" y="20" width="10" height="8" rx="1" fill="#fff" stroke="#a8843a" stroke-width="1.2"/>
      <path d="M16 8 H24" stroke="#7a4a2e" stroke-width="2"/>`),
    'sugarcolor-bitter': S('0 0 40 40', `
      <path d="M9 18 H29 C29 25 24 29 19 29 C14 29 9 25 9 18 Z" fill="#a8662a" stroke="#6a3a18" stroke-width="2"/>
      <path d="M29 20 H37" stroke="#7a4a2e" stroke-width="2.2"/>
      <path d="M7 18 H31" stroke="#6a3a18" stroke-width="2"/>
      <circle cx="15" cy="22" r="1.4" fill="#7a4416" stroke="#5a2e10" stroke-width="0.8"/>
      <circle cx="21" cy="23" r="1.6" fill="#7a4416" stroke="#5a2e10" stroke-width="0.8"/>`),
    'seasoning-uneven': S('0 0 40 40', `
      <circle cx="20" cy="20" r="12" fill="#f4ecdc" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M20 20 V12 M20 20 L26 23" stroke="#a33f2c" stroke-width="2"/>
      <circle cx="20" cy="20" r="1.4" fill="#7a4a2e"/>
      <path d="M20 7 V9 M33 20 H31 M20 33 V31 M7 20 H9" stroke="#7a4a2e" stroke-width="1.4"/>`),
    'too-spicy': S('0 0 40 40', `
      <path d="M13 8 C15 11 15 14 18 15" stroke="#5a7a36" stroke-width="2"/>
      <path d="M18 15 C27 16 31 24 26 31 C22 36 15 33 14 26 C13 21 13 18 18 15 Z" fill="#d6502f" stroke="#9a2e1e" stroke-width="2"/>
      <path d="M19 19 C22 22 23 27 22 30" stroke="#fff" stroke-width="1.2" opacity="0.6"/>`),
    'too-greasy': S('0 0 40 40', `
      <path d="M7 18 H33 C32 27 26 31 20 31 C14 31 8 27 7 18 Z" fill="#e7d2a8" stroke="#7a4a2e" stroke-width="2"/>
      <path d="M5 18 H35" stroke="#7a4a2e" stroke-width="2"/>
      <circle cx="15" cy="23" r="2.2" stroke="#d9a83a" stroke-width="1.4"/>
      <circle cx="22" cy="24" r="2.8" stroke="#d9a83a" stroke-width="1.4"/>
      <circle cx="26" cy="22" r="1.6" stroke="#d9a83a" stroke-width="1.4"/>`),
  };

  window.HCL_TS_ART = { meta: meta, hero: hero, icon: icon };
})();
