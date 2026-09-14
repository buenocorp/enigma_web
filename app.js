/* ==========================================================================
   O ENIGMA DO PROFESSOR BASTOS — motor do jogo
   ========================================================================== */

(function () {
  "use strict";

  const LIGHT_RADIUS = 105; // px — raio "aceso" ao redor do cursor/dedo
  const PUZZLES_PER_ROOM = 4; // quantas perguntas sorteadas do pool por sala

  const state = {
    roomIndex: -1,             // índice em state.rooms
    rooms: [],                  // salas sorteadas para esta partida (conteúdo + estado)
    battery: 100,
    notebook: [],                // { roomName, text }
    currentPuzzleRef: null,      // { puzzle, kind: 'discovery'|'door' }
    selectedOptions: [],
    attempts: 0,
    mx: window.innerWidth / 2,
    my: window.innerHeight / 2,
    orderPicked: [],
    orderPool: [],
    finalOrderSolved: false,
    accusationSelected: null,
    startTime: null,
    timerInterval: null,
    roomDigits: {},        // { roomId: digit } — sorteado a cada partida
    secretOrder: [],        // ordem correta (ids de sala) para a fechadura final
    foundDigitRooms: [],    // ids de sala cujo dígito já foi revelado
    lockChips: [],
    lockPicked: [],
    lockPool: []
  };

  // ---------------------------------------------------------------------
  // Bootstrapping / sorteio de conteúdo (novo a cada partida)
  // ---------------------------------------------------------------------

  function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // Embaralha as alternativas de uma pergunta mc/multi e reindexa a(s)
  // resposta(s) correta(s). Perguntas "fill" não têm alternativas.
  function shuffledOptionsFor(raw) {
    if (raw.type === "fill") return {};
    const order = shuffle(raw.options.map((_, i) => i)); // permutação dos índices originais
    const options = order.map((origIdx) => raw.options[origIdx]);
    if (raw.type === "multi") {
      const correctSet = new Set(raw.correct);
      const correct = [];
      order.forEach((origIdx, newIdx) => {
        if (correctSet.has(origIdx)) correct.push(newIdx);
      });
      correct.sort((a, b) => a - b);
      return { options, correct };
    }
    return { options, correct: order.indexOf(raw.correct) };
  }

  function instantiatePuzzle(raw, pos) {
    return Object.assign({}, raw, shuffledOptionsFor(raw), {
      top: pos.top,
      left: pos.left,
      solved: false
    });
  }

  function buildRooms() {
    return CASE_DATA.rooms.map((room) => {
      const chosenDoorRaw = shuffle(room.doorPool)[0];

      // A pista-chave da porta precisa sempre estar entre as perguntas
      // sorteadas nesta sala, senão o jogador nunca poderia encontrá-la.
      const keyPuzzle = room.puzzlePool.find((p) => p.id === chosenDoorRaw.keyPuzzleId);
      const restPool = room.puzzlePool.filter((p) => p.id !== chosenDoorRaw.keyPuzzleId);
      const chosenPuzzles = shuffle([
        keyPuzzle,
        ...shuffle(restPool).slice(0, PUZZLES_PER_ROOM - 1)
      ]);

      const chosenSlots = shuffle(CASE_DATA.slots).slice(0, chosenPuzzles.length);
      const puzzles = chosenPuzzles.map((raw, i) => instantiatePuzzle(raw, chosenSlots[i]));

      const door = instantiatePuzzle(chosenDoorRaw, CASE_DATA.doorSlot);

      return {
        data: room, // metadados fixos: name, icon, theme, entryFlavor, number
        solved: false,
        puzzles,
        door
      };
    });
  }

  const els = {};

  function cacheEls() {
    [
      "flashlight-overlay", "hud", "hud-case", "hud-room-name", "hud-timer",
      "battery-fill", "clue-counter", "digit-counter", "btn-notebook", "notebook",
      "notebook-content", "btn-close-notebook", "screen-intro", "intro-title",
      "intro-subtitle", "intro-ficha", "intro-paragraphs", "intro-instrucoes",
      "btn-start", "screen-room", "room-scene", "screen-final", "final-icon",
      "final-name", "final-flavor", "final-order-section", "final-order-prompt",
      "order-picked", "order-pool", "order-feedback", "btn-order-reset",
      "btn-order-confirm", "final-lock-section", "final-lock-prompt",
      "lock-picked", "lock-pool", "lock-feedback", "btn-lock-reset",
      "btn-lock-confirm", "final-accusation-section", "final-accusation-prompt",
      "accusation-options", "accusation-hint", "btn-accusation-confirm",
      "screen-end", "ending-text", "final-time", "btn-restart", "puzzle-modal",
      "modal-box", "btn-close-modal", "modal-flavor", "modal-title",
      "modal-code", "modal-prompt", "modal-options", "modal-fill-input",
      "modal-feedback", "modal-hint", "btn-submit-answer", "btn-continue", "toast"
    ].forEach((id) => {
      els[id] = document.getElementById(id);
    });
  }

  function init() {
    cacheEls();
    renderIntro();
    bindGlobalEvents();
    bindStaticEvents();
    if (window.location.search.indexOf("debug=1") !== -1) {
      window.__debugState = state; // somente para testes automatizados (?debug=1)
    }
  }

  document.addEventListener("DOMContentLoaded", init);

  // ---------------------------------------------------------------------
  // Flashlight (escurece apenas o piso da sala atual, nunca o HUD)
  // ---------------------------------------------------------------------

  function bindGlobalEvents() {
    window.addEventListener("mousemove", (e) => setLight(e.clientX, e.clientY));
    window.addEventListener(
      "touchmove",
      (e) => {
        if (e.touches && e.touches[0]) {
          setLight(e.touches[0].clientX, e.touches[0].clientY);
        }
      },
      { passive: true }
    );
    window.addEventListener("resize", () => setLight(state.mx, state.my));
  }

  function setLight(x, y) {
    state.mx = x;
    state.my = y;
    const floor = document.getElementById("room-floor");
    if (floor) {
      const rect = floor.getBoundingClientRect();
      els["flashlight-overlay"].style.setProperty("--mx", x - rect.left + "px");
      els["flashlight-overlay"].style.setProperty("--my", y - rect.top + "px");
    }
    updateHotspotLighting();
  }

  function updateHotspotLighting() {
    if (state.roomIndex < 0) return;
    const hotspots = els["room-scene"].querySelectorAll(".hotspot");
    hotspots.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(cx - state.mx, cy - state.my);
      el.classList.toggle("lit", dist <= LIGHT_RADIUS || el.classList.contains("solved"));
    });
  }

  function flickerLight() {
    els["flashlight-overlay"].classList.add("flicker");
    setTimeout(() => els["flashlight-overlay"].classList.remove("flicker"), 360);
  }

  // ---------------------------------------------------------------------
  // Screens
  // ---------------------------------------------------------------------

  function showScreen(id) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById(id).classList.add("active");
  }

  // ---------------------------------------------------------------------
  // Intro
  // ---------------------------------------------------------------------

  function renderIntro() {
    els["intro-title"].textContent = CASE_DATA.title;
    els["intro-subtitle"].textContent = CASE_DATA.subtitle;

    els["intro-ficha"].innerHTML = "";
    CASE_DATA.intro.ficha.forEach((f) => {
      const dt = document.createElement("dt");
      dt.textContent = f.label;
      const dd = document.createElement("dd");
      dd.textContent = f.value;
      els["intro-ficha"].appendChild(dt);
      els["intro-ficha"].appendChild(dd);
    });

    els["intro-paragraphs"].innerHTML = "";
    CASE_DATA.intro.paragrafos.forEach((txt) => {
      const p = document.createElement("p");
      p.textContent = txt;
      els["intro-paragraphs"].appendChild(p);
    });

    els["intro-instrucoes"].textContent = CASE_DATA.intro.instrucoes;
  }

  function bindStaticEvents() {
    els["btn-start"].addEventListener("click", startGame);
    els["btn-restart"].addEventListener("click", restartGame);

    els["btn-notebook"].addEventListener("click", () => toggleNotebook(true));
    els["btn-close-notebook"].addEventListener("click", () => toggleNotebook(false));

    els["btn-close-modal"].addEventListener("click", closeModal);
    els["btn-continue"].addEventListener("click", closeModal);
    els["btn-submit-answer"].addEventListener("click", submitAnswer);

    els["btn-order-reset"].addEventListener("click", resetOrderPuzzle);
    els["btn-order-confirm"].addEventListener("click", confirmOrderPuzzle);
    els["btn-lock-reset"].addEventListener("click", resetLockPuzzle);
    els["btn-lock-confirm"].addEventListener("click", confirmLock);
    els["btn-accusation-confirm"].addEventListener("click", confirmAccusation);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !els["puzzle-modal"].classList.contains("hidden")) {
        closeModal();
      }
    });
  }

  function startGame() {
    state.rooms = buildRooms();
    state.notebook = [];
    state.roomIndex = 0;
    state.finalOrderSolved = false;
    state.accusationSelected = null;
    assignDigits();
    els["hud"].classList.remove("hidden");
    showScreen("screen-room");
    enterRoom(0);
    startTimer();
  }

  // Sorteia, para esta partida, qual dígito (0-9, sem repetição) cada sala-
  // marco vai entregar, e a ordem SECRETA em que eles formam a combinação
  // final — que nunca é a ordem em que as salas são visitadas.
  function assignDigits() {
    const ids = CASE_DATA.digitRooms;
    const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, ids.length);
    state.roomDigits = {};
    ids.forEach((id, i) => {
      state.roomDigits[id] = digits[i];
    });
    let order;
    do {
      order = shuffle(ids);
    } while (order.every((id, i) => id === ids[i]));
    state.secretOrder = order;
    state.foundDigitRooms = [];
    updateDigitCounter();
  }

  function updateDigitCounter() {
    els["digit-counter"].textContent = `🔢 ${state.foundDigitRooms.length}/${CASE_DATA.digitRooms.length}`;
  }

  function restartGame() {
    state.roomIndex = -1;
    state.battery = 100;
    state.finalOrderSolved = false;
    stopTimer();
    els["hud-timer"].textContent = "⏱ 00:00";
    els["hud"].classList.add("hidden");
    toggleNotebook(false);
    showScreen("screen-intro");
  }

  // ---------------------------------------------------------------------
  // Cronômetro — inicia com a investigação, encerra ao resolver o caso
  // ---------------------------------------------------------------------

  function startTimer() {
    stopTimer();
    state.startTime = Date.now();
    updateTimerDisplay();
    state.timerInterval = setInterval(updateTimerDisplay, 1000);
  }

  function stopTimer() {
    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }
  }

  function elapsedMs() {
    return state.startTime ? Date.now() - state.startTime : 0;
  }

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000);
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  }

  function updateTimerDisplay() {
    els["hud-timer"].textContent = "⏱ " + formatTime(elapsedMs());
  }

  function applyTimePenalty() {
    if (!state.startTime) return;
    state.startTime -= WRONG_ANSWER_PENALTY_MS;
    updateTimerDisplay();
    els["hud-timer"].classList.remove("penalty");
    void els["hud-timer"].offsetWidth;
    els["hud-timer"].classList.add("penalty");
  }

  // ---------------------------------------------------------------------
  // Notebook
  // ---------------------------------------------------------------------

  function toggleNotebook(show) {
    els["notebook"].classList.toggle("hidden", !show);
    els["notebook"].setAttribute("aria-hidden", show ? "false" : "true");
    if (show) renderNotebook();
  }

  function renderNotebook() {
    const c = els["notebook-content"];
    c.innerHTML = "";
    if (state.notebook.length === 0) {
      const p = document.createElement("p");
      p.className = "notebook-empty";
      p.textContent = "Nenhuma pista recolhida ainda. Ilumine os objetos da sala para começar.";
      c.appendChild(p);
      return;
    }
    state.notebook.forEach((entry) => {
      const div = document.createElement("div");
      div.className = "notebook-entry";
      const room = document.createElement("span");
      room.className = "entry-room";
      room.textContent = entry.roomName;
      const text = document.createElement("span");
      text.textContent = entry.text;
      div.appendChild(room);
      div.appendChild(text);
      c.appendChild(div);
    });
  }

  function addNotebookEntry(roomName, text) {
    state.notebook.push({ roomName, text });
  }

  // ---------------------------------------------------------------------
  // Room rendering
  // ---------------------------------------------------------------------

  function enterRoom(index) {
    state.roomIndex = index;
    state.battery = 100;
    updateBattery();

    const roomState = state.rooms[index];
    const room = roomState.data;

    els["hud-case"].textContent = CASE_DATA.subtitle;
    els["hud-room-name"].textContent = `${room.icon} Sala ${room.number} — ${room.name}`;

    els["room-scene"].className = `room-scene room-theme-${room.theme}`;
    els["room-scene"].innerHTML = "";

    const header = document.createElement("div");
    header.className = "room-header";
    header.innerHTML = `<div class="room-icon">${room.icon}</div><h2>${escapeHtml(room.name)}</h2><p>${escapeHtml(room.entryFlavor)}</p>`;
    els["room-scene"].appendChild(header);

    const floor = document.createElement("div");
    floor.className = "room-floor";
    floor.id = "room-floor";
    floor.appendChild(els["flashlight-overlay"]);

    roomState.puzzles.forEach((puzzle) => {
      floor.appendChild(buildHotspot(puzzle));
    });
    floor.appendChild(buildDoorHotspot(roomState));

    els["room-scene"].appendChild(floor);

    const footer = document.createElement("div");
    footer.className = "room-footer";
    footer.textContent = "Mova a lanterna pelo ambiente. Objetos iluminados podem ser examinados.";
    els["room-scene"].appendChild(footer);

    updateClueCounter();
    setLight(state.mx, state.my);
  }

  function buildHotspot(puzzle) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `hotspot furniture-${puzzle.furniture}`;
    btn.style.top = puzzle.top;
    btn.style.left = puzzle.left;
    btn.dataset.kind = "discovery";
    btn.dataset.id = puzzle.id;
    if (puzzle.solved) btn.classList.add("solved");

    btn.innerHTML = `
      <span class="hotspot-icon">${puzzle.icon}</span>
      <span class="hotspot-label">${escapeHtml(puzzle.label)}</span>
      ${!puzzle.solved ? '<span class="hotspot-pulse"></span>' : ""}
    `;

    btn.addEventListener("click", () => onHotspotClick(puzzle));
    return btn;
  }

  function buildDoorHotspot(roomState) {
    const door = roomState.door;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "hotspot hotspot--porta furniture-porta";
    btn.style.top = door.top;
    btn.style.left = door.left;
    btn.dataset.kind = "door";
    if (door.solved) btn.classList.add("solved");
    if (!allDiscoveriesSolved(roomState)) btn.classList.add("locked");

    btn.innerHTML = `
      <span class="hotspot-icon">${door.icon}</span>
      <span class="hotspot-label">${escapeHtml(door.label)}</span>
      ${!door.solved ? '<span class="hotspot-pulse"></span>' : ""}
    `;

    btn.addEventListener("click", () => onDoorClick(roomState));
    return btn;
  }

  function allDiscoveriesSolved(roomState) {
    return roomState.puzzles.every((p) => p.solved);
  }

  function updateClueCounter() {
    const roomState = state.rooms[state.roomIndex];
    const total = roomState.puzzles.length;
    const found = roomState.puzzles.filter((p) => p.solved).length;
    els["clue-counter"].textContent = `Pistas: ${found}/${total}`;
  }

  function updateBattery() {
    els["battery-fill"].style.width = Math.max(8, state.battery) + "%";
  }

  // ---------------------------------------------------------------------
  // Hotspot interactions
  // ---------------------------------------------------------------------

  function onHotspotClick(puzzle) {
    if (puzzle.solved) {
      showToast(puzzle.clue || "Você já examinou este objeto.");
      return;
    }
    openPuzzleModal({ puzzle, kind: "discovery" });
  }

  function onDoorClick(roomState) {
    const door = roomState.door;
    if (door.solved) {
      goToNextRoom();
      return;
    }
    if (!allDiscoveriesSolved(roomState)) {
      const remaining = roomState.puzzles.filter((p) => !p.solved).length;
      showToast(`A porta está trancada. Ainda faltam ${remaining} pista(s) nesta sala.`);
      return;
    }
    openDoorKeyPhase(roomState);
  }

  // Antes do desafio final da porta, o jogador precisa reconhecer — entre
  // as pistas que já recolheu — qual delas é a chave para essa porta.
  function openDoorKeyPhase(roomState) {
    const door = roomState.door;
    const shuffledClues = shuffle(roomState.puzzles);
    const correctIdx = shuffledClues.findIndex((p) => p.id === door.keyPuzzleId);

    const keyStepPuzzle = {
      type: "mc",
      label: door.label,
      flavor: "Antes de tentar a porta, pense no que você já descobriu. Uma das pistas do seu caderno é a chave para destravá-la.",
      prompt: "Qual pista recolhida nesta sala é a chave que destrava esta porta?",
      options: shuffledClues.map((p) => p.clue),
      correct: correctIdx,
      hint: "Reveja o caderno de evidências: qual pista fala sobre o mesmo assunto cobrado no desafio da porta?"
    };

    openPuzzleModal({ puzzle: keyStepPuzzle, kind: "door-key" });
  }

  function goToNextRoom() {
    const nextIndex = state.roomIndex + 1;
    if (nextIndex < state.rooms.length) {
      showScreen("screen-room");
      enterRoom(nextIndex);
    } else {
      enterFinalRoom();
    }
  }

  // ---------------------------------------------------------------------
  // Puzzle modal
  // ---------------------------------------------------------------------

  function openPuzzleModal(ref) {
    state.currentPuzzleRef = ref;
    state.selectedOptions = [];
    state.attempts = 0;

    const p = ref.puzzle;

    els["modal-flavor"].textContent = p.flavor || "";
    els["modal-title"].textContent = p.label || (ref.kind === "door" ? "Desafio Final da Sala" : "Pista Encontrada");

    if (p.code) {
      els["modal-code"].textContent = p.code;
      els["modal-code"].classList.remove("hidden");
    } else {
      els["modal-code"].classList.add("hidden");
    }

    els["modal-prompt"].textContent = p.prompt;
    els["modal-feedback"].classList.add("hidden");
    els["modal-feedback"].textContent = "";
    els["modal-hint"].classList.add("hidden");
    els["modal-hint"].textContent = "";
    els["btn-continue"].classList.add("hidden");
    els["btn-submit-answer"].classList.remove("hidden");
    els["btn-submit-answer"].disabled = false;
    els["modal-fill-input"].classList.add("hidden");
    els["modal-fill-input"].disabled = false;
    els["modal-fill-input"].value = "";

    els["modal-options"].innerHTML = "";

    if (p.type === "fill") {
      els["modal-fill-input"].classList.remove("hidden");
      setTimeout(() => els["modal-fill-input"].focus(), 50);
    } else {
      const mode = p.type === "multi" ? "multi" : "mc";
      p.options.forEach((optText, idx) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `option-btn mode-${mode}`;
        btn.dataset.idx = String(idx);
        btn.innerHTML = `<span class="marker"></span><span>${escapeHtml(optText)}</span>`;
        btn.addEventListener("click", () => toggleOption(idx, mode));
        els["modal-options"].appendChild(btn);
      });
    }

    els["puzzle-modal"].classList.remove("hidden");
  }

  function toggleOption(idx, mode) {
    if (els["btn-submit-answer"].disabled) return;
    if (mode === "mc") {
      state.selectedOptions = [idx];
    } else {
      const pos = state.selectedOptions.indexOf(idx);
      if (pos === -1) state.selectedOptions.push(idx);
      else state.selectedOptions.splice(pos, 1);
    }
    renderOptionSelection();
  }

  function renderOptionSelection() {
    const buttons = els["modal-options"].querySelectorAll(".option-btn");
    buttons.forEach((btn) => {
      const idx = Number(btn.dataset.idx);
      const selected = state.selectedOptions.includes(idx);
      btn.classList.toggle("selected", selected);
      const marker = btn.querySelector(".marker");
      marker.textContent = selected ? "✓" : "";
    });
  }

  function closeModal() {
    els["puzzle-modal"].classList.add("hidden");
    state.currentPuzzleRef = null;
  }

  function normalizeText(str) {
    return str
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function isAnswerCorrect(p) {
    if (p.type === "fill") {
      const val = normalizeText(els["modal-fill-input"].value || "");
      if (!val) return false;
      return p.answers.some((a) => normalizeText(a) === val);
    }
    if (p.type === "multi") {
      const correct = [...p.correct].sort();
      const chosen = [...state.selectedOptions].sort();
      return (
        correct.length === chosen.length && correct.every((v, i) => v === chosen[i])
      );
    }
    // mc
    return state.selectedOptions.length === 1 && state.selectedOptions[0] === p.correct;
  }

  function submitAnswer() {
    const ref = state.currentPuzzleRef;
    if (!ref) return;
    const p = ref.puzzle;

    if (p.type === "fill") {
      if (!els["modal-fill-input"].value.trim()) return;
    } else if (state.selectedOptions.length === 0) {
      return;
    }

    const correct = isAnswerCorrect(p);

    if (correct) {
      handleCorrectAnswer(ref);
    } else {
      handleWrongAnswer(ref);
    }
  }

  function markOptionColors(p, correctIndices) {
    const buttons = els["modal-options"].querySelectorAll(".option-btn");
    buttons.forEach((btn) => {
      const idx = Number(btn.dataset.idx);
      btn.disabled = true;
      if (correctIndices.includes(idx)) btn.classList.add("correct");
      else if (state.selectedOptions.includes(idx)) btn.classList.add("incorrect");
    });
  }

  function handleCorrectAnswer(ref) {
    const p = ref.puzzle;
    const correctIndices = p.type === "multi" ? p.correct : p.type === "mc" ? [p.correct] : [];
    if (p.type !== "fill") markOptionColors(p, correctIndices);

    els["modal-hint"].classList.add("hidden");
    els["btn-submit-answer"].classList.add("hidden");
    els["btn-continue"].classList.remove("hidden");
    els["modal-fill-input"].disabled = true;

    const roomState = state.rooms[state.roomIndex];
    const room = roomState.data;

    if (ref.kind === "door-key") {
      // Fase 1 da porta: identificar a pista-chave. Ainda não resolve a porta —
      // apenas libera o desafio de síntese de fato.
      els["modal-feedback"].classList.remove("hidden");
      els["modal-feedback"].className = "feedback correct";
      els["modal-feedback"].textContent = "✔ Essa é a pista certa. As peças se encaixam — agora o verdadeiro teste começa.";
      els["btn-continue"].textContent = "Usar a pista e abrir a porta";
      els["btn-continue"].onclick = () => {
        openPuzzleModal({ puzzle: roomState.door, kind: "door" });
      };
      return;
    }

    p.solved = true;

    if (ref.kind === "discovery") {
      els["modal-feedback"].classList.remove("hidden");
      els["modal-feedback"].className = "feedback correct";
      els["modal-feedback"].textContent = "✔ Correto. " + (p.clue || "");

      addNotebookEntry(room.name, p.clue);
      updateClueCounter();
      const hotEl = document.querySelector(`.hotspot[data-id="${p.id}"]`);
      if (hotEl) {
        hotEl.classList.add("solved");
        const pulse = hotEl.querySelector(".hotspot-pulse");
        if (pulse) pulse.remove();
      }
      els["btn-continue"].textContent = "Continuar";
      els["btn-continue"].onclick = closeModal;
    } else {
      let successText = p.successFlavor || "";
      if (CASE_DATA.digitRooms.includes(room.id)) {
        const digit = state.roomDigits[room.id];
        state.foundDigitRooms.push(room.id);
        successText += ` Gravado na porta, um número solto: ${digit}. Guarde-o — ele vai importar no final.`;
        updateDigitCounter();
      }

      els["modal-feedback"].classList.remove("hidden");
      els["modal-feedback"].className = "feedback correct";
      els["modal-feedback"].textContent = "✔ Correto. " + successText;

      addNotebookEntry(room.name, "Porta desvendada: " + successText);
      roomState.solved = true;
      const doorEl = document.querySelector(".hotspot--porta");
      if (doorEl) {
        doorEl.classList.add("solved");
        doorEl.classList.remove("locked");
        const pulse = doorEl.querySelector(".hotspot-pulse");
        if (pulse) pulse.remove();
      }

      els["btn-continue"].textContent = state.roomIndex + 1 < state.rooms.length ? "Ir para a próxima sala" : "Ir para a Sala da Verdade";
      els["btn-continue"].onclick = () => {
        closeModal();
        goToNextRoom();
      };
    }
  }

  const WRONG_ANSWER_PENALTY_MS = 30 * 1000;

  function handleWrongAnswer(ref) {
    state.attempts += 1;
    state.battery = Math.max(10, state.battery - 15);
    updateBattery();
    flickerLight();
    applyTimePenalty();

    const p = ref.puzzle;

    els["modal-box"].classList.remove("shake");
    void els["modal-box"].offsetWidth;
    els["modal-box"].classList.add("shake");

    els["modal-feedback"].classList.remove("hidden");
    els["modal-feedback"].className = "feedback incorrect";
    els["modal-feedback"].textContent = "✘ Não é bem isso. O professor teria checado com mais cuidado... tente de novo. (+30s de penalidade)";

    if (p.type !== "fill") {
      const buttons = els["modal-options"].querySelectorAll(".option-btn");
      buttons.forEach((btn) => {
        const idx = Number(btn.dataset.idx);
        if (state.selectedOptions.includes(idx)) {
          btn.classList.add("incorrect");
          setTimeout(() => btn.classList.remove("incorrect", "selected"), 700);
        }
      });
      state.selectedOptions = [];
    }

    if (state.attempts >= 2 && p.hint) {
      els["modal-hint"].classList.remove("hidden");
      els["modal-hint"].textContent = "💡 Dica: " + p.hint;
    }
  }

  // ---------------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------------

  let toastTimer = null;
  function showToast(msg) {
    const t = els["toast"];
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 3200);
  }

  // ---------------------------------------------------------------------
  // Final room
  // ---------------------------------------------------------------------

  function enterFinalRoom() {
    const fr = CASE_DATA.finalRoom;
    els["hud-room-name"].textContent = `${fr.icon} ${fr.name}`;
    els["clue-counter"].textContent = `Pistas: ${state.notebook.length} recolhidas`;

    els["final-icon"].textContent = fr.icon;
    els["final-name"].textContent = fr.name;
    els["final-flavor"].textContent = fr.entryFlavor;
    els["final-order-prompt"].textContent = fr.orderPrompt;
    els["final-accusation-prompt"].textContent = fr.accusationPrompt;

    els["final-order-section"].classList.remove("hidden");
    els["final-lock-section"].classList.add("hidden");
    els["final-accusation-section"].classList.add("hidden");
    state.finalOrderSolved = false;
    state.accusationSelected = null;
    els["btn-order-confirm"].disabled = false;
    els["btn-order-reset"].disabled = false;
    els["btn-lock-confirm"].disabled = false;
    els["btn-lock-reset"].disabled = false;

    state.orderPool = shuffle(fr.orderSteps.map((s) => s.id));
    state.orderPicked = [];
    renderOrderPuzzle();

    els["final-lock-prompt"].textContent = fr.lockPrompt;
    state.lockChips = CASE_DATA.digitRooms.map((id) => ({ roomId: id, digit: state.roomDigits[id] }));
    state.lockPool = shuffle(state.lockChips);
    state.lockPicked = [];
    els["lock-feedback"].textContent = "";
    renderLockPuzzle();

    const accusationOrder = shuffle(fr.accusationOptions.map((_, i) => i));
    state.accusationOrder = accusationOrder;

    els["accusation-options"].innerHTML = "";
    accusationOrder.forEach((origIdx, displayIdx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn mode-mc";
      btn.dataset.idx = String(displayIdx);
      btn.innerHTML = `<span class="marker"></span><span>${escapeHtml(fr.accusationOptions[origIdx])}</span>`;
      btn.addEventListener("click", () => {
        els["accusation-options"].querySelectorAll(".option-btn").forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
        state.accusationSelected = displayIdx;
      });
      els["accusation-options"].appendChild(btn);
    });
    els["accusation-hint"].classList.add("hidden");

    showScreen("screen-final");
  }

  function stepById(id) {
    return CASE_DATA.finalRoom.orderSteps.find((s) => s.id === id);
  }

  function renderOrderPuzzle() {
    const pickedWrap = els["order-picked"];
    pickedWrap.innerHTML = "";
    if (state.orderPicked.length === 0) {
      const p = document.createElement("div");
      p.className = "order-picked-empty";
      p.textContent = "Clique nos cartões abaixo para montar a sequência.";
      pickedWrap.appendChild(p);
    } else {
      state.orderPicked.forEach((id, i) => {
        const slot = document.createElement("div");
        slot.className = "order-slot";
        slot.innerHTML = `<span class="n">${i + 1}.</span><span>${escapeHtml(stepById(id).text)}</span>`;
        pickedWrap.appendChild(slot);
      });
    }

    const pool = els["order-pool"];
    pool.innerHTML = "";
    state.orderPool.forEach((id) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "order-card";
      card.textContent = stepById(id).text;
      card.addEventListener("click", () => {
        state.orderPicked.push(id);
        state.orderPool = state.orderPool.filter((x) => x !== id);
        renderOrderPuzzle();
      });
      pool.appendChild(card);
    });
  }

  function resetOrderPuzzle() {
    const fr = CASE_DATA.finalRoom;
    state.orderPool = shuffle(fr.orderSteps.map((s) => s.id));
    state.orderPicked = [];
    els["order-feedback"].textContent = "";
    renderOrderPuzzle();
  }

  function confirmOrderPuzzle() {
    const fr = CASE_DATA.finalRoom;
    const correctIds = fr.orderSteps.map((s) => s.id);

    if (state.orderPicked.length !== correctIds.length) {
      els["order-feedback"].textContent = "Posicione todos os cartões antes de confirmar.";
      return;
    }

    let hits = 0;
    correctIds.forEach((id, i) => {
      if (state.orderPicked[i] === id) hits++;
    });

    if (hits === correctIds.length) {
      els["order-feedback"].textContent = "✔ Sequência correta! O fluxo da requisição está reconstruído.";
      els["final-lock-section"].classList.remove("hidden");
      state.finalOrderSolved = true;
      els["btn-order-confirm"].disabled = true;
      els["btn-order-reset"].disabled = true;
      els["final-lock-section"].scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      els["order-feedback"].textContent = `${hits} de ${correctIds.length} posições corretas. Reorganize e tente novamente.`;
    }
  }

  function renderLockPuzzle() {
    const pickedWrap = els["lock-picked"];
    pickedWrap.innerHTML = "";
    if (state.lockPicked.length === 0) {
      const p = document.createElement("div");
      p.className = "order-picked-empty";
      p.textContent = "Toque nos números abaixo para montar a combinação.";
      pickedWrap.appendChild(p);
    } else {
      state.lockPicked.forEach((chip, i) => {
        const slot = document.createElement("div");
        slot.className = "order-slot digit-slot";
        slot.innerHTML = `<span class="n">${i + 1}.</span><span class="digit-value">${chip.digit}</span>`;
        pickedWrap.appendChild(slot);
      });
    }

    const pool = els["lock-pool"];
    pool.innerHTML = "";
    state.lockPool.forEach((chip) => {
      const card = document.createElement("button");
      card.type = "button";
      card.className = "order-card digit-card";
      card.textContent = String(chip.digit);
      card.addEventListener("click", () => {
        state.lockPicked.push(chip);
        state.lockPool = state.lockPool.filter((c) => c !== chip);
        renderLockPuzzle();
      });
      pool.appendChild(card);
    });
  }

  function resetLockPuzzle() {
    state.lockPool = shuffle(state.lockChips);
    state.lockPicked = [];
    els["lock-feedback"].textContent = "";
    renderLockPuzzle();
  }

  function confirmLock() {
    if (state.lockPicked.length !== state.lockChips.length) {
      els["lock-feedback"].textContent = "Posicione os 4 números antes de testar a combinação.";
      return;
    }

    let hits = 0;
    state.secretOrder.forEach((roomId, i) => {
      if (state.lockPicked[i] && state.lockPicked[i].roomId === roomId) hits++;
    });

    if (hits === state.secretOrder.length) {
      els["lock-feedback"].textContent = "✔ A fechadura gira e se abre com um clique metálico.";
      els["final-accusation-section"].classList.remove("hidden");
      els["btn-lock-confirm"].disabled = true;
      els["btn-lock-reset"].disabled = true;
      els["final-accusation-section"].scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      applyTimePenalty();
      els["lock-feedback"].textContent = `✘ Combinação incorreta — ${hits} de ${state.secretOrder.length} números na posição certa. (+30s de penalidade)`;
      state.lockPool = shuffle(state.lockChips);
      state.lockPicked = [];
      renderLockPuzzle();
    }
  }

  function confirmAccusation() {
    const fr = CASE_DATA.finalRoom;
    if (state.accusationSelected === undefined || state.accusationSelected === null) {
      return;
    }
    const chosenOriginalIdx = state.accusationOrder[state.accusationSelected];
    if (chosenOriginalIdx === fr.accusationCorrect) {
      showEnding();
    } else {
      els["accusation-hint"].classList.remove("hidden");
      els["accusation-hint"].textContent = "💡 " + fr.accusationHint;
      const buttons = els["accusation-options"].querySelectorAll(".option-btn");
      const btn = buttons[state.accusationSelected];
      if (btn) {
        btn.classList.add("incorrect");
        setTimeout(() => btn.classList.remove("incorrect"), 700);
      }
    }
  }

  function showEnding() {
    const fr = CASE_DATA.finalRoom;
    els["ending-text"].innerHTML = "";
    fr.ending.forEach((txt) => {
      const p = document.createElement("p");
      p.textContent = txt;
      els["ending-text"].appendChild(p);
    });

    stopTimer();
    const ms = elapsedMs();
    let rank = "Investigador Meticuloso 🔍 — cada detalhe foi checado com calma.";
    if (ms < 15 * 60 * 1000) rank = "Detetive Relâmpago ⚡ — caso resolvido em tempo recorde!";
    else if (ms < 30 * 60 * 1000) rank = "Detetive Competente 🕵️ — investigação sólida e segura.";
    els["final-time"].textContent = `Tempo total de investigação: ${formatTime(ms)} — ${rank}`;

    els["hud"].classList.add("hidden");
    showScreen("screen-end");
  }

  // ---------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : str;
    return div.innerHTML;
  }
})();
