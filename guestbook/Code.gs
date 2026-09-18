/**
 * 청첩장 축하 메시지(방명록) API — Google Apps Script
 *
 * 설치: 구글 시트 → 확장 프로그램 → Apps Script → 이 코드를 붙여넣고
 *       배포 → 새 배포 → 유형 "웹 앱", 실행 사용자 "나", 액세스 "모든 사용자"
 *       → 나온 웹 앱 URL을 script.js 의 CONFIG.guestbookApi 에 넣기
 *
 * 관리(삭제): 시트에서 해당 줄을 지우거나 "숨김" 체크박스를 켜면 청첩장에서 사라집니다.
 * 하객은 글 작성 시 정한 비밀번호로 자기 글만 삭제할 수 있습니다.
 *
 * 관리자 강제 삭제 비밀번호: 코드에 적지 말고
 *   Apps Script 왼쪽 ⚙️ 프로젝트 설정 → 스크립트 속성 → 속성 "ADMIN_PASSWORD" 에 값 입력.
 *   청첩장에서 아무 글의 "삭제"에 이 비밀번호를 넣으면 지워집니다.
 */
const SHEET_NAME = "메시지";
const HEADERS = ["id", "작성시간", "이름", "메시지", "비밀번호(암호화)", "숨김"];
const MAX_NAME = 20, MAX_MSG = 200, MIN_PW = 4;

function doGet() {
  const sh = sheet_();
  const n = sh.getLastRow() - 1;
  if (n <= 0) return json_({ ok: true, items: [] });
  const items = sh.getRange(2, 1, n, HEADERS.length).getValues()
    .filter((r) => r[0] && r[2] && r[3] && r[5] !== true)
    .map((r) => ({ id: String(r[0]), at: new Date(r[1]).getTime(), name: String(r[2]), msg: String(r[3]) }))
    .sort((a, b) => b.at - a.at);
  return json_({ ok: true, items });
}

function doPost(e) {
  let data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: "bad_request" }); }
  if (data.website) return json_({ ok: true }); // 봇 방지용 숨은 칸이 채워져 있으면 무시
  return data.action === "delete" ? remove_(data) : add_(data);
}

function add_(data) {
  const name = String(data.name || "").trim().slice(0, MAX_NAME);
  const msg = String(data.msg || "").trim().slice(0, MAX_MSG);
  const pw = String(data.pw || "");
  if (!name || !msg) return json_({ ok: false, error: "empty" });
  if (pw.length < MIN_PW) return json_({ ok: false, error: "pw_short" });

  // 같은 내용 반복 등록 / 짧은 시간 대량 등록 막기
  const cache = CacheService.getScriptCache();
  const dupKey = "dup_" + hash_(name + "|" + msg).slice(0, 40);
  if (cache.get(dupKey)) return json_({ ok: false, error: "duplicate" });
  const burst = Number(cache.get("burst") || 0);
  if (burst >= 30) return json_({ ok: false, error: "busy" });

  const id = Utilities.getUuid();
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([id, new Date(), safe_(name), safe_(msg), hash_(id + pw), false]);
  } finally {
    lock.releaseLock();
  }
  cache.put(dupKey, "1", 600);
  cache.put("burst", String(burst + 1), 60);
  return json_({ ok: true, id });
}

function remove_(data) {
  const id = String(data.id || ""), pw = String(data.pw || "");
  // 비밀번호 무작위 대입 막기: 10분에 틀린 시도 20회 넘으면 잠시 차단
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get("del_fails") || 0);
  const admin = PropertiesService.getScriptProperties().getProperty("ADMIN_PASSWORD");
  const isAdmin = !!admin && admin.length >= 6 && pw === admin;
  if (!isAdmin && fails >= 20) return json_({ ok: false, error: "busy" });
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sh = sheet_();
    const n = sh.getLastRow() - 1;
    if (n <= 0) return json_({ ok: false, error: "not_found" });
    const ids = sh.getRange(2, 1, n, 1).getValues();
    for (let i = 0; i < n; i++) {
      if (String(ids[i][0]) !== id) continue;
      const row = i + 2;
      if (!isAdmin && sh.getRange(row, 5).getValue() !== hash_(id + pw)) {
        cache.put("del_fails", String(fails + 1), 600);
        return json_({ ok: false, error: "wrong_pw" });
      }
      sh.deleteRow(row);
      return json_({ ok: true });
    }
    return json_({ ok: false, error: "not_found" });
  } finally {
    lock.releaseLock();
  }
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
    sh.getRange(2, 6, sh.getMaxRows() - 1, 1).insertCheckboxes();
    sh.hideColumns(1);
    sh.hideColumns(5);
  }
  return sh;
}

function hash_(s) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8)
    .map((b) => ((b + 256) % 256).toString(16).padStart(2, "0")).join("");
}

// 시트 수식으로 해석되는 것 방지 (=, +, -, @ 로 시작하는 글)
function safe_(s) {
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
