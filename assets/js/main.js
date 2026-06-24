/* =========================================================
   家常菜实验室 · 共享脚本
   - 注入统一的顶部导航与页脚（多页风格一致）
   - 顶部阅读进度条 / 移动端菜单 / 目录高亮 / 进场动画
   - 深色模式 / 站内搜索 / 正文术语悬浮 / “已掌握”标记
   零依赖，可直接用 file:// 打开
   ========================================================= */

/* 站点结构：改这里即可全站同步 */
const SITE = {
  brand: { title: '家常菜实验室', sub: 'HOMECOOK · LAB' },
  chapters: [
    { id: 'principles', num: '01', file: 'principles.html', title: '底层原理', short: '原理', en: 'The Science',
      accent: '#C0492B', art: 'assets/img/ch-principles.webp',
      desc: '热怎么传、香从哪来、为什么会嫩会脆——先把厨房里的物理化学讲明白。',
      tags: ['热传递', '美拉德', '蛋白质变性', '乳化', '鲜味协同'] },
    { id: 'prep', num: '02', file: 'prep.html', title: '预处理', short: '预处理', en: 'Prep & Mise en place',
      accent: '#8B5E3C', art: 'assets/img/ch-prep.webp',
      desc: '刀工、腌制上浆、焯水、控水——下锅前决定成败的一半。',
      tags: ['刀工', '腌制上浆', '焯水', '断生', '控水'] },
    { id: 'sauces', num: '03', file: 'sauces.html', title: '调味与酱料', short: '调味', en: 'Seasoning & Sauces',
      accent: '#E2A03F', art: 'assets/img/ch-sauces.webp',
      desc: '盐糖酱醋酒、生抽老抽蚝油豆瓣各司其职；味型其实是可计算的配比。',
      tags: ['五味', '复合酱料', '味型公式', '兑碗汁', '勾芡'] },
    { id: 'techniques', num: '04', file: 'techniques.html', title: '火候与技法', short: '火候', en: 'Heat & Techniques',
      accent: '#6F9A4C', art: 'assets/img/ch-techniques.webp',
      desc: '炒煎炸烹、蒸煮炖焖烧卤——每种技法对应一套热与水的逻辑。',
      tags: ['炒', '煎炸', '蒸炖', '勾芡时机', '锅气'] },
    { id: 'practice', num: '05', file: 'practice.html', title: '实操 · 保存 · 创新', short: '实操', en: 'Practice & Beyond',
      accent: '#5A8C8B', art: 'assets/img/ch-practice.webp',
      desc: '通用流程模板、翻车排查、剩菜保存的食品安全，以及基于原理的创新方法。',
      tags: ['流程模板', '翻车排查', '冷藏复热', '食品安全', '创新组合'] },
  ],
};

/* 小图标库（inline SVG） */
const ICONS = {
  principles: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6M10 3v5.2L5.5 17a3 3 0 0 0 2.6 4.5h7.8A3 3 0 0 0 18.5 17L14 8.2V3"/><path d="M7.5 14h9"/></svg>',
  prep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14l9-9 3 3-9 9-4 1z"/><path d="M14 5l3 3"/><path d="M3 21h18"/></svg>',
  sauces: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6v3l1 2v3H8V8l1-2z"/><path d="M8 11h8v9a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1z"/></svg>',
  techniques: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h13a4 4 0 0 1-4 4H8a5 5 0 0 1-5-4z" transform="translate(0 1)"/><path d="M16 12h2.5a2.5 2.5 0 0 1 0 5H15"/><path d="M6 19h8"/><path d="M7 6c0-1 1-1 1-2M11 6c0-1 1-1 1-2"/></svg>',
  practice: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  pot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z"/><path d="M2 9h2M20 9h2"/><path d="M8 5c0-1 1-1 1-2M12 5c0-1 1-1 1-2M16 5c0-1 1-1 1-2"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></svg>',
  chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
};

const LS = { theme: 'hcl-theme', learned: 'hcl-learned' };

/* ---------- 顶部导航 ---------- */
function injectHeader() {
  const current = document.body.dataset.page || '';
  const utils = (window.HCL && window.HCL.utils) || [];

  const chapterLinks = SITE.chapters.map(c =>
    `<li><a href="${c.file}" data-id="${c.id}" class="${c.id === current ? 'active' : ''}">
       <span class="n">${c.num}</span>${c.short || c.title}</a></li>`
  ).join('');

  const utilActive = utils.some(u => u.id === current);
  const utilLinks = utils.map(u =>
    `<li><a href="${u.file}" data-id="${u.id}" class="${u.id === current ? 'active' : ''}">
       <span class="emoji">${u.icon}</span>${u.title}</a></li>`
  ).join('');

  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <div class="container nav">
      <a class="brand" href="index.html" aria-label="回到首页">
        <span class="mark">${ICONS.pot}</span>
        <span><b>${SITE.brand.title}</b><small>${SITE.brand.sub}</small></span>
      </a>
      <ul class="nav-links">
        ${chapterLinks}
        <li class="nav-more${utilActive ? ' active' : ''}">
          <button class="nav-more-btn" aria-haspopup="true" aria-expanded="false">工具箱 ${ICONS.chevron}</button>
          <ul class="nav-dropdown">${utilLinks}</ul>
        </li>
      </ul>
      <div class="nav-actions">
        <button class="icon-btn" data-search aria-label="搜索（按 / 打开）" title="搜索  /">${ICONS.search}</button>
        <button class="icon-btn" data-theme-toggle aria-label="切换深色模式" title="深色模式">${ICONS.moon}</button>
        <button class="nav-toggle" aria-label="菜单" aria-expanded="false">${ICONS.menu}</button>
      </div>
    </div>`;
  document.body.prepend(header);

  const toggle = header.querySelector('.nav-toggle');
  const list = header.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    const open = list.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  // 工具箱下拉（桌面端点击展开，移动端始终平铺）
  const more = header.querySelector('.nav-more');
  const moreBtn = header.querySelector('.nav-more-btn');
  moreBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = more.classList.toggle('open');
    moreBtn.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', () => {
    more.classList.remove('open');
    moreBtn.setAttribute('aria-expanded', 'false');
  });
}

function injectFooter() {
  const links = SITE.chapters.map(c => `<li><a href="${c.file}">${c.num} · ${c.title}</a></li>`).join('');
  const utils = (window.HCL && window.HCL.utils) || [];
  const utilLinks = utils.map(u => `<li><a href="${u.file}">${u.icon} ${u.title}</a></li>`).join('');
  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="container">
      <div class="foot-grid">
        <div class="foot-brand">
          <b>${SITE.brand.title}</b>
          <p>用理科生的视角拆解中餐家常菜：先懂原理，再谈技法，最后才是创新。通俗、系统、可复用。</p>
        </div>
        <div>
          <h4>学习篇章</h4>
          <ul>${links}</ul>
        </div>
        <div>
          <h4>工具箱</h4>
          <ul>${utilLinks}</ul>
        </div>
      </div>
      <div class="container foot-bottom" style="padding-inline:0">
        <span>© ${new Date().getFullYear()} 家常菜实验室 · 自用学习项目</span>
        <span>慢工出细活 🍲（内容持续补充中）</span>
      </div>
    </div>`;
  document.body.appendChild(footer);
}

/* 注入共享的“手绘”SVG 滤镜定义 */
function injectSketchDefs() {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  svg.innerHTML = `<defs>
    <filter id="rough" x="-8%" y="-8%" width="116%" height="116%">
      <feTurbulence type="fractalNoise" baseFrequency="0.013" numOctaves="3" seed="8" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="3" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
    <filter id="rough-strong" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.022" numOctaves="3" seed="14" result="n"/>
      <feDisplacementMap in="SourceGraphic" in2="n" scale="4.5" xChannelSelector="R" yChannelSelector="G"/>
    </filter>
  </defs>`;
  document.body.appendChild(svg);
}

/* 顶部阅读进度条 */
function setupProgress() {
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.appendChild(bar);
  const onScroll = () => {
    const h = document.documentElement;
    const scrolled = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
    bar.style.width = Math.max(0, Math.min(1, scrolled)) * 100 + '%';
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* 自动给正文 h2 生成锚点并构建侧栏目录 + 滚动高亮 */
function setupTOC() {
  const toc = document.querySelector('[data-toc]');
  const prose = document.querySelector('.prose');
  if (!toc || !prose) return;

  const heads = [...prose.querySelectorAll('h2')];
  const slug = (t) => t.trim().replace(/\s+/g, '-').replace(/[^\w\u4e00-\u9fa5-]/g, '');
  const items = heads.map((h, i) => {
    if (!h.id) h.id = 'sec-' + (i + 1) + '-' + slug(h.textContent).slice(0, 12);
    return `<li><a href="#${h.id}">${h.dataset.toc || h.textContent.replace(/^[\d\.\s]+/, '')}</a></li>`;
  }).join('');
  toc.innerHTML = `<div class="toc-title">本页目录</div><ul>${items}</ul>`;

  const links = [...toc.querySelectorAll('a')];
  const byId = Object.fromEntries(links.map(a => [a.getAttribute('href').slice(1), a]));
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(a => a.classList.remove('active'));
        byId[e.target.id]?.classList.add('active');
      }
    });
  }, { rootMargin: '-72px 0px -70% 0px', threshold: 0 });
  heads.forEach(h => obs.observe(h));
}

/* 进场动画 */
function setupReveal() {
  const els = document.querySelectorAll('.reveal:not(.in)');
  if (!els.length) return;
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => obs.observe(el));
}

/* ---------- 深色模式 ---------- */
function getTheme() { return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'; }
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem(LS.theme, t); } catch (e) {}
  const btn = document.querySelector('[data-theme-toggle]');
  if (btn) {
    btn.innerHTML = t === 'dark' ? ICONS.sun : ICONS.moon;
    btn.title = t === 'dark' ? '浅色模式' : '深色模式';
  }
}
function setupTheme() {
  applyTheme(getTheme());
  const btn = document.querySelector('[data-theme-toggle]');
  if (btn) btn.addEventListener('click', () => applyTheme(getTheme() === 'dark' ? 'light' : 'dark'));
}

/* ---------- “已掌握”标记 ---------- */
function getLearned() {
  try { return new Set(JSON.parse(localStorage.getItem(LS.learned) || '[]')); } catch (e) { return new Set(); }
}
function saveLearned(set) {
  try { localStorage.setItem(LS.learned, JSON.stringify([...set])); } catch (e) {}
}
function setupLearnedToggle() {
  const page = document.body.dataset.page || '';
  const chapter = SITE.chapters.find(c => c.id === page);
  const head = document.querySelector('.page-head .container');
  if (!chapter || !head) return;
  const learned = getLearned();
  const btn = document.createElement('button');
  btn.className = 'learn-btn';
  const render = () => {
    const on = getLearned().has(chapter.id);
    btn.classList.toggle('done', on);
    btn.innerHTML = on ? `${ICONS.check} 已掌握` : `标记为已掌握`;
  };
  btn.addEventListener('click', () => {
    const set = getLearned();
    set.has(chapter.id) ? set.delete(chapter.id) : set.add(chapter.id);
    saveLearned(set);
    render();
  });
  render();
  const row = document.createElement('div');
  row.className = 'learn-row';
  row.appendChild(btn);
  head.appendChild(row);
}

/* ---------- 章节题图（注入到 page-head） ---------- */
function renderHeadArt() {
  const page = document.body.dataset.page || '';
  const chapter = SITE.chapters.find(c => c.id === page);
  const head = document.querySelector('.page-head .container');
  if (!chapter || !chapter.art || !head) return;
  head.classList.add('has-art');
  const fig = document.createElement('div');
  fig.className = 'head-art';
  fig.innerHTML = `<img src="${chapter.art}" alt="${chapter.title}篇章题图" loading="lazy" />`;
  head.appendChild(fig);
}

/* ---------- 站内搜索 ---------- */
function buildSearchIndex() {
  const H = window.HCL || {};
  const idx = [];
  SITE.chapters.forEach(c => idx.push({ type: '篇章', title: `${c.num} · ${c.title}`, sub: c.desc, href: c.file, kw: c.tags.join(' ') + ' ' + c.en }));
  (H.utils || []).forEach(u => idx.push({ type: '工具', title: u.title, sub: u.en, href: u.file, kw: u.en }));
  (H.topics || []).forEach(t => idx.push({ type: '小节', title: t.title, sub: '', href: t.page, kw: t.kw }));
  (H.glossary || []).forEach(g => idx.push({ type: '术语', title: g.term, sub: g.def, href: 'glossary.html#term-' + g.id, kw: (g.aliases || []).join(' ') + ' ' + g.cat }));
  (H.ingredients || []).forEach(i => idx.push({ type: '食材', title: i.name, sub: i.note, href: 'ingredients.html#ing-' + i.id, kw: i.type + ' ' + (i.props || []).join(' ') + ' ' + (i.best || []).join(' ') }));
  (H.dishes || []).forEach(d => idx.push({ type: '菜谱', title: d.name, sub: d.summary, href: 'dishes.html#dish-' + d.id, kw: d.taste.map(x => x[0]).join(' ') + ' ' + d.tech.map(x => x[0]).join(' ') }));
  return idx;
}
function setupSearch() {
  const trigger = document.querySelector('[data-search]');
  if (!trigger) return;
  const index = buildSearchIndex();

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-box" role="dialog" aria-label="站内搜索">
      <div class="search-input">
        ${ICONS.search}
        <input type="search" placeholder="搜原理、技法、术语、食材、菜谱…" aria-label="搜索" autocomplete="off" />
        <kbd>Esc</kbd>
      </div>
      <div class="search-results" data-results></div>
      <div class="search-foot"><span>↑↓ 选择 · ↵ 打开 · Esc 关闭</span><span>共 ${index.length} 条</span></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('input');
  const results = overlay.querySelector('[data-results]');
  let active = -1, current = [];

  const typeOrder = { '篇章': 0, '工具': 1, '菜谱': 2, '术语': 3, '食材': 4, '小节': 5 };
  function score(item, q) {
    const t = item.title.toLowerCase(), k = (item.kw || '').toLowerCase(), s = (item.sub || '').toLowerCase();
    if (t.includes(q)) return 3;
    if (k.includes(q)) return 2;
    if (s.includes(q)) return 1;
    return 0;
  }
  function render(q) {
    q = q.trim().toLowerCase();
    if (!q) {
      current = index.filter(i => i.type === '篇章' || i.type === '工具');
    } else {
      current = index.map(i => ({ i, s: score(i, q) })).filter(x => x.s > 0)
        .sort((a, b) => b.s - a.s || typeOrder[a.i.type] - typeOrder[b.i.type]).map(x => x.i).slice(0, 24);
    }
    active = current.length ? 0 : -1;
    if (!current.length) { results.innerHTML = `<div class="search-empty">没有匹配「${q}」的内容，换个词试试～</div>`; return; }
    results.innerHTML = current.map((it, n) => `
      <a class="search-item${n === active ? ' active' : ''}" href="${it.href}" data-n="${n}">
        <span class="st">${it.type}</span>
        <span class="smain"><b>${it.title}</b>${it.sub ? `<small>${it.sub}</small>` : ''}</span>
      </a>`).join('');
  }
  function open() { overlay.classList.add('open'); document.body.style.overflow = 'hidden'; input.value = ''; render(''); setTimeout(() => input.focus(), 30); }
  function close() { overlay.classList.remove('open'); document.body.style.overflow = ''; }
  function move(d) {
    if (!current.length) return;
    active = (active + d + current.length) % current.length;
    [...results.querySelectorAll('.search-item')].forEach((el, n) => el.classList.toggle('active', n === active));
    results.querySelector('.search-item.active')?.scrollIntoView({ block: 'nearest' });
  }

  trigger.addEventListener('click', open);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  input.addEventListener('input', () => render(input.value));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
    else if (e.key === 'Enter') { const a = results.querySelector('.search-item.active'); if (a) location.href = a.getAttribute('href'); }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') return close();
    const tag = (e.target.tagName || '').toLowerCase();
    const typing = tag === 'input' || tag === 'textarea' || e.target.isContentEditable;
    if (!typing && e.key === '/') { e.preventDefault(); open(); }
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
  });
}

/* ---------- 正文术语自动标注 + 悬浮解释 ---------- */
function setupGlossary() {
  const prose = document.querySelector('.prose');
  const H = window.HCL || {};
  if (!prose || !H.glossary) return;

  // 别名 -> 词条，长别名优先匹配
  const entries = [];
  H.glossary.forEach(g => (g.aliases || [g.term]).forEach(a => entries.push({ alias: a, g })));
  entries.sort((a, b) => b.alias.length - a.alias.length);

  const linked = new Set();           // 每个词条全页只标注一次
  const SKIP = new Set(['A', 'BUTTON', 'H1', 'H2', 'H3', 'H4', 'FIGURE', 'CODE', 'SVG', 'TEXT', 'STRONG']);
  function inSkip(node) {
    for (let p = node.parentNode; p && p !== prose; p = p.parentNode) {
      if (p.nodeType === 1 && (SKIP.has(p.tagName) || p.classList.contains('hcl-term'))) return true;
    }
    return false;
  }

  entries.forEach(({ alias, g }) => {
    if (linked.has(g.id)) return;
    const walker = document.createTreeWalker(prose, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (inSkip(node)) continue;
      const i = node.nodeValue.indexOf(alias);
      if (i < 0) continue;
      const after = node.splitText(i);
      after.nodeValue = after.nodeValue.slice(alias.length);
      const a = document.createElement('a');
      a.className = 'hcl-term';
      a.href = 'glossary.html#term-' + g.id;
      a.textContent = alias;
      a.dataset.term = g.id;
      node.parentNode.insertBefore(a, after);
      linked.add(g.id);
      break;
    }
  });

  // 悬浮提示
  const tip = document.createElement('div');
  tip.className = 'hcl-tip';
  document.body.appendChild(tip);
  let hideTimer, currentG = null;
  const byId = Object.fromEntries(H.glossary.map(g => [g.id, g]));
  const goTo = (g) => { if (g) location.href = 'glossary.html#term-' + g.id; };
  tip.addEventListener('click', () => goTo(currentG));
  function show(el) {
    clearTimeout(hideTimer);
    const g = byId[el.dataset.term];
    if (!g) return;
    currentG = g;
    tip.innerHTML = `<b>${g.term}<span class="cat">${g.cat}</span></b><p>${g.def}</p><span class="more">点击查看术语表 →</span>`;
    tip.classList.add('show');
    const r = el.getBoundingClientRect();
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    let left = r.left + r.width / 2 - tw / 2;
    left = Math.max(12, Math.min(left, window.innerWidth - tw - 12));
    let top = r.top - th - 10;
    if (top < 8) top = r.bottom + 10;
    tip.style.left = left + 'px';
    tip.style.top = top + 'px';
  }
  function hide() { hideTimer = setTimeout(() => tip.classList.remove('show'), 120); }
  prose.querySelectorAll('.hcl-term').forEach(el => {
    el.addEventListener('mouseenter', () => show(el));
    el.addEventListener('mouseleave', hide);
    el.addEventListener('focus', () => show(el));
    el.addEventListener('blur', hide);
  });
  tip.addEventListener('mouseenter', () => clearTimeout(hideTimer));
  tip.addEventListener('mouseleave', hide);
}

/* ---------- 首页章节卡 ---------- */
function renderChapterCards(selector) {
  const host = document.querySelector(selector);
  if (!host) return;
  const learned = getLearned();
  host.innerHTML = SITE.chapters.map(c => `
    <a class="card chapter-card reveal" href="${c.file}" style="--accent:${c.accent}">
      <span class="num">${c.num}</span>
      <span class="ic" style="color:${c.accent}">${ICONS[c.id] || ''}</span>
      ${learned.has(c.id) ? `<span class="learned-badge">${ICONS.check} 已掌握</span>` : ''}
      <h3>${c.title}</h3>
      <span class="en">${c.en}</span>
      <p>${c.desc}</p>
      <ul>${c.tags.map(t => `<li>${t}</li>`).join('')}</ul>
      <span class="go">进入学习 ${ICONS.arrow}</span>
    </a>`).join('');
  setupReveal();
}

/* ---------- 参考视频组件（章节页） ---------- */
const VID_ICONS = {
  bili: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M8 3l3 4M16 3l-3 4"/><path d="M9 12v3M15 12v3"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="M10 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/></svg>',
};
function renderVideos() {
  const page = document.body.dataset.page || '';
  const list = (window.HCL && window.HCL.videos && window.HCL.videos[page]) || null;
  if (!list || !list.length) return;
  const article = document.querySelector('article.prose');
  const pager = article && article.querySelector('.pager');
  if (!article) return;

  const sec = document.createElement('section');
  sec.className = 'video-block reveal';
  sec.innerHTML = `
    <div class="video-head">
      <span class="video-ic">${ICONS.play}</span>
      <div>
        <h2 data-toc="参考视频">看完原理，看演示</h2>
        <p>精选检索词，一键跳到 B 站 / YouTube 的搜索结果——长期有效，挑播放量高、讲解清楚的看。</p>
      </div>
    </div>
    <div class="video-grid">
      ${list.map(v => {
        const q = encodeURIComponent(v.t);
        const bili = `https://search.bilibili.com/all?keyword=${q}`;
        const yt = `https://www.youtube.com/results?search_query=${q}`;
        return `<div class="video-card">
          <div class="vc-q">${v.t}</div>
          <p class="vc-note">${v.note}</p>
          <div class="vc-links">
            <a href="${bili}" target="_blank" rel="noopener" class="vc-btn bili">${VID_ICONS.bili} B站</a>
            <a href="${yt}" target="_blank" rel="noopener" class="vc-btn yt">${VID_ICONS.yt} YouTube</a>
          </div>
        </div>`;
      }).join('')}
    </div>`;

  if (pager) article.insertBefore(sec, pager);
  else article.appendChild(sec);
}

document.addEventListener('DOMContentLoaded', () => {
  injectSketchDefs();
  injectHeader();
  setupTheme();
  setupProgress();
  renderHeadArt();
  renderVideos();
  setupTOC();
  setupLearnedToggle();
  setupGlossary();
  setupSearch();
  setupReveal();
  injectFooter();
});
