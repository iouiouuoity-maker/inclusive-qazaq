(() => {
  const html = document.documentElement;

  // ---------- Settings (font/motion/audio) ----------
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const getFs = () => parseInt(getComputedStyle(html).getPropertyValue("--fs"), 10) || 18;

  function restore() {
    const savedFs = localStorage.getItem("fs");
    if (savedFs) html.style.setProperty("--fs", clamp(parseInt(savedFs,10), 16, 24) + "px");

    const motion = localStorage.getItem("motion") ?? "on";
    html.dataset.motion = motion;

    const audio = localStorage.getItem("audio") ?? "on";
    html.dataset.audio = audio;
  }

  function bindToolbar() {
    document.querySelectorAll("[data-font]").forEach(btn => {
      btn.addEventListener("click", () => {
        const next = btn.dataset.font === "plus" ? getFs()+1 : getFs()-1;
        const v = clamp(next, 16, 24);
        html.style.setProperty("--fs", v + "px");
        localStorage.setItem("fs", String(v));
      });
    });

    const m = document.getElementById("toggleMotion");
    const a = document.getElementById("toggleAudio");

    function paint() {
      if (m) {
        const on = html.dataset.motion === "on";
        m.textContent = `Анимация: ${on ? "ON" : "OFF"}`;
        m.setAttribute("aria-pressed", on ? "true" : "false");
      }
      if (a) {
        const on = html.dataset.audio === "on";
        a.textContent = `Дыбыс: ${on ? "ON" : "OFF"}`;
        a.setAttribute("aria-pressed", on ? "true" : "false");
      }
    }

    m?.addEventListener("click", () => {
      html.dataset.motion = (html.dataset.motion === "on") ? "off" : "on";
      localStorage.setItem("motion", html.dataset.motion);
      paint();
    });

    a?.addEventListener("click", () => {
      html.dataset.audio = (html.dataset.audio === "on") ? "off" : "on";
      localStorage.setItem("audio", html.dataset.audio);
      paint();
    });

    paint();
  }

  // Simple TTS
  window.say = function (text, lang = "kk-KZ") {
    if (html.dataset.audio !== "on") return;
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = 0.92; // баяулау — ЕБҚ үшін ыңғайлы
    window.speechSynthesis.speak(u);
  };

  restore();
  bindToolbar();

  // ---------- Built-in Comics (SVG inline) ----------
  // NOTE: SVG-лер жеңіл, “жылы” түстер, қарапайым кейіпкерлер.
  // Кадр ауыстыру + жеңіл pulse = “анимацияланған комикс” (стресссіз).
  const SVG = {
    bubble: (text) => `
      <g>
        <rect x="680" y="120" width="420" height="95" rx="18" fill="#121826" stroke="rgba(255,255,255,.16)" stroke-width="3"/>
        <text x="705" y="178" fill="#eef6ff" font-size="28" font-family="Arial">${text}</text>
      </g>
    `,
    kid: (x, y, shirt="#7bdff2") => `
      <g>
        <circle cx="${x}" cy="${y}" r="36" fill="#f4d7c7"/>
        <rect x="${x-24}" y="${y+30}" width="48" height="120" rx="16" fill="${shirt}" opacity="0.28" stroke="${shirt}"/>
        <rect x="${x-52}" y="${y+92}" width="70" height="16" rx="8" fill="#b9c7dd" opacity="0.45"/>
        <rect x="${x-10}" y="${y+92}" width="70" height="16" rx="8" fill="#b9c7dd" opacity="0.45"/>
      </g>
    `,
    teacher: (x, y) => `
      <g>
        <circle cx="${x}" cy="${y}" r="36" fill="#f4d7c7"/>
        <rect x="${x-24}" y="${y+30}" width="48" height="140" rx="16" fill="#b9c7dd" opacity="0.35" stroke="#b9c7dd"/>
        <rect x="${x-70}" y="${y+95}" width="80" height="14" rx="7" fill="#f4d7c7" opacity="0.9"/>
      </g>
    `,
    base: (title, subtitle) => `
      <defs>
        <linearGradient id="bg" x1="0" x2="1">
          <stop offset="0" stop-color="#14213d"/>
          <stop offset="1" stop-color="#0b132b"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="700" fill="url(#bg)"/>
      <rect x="70" y="70" width="1060" height="560" rx="28" fill="#0f1b33" opacity="0.92" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
      <text x="110" y="150" fill="#eef6ff" font-size="44" font-family="Arial" font-weight="700">${title}</text>
      <text x="110" y="210" fill="#b9c7dd" font-size="32" font-family="Arial">${subtitle}</text>
      <circle cx="1020" cy="560" r="90" fill="rgba(123,223,242,.12)"/>
      <circle cx="920" cy="590" r="55" fill="rgba(255,214,165,.10)"/>
    `
  };

  const COMICS = [
    {
      id: "school-road",
      title: "Мектепке жол",
      frames: [
        { text:"Дос үйден шықты.", svg: ( ) => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Мектепке жол — 1", "Дос үйден шықты.")}
            <rect x="160" y="340" width="240" height="180" fill="#1e2c4f" stroke="rgba(255,255,255,.16)" stroke-width="4"/>
            <polygon points="160,340 280,260 400,340" fill="#0d3b66"/>
            <rect x="255" y="420" width="50" height="100" fill="rgba(0,0,0,.35)"/>
            ${SVG.kid(610, 370)}
            ${SVG.bubble("Сәлем! Мен шығамын.")}
          </svg>`},
        { text:"Ол жолдан өтті.", svg: ( ) => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Мектепке жол — 2", "Ол жолдан өтті.")}
            <polygon points="220,580 520,280 680,280 980,580" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.12)" stroke-width="4"/>
            <line x1="600" y1="580" x2="600" y2="280" stroke="rgba(255,255,255,.22)" stroke-width="8" stroke-dasharray="18 18"/>
            <rect x="330" y="520" width="520" height="16" fill="rgba(255,255,255,.10)"/>
            <rect x="330" y="490" width="520" height="16" fill="rgba(255,255,255,.10)"/>
            <rect x="330" y="460" width="520" height="16" fill="rgba(255,255,255,.10)"/>
            ${SVG.kid(420, 360)}
          </svg>`},
        { text:"Ол мектепке келді.", svg: ( ) => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Мектепке жол — 3", "Ол мектепке келді.")}
            <rect x="220" y="300" width="540" height="270" fill="#1e2c4f" stroke="rgba(255,255,255,.16)" stroke-width="4"/>
            <rect x="440" y="410" width="100" height="160" fill="rgba(0,0,0,.35)"/>
            <rect x="260" y="340" width="120" height="80" fill="rgba(13,59,102,.55)"/>
            <rect x="600" y="340" width="120" height="80" fill="rgba(13,59,102,.55)"/>
            <text x="360" y="335" fill="#eef6ff" font-size="34" font-family="Arial" font-weight="700">МЕКТЕП</text>
            ${SVG.kid(900, 380)}
          </svg>`},
        { text:"Ол досымен амандасты.", svg: ( ) => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Мектепке жол — 4", "Ол досымен амандасты.")}
            ${SVG.kid(500, 360)}
            ${SVG.kid(720, 360, "#ffd6a5")}
            <rect x="555" y="460" width="110" height="22" rx="11" fill="#f4d7c7" opacity="0.9"/>
            ${SVG.bubble("Сәлем! Қалайсың?")}
          </svg>`},
        { text:"Мұғалім сабақты бастады.", svg: ( ) => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Мектепке жол — 5", "Мұғалім сабақты бастады.")}
            <rect x="210" y="270" width="650" height="270" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.16)" stroke-width="4"/>
            <text x="250" y="350" fill="#eef6ff" font-size="34" font-family="Arial">Тақырып: Мәтіннің негізгі ойы</text>
            ${SVG.teacher(940, 320)}
          </svg>`},
        { text:"Дос тапсырманы орындады.", svg: ( ) => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Мектепке жол — 6", "Дос тапсырманы орындады.")}
            <rect x="300" y="450" width="600" height="120" rx="22" fill="rgba(0,0,0,.25)" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
            <rect x="360" y="410" width="300" height="50" rx="12" fill="rgba(30,44,79,.7)"/>
            <text x="380" y="445" fill="#eef6ff" font-size="26" font-family="Arial">Жауап: негізгі ой</text>
            ${SVG.kid(220, 360)}
            <circle cx="980" cy="250" r="60" fill="rgba(202,255,191,.14)"/>
            <text x="960" y="262" fill="#eef6ff" font-size="34" font-family="Arial">✓</text>
          </svg>`}
      ],
      tasks: {
        q1: { title:"Бұл кім?", choices:["Дос","Апай","Директор"], correct:0, ok:"Жарайсың! Бұл — Дос." },
        q2: { title:"Ол не істеді?", choices:["Ұйықтады","Мектепке келді","Ойын ойнады"], correct:1, ok:"Дұрыс! Ол мектепке келді." },
        q3: { title:"Сөйлем құра", words:["Дос","тапсырманы","орындады"] }
      }
    },

    {
      id: "library-day",
      title: "Кітапхана күні",
      frames: [
        { text:"Алина кітапханаға келді.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Кітапхана күні — 1", "Алина кітапханаға келді.")}
            <rect x="180" y="300" width="260" height="320" fill="#1e2c4f" stroke="rgba(255,255,255,.16)" stroke-width="4"/>
            <rect x="470" y="300" width="260" height="320" fill="#1e2c4f" stroke="rgba(255,255,255,.16)" stroke-width="4"/>
            <rect x="760" y="300" width="260" height="320" fill="#1e2c4f" stroke="rgba(255,255,255,.16)" stroke-width="4"/>
            <text x="220" y="350" fill="#eef6ff" font-size="26" font-family="Arial">Кітаптар</text>
            ${SVG.kid(600, 520, "#caffbf")}
          </svg>`},
        { text:"Ол кітап таңдады.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Кітапхана күні — 2", "Ол кітап таңдады.")}
            <rect x="220" y="320" width="760" height="300" rx="20" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
            <rect x="260" y="360" width="190" height="220" fill="rgba(13,59,102,.55)"/>
            <rect x="480" y="360" width="190" height="220" fill="rgba(30,44,79,.65)"/>
            <rect x="700" y="360" width="190" height="220" fill="rgba(13,59,102,.55)"/>
            <text x="300" y="470" fill="#eef6ff" font-size="26" font-family="Arial">Кітап</text>
            ${SVG.kid(1010, 500, "#ffd6a5")}
          </svg>`},
        { text:"Кітапханашы көмектесті.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Кітапхана күні — 3", "Кітапханашы көмектесті.")}
            ${SVG.teacher(420, 420)}
            ${SVG.kid(720, 420, "#caffbf")}
            ${SVG.bubble("Мына кітапты ал.")}
          </svg>`},
        { text:"Алина кітапты оқыды.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Кітапхана күні — 4", "Алина кітапты оқыды.")}
            <rect x="260" y="400" width="700" height="190" rx="22" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
            <rect x="320" y="340" width="280" height="170" rx="18" fill="rgba(30,44,79,.7)"/>
            <text x="350" y="430" fill="#eef6ff" font-size="26" font-family="Arial">Мәтін</text>
            ${SVG.kid(200, 350, "#caffbf")}
          </svg>`},
        { text:"Ол негізгі ойды тапты.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Кітапхана күні — 5", "Ол негізгі ойды тапты.")}
            <rect x="220" y="310" width="780" height="300" rx="22" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
            <text x="260" y="380" fill="#eef6ff" font-size="30" font-family="Arial">Негізгі ой:</text>
            <rect x="260" y="410" width="700" height="70" rx="16" fill="rgba(30,44,79,.7)"/>
            <text x="280" y="455" fill="#eef6ff" font-size="26" font-family="Arial">Оқу — пайдалы әдет.</text>
            <circle cx="1020" cy="250" r="60" fill="rgba(123,223,242,.14)"/>
            <text x="1000" y="262" fill="#eef6ff" font-size="34" font-family="Arial">✓</text>
          </svg>`},
        { text:"Ол қысқа жоспар құрды.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Кітапхана күні — 6", "Ол қысқа жоспар құрды.")}
            <rect x="240" y="320" width="720" height="320" rx="22" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
            <text x="280" y="390" fill="#eef6ff" font-size="28" font-family="Arial">1) Кейіпкер</text>
            <text x="280" y="440" fill="#eef6ff" font-size="28" font-family="Arial">2) Оқиға</text>
            <text x="280" y="490" fill="#eef6ff" font-size="28" font-family="Arial">3) Негізгі ой</text>
            ${SVG.kid(980, 520, "#ffd6a5")}
          </svg>`}
      ],
      tasks: {
        q1: { title:"Бұл қай жер?", choices:["Асхана","Кітапхана","Стадион"], correct:1, ok:"Дұрыс! Бұл — кітапхана." },
        q2: { title:"Алина не істеді?", choices:["Кітап оқыды","Сурет салды","Жүгірді"], correct:0, ok:"Жарайсың! Ол кітап оқыды." },
        q3: { title:"Сөйлем құра", words:["Алина","негізгі","ойды","тапты"] }
      }
    },

    {
      id: "kind-word",
      title: "Жақсы сөз",
      frames: [
        { text:"Ернар сыныпқа кірді.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Жақсы сөз — 1", "Ернар сыныпқа кірді.")}
            <rect x="260" y="300" width="700" height="330" rx="22" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
            <text x="300" y="370" fill="#eef6ff" font-size="30" font-family="Arial">СЫНЫП</text>
            ${SVG.kid(200, 420, "#ffd6a5")}
          </svg>`},
        { text:"Ол қобалжыды.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Жақсы сөз — 2", "Ол қобалжыды.")}
            ${SVG.kid(520, 400, "#ffd6a5")}
            ${SVG.bubble("Мен қобалжып тұрмын…")}
          </svg>`},
        { text:"Сыныптасы оған орын берді.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Жақсы сөз — 3", "Сыныптасы оған орын берді.")}
            ${SVG.kid(460, 420, "#ffd6a5")}
            ${SVG.kid(720, 420, "#caffbf")}
            ${SVG.bubble("Кел, мұнда отыр.")}
          </svg>`},
        { text:"Олар бірге тапсырма орындады.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Жақсы сөз — 4", "Олар бірге тапсырма орындады.")}
            <rect x="260" y="460" width="700" height="150" rx="22" fill="rgba(0,0,0,.22)" stroke="rgba(255,255,255,.14)" stroke-width="4"/>
            <text x="310" y="540" fill="#eef6ff" font-size="26" font-family="Arial">Тапсырма: сөйлем құра</text>
            ${SVG.kid(420, 360, "#ffd6a5")}
            ${SVG.kid(780, 360, "#caffbf")}
          </svg>`},
        { text:"Ернар қуанды.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Жақсы сөз — 5", "Ернар қуанды.")}
            ${SVG.kid(520, 420, "#ffd6a5")}
            <circle cx="860" cy="260" r="70" fill="rgba(202,255,191,.16)"/>
            <text x="800" y="272" fill="#eef6ff" font-size="34" font-family="Arial">Жарайсың!</text>
          </svg>`},
        { text:"Ол «Рахмет!» деді.", svg: () => `
          <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="700" viewBox="0 0 1200 700">
            ${SVG.base("Жақсы сөз — 6", "Ол «Рахмет!» деді.")}
            ${SVG.kid(520, 420, "#ffd6a5")}
            ${SVG.bubble("Рахмет!")}
          </svg>`}
      ],
      tasks: {
        q1: { title:"Ернар қандай күйде болды?", choices:["Қобалжыды","Ашулы болды","Ұйықтады"], correct:0, ok:"Дұрыс! Ол қобалжыды." },
        q2: { title:"Сыныптасы не істеді?", choices:["Орын берді","Айқайлады","Кетті"], correct:0, ok:"Жарайсың! Сыныптасы орын берді." },
        q3: { title:"Сөйлем құра", words:["Ол","рахмет","деді"] }
      }
    }
  ];

  // ---------- Comic Page Mount ----------
  function initComicPage() {
    const select = document.getElementById("comicSelect");
    const stage = document.getElementById("comicStage");
    const caption = document.getElementById("caption");
    const counter = document.getElementById("counter");

    if (!select || !stage || !caption || !counter) return;

    const q1Mount = document.getElementById("q1");
    const q2Mount = document.getElementById("q2");
    const q3Mount = document.getElementById("q3words");
    const q1msg = document.getElementById("q1msg");
    const q2msg = document.getElementById("q2msg");
    const q3res = document.getElementById("q3result");

    const q1title = document.getElementById("q1title");
    const q2title = document.getElementById("q2title");
    const q3title = document.getElementById("q3title");
    const pageTitle = document.getElementById("comicTitle");

    let active = COMICS[0];
    let idx = 0;
    let timer = null;

    const stop = () => {
      if (timer) clearInterval(timer);
      timer = null;
      const play = document.getElementById("play");
      if (play) play.textContent = "▶ Ойнату";
    };

    const pulse = () => {
      if (html.dataset.motion !== "on") return;
      stage.animate(
        [{ transform:"translateY(0)" }, { transform:"translateY(-2px)" }, { transform:"translateY(0)" }],
        { duration: 520, iterations: 1 }
      );
    };

    const render = () => {
      const frame = active.frames[idx];
      stage.innerHTML = frame.svg();
      caption.textContent = `${idx+1}) ${frame.text}`;
      counter.textContent = `${idx+1}/${active.frames.length}`;
      pulse();
    };

    const makeChoices = (mount, msgEl, task) => {
      mount.innerHTML = "";
      msgEl.textContent = "";
      task.choices.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "pill";
        b.textContent = c;
        b.onclick = () => {
          if (i === task.correct) {
            msgEl.textContent = task.ok;
            say(task.ok);
          } else {
            msgEl.textContent = "Қайта көріп көрейік 🙂";
            say("Қайта көріп көрейік");
          }
        };
        mount.appendChild(b);
      });
    };

    const setupSentence = (words) => {
      q3Mount.innerHTML = "";
      q3res.textContent = "…";
      const selected = [];
      words.forEach(w => {
        const b = document.createElement("button");
        b.className = "pill";
        b.textContent = w;
        b.onclick = () => {
          selected.push(w);
          q3res.textContent = selected.join(" ");
          say(q3res.textContent);
        };
        q3Mount.appendChild(b);
      });
      document.getElementById("q3clear").onclick = () => {
        selected.length = 0;
        q3res.textContent = "…";
        say("Тазартылды");
      };
    };

    const load = (comicId) => {
      active = COMICS.find(c => c.id === comicId) || COMICS[0];
      idx = 0;
      stop();

      pageTitle.textContent = `Комикс: «${active.title}»`;

      q1title.textContent = `1) ${active.tasks.q1.title}`;
      q2title.textContent = `2) ${active.tasks.q2.title}`;
      q3title.textContent = `3) ${active.tasks.q3.title}`;

      makeChoices(q1Mount, q1msg, active.tasks.q1);
      makeChoices(q2Mount, q2msg, active.tasks.q2);
      setupSentence(active.tasks.q3.words);

      render();
    };

    // Build selector
    COMICS.forEach(c => {
      const o = document.createElement("option");
      o.value = c.id;
      o.textContent = c.title;
      select.appendChild(o);
    });
    select.onchange = () => load(select.value);

    // Controls
    document.getElementById("prev").onclick = () => { stop(); idx = (idx-1+active.frames.length)%active.frames.length; render(); };
    document.getElementById("next").onclick = () => { stop(); idx = (idx+1)%active.frames.length; render(); };
    document.getElementById("speak").onclick = () => say(active.frames[idx].text);

    document.getElementById("play").onclick = () => {
      if (timer) return stop();
      document.getElementById("play").textContent = "⏸ Тоқтату";
      say(active.frames[idx].text);
      timer = setInterval(() => {
        idx = (idx+1) % active.frames.length;
        render();
        say(active.frames[idx].text);
      }, 2600);
    };

    load(COMICS[0].id);
  }

  // ---------- Qazaq-tili Page Mount ----------
  function initQazaqTili() {
    const mount1 = document.getElementById("qtWords");
    const msg1 = document.getElementById("qtMsg");
    const smount = document.getElementById("qtSentenceWords");
    const sres = document.getElementById("qtSentenceResult");
    if (!mount1 || !msg1 || !smount || !sres) return;

    // Бағдарламаға сай қысқа үлгі:
    // 7–8: сөз таптары, сөйлем, мәтін
    const tasks = [
      {
        title: "Сөз таптары: зат есімді тап",
        choices: ["кітап", "жүгіреді", "әдемі"],
        correct: 0,
        ok: "Жарайсың! «кітап» — зат есім."
      },
      {
        title: "Сөйлем түрі: хабарлы сөйлемді таңда",
        choices: ["Сен келдің бе?", "Келші!", "Мен мектепке бардым."],
        correct: 2,
        ok: "Дұрыс! Бұл — хабарлы сөйлем."
      }
    ];

    const titleEl = document.getElementById("qtTitle");
    let idx = 0;

    const draw = () => {
      const t = tasks[idx];
      titleEl.textContent = t.title;
      mount1.innerHTML = "";
      msg1.textContent = "";
      t.choices.forEach((c, i) => {
        const b = document.createElement("button");
        b.className = "pill";
        b.textContent = c;
        b.onclick = () => {
          if (i === t.correct) { msg1.textContent = t.ok; say(t.ok); }
          else { msg1.textContent = "Қайта көрейік 🙂"; say("Қайта көрейік"); }
        };
        mount1.appendChild(b);
      });
    };

    document.getElementById("qtPrev").onclick = () => { idx = (idx-1+tasks.length)%tasks.length; draw(); };
    document.getElementById("qtNext").onclick = () => { idx = (idx+1)%tasks.length; draw(); };
    document.getElementById("qtSpeak").onclick = () => say(tasks[idx].title);

    // Sentence builder
    const words = ["Мен", "кітап", "оқыдым"];
    const selected = [];
    smount.innerHTML = "";
    words.forEach(w => {
      const b = document.createElement("button");
      b.className = "pill";
      b.textContent = w;
      b.onclick = () => { selected.push(w); sres.textContent = selected.join(" "); say(sres.textContent); };
      smount.appendChild(b);
    });

    document.getElementById("qtClear").onclick = () => { selected.length = 0; sres.textContent="…"; say("Тазартылды"); };

    draw();
  }

  // Run page initializers
  initComicPage();
  initQazaqTili();
})();
