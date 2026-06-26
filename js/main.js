/* ===== ECNU 中国当代史 - Main Application ===== */

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  renderCategories();
  renderStats();
  renderPeriodCards();
  renderFeatured();
  setupSearch();
  setupNavigation();
});

// ====== TIMELINE ======
function renderTimeline() {
  const container = document.getElementById('timeline-links');
  const periods = [
    { id:'1949-1952', label:'1949-1952 新政权建立与巩固' },
    { id:'1953-1956', label:'1953-1956 社会主义改造' },
    { id:'1956-1957', label:'1956-1957 双百方针与反右' },
    { id:'1958-1961', label:'1958-1961 大跃进' },
    { id:'1961-1965', label:'1961-1965 调整与社教运动' },
    { id:'1966-1969', label:'1966-1969 文革高潮' },
    { id:'1969-1976', label:'1969-1976 文革后期' },
    { id:'1976-1982', label:'1976-1982 改革开放初期' },
  ];
  container.innerHTML = periods.map(p =>
    `<a class="timeline-link" data-period="${p.id}" onclick="filterByPeriod('${p.id}')">${p.label}</a>`
  ).join('');
}

// ====== CATEGORIES ======
function renderCategories() {
  const container = document.getElementById('category-links');
  const cats = [
    { key:'events', label:'📜 政治事件', count: countByCategory('events') },
    { key:'documents', label:'📄 重要文件', count: countByCategory('documents') },
    { key:'meetings', label:'🏛️ 重要会议', count: countByCategory('meetings') },
    { key:'figures', label:'👤 重要人物', count: countByCategory('figures') },
    { key:'terms', label:'📖 名词解释', count: countByCategory('terms') },
    { key:'movements', label:'🔥 重要运动', count: countByCategory('movements') },
  ];
  container.innerHTML = cats.map(c =>
    `<a class="category-link" onclick="filterByCategory('${c.key}')">${c.label} <small>(${c.count})</small></a>`
  ).join('');
}

function countByCategory(cat) {
  return ALL_ENTRIES.filter(e => e.category === cat).length;
}

// ====== STATS ======
function renderStats() {
  ['events','documents','meetings','figures','terms','movements'].forEach(cat => {
    const el = document.getElementById(`stat-${cat}`);
    if (el) {
      const count = countByCategory(cat);
      el.querySelector('.num').textContent = count;
      el.onclick = () => filterByCategory(cat);
    }
  });
}

// ====== PERIOD CARDS ======
function renderPeriodCards() {
  const container = document.getElementById('period-cards');
  const periods = [
    { id:'1949-1952', title:'新政权建立与巩固', dates:'1949-1952',
      desc:'建国、土地改革、抗美援朝、镇压反革命、"三反""五反"运动、知识分子的思想改造。中共从革命党转型为执政党，建立全国性政权体系。' },
    { id:'1953-1956', title:'社会主义改造', dates:'1953-1956',
      desc:'过渡时期总路线、第一个五年计划、农业合作化高潮、资本主义工商业改造、手工业合作化。中国急速从新民主主义转向苏联模式的社会主义。' },
    { id:'1956-1957', title:'双百方针与反右运动', dates:'1956-1957',
      desc:'苏共二十大冲击、毛泽东《论十大关系》、中共八大、"百花齐放、百家争鸣"的短暂春天、反右运动的毁灭性打击。知识分子的希望与悲剧。' },
    { id:'1958-1961', title:'大跃进与大饥荒', dates:'1958-1961',
      desc:'三面红旗（总路线、大跃进、人民公社）、全民大炼钢铁、浮夸风、公共食堂、庐山会议彭德怀事件、人类历史上最严重的饥荒之一。' },
    { id:'1961-1965', title:'调整恢复与社教运动', dates:'1961-1965',
      desc:'八字方针、七千人大会、包产到户试验、八届十中全会"千万不要忘记阶级斗争"、社会主义教育运动（四清）、毛泽东与刘少奇分歧公开化。' },
    { id:'1966-1976', title:'文化大革命', dates:'1966-1976',
      desc:'五一六通知、红卫兵运动、一月风暴全面夺权、林彪事件、批林批孔、邓小平1975年整顿、四五天安门事件、毛泽东逝世与四人帮覆灭。' },
    { id:'1976-1982', title:'改革开放的启动', dates:'1976-1982',
      desc:'真理标准讨论、十一届三中全会、农村家庭联产承包责任制、经济特区设立、中美建交、对越自卫反击战、废除干部终身制、十二大与新党章。' },
  ];
  container.innerHTML = periods.map(p => `
    <div class="period-card" onclick="filterByPeriod('${p.id}')">
      <h3>${p.title}</h3>
      <div class="dates">${p.dates}</div>
      <p>${p.desc}</p>
    </div>
  `).join('');
}

// ====== FEATURED ======
function renderFeatured() {
  const container = document.getElementById('featured-entries');
  const featured = ALL_ENTRIES.filter(e => e.featured).slice(0, 12);
  container.innerHTML = '<h3 style="margin:32px 0 16px">📌 核心条目</h3>' +
    featured.map(e => renderEntryCard(e)).join('');
}

function renderEntryCard(entry) {
  const catLabels = { events:'政治事件', documents:'重要文件', meetings:'重要会议', figures:'重要人物', terms:'名词解释', movements:'重要运动' };
  return `
    <div class="entry-card" onclick="showDetail('${entry.id}')">
      <h4>${entry.title}</h4>
      <div class="meta">
        <span class="tag">${catLabels[entry.category] || entry.category}</span>
        ${entry.date} ${entry.period ? '· '+entry.period : ''}
      </div>
      <div class="summary">${entry.summary}</div>
    </div>
  `;
}

// ====== DETAIL VIEW ======
function showDetail(id) {
  const entry = ALL_ENTRIES.find(e => e.id === id);
  if (!entry) return;

  document.getElementById('home-view').style.display = 'none';
  document.getElementById('list-view').style.display = 'none';
  const detailView = document.getElementById('detail-view');
  detailView.style.display = 'block';

  const catLabels = { events:'政治事件', documents:'重要文件', meetings:'重要会议', figures:'重要人物', terms:'名词解释', movements:'重要运动' };

  let html = `
    <div class="detail-header">
      <h2>${entry.title}</h2>
      <div class="meta-line">📅 ${entry.date} | 📂 ${catLabels[entry.category] || entry.category} | 🕐 ${entry.period || '1949-1982'}</div>
      <div class="tags">${(entry.tags || []).map(t => `<span>${t}</span>`).join('')}</div>
    </div>
    <div class="detail-body">
      <h3>概述</h3>
      <p>${entry.summary}</p>
  `;

  if (entry.background) {
    html += `<h3>背景与前因</h3>`;
    entry.background.forEach(p => html += `<p>${p}</p>`);
  }

  if (entry.content) {
    html += `<h3>详细内容</h3>`;
    entry.content.forEach(p => html += `<p>${p}</p>`);
  }

  if (entry.consequences) {
    html += `<h3>后果与影响</h3>`;
    entry.consequences.forEach(p => html += `<p>${p}</p>`);
  }

  if (entry.analysis) {
    html += `<div class="highlight"><strong>💡 学术分析（剑桥中国史/迈斯纳）：</strong><br>${entry.analysis}</div>`;
  }

  // Related entries
  if (entry.related && entry.related.length > 0) {
    html += `<div class="related"><h3>🔗 相关条目</h3>`;
    entry.related.forEach(rid => {
      const rel = ALL_ENTRIES.find(e => e.id === rid);
      if (rel) html += `<a onclick="showDetail('${rid}')">${rel.title}</a>`;
    });
    html += `</div>`;
  }

  html += `</div>`;
  detailView.innerHTML = `<button id="back-btn" onclick="goHome()">← 返回</button>` + html;
  window.scrollTo(0, 0);
}

// ====== LIST VIEW (by category or period) ======
function showListView(title, entries) {
  document.getElementById('home-view').style.display = 'none';
  document.getElementById('detail-view').style.display = 'none';
  const listView = document.getElementById('list-view');
  listView.style.display = 'block';
  document.getElementById('list-title').textContent = title + ` (${entries.length}条)`;
  document.getElementById('list-content').innerHTML = entries.map(e => renderEntryCard(e)).join('');
  window.scrollTo(0, 0);
}

function filterByCategory(cat) {
  const catLabels = { events:'政治事件', documents:'重要文件', meetings:'重要会议', figures:'重要人物', terms:'名词解释', movements:'重要运动' };
  const entries = ALL_ENTRIES.filter(e => e.category === cat).sort((a,b) => a.date.localeCompare(b.date));
  showListView(catLabels[cat] || cat, entries);
}

function filterByPeriod(periodId) {
  const entries = ALL_ENTRIES.filter(e => e.period === periodId).sort((a,b) => a.date.localeCompare(b.date));
  showListView('时期：' + periodId, entries);
}

function goHome() {
  document.getElementById('home-view').style.display = 'block';
  document.getElementById('detail-view').style.display = 'none';
  document.getElementById('list-view').style.display = 'none';
}

// ====== SEARCH ======
function setupSearch() {
  const input = document.getElementById('search-input');
  let timeout;
  input.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => performSearch(input.value), 200);
  });
}

function performSearch(query) {
  if (!query || query.length < 1) return;
  const q = query.toLowerCase();
  const results = ALL_ENTRIES.filter(e =>
    e.title.toLowerCase().includes(q) ||
    e.summary.toLowerCase().includes(q) ||
    (e.tags || []).some(t => t.toLowerCase().includes(q)) ||
    e.date.includes(q)
  ).slice(0, 30);

  if (results.length > 0) {
    showListView('🔍 搜索：' + query, results);
  }
}

// ====== NAVIGATION ======
function setupNavigation() {
  document.getElementById('list-back-btn').addEventListener('click', goHome);
}
