/* =====================================================================
   ✏️  여기만 수정하면 됩니다 — 실제 결혼식 정보로 바꿔주세요.
   ===================================================================== */
const CONFIG = {
  groom: {
    name: "주환철", father: "주길화", mother: "최순이", order: "장남",
    job: "개발자", intro: "아이디어를 코드로 현실로 만드는 사람", photo: "images/groom.jpg",
  },
  bride: {
    name: "김하정", father: "김형진", mother: "허정화", order: "장녀",
    job: "PM", intro: "사람과 일을 이어 방향을 잡아주는 사람", photo: "images/bride.jpg",
  },
  pet: { name: "루이", job: "고양이", intro: "팀의 분위기 담당 막내", photo: "images/cat.jpg" },

  // 예식 일시 (24시간제)
  wedding: { year: 2027, month: 1, day: 31, hour: 15, minute: 30 },

  venue: {
    name: "아벤티움 웨딩홀",
    hall: "○층 ○○홀",
    address: "주소 입력 예정",
    mapQuery: "아벤티움 웨딩홀",
    transport: [
      { head: "지하철", body: "○○역 ○번 출구 도보 ○분" },
      { head: "버스", body: "○○ 정류장 하차 (○○, ○○번)" },
      { head: "자가용", body: "내비게이션에 '아벤티움' 검색\n주차 ○시간 무료" },
    ],
  },

  // 메인 한 줄 소개
  tagline: "PM과 개발자가 만나\n‘결혼’ 프로젝트를 런칭합니다.",

  // 메인 홀로그램 사진 + 인물 영역 자르기(비율)
  heroImage: "images/main.jpg",
  heroCrop: { x: 0.13, y: 0.19, w: 0.87, h: 0.79 },

  greeting:
    "계획을 세우는 사람과\n그 계획을 만들어 내는 사람이 만나\n서로의 빈 곳을 채워주며 여기까지 왔습니다.\n\n서로의 다름을 인정하고 배려하며,\n살아가며 생기는 이슈들은\n따뜻한 소통으로 즉시 핫픽스해 나가겠습니다.\n\n저희의 성공적인 프로젝트 런칭을\n함께 축하해 주시면 감사하겠습니다.",

  // 프로젝트 히스토리 — 오래된 순 (위에서 아래로)
  timeline: [
    { msg: "기념일 와인 한잔", img: ["images/t1.jpg"] },
    { msg: "특별한 날, 특별한 기억", img: ["images/t2.jpg"] },
    { msg: "짤랑이와 식빵맨", img: ["images/t3.jpg"] },
    { msg: "루이가 가족이 되었어요 🐈", img: ["images/cat.jpg"] },
    { msg: "씩씩한 커플", img: ["images/t4-1.jpg", "images/t4-2.jpg"] },
  ],

  interview: [
    { q: "신혼여행은 어디로 가나요?", a: "고민 끝에 ○○로 결정했어요. 너무 설레요!" },
    { q: "첫 데이트는 누가 신청했나요?", a: "사실 처음 보자마자 반했어요. 먼저 마음을 표현해줘서 고마웠어요." },
    { q: "서로의 첫인상은 어땠나요?", a: "친구처럼 편안했고, 함께라면 뭐든 즐거울 것 같았어요." },
  ],

  accounts: {
    groom: [
      { label: "신랑", bank: "○○은행", number: "000-0000-0000", holder: "주환철" },
      { label: "신랑 아버지", bank: "○○은행", number: "000-0000-0000", holder: "주길화" },
    ],
    bride: [
      { label: "신부", bank: "○○은행", number: "000-0000-0000", holder: "김하정" },
      { label: "신부 어머니", bank: "○○은행", number: "000-0000-0000", holder: "허정화" },
    ],
  },

  thanks: "바쁘신 중에도 저희의 시작을 함께해 주셔서 감사합니다.\n오래오래 서로 아끼며 예쁘게 살겠습니다.",
};

/* =====================================================================
   아래는 동작 로직
   ===================================================================== */
const $ = (s) => document.querySelector(s);
const $$ = (s) => document.querySelectorAll(s);
const W = CONFIG.wedding;
const WEDDING_AT = new Date(W.year, W.month - 1, W.day, W.hour, W.minute);
const DOW_KO = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n) => String(n).padStart(2, "0");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

function esc(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function koTime(h, m) {
  const ap = h < 12 ? "오전" : "오후";
  const hh = h % 12 || 12;
  return `${ap} ${hh}시${m ? ` ${m}분` : ""}`;
}
const DATE_KO = `${W.year}년 ${W.month}월 ${W.day}일 ${DOW_KO[WEDDING_AT.getDay()]}요일 ${koTime(W.hour, W.minute)}`;

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
    { cmd: "npm run wedding" },
    { out: "&gt; 두 사람의 이야기를 불러오는 중... <span class=\"ok\">완료</span>" },
    { cmd: "./hologram --start" },
    { out: "[<span class=\"ok\">##########</span>] 100%  <span class=\"ok\">LAUNCH!</span>" },
  ];
  let skip = REDUCED;
  $("#hero").addEventListener("click", () => (skip = true), { once: true });

  let html = "";
  for (const l of lines) {
    if (l.cmd) {
      const pre = html + '<span class="ps">$</span><span class="cmdline">';
      for (let i = 1; i <= l.cmd.length; i++) {
        if (skip) break;
        boot.innerHTML = pre + esc(l.cmd.slice(0, i)) + '</span><span class="cursor"></span>';
        await sleep(12 + Math.random() * 12);
      }
      html = pre + esc(l.cmd) + "</span>\n";
    } else {
      html += l.out + "\n";
    }
    boot.innerHTML = html + '<span class="cursor"></span>';
    if (!skip) await sleep(l.cmd ? 90 : 160);
  }
  $("#holo").classList.add("on");
  await sleep(skip ? 0 : 250);
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
  $("#hero-names").innerHTML = `${esc(g.name)}<span class="heart">♥</span>${esc(b.name)}`;
  $("#hero-tagline").textContent = CONFIG.tagline;
  $("#hero-when").textContent = DATE_KO;
  $("#hero-venue").textContent = CONFIG.venue.name;
  $("#scroll-hint").addEventListener("click", (e) => {
    e.stopPropagation();
    $("#invite").scrollIntoView({ behavior: "smooth" });
  });
}

/* ---------- 초대합니다 ---------- */
function renderGreeting() {
  $("#greeting-body").textContent = CONFIG.greeting;
  const row = (p, role) => `
    <div class="row">
      <span class="who">${esc(p.father)} · ${esc(p.mother)}의 ${esc(p.order)}</span>
      <span class="me"><span class="role">${role}</span>${esc(p.name)}</span>
    </div>`;
  $("#parents").innerHTML = row(CONFIG.groom, "신랑") + row(CONFIG.bride, "신부");
}

/* ---------- 프로젝트 팀 소개 ---------- */
function renderProfiles() {
  const g = CONFIG.groom, b = CONFIG.bride, p = CONFIG.pet;
  const card = (who, person, color) => `
    <div class="card" style="--accent:var(${color})">
      <img class="avatar" src="${person.photo}" alt="${esc(person.name)}" data-zoom />
      <div class="card__info">
        <p class="card__badge">${who} · ${esc(person.job)}</p>
        <p class="card__name">${esc(person.name)}</p>
        <p class="card__intro">${esc(person.intro)}</p>
      </div>
    </div>`;
  $("#profiles").innerHTML =
    card("신랑", g, "--blue") + card("신부", b, "--pink") + card("막내", p, "--orange");
}

/* ---------- 달력 ---------- */
function renderCalendar() {
  $("#date-text").textContent = DATE_KO;
  const first = new Date(W.year, W.month - 1, 1).getDay();
  const days = new Date(W.year, W.month, 0).getDate();
  const cls = (col) => (col === 0 ? "sun" : col === 6 ? "sat" : "");
  let cells = DOW_KO.map((d, i) => `<span class="wk ${cls(i)}">${d}</span>`).join("");
  cells += "<span></span>".repeat(first);
  for (let d = 1; d <= days; d++) {
    const col = (first + d - 1) % 7;
    cells += `<span class="${d === W.day ? "day-d" : cls(col)}">${d}</span>`;
  }
  $("#cal").innerHTML = `<p class="title">${W.year}년 ${W.month}월</p><div class="cal__grid">${cells}</div>`;
}

function startCountdown() {
  const el = $("#countdown");
  const tick = () => {
    const diff = WEDDING_AT - new Date();
    if (diff <= 0) {
      el.innerHTML = `런칭 완료! <small>결혼했습니다 🎉</small>`;
      return;
    }
    const s = Math.floor(diff / 1000);
    const d = Math.floor(s / 86400);
    el.innerHTML = `D-${d} <small>${pad(Math.floor((s % 86400) / 3600))}시간 ${pad(Math.floor((s % 3600) / 60))}분 ${pad(s % 60)}초</small>`;
  };
  tick();
  setInterval(tick, 1000);
}

/* ---------- 프로젝트 히스토리 (git 그래프 모양) ---------- */
function renderGraph() {
  const g = CONFIG.groom, b = CONFIG.bride;
  // 위에서 아래로: 각자의 시작 → 만남 → 함께한 시간(오래된 순) → 결혼식
  const rows = [
    { lane: 0, l0: "bot", badge: `<span class="b-groom">신랑 · ${esc(g.job)}</span>`, msg: `${g.name}의 이야기` },
    { lane: 1, l0: "both", l1: "bot", badge: `<span class="b-bride">신부 · ${esc(b.job)}</span>`, msg: `${b.name}의 이야기` },
    { lane: 0, l0: "both", merge: true, badge: `<span class="b-merge">만남</span>`, msg: "두 사람의 길이 하나로 합쳐졌어요" },
    ...CONFIG.timeline.map((t) => ({ lane: 0, l0: "both", msg: t.msg, img: t.img })),
    {
      lane: 0, l0: "top", release: true,
      badge: `<span class="b-release">💍 결혼식</span>`,
      msg: "저희 결혼합니다",
      date: `${DATE_KO} · ${CONFIG.venue.name}`,
    },
  ];

  const X0 = 9, X1 = 26, MERGE_GAP = 26;
  const dotY = (r) => (r.merge ? 11 + MERGE_GAP : 11);
  const rail = (r) => {
    const col = (x, color, from, to) => `<line x1="${x}" x2="${x}" y1="${from}" y2="${to}" stroke="${color}" stroke-width="2"/>`;
    let s = "";
    const c0 = "var(--green)", c1 = "var(--pink)";
    const DOT_Y = dotY(r);
    if (r.l0 === "both") s += col(X0, c0, 0, "100%");
    if (r.l0 === "bot") s += col(X0, c0, DOT_Y, "100%");
    if (r.l0 === "top") s += col(X0, c0, 0, DOT_Y);
    if (r.l1 === "bot") s += col(X1, c1, DOT_Y, "100%");
    if (r.merge) {
      // 신부 선이 신랑 선으로 합쳐지는 곡선
      s += `<path d="M${X1} 0 C ${X1} ${DOT_Y * 0.6}, ${X0} ${DOT_Y * 0.4}, ${X0} ${DOT_Y}" fill="none" stroke="${c1}" stroke-width="2"/>`;
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
        <div class="commit__body"${r.merge ? ` style="padding-top:${MERGE_GAP}px"` : ""}>
          ${r.badge ? `<div class="commit__badge">${r.badge}</div>` : ""}
          <div class="commit__msg">${esc(r.msg)}</div>
          ${r.date ? `<div class="commit__date">${esc(r.date)}</div>` : ""}
          ${imgs}
        </div>
      </li>`;
  }).join("");
}

/* ---------- 자주 묻는 질문 ---------- */
function renderInterview() {
  $("#interview").innerHTML = CONFIG.interview.map((it, i) => `
    <details class="issue"${i === 0 ? " open" : ""}>
      <summary>
        <span class="issue__icon">Q</span>
        <span class="issue__title">${esc(it.q)}</span>
      </summary>
      <div class="issue__reply"><span class="issue__a">A</span>${esc(it.a)}</div>
    </details>`).join("");
}

/* ---------- 오시는 길 ---------- */
function renderVenue() {
  const v = CONFIG.venue;
  $("#venue").innerHTML = `
    <p class="venue__name">${esc(v.name)} <span>${esc(v.hall)}</span></p>
    <p class="venue__addr">${esc(v.address)}</p>
    <button class="copy" type="button" id="addr-copy">주소 복사</button>`;
  $("#addr-copy").addEventListener("click", async () => {
    await copyText(v.address);
    toast("✓ 주소가 복사되었습니다");
  });

  const q = encodeURIComponent(v.mapQuery);
  $("#map-frame").src = `https://www.google.com/maps?q=${q}&output=embed`;
  $("#map-buttons").innerHTML = `
    <a class="btn" href="https://map.naver.com/v5/search/${q}" target="_blank" rel="noopener">네이버 지도</a>
    <a class="btn" href="https://map.kakao.com/?q=${q}" target="_blank" rel="noopener">카카오맵</a>
    <a class="btn" href="https://www.google.com/maps/search/${q}" target="_blank" rel="noopener">구글 지도</a>`;
  $("#transport").innerHTML = v.transport.map((t) => `<dt>${esc(t.head)}</dt><dd>${esc(t.body)}</dd>`).join("");
}

/* ---------- 마음 전하실 곳 ---------- */
function renderAccounts() {
  const group = (title, list) => `
    <details class="env">
      <summary>${title}</summary>
      ${list.map((a) => `
        <div class="env__row">
          <div class="kv">
            <span class="h">${esc(a.label)} · ${esc(a.holder)}</span><br/>
            <span class="v">${esc(a.bank)} ${esc(a.number)}</span>
          </div>
          <button class="copy" type="button" data-copy="${esc(`${a.bank} ${a.number}`)}">복사</button>
        </div>`).join("")}
    </details>`;
  $("#accounts").innerHTML = group("신랑측 계좌번호", CONFIG.accounts.groom) + group("신부측 계좌번호", CONFIG.accounts.bride);
  $$("#accounts .copy").forEach((btn) => btn.addEventListener("click", async () => {
    await copyText(btn.dataset.copy);
    toast("✓ 계좌번호가 복사되었습니다");
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
    $("#gb-list").innerHTML = list.map((it, i) => `
        <div class="gb-item">
          <span class="gb-name">${esc(it.name)}</span>
          <span class="dim">${new Date(it.at).toLocaleDateString("ko-KR")}</span>
          <button class="del" type="button" data-i="${i}">삭제</button>
          <p class="msg">${esc(it.msg)}</p>
        </div>`).join("");
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
    toast("✓ 축하 메시지가 등록되었습니다");
  });
  render();
}

/* ---------- 마무리 ---------- */
function renderFooter() {
  $("#thanks").textContent = CONFIG.thanks;
  $("#footer-names").innerHTML = `<b>${esc(CONFIG.groom.name)}</b> ♥ <b>${esc(CONFIG.bride.name)}</b>`;
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

/* ---------- 스크롤 시 명령어 타이핑 (장식) ---------- */
function initReveal() {
  const prompt = `<span class="c-green">$</span> `;
  $$(".cmd").forEach((h) => (h.innerHTML = prompt));
  const typeCmd = async (block) => {
    const h = block.querySelector(".cmd");
    const cmd = h.dataset.cmd;
    if (!REDUCED) {
      for (let i = 1; i <= cmd.length; i++) {
        h.innerHTML = prompt + esc(cmd.slice(0, i)) + '<span class="cursor"></span>';
        await sleep(22);
      }
      await sleep(100);
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
