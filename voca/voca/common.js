/* PIF 단어장·단어시험 공통 설정
 * - API: 새 학원관리 서버 Edge Function 'voca' (단어 읽기 · 결과 저장, 10-24부터 — 옛 Apps Script와 주고받는 모양 같음)
 *   단어·숙제 코드·결과는 새 앱 '학습실 관리 → 단어장'에서 봄·고침
 * - BOOKS: 단어장 키별 학교 이름과 표시 문구 (Code.gs QUIZZES의 키와 같아야 함)
 *   새 학교·범위를 추가할 때 여기에 한 줄, Code.gs QUIZZES에 한 줄을 추가하면 됩니다.
 * - group이 같은 단어장끼리는 QR 하나로 묶여, 시작 화면에서 탭으로 고릅니다. (tab = 탭에 보이는 이름)
 */
var PIF = {
  API: 'https://ndivspksctjatkkvakja.supabase.co/functions/v1/voca',
  // 옛 주소 (되돌리려면 위 줄을 지우고 아래 줄 맨 앞 // 를 지우기 — 옛 Apps Script·시트는 그대로 보관):
  // API: 'https://script.google.com/macros/s/AKfycbzLXSUQe7We0xLqI4QrCQc_q0FTB-Qy0KpedNLGDeM5IMFiyowBRnhae1uhX9yK_ho/exec',
  BOOKS: {
    seocho1:      { school: '서초고', label: '서초고1 · 2학기 기말고사 대비' },
    sangmun1:     { school: '상문고', label: '상문고1 · 2학기 기말고사 대비', group: 'sangmun1', tab: '기말고사 범위' },
    sangmun1voca: { school: '상문고', label: '상문고1 · 어휘끝', group: 'sangmun1', tab: '어휘끝' },
    seoullight:   { school: '서울고', label: '서울고1 · 2학기 기말고사 대비' },
    seoul2:       { school: '서울고', label: '서울고2 · 2학기 기말고사 대비' }
  },
  param: function (n) {
    var m = new RegExp('[?&]' + n + '=([^&#]*)').exec(location.search);
    return m ? decodeURIComponent(m[1].replace(/\+/g, ' ')) : '';
  },
  qs: function (o) {
    return Object.keys(o).filter(function (k) { return o[k] !== '' && o[k] != null; })
      .map(function (k) { return k + '=' + encodeURIComponent(o[k]); }).join('&');
  },
  get: function (params) {
    return fetch(PIF.API + '?' + PIF.qs(params), { redirect: 'follow' })
      .then(function (r) { if (!r.ok) throw new Error('서버 응답 ' + r.status); return r.json(); })
      .then(function (d) { if (d && d.error) throw new Error(d.error); return d; });
  },
  // 결과 저장: 기존 doPost가 받습니다. text/plain으로 보내야 브라우저 사전 확인(CORS) 없이 전송됩니다.
  post: function (obj) {
    return fetch(PIF.API, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(obj) })
      .then(function (r) { return r.text(); })
      .then(function (t) { if (!/Success/.test(t)) throw new Error(t || '저장 응답 없음'); return t; });
  },
  esc: function (s) {
    return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
};
