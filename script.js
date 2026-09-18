/* =====================================================================
   ✏️  여기만 수정하면 됩니다 — 실제 결혼식 정보로 바꿔주세요.
   ===================================================================== */
const CONFIG = {
  groom: { name: "주환철", en: "groom", father: "주길화", mother: "최순이", order: "장남", photo: "images/groom.jpg" },
  bride: { name: "김하정", en: "bride", father: "김형진", mother: "허정화", order: "장녀", photo: "images/bride.jpg" },
  pet: { name: "루이", role: "cat", photo: "images/cat.jpg" },

  // 예식 일시 (24시간제)
  wedding: { year: 2027, month: 1, day: 31, hour: 15, minute: 30 },

  venue: {
    name: "아벤티움 웨딩홀",
    hall: "○층 ○○홀",
    address: "주소 입력 예정",
    mapQuery: "아벤티움 웨딩홀",
    transport: [
      { key: "subway", body: "○○역 ○번 출구 도보 ○분" },
      { key: "bus", body: "○○ 정류장 하차 (○○, ○○번)" },
      { key: "car", body: "내비게이션 '아벤티움' 검색, 주차 ○시간 무료" },
    ],
  },

  // 메인 한 줄 소개
  tagline: "PM과 개발자가 만나\n‘결혼’ 프로젝트를 런칭합니다.",

  // 메인 홀로그램 사진 + 인물 영역 자르기(비율)
  heroImage: "images/main.jpg",
  heroCrop: { x: 0.13, y: 0.19, w: 0.87, h: 0.79 },

  greeting:
    "서로 다른 브랜치에서 각자의 커밋을 쌓아온 두 사람이\n이제 하나의 브랜치로 merge 하려 합니다.\n\n충돌 없이 오래오래 함께 빌드해 나갈 수 있도록\n귀한 걸음으로 리뷰(축복)해 주시면 감사하겠습니다.",

  // git log — 위에서부터 최신순
  timeline: [
    { msg: "feat: 씩씩한 커플", img: ["images/t4-1.jpg", "images/t4-2.jpg"] },
    { msg: "feat: 루이 합류 🐈", img: ["images/cat.jpg"] },
    { msg: "feat: 짤랑이와 식빵맨", img: ["images/t3.jpg"] },
    { msg: "feat: 특별한 날, 특별한 기억", img: ["images/t2.jpg"] },
    { msg: "feat: 기념일 와인 한잔", img: ["images/t1.jpg"] },
  ],

  interview: [
    { q: "신혼여행은 어디로 가나요?", a: "고민 끝에 ○○로 결정했어요. 너무 설레요!" },
    { q: "첫 데이트는 누가 신청했나요?", a: "사실 처음 보자마자 반했어요. 먼저 마음을 표현해줘서 고마웠어요." },
    { q: "서로의 첫인상은 어땠나요?", a: "친구처럼 편안했고, 함께라면 뭐든 즐거울 것 같았어요." },
  ],

  accounts: {
    groom: [
      { key: "GROOM", label: "신랑", bank: "○○은행", number: "000-0000-0000", holder: "주환철" },
      { key: "GROOM_FATHER", label: "신랑 아버지", bank: "○○은행", number: "000-0000-0000", holder: "주길화" },
    ],
    bride: [
      { key: "BRIDE", label: "신부", bank: "○○은행", number: "000-0000-0000", holder: "김하정" },
      { key: "BRIDE_MOTHER", label: "신부 어머니", bank: "○○은행", number: "000-0000-0000", holder: "허정화" },
    ],
  },
};

/* =====================================================================
   아래는 동작 로직
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const W = CONFIG.wedding;
const WEDDING_AT = new Date(W.year, W.month - 1, W.day, W.hour, W.minute);
const DOW = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const pad = (n) => String(n).padStart(2, "0");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
// 문자열 → 7자리 커밋 해시
function hash(str) {
  let h = 0x811c9dc5;
  for (const ch of str) h = Math.imul(h ^ ch.codePointAt(0), 16777619) >>> 0;
  return (h.toString(16) + "0000000").slice(0, 7);
}
function toast(msg) {
  const t = $("#toast");
  t.textContent = msg;
  t.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove("show"), 1600);
}
async function copyText(text) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = Object.assign(document.createElement("textarea"), { value: text });
    document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHeroMeta();
  renderGreeting();
  renderProfiles();
  renderCalendar();
  startCountdown();
  renderGraph();
  renderInterview();
  renderVenue();
  renderAccounts();
  initGuestbook();
  renderFooter();
  initLightbox();
  initReveal();
  buildHologram().then(runBoot);
});

/* ---------- 부팅 시퀀스 ---------- */
async function runBoot() {
  const boot = $("#boot");
  const lines = [
    { cmd: "git clone git@github.com:love/our-wedding.git" },
    { out: "Cloning into 'our-wedding'...\nReceiving objects: 100% (2/2), <span class=\"ok\">done.</span>" },
    { cmd: "./hologram --render couple.jpg --spin" },
    { out: "[<span class=\"ok\">##########</span>] 100%  projecting..." },
  ];
  let skip = REDUCED;
  const doSkip = () => (skip = true);
  $("#hero").addEventListener("click", doSkip, { once: true });

  let html = "";
  for (const l of lines) {
    if (l.cmd) {
      const pre = html + '<span class="ps">$</span><span class="cmdline">';
      for (let i = 1; i <= l.cmd.length; i++) {
        if (skip) break;
        boot.innerHTML = pre + esc(l.cmd.slice(0, i)) + '</span><span class="cursor"></span>';
        await sleep(28 + Math.random() * 40);
      }
      html = pre + esc(l.cmd) + "</span>\n";
    } else {
      html += l.out + "\n";
    }
    boot.innerHTML = html + '<span class="cursor"></span>';
    if (!skip) await sleep(l.cmd ? 250 : 380);
  }
  $("#holo").classList.add("on");
  await sleep(skip ? 0 : 500);
  $("#hero-meta").classList.add("on");
}

/* ---------- 홀로그램: 사진을 캔버스로 녹색 홀로그램화 ---------- */
function buildHologram() {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const c = CONFIG.heroCrop;
      const sx = img.naturalWidth * c.x, sy = img.naturalHeight * c.y;
      const sw = img.naturalWidth * c.w, sh = img.naturalHeight * c.h;
      const w = 440, h = Math.round((w * sh) / sw);
      const cv = document.createElement("canvas");
      cv.width = w; cv.height = h;
      const ctx = cv.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
      const d = ctx.getImageData(0, 0, w, h);
      const px = d.data;

      // 밝기
      const L = new Float32Array(w * h);
      for (let i = 0; i < w * h; i++) L[i] = (px[i * 4] * 0.299 + px[i * 4 + 1] * 0.587 + px[i * 4 + 2] * 0.114) / 255;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          // 소벨 엣지
          let e = 0;
          if (x > 0 && y > 0 && x < w - 1 && y < h - 1) {
            const gx = -L[i - w - 1] - 2 * L[i - 1] - L[i + w - 1] + L[i - w + 1] + 2 * L[i + 1] + L[i + w + 1];
            const gy = -L[i - w - 1] - 2 * L[i - w] - L[i - w + 1] + L[i + w - 1] + 2 * L[i + w] + L[i + w + 1];
            e = Math.min(1, Math.max(0, (Math.hypot(gx, gy) - 0.09) * 3.2));
          }
          const dark = Math.min(1, Math.max(0, (0.8 - L[i]) / 0.55));
          // 가장자리로 갈수록 투명하게 (사각형 테두리 제거)
          const fx = Math.min(x, w - 1 - x) / (w * 0.08), fy = Math.min(y, h - 1 - y) / (h * 0.05);
          const fade = Math.min(1, fx, fy);
          let a = Math.max(dark * 0.9, e) * fade;
          if (y % 3 === 0) a *= 0.45;            // 가로 스캔라인
          a *= 0.85 + Math.random() * 0.15;       // 노이즈
          const o = i * 4;
          px[o] = 70 + 185 * e;                   // 엣지는 하얗게
          px[o + 1] = 255;
          px[o + 2] = 170 + 85 * e;
          px[o + 3] = a * 255;
        }
      }
      ctx.putImageData(d, 0, 0);
      const url = cv.toDataURL("image/png");

      const spin = $("#holo-spin");
      [-10, -5, 0, 5, 10].forEach((z) => {
        const el = document.createElement("div");
        el.className = "holo__layer" + (z ? " ghost" : "");
        el.style.backgroundImage = `url(${url})`;
        el.style.transform = `translateZ(${z}px)`;
        spin.appendChild(el);
      });
      resolve();
    };
    img.onerror = resolve;
    img.src = CONFIG.heroImage;
  });
}

function renderHeroMeta() {
  const g = CONFIG.groom, b = CONFIG.bride;
  $("#hero-names").innerHTML = `${esc(g.name)}<span class="heart">&lt;3</span>${esc(b.name)}`;
  $("#hero-tagline").textContent = CONFIG.tagline;
  $("#hero-when").textContent = `${W.year}.${pad(W.month)}.${pad(W.day)} ${DOW[WEDDING_AT.getDay()]} ${pad(W.hour)}:${pad(W.minute)}`;
  $("#hero-venue").textContent = `@ ${CONFIG.venue.name}`;
  $("#scroll-hint").addEventListener("click", (e) => {
    e.stopPropagation();
    $("#readme").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------- README ---------- */
function renderGreeting() {
  $("#greeting-body").textContent = CONFIG.greeting;
  const row = (p, color) => `
    <div class="row">
      <span class="who">${esc(p.father)} · ${esc(p.mother)}의 ${esc(p.order)}</span>
      <span class="me">${esc(p.name)}</span>
      <span class="tag" style="color:var(${color})">${p.en}</span>
    </div>`;
  $("#parents").innerHTML = row(CONFIG.groom, "--blue") + row(CONFIG.bride, "--purple");
}

/* ---------- contributors/*.json ---------- */
function renderProfiles() {
  const json = (obj) => {
    const body = Object.entries(obj).map(([k, v]) => {
      const val = typeof v === "number" ? `<span class="n">${v}</span>` : `<span class="s">"${esc(v)}"</span>`;
      return `  <span class="k">"${k}"</span><span class="p">:</span> ${val}`;
    }).join('<span class="p">,</span>\n');
    return `<span class="p">{</span>\n${body}\n<span class="p">}</span>`;
  };
  const g = CONFIG.groom, b = CONFIG.bride, p = CONFIG.pet;
  const card = (file, photo, obj) => `
    <div class="card">
      <div class="card__head">📄 ${file}</div>
      <div class="card__inner">
        <img class="avatar" src="${photo}" alt="" data-zoom />
        <pre class="json">${json(obj)}</pre>
      </div>
    </div>`;
  $("#profiles").innerHTML =
    card("groom.json", g.photo, { name: g.name, role: "groom", parents: `${g.father} · ${g.mother}` }) +
    card("bride.json", b.photo, { name: b.name, role: "bride", parents: `${b.father} · ${b.mother}` }) +
    card("louis.json", p.photo, { name: p.name, role: p.role, lives: 9 });
}

/* ---------- cal ---------- */
function renderCalendar() {
  const first = new Date(W.year, W.month - 1, 1).getDay();
  const days = new Date(W.year, W.month, 0).getDate();
  const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let out = `<span class="title">${MONTHS[W.month - 1]} ${W.year}</span>\n<span class="wk"><span class="sun">Su</span> Mo Tu We Th Fr <span class="sat">Sa</span></span>\n`;
  let col = 0;
  out += "   ".repeat(first);
  col = first;
  for (let d = 1; d <= days; d++) {
    let s = String(d).padStart(2, " ");
    if (d === W.day) s = `<span class="day-d">${s}</span>`;
    else if (col === 0) s = `<span class="sun">${s}</span>`;
    else if (col === 6) s = `<span class="sat">${s}</span>`;
    out += s;
    col++;
    if (col === 7) { out += "\n"; col = 0; } else out += " ";
  }
  $("#cal").innerHTML = out.replace(/ +$/, "");
}

function startCountdown() {
  const el = $("#countdown");
  const tick = () => {
    const diff = WEDDING_AT - new Date();
    if (diff <= 0) {
      el.innerHTML = `v1.0.0 released <small>— 결혼했습니다 🎉</small>`;
      return;
    }
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    el.innerHTML = `D-${d} <small>${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}</small>`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- git log --graph ---------- */
function renderGraph() {
  const g = CONFIG.groom, b = CONFIG.bride;
  const dateStr = `${W.year}-${pad(W.month)}-${pad(W.day)} ${pad(W.hour)}:${pad(W.minute)}`;
  const rows = [
    {
      lane: 0, l0: "bot", release: true,
      refs: `<span class="head">HEAD -&gt; main</span>, <span class="tag">tag: v1.0.0</span>`,
      msg: "release: 저희 결혼합니다 💍",
      date: `${dateStr} · ${CONFIG.venue.name}`,
    },
    ...CONFIG.timeline.map((t) => ({ lane: 0, l0: "both", msg: t.msg, img: t.img })),
    {
      lane: 0, l0: "both", merge: true,
      msg: `Merge branch '${b.en}' into ${g.en}`,
      date: "우리의 시작",
    },
    { lane: 1, l0: "both", l1: "top", refs: `<span class="br2">${b.en}</span>`, msg: `Initial commit: ${b.name}` },
    { lane: 0, l0: "top", refs: `<span class="br">${g.en}</span>`, msg: `Initial commit: ${g.name}` },
  ];

  const X0 = 9, X1 = 26, DOT_Y = 11;
  const rail = (r) => {
    const col = (x, color, from, to) => `<line x1="${x}" x2="${x}" y1="${from}" y2="${to}" stroke="${color}" stroke-width="2"/>`;
    let s = "";
    const c0 = "var(--green)", c1 = "var(--purple)";
    if (r.l0 === "both") s += col(X0, c0, 0, "100%");
    if (r.l0 === "bot") s += col(X0, c0, DOT_Y, "100%");
    if (r.l0 === "top") s += col(X0, c0, 0, DOT_Y);
    if (r.l1 === "top") s += col(X1, c1, 0, DOT_Y);
    if (r.merge) {
      s += `<path d="M${X0} ${DOT_Y} C ${X0} ${DOT_Y + 16}, ${X1} ${DOT_Y + 10}, ${X1} ${DOT_Y + 28}" fill="none" stroke="${c1}" stroke-width="2"/>`;
      s += col(X1, c1, DOT_Y + 28, "100%");
    }
    const cx = r.lane ? X1 : X0;
    const color = r.lane ? c1 : c0;
    s += r.release
      ? `<circle cx="${cx}" cy="${DOT_Y}" r="6" fill="var(--bg)" stroke="var(--green-hi)" stroke-width="2.5"/><circle cx="${cx}" cy="${DOT_Y}" r="2.5" fill="var(--green-hi)"/>`
      : `<circle cx="${cx}" cy="${DOT_Y}" r="4.5" fill="${color}" stroke="var(--bg)" stroke-width="2"/>`;
    return `<svg aria-hidden="true">${s}</svg>`;
  };

  $("#graph").innerHTML = rows.map((r) => {
    const imgs = r.img ? `<div class="commit__photos">${r.img.map((src) => `<img src="${src}" alt="" loading="lazy" data-zoom />`).join("")}</div>` : "";
    return `
      <li class="commit${r.release ? " commit--release" : ""}">
        <div class="commit__rail">${rail(r)}</div>
        <div class="commit__body">
          <div class="commit__line"><span class="hash">${hash(r.msg)}</span>${r.refs ? ` <span class="ref">(${r.refs})</span>` : ""}</div>
          <div class="commit__msg">${esc(r.msg)}</div>
          ${r.date ? `<div class="commit__date">${esc(r.date)}</div>` : ""}
          ${imgs}
        </div>
      </li>`;
  }).join("");
}

/* ---------- gh issue list ---------- */
function renderInterview() {
  $("#interview").innerHTML = CONFIG.interview.map((it, i) => `
    <details class="issue"${i === 0 ? " open" : ""}>
      <summary>
        <span class="issue__icon">✓</span>
        <span>
          <span class="issue__title">${esc(it.q)}</span><br/>
          <span class="issue__meta">#${i + 1} closed by ${CONFIG.groom.en} &amp; ${CONFIG.bride.en}</span>
        </span>
      </summary>
      <div class="issue__reply"><div class="who">💬 reply</div>${esc(it.a)}</div>
    </details>`).join("");
}

/* ---------- venue.yml ---------- */
function renderVenue() {
  const v = CONFIG.venue;
  const k = (s) => `<span class="k">${s}</span>:`;
  const s = (t) => `<span class="s">"${esc(t)}"</span>`;
  let y = `<span class="c"># 오시는 길</span>\n`;
  y += `${k("venue")} ${s(v.name)}\n${k("hall")} ${s(v.hall)}\n${k("address")} ${s(v.address)}\n`;
  y += `${k("when")} ${s(`${W.year}-${pad(W.month)}-${pad(W.day)} ${pad(W.hour)}:${pad(W.minute)}`)}\n${k("transport")}\n`;
  y += v.transport.map((t) => `  ${k(t.key)} ${s(t.body)}`).join("\n");
  $("#venue-yml").innerHTML = y;

  const q = encodeURIComponent(v.mapQuery);
  $("#map-frame").src = `https://www.google.com/maps?q=${q}&output=embed`;
  $("#map-buttons").innerHTML = `
    <a class="btn" href="https://map.naver.com/v5/search/${q}" target="_blank" rel="noopener">naver</a>
    <a class="btn" href="https://map.kakao.com/?q=${q}" target="_blank" rel="noopener">kakao</a>
    <a class="btn" href="https://www.google.com/maps/search/${q}" target="_blank" rel="noopener">google</a>`;
}

/* ---------- .env ---------- */
function renderAccounts() {
  const group = (title, list) => `
    <details class="env">
      <summary><span><span class="c-dim"># </span>${title}</span></summary>
      ${list.map((a) => `
        <div class="env__row">
          <div class="kv">
            <span class="k">${a.key}</span>=<span class="v">${esc(a.bank)} ${esc(a.number)}</span><br/>
            <span class="h">${esc(a.label)} · ${esc(a.holder)}</span>
          </div>
          <button class="copy" type="button" data-copy="${esc(`${a.bank} ${a.number}`)}">copy</button>
        </div>`).join("")}
    </details>`;
  $("#accounts").innerHTML = group("신랑측", CONFIG.accounts.groom) + group("신부측", CONFIG.accounts.bride);
  $$("#accounts .copy").forEach((btn) => btn.addEventListener("click", async () => {
    await copyText(btn.dataset.copy);
    toast("✓ copied to clipboard");
  }));
}

/* ---------- 방명록 (이 기기 localStorage) ---------- */
const GB_KEY = "wedding2_guestbook";
function loadGb() {
  try { return JSON.parse(localStorage.getItem(GB_KEY)) || []; } catch { return []; }
}
function saveGb(list) {
  try { localStorage.setItem(GB_KEY, JSON.stringify(list)); } catch {}
}
function initGuestbook() {
  const render = () => {
    const list = loadGb();
    $("#gb-list").innerHTML = list.length
      ? list.map((it, i) => `
        <div class="gb-item">
          <span class="hash">commit ${hash(it.name + it.msg + it.at)}</span>
          <button class="del" type="button" data-i="${i}">revert</button><br/>
          <span class="dim">Author: ${esc(it.name)} · ${new Date(it.at).toLocaleString("ko-KR")}</span>
          <p class="msg">${esc(it.msg)}</p>
        </div>`).join("")
      : `<p class="comment">nothing to show — 첫 커밋을 남겨주세요.</p>`;
    $$("#gb-list .del").forEach((b) => b.addEventListener("click", () => {
      const l = loadGb(); l.splice(+b.dataset.i, 1); saveGb(l); render();
    }));
  };
  $("#gb-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#gb-name").value.trim(), msg = $("#gb-msg").value.trim();
    if (!name || !msg) return;
    const l = loadGb();
    l.unshift({ name, msg, at: Date.now() });
    saveGb(l);
    e.target.reset();
    render();
    toast("✓ 1 file changed, 1 insertion(+)");
  });
  render();
}

/* ---------- footer ---------- */
function renderFooter() {
  $("#push-log").innerHTML =
    `Enumerating objects: 2, done.\nWriting objects: 100% (2/2), <span class="ok">done.</span>\n` +
    `To github.com:love/our-wedding.git\n   <span class="c-orange">groom + bride</span> -&gt; <span class="ok">forever</span>\n\n` +
    `<span class="c-green">Thank you for being part of our history.</span>`;
  $("#footer-names").innerHTML = `<b>${esc(CONFIG.groom.name)}</b> &amp; <b>${esc(CONFIG.bride.name)}</b>`;
  $("#share-btn").addEventListener("click", async () => {
    const data = { title: document.title, url: location.href };
    if (navigator.share) { try { await navigator.share(data); } catch {} return; }
    await copyText(location.href);
    toast("✓ 링크가 복사되었습니다");
  });
}

/* ---------- 사진 확대 ---------- */
function initLightbox() {
  const lb = $("#lightbox");
  document.addEventListener("click", (e) => {
    const img = e.target.closest("[data-zoom]");
    if (!img) return;
    $("#lightbox-img").src = img.src;
    lb.hidden = false;
  });
  lb.addEventListener("click", () => (lb.hidden = true));
}

/* ---------- 스크롤 시 명령어 타이핑 ---------- */
function initReveal() {
  const prompt = `<span class="ps">~/our-wedding</span><span class="branch">(main)</span> <span class="c-green">$</span> `;
  $$(".cmd").forEach((h) => (h.innerHTML = prompt));
  const typeCmd = async (block) => {
    const h = block.querySelector(".cmd");
    const cmd = h.dataset.cmd;
    if (!REDUCED) {
      for (let i = 1; i <= cmd.length; i++) {
        h.innerHTML = prompt + esc(cmd.slice(0, i)) + '<span class="cursor"></span>';
        await sleep(22);
      }
      await sleep(120);
    }
    h.innerHTML = prompt + esc(cmd);
    block.classList.add("typed");
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      io.unobserve(en.target);
      typeCmd(en.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => io.observe(el));
}
