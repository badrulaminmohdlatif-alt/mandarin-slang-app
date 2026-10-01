// Antara muka (UI): mengurus skrin, butang dan simpanan kemajuan.
(function () {
  var LESSONS = window.SLANG_DATA;
  var ALL_ITEMS = LESSONS.reduce(function (acc, l) { return acc.concat(l.items); }, []);
  var CAN_SPEAK = 'speechSynthesis' in window;
  var STORE_KEY = 'slanglingo-v1';

  var $ = function (id) { return document.getElementById(id); };

  // ---------- Simpanan (localStorage) ----------
  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) { return {}; }
  }
  function saveProgress(p) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(p)); } catch (e) { /* abaikan */ }
  }
  function dayKey(d) {
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
  }
  function currentStreak(p) {
    var today = dayKey(new Date());
    var yest = dayKey(new Date(Date.now() - 864e5));
    return (p.lastDay === today || p.lastDay === yest) ? (p.streak || 0) : 0;
  }
  function recordFinish(lessonId, xp) {
    var p = loadProgress();
    var today = dayKey(new Date());
    var yest = dayKey(new Date(Date.now() - 864e5));
    if (p.lastDay !== today) p.streak = p.lastDay === yest ? (p.streak || 0) + 1 : 1;
    p.lastDay = today;
    p.totalXp = (p.totalXp || 0) + xp;
    p.best = p.best || {};
    p.best[lessonId] = Math.max(p.best[lessonId] || 0, xp);
    saveProgress(p);
  }

  // ---------- Bunyi ringkas (Web Audio) ----------
  var audioCtx;
  function beep(freqs) {
    try {
      audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
      freqs.forEach(function (f, i) {
        var o = audioCtx.createOscillator(), g = audioCtx.createGain();
        var t = audioCtx.currentTime + i * 0.1;
        o.frequency.value = f;
        o.type = 'sine';
        g.gain.setValueAtTime(0.15, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
        o.connect(g).connect(audioCtx.destination);
        o.start(t); o.stop(t + 0.25);
      });
    } catch (e) { /* bunyi tidak wajib */ }
  }
  function speak(text) {
    if (!CAN_SPEAK) return;
    speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = 0.85;
    speechSynthesis.speak(u);
  }

  // ---------- Navigasi skrin ----------
  function show(id) {
    document.querySelectorAll('.screen').forEach(function (s) { s.classList.toggle('active', s.id === id); });
    window.scrollTo(0, 0);
  }

  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  // ---------- Skrin utama ----------
  function renderHome() {
    var p = loadProgress();
    $('streak').textContent = currentStreak(p);
    $('total-xp').textContent = p.totalXp || 0;
    var box = $('lessons');
    box.innerHTML = '';
    LESSONS.forEach(function (lesson) {
      var b = el('button', 'lesson');
      var icon = el('div', 'lesson-icon', lesson.icon);
      icon.style.background = lesson.color;
      var info = el('div');
      info.appendChild(el('div', 'lesson-title', lesson.title));
      info.appendChild(el('div', 'lesson-meta', lesson.items.length + ' slang'));
      b.appendChild(icon);
      b.appendChild(info);
      var best = p.best && p.best[lesson.id];
      if (best) b.appendChild(el('div', 'lesson-best', '⭐ ' + best + ' XP'));
      b.addEventListener('click', function () { startLesson(lesson.id, lesson.items, lesson.items.length); });
      box.appendChild(b);
    });
    show('home');
  }

  // ---------- Kuiz ----------
  var session, current, selected, phase, lastLesson;

  function startLesson(id, items, count) {
    lastLesson = { id: id, items: items, count: count };
    var types = CAN_SPEAK ? ['my2zh', 'zh2my', 'my2zh', 'listen'] : ['my2zh', 'zh2my'];
    session = Quiz.newSession(Quiz.buildQuestions(items, ALL_ITEMS, { count: count, types: types }));
    $('hearts').textContent = session.hearts;
    $('combo').classList.add('hidden');
    show('quiz');
    nextQuestion();
  }

  function nextQuestion() {
    current = session.queue[0];
    selected = null;
    phase = 'answer';
    $('progress-fill').style.width = (session.done / session.total * 100) + '%';
    $('footer').className = 'footer';
    $('btn-check').textContent = 'SEMAK';
    $('btn-check').disabled = true;

    var item = current.item, prompt = $('q-prompt');
    prompt.innerHTML = '';
    prompt.className = 'bubble';
    if (current.type === 'my2zh') {
      $('q-instruction').textContent = 'Apakah maksud slang ini dalam Mandarin?';
      prompt.textContent = item.my;
    } else if (current.type === 'zh2my') {
      $('q-instruction').textContent = 'Pilih slang Melayu yang sama maksud';
      prompt.classList.add('big-zh');
      var zh = el('span', 'zh', item.zh);
      var sp = el('button', 'speak-inline', '🔊');
      sp.setAttribute('aria-label', 'Dengar sebutan');
      sp.addEventListener('click', function () { speak(item.zh); });
      zh.appendChild(sp);
      prompt.appendChild(zh);
      prompt.appendChild(el('span', 'py', item.py));
    } else {
      $('q-instruction').textContent = 'Dengar dan pilih maksudnya';
      prompt.classList.add('listen');
      var btn = el('button', 'speak-btn', '🔊 Main semula');
      btn.addEventListener('click', function () { speak(item.zh); });
      prompt.appendChild(btn);
      setTimeout(function () { speak(item.zh); }, 250);
    }

    var box = $('options');
    box.innerHTML = '';
    current.options.forEach(function (opt, i) {
      var b = el('button', 'option' + (opt.sub ? ' zh' : ''));
      b.appendChild(el('span', 'key', String(i + 1)));
      b.appendChild(el('span', 'opt-main', opt.text));
      if (opt.sub) b.appendChild(el('span', 'opt-sub', opt.sub));
      b.addEventListener('click', function () { choose(i); });
      box.appendChild(b);
    });
  }

  function choose(i) {
    if (phase !== 'answer') return;
    selected = i;
    var opt = current.options[i];
    if (opt.sub) speak(opt.text);
    document.querySelectorAll('.option').forEach(function (b, j) { b.classList.toggle('selected', j === i); });
    $('btn-check').disabled = false;
  }

  function check() {
    if (selected == null) return;
    var isCorrect = current.options[selected].correct;
    var item = current.item;
    var res = Quiz.answer(session, isCorrect);
    phase = 'feedback';

    document.querySelectorAll('.option').forEach(function (b, j) {
      b.disabled = true;
      b.classList.remove('selected');
      if (current.options[j].correct) b.classList.add('right');
      else if (j === selected) b.classList.add('wrong');
    });

    var footer = $('footer');
    footer.className = 'footer ' + (isCorrect ? 'correct' : 'incorrect');
    var praise = ['Hebat!', 'Betul!', 'Mantap!', 'Power!', '太棒了！'];
    $('fb-title').textContent = isCorrect
      ? '✅ ' + praise[Math.floor(Math.random() * praise.length)] + '  +' + res.gained + ' XP'
      : '❌ Jawapan betul:';
    $('fb-detail').textContent = item.my + ' = ' + item.zh + ' (' + item.py + ') — ' + item.note;
    $('btn-check').textContent = 'TERUSKAN';
    $('btn-check').disabled = false;
    $('hearts').textContent = session.hearts;
    $('progress-fill').style.width = (session.done / session.total * 100) + '%';

    var combo = $('combo');
    if (isCorrect) {
      beep([660, 880]);
      if (session.combo >= Quiz.COMBO_THRESHOLD) {
        combo.textContent = '🔥 ' + session.combo + ' betul berturut-turut! Bonus +' + Quiz.COMBO_BONUS + ' XP';
        combo.classList.remove('hidden');
      }
    } else {
      beep([300, 200]);
      combo.classList.add('hidden');
      var h = document.querySelector('.hearts');
      h.classList.remove('shake'); void h.offsetWidth; h.classList.add('shake');
    }

    if (res.gameOver || res.finished) phase = res.gameOver ? 'gameover' : 'finished';
  }

  function onFooterButton() {
    if (phase === 'answer') check();
    else if (phase === 'feedback') nextQuestion();
    else if (phase === 'finished' || phase === 'gameover') showResult(phase === 'gameover');
  }

  // ---------- Keputusan ----------
  function showResult(gameOver) {
    if (!gameOver) recordFinish(lastLesson.id, session.xp);
    $('r-emoji').textContent = gameOver ? '💔' : (Quiz.accuracy(session) === 100 ? '🏆' : '🎉');
    $('r-title').textContent = gameOver ? 'Nyawa habis! Cuba lagi?' : 'Pelajaran tamat!';
    $('r-title').style.color = gameOver ? 'var(--red)' : '';
    $('r-xp').textContent = session.xp;
    $('r-acc').textContent = Quiz.accuracy(session) + '%';
    $('r-combo').textContent = session.bestCombo;

    var review = $('r-review');
    review.innerHTML = '';
    if (session.mistakes.length) {
      review.appendChild(el('h3', null, '📝 Ulang kaji slang yang salah'));
      session.mistakes.forEach(function (it) {
        var row = el('div', 'review-item');
        row.appendChild(el('span', null, it.my));
        var zh = el('span', 'r-zh zh', it.zh);
        zh.appendChild(el('small', null, it.py));
        row.appendChild(zh);
        review.appendChild(row);
      });
    }
    if (!gameOver) beep([523, 659, 784, 1047]);
    show('result');
  }

  // ---------- Pendengar acara ----------
  $('btn-check').addEventListener('click', onFooterButton);
  $('btn-quit').addEventListener('click', function () {
    if (confirm('Keluar dari pelajaran? Kemajuan sesi ini akan hilang.')) renderHome();
  });
  $('btn-random').addEventListener('click', function () { startLesson('rawak', ALL_ITEMS, 10); });
  $('btn-home').addEventListener('click', renderHome);
  $('btn-retry').addEventListener('click', function () {
    startLesson(lastLesson.id, lastLesson.items, lastLesson.count);
  });
  document.addEventListener('keydown', function (e) {
    if (!$('quiz').classList.contains('active')) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= 4) choose(n - 1);
    else if (e.key === 'Enter' && !$('btn-check').disabled) { e.preventDefault(); onFooterButton(); }
  });

  renderHome();
})();
