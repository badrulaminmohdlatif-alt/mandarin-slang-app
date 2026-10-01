// Logik kuiz tulen (tiada DOM) supaya boleh diuji dengan Node.
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Quiz = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  var XP_PER_CORRECT = 10;
  var COMBO_BONUS = 5;
  var COMBO_THRESHOLD = 3;
  var MAX_HEARTS = 5;

  function shuffle(arr, rand) {
    rand = rand || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rand() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // Jenis soalan:
  //  my2zh  - slang Melayu diberi, pilih Mandarin
  //  zh2my  - Mandarin diberi, pilih slang Melayu
  //  listen - dengar sebutan Mandarin, pilih slang Melayu
  function makeQuestion(item, pool, type, rand) {
    var key = type === 'my2zh' ? 'zh' : 'my';
    var seen = {};
    seen[item[key]] = true;
    var distractors = [];
    shuffle(pool, rand).forEach(function (other) {
      if (distractors.length < 3 && !seen[other[key]]) {
        seen[other[key]] = true;
        distractors.push(other);
      }
    });
    return {
      type: type,
      item: item,
      options: shuffle([item].concat(distractors), rand).map(function (o) {
        return { text: o[key], sub: key === 'zh' ? o.py : '', correct: o === item };
      })
    };
  }

  function buildQuestions(items, pool, opts) {
    opts = opts || {};
    var rand = opts.rand || Math.random;
    var count = Math.min(opts.count || items.length, items.length);
    var types = opts.types || ['my2zh', 'zh2my'];
    return shuffle(items, rand).slice(0, count).map(function (item, i) {
      return makeQuestion(item, pool, types[i % types.length], rand);
    });
  }

  function newSession(questions) {
    return {
      queue: questions.slice(),
      total: questions.length,
      done: 0,
      hearts: MAX_HEARTS,
      xp: 0,
      combo: 0,
      bestCombo: 0,
      correct: 0,
      answered: 0,
      mistakes: []
    };
  }

  // Kemas kini sesi selepas jawapan. Soalan salah diulang di hujung (gaya Duolingo).
  function answer(s, isCorrect) {
    var q = s.queue.shift();
    s.answered++;
    var gained = 0;
    if (isCorrect) {
      s.correct++;
      s.done++;
      s.combo++;
      s.bestCombo = Math.max(s.bestCombo, s.combo);
      gained = XP_PER_CORRECT + (s.combo >= COMBO_THRESHOLD ? COMBO_BONUS : 0);
      s.xp += gained;
    } else {
      s.combo = 0;
      s.hearts--;
      if (s.mistakes.indexOf(q.item) === -1) s.mistakes.push(q.item);
      s.queue.push(q);
    }
    return { gained: gained, finished: s.queue.length === 0, gameOver: s.hearts <= 0 };
  }

  function accuracy(s) {
    return s.answered ? Math.round((s.correct / s.answered) * 100) : 0;
  }

  return {
    MAX_HEARTS: MAX_HEARTS,
    XP_PER_CORRECT: XP_PER_CORRECT,
    COMBO_BONUS: COMBO_BONUS,
    COMBO_THRESHOLD: COMBO_THRESHOLD,
    shuffle: shuffle,
    makeQuestion: makeQuestion,
    buildQuestions: buildQuestions,
    newSession: newSession,
    answer: answer,
    accuracy: accuracy
  };
});
