const test = require('node:test');
const assert = require('node:assert');
const LESSONS = require('../js/data.js');
const Quiz = require('../js/quiz.js');

const ALL = LESSONS.flatMap((l) => l.items);

test('data: setiap slang ada my, zh, py dan note', () => {
  for (const it of ALL) {
    for (const k of ['my', 'zh', 'py', 'note']) assert.ok(it[k], `${it.my} tiada ${k}`);
  }
});

test('data: tiada slang Melayu atau Mandarin berulang', () => {
  assert.strictEqual(new Set(ALL.map((i) => i.my)).size, ALL.length);
  assert.strictEqual(new Set(ALL.map((i) => i.zh)).size, ALL.length);
});

test('soalan: 4 pilihan unik dan tepat satu jawapan betul', () => {
  for (const type of ['my2zh', 'zh2my', 'listen']) {
    for (const item of ALL) {
      const q = Quiz.makeQuestion(item, ALL, type);
      assert.strictEqual(q.options.length, 4);
      assert.strictEqual(new Set(q.options.map((o) => o.text)).size, 4);
      assert.strictEqual(q.options.filter((o) => o.correct).length, 1);
      const right = q.options.find((o) => o.correct).text;
      assert.strictEqual(right, type === 'my2zh' ? item.zh : item.my);
    }
  }
});

test('buildQuestions: hormati bilangan soalan', () => {
  assert.strictEqual(Quiz.buildQuestions(ALL, ALL, { count: 10 }).length, 10);
  assert.strictEqual(Quiz.buildQuestions(LESSONS[0].items, ALL).length, LESSONS[0].items.length);
});

test('sesi: XP, combo bonus dan soalan salah diulang', () => {
  const qs = Quiz.buildQuestions(ALL, ALL, { count: 4 });
  const s = Quiz.newSession(qs);
  Quiz.answer(s, true); // 10
  Quiz.answer(s, true); // 10
  const r = Quiz.answer(s, true); // 10 + 5 bonus combo
  assert.strictEqual(r.gained, Quiz.XP_PER_CORRECT + Quiz.COMBO_BONUS);
  assert.strictEqual(s.xp, 35);

  Quiz.answer(s, false);
  assert.strictEqual(s.hearts, Quiz.MAX_HEARTS - 1);
  assert.strictEqual(s.combo, 0);
  assert.strictEqual(s.queue.length, 1, 'soalan salah masuk semula ke barisan');
  assert.strictEqual(s.mistakes.length, 1);

  const end = Quiz.answer(s, true);
  assert.ok(end.finished);
  assert.strictEqual(Quiz.accuracy(s), 80);
});

test('sesi: tamat apabila nyawa habis', () => {
  const s = Quiz.newSession(Quiz.buildQuestions(ALL, ALL, { count: 3 }));
  let r;
  for (let i = 0; i < Quiz.MAX_HEARTS; i++) r = Quiz.answer(s, false);
  assert.ok(r.gameOver);
});
