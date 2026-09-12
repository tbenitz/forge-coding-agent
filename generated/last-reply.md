*** CREATE: index.html ***
<<<<<<< CONTENT
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>DuckHunter FPS</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="game">
  <canvas id="scene"></canvas>
  <div id="crosshair"></div>
  <div id="hud">
    <div class="hud-item">SCORE <span id="score">0</span></div>
    <div class="hud-item">AMMO <span id="ammo">6</span></div>
    <div class="hud-item">TIME <span id="time">60</span></div>
    <div class="hud-item">WAVE <span id="wave">1</span></div>
  </div>
  <div id="reload-bar"><div id="reload-fill"></div></div>
  <div id="hitmarker">✕</div>
  <div id="overlay">
    <h1>DUCKHUNTER</h1>
    <p>Point and click to shoot the ducks. Reload with <b>R</b> or right-click. Don't let them escape!</p>
    <button id="startBtn">START HUNT</button>
  </div>
  <div id="gameover" class="hidden">
    <h1>HUNT OVER</h1>
    <p>Final Score: <span id="finalScore">0</span></p>
    <p>Ducks Bagged: <span id="finalKills">0</span></p>
    <button id="restartBtn">HUNT AGAIN</button>
  </div>
</div>
<script src="game.js"></script>
</body>
</html>
>>>>>>> CONTENT

*** CREATE: style.css ***
<<<<<<< CONTENT
* { margin: 0; padding: 0; box-sizing: border-box; }

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #000;
  font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  user-select: none;
}

#game {
  position: relative;
  width: 100vw;
  height: 100vh;
  cursor: none;
}

#scene {
  display: block;
  width: 100%;
  height: 100%;
}

#crosshair {
  position: absolute;
  width: 26px;
  height: 26px;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: 20;
}
#crosshair::before, #crosshair::after {
  content: "";
  position: absolute;
  background: rgba(255, 60, 60, 0.9);
  box-shadow: 0 0 4px rgba(0,0,0,0.8);
}
#crosshair::before { left: 50%; top: 0; width: 2px; height: 100%; transform: translateX(-50%); }
#crosshair::after { top: 50%; left: 0; height: 2px; width: 100%; transform: translateY(-50%); }

#hud {
  position: absolute;
  top: 16px;
  left: 16px;
  display: flex;
  gap: 22px;
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  text-shadow: 0 2px 6px #000, 0 0 12px rgba(0,0,0,0.9);
  z-index: 15;
  letter-spacing: 1px;
}
.hud-item span { color: #ffd23f; }

#reload-bar {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  width: 220px;
  height: 12px;
  border: 2px solid rgba(255,255,255,0.7);
  border-radius: 8px;
  background: rgba(0,0,0,0.5);
  overflow: hidden;
  opacity: 0;
  transition: opacity 0.15s;
  z-index: 15;
}
#reload-bar.active { opacity: 1; }
#reload-fill {
  width: 0%;
  height: 100%;
  background: linear-gradient(90deg, #ffd23f, #ff8c00);
}

#hitmarker {
  position: absolute;
  transform: translate(-50%, -50%);
  color: #fff;
  font-size: 30px;
  font-weight: bold;
  text-shadow: 0 0 8px #ff3c3c;
  opacity: 0;
  pointer-events: none;
  z-index: 25;
}
#hitmarker.show { animation: hit 0.25s ease-out; }
@keyframes hit {
  0% { opacity: 1; transform: translate(-50%, -50%) scale(0.6); }
  100% { opacity: 0; transform: translate(-50%, -50%) scale(1.4); }
}

#overlay, #gameover {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 18px;
  background: radial-gradient(circle at 50% 40%, rgba(20,40,70,0.85), rgba(0,0,0,0.95));
  color: #fff;
  text-align: center;
  z-index: 30;
  cursor: pointer;
}
#overlay h1, #gameover h1 {
  font-size: 64px;
  letter-spacing: 6px;
  color: #ffd23f;
  text-shadow: 0 4px 0 #b8860b, 0 8px 24px #000;
}
#overlay p, #gameover p {
  font-size: 18px;
  max-width: 520px;
  line-height: 1.5;
  color: #d8e2ee;
}
#overlay b { color: #ffd23f; }
button {
  margin-top: 10px;
  padding: 14px 42px;
  font-size: 22px;
  font-weight: bold;
  letter-spacing: 2px;
  color: #1a1a1a;
  background: linear-gradient(180deg, #ffe066, #ffb300);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 6px 0 #a06a00, 0 10px 20px rgba(0,0,0,0.6);
  transition: transform 0.08s, box-shadow 0.08s;
}
button:hover { transform: translateY(-2px); box-shadow: 0 8px 0 #a06a00, 0 12px 24px rgba(0,0,0,0.6); }
button:active { transform: translateY(4px); box-shadow: 0 2px 0 #a06a00; }

.hidden { display: none !important; }
>>>>>>> CONTENT

*** CREATE: game.js ***
<<<<<<< CONTENT
(() => {
  "use strict";

  const canvas = document.getElementById("scene");
  const ctx = canvas.getContext("2d");
  const crosshair = document.getElementById("crosshair");
  const scoreEl = document.getElementById("score");
  const ammoEl = document.getElementById("ammo");
  const timeEl = document.getElementById("time");
  const waveEl = document.getElementById("wave");
  const reloadBar = document.getElementById("reload-bar");
  const reloadFill = document.getElementById("reload-fill");
  const hitmarker = document.getElementById("hitmarker");
  const overlay = document.getElementById("overlay");
  const gameover = document.getElementById("gameover");
  const startBtn = document.getElementById("startBtn");
  const restartBtn = document.getElementById("restartBtn");
  const finalScore = document.getElementById("finalScore");
  const finalKills = document.getElementById("finalKills");

  let W = 0, H = 0, DPR = 1;

  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resize);
  resize();

  // ---------- Game state ----------
  const MAG_SIZE = 6;
  const RELOAD_TIME = 1.1; // seconds
  const GAME_TIME = 60;

  const state = {
    running: false,
    score: 0,
    kills: 0,
    ammo: MAG_SIZE,
    reloading: false,
    reloadT: 0,
    timeLeft: GAME_TIME,
    wave: 1,
    spawnTimer: 0,
    spawnInterval: 1.1,
    ducks: [],
    particles: [],
    feathers: [],
    shots: [],
    mouseX: W / 2,
    mouseY: H / 2,
    shake: 0,
    lastTime: 0,
  };

  // ---------- Duck ----------
  const DUCK_TYPES = [
    { name: "mallard", body: "#6b4a2b", head: "#1f7a3d", wing: "#8a6a45", size: 1.0, speed: 1.0, points: 100 },
    { name: "golden", body: "#d9a520", head: "#ffd23f", wing: "#f0c040", size: 0.85, speed: 1.5, points: 250 },
    { name: "bomber", body: "#3a3a3a", head: "#111", wing: "#555", size: 1.35, speed: 0.7, points: 150 },
  ];

  function spawnDuck() {
    const t = DUCK_TYPES[Math.floor(Math.random() * DUCK_TYPES.length)];
    const fromLeft = Math.random() < 0.5;
    const baseSpeed = (90 + state.wave * 22) * t.speed;
    const dir = fromLeft ? 1 : -1;
    const y = 80 + Math.random() * (H * 0.55);
    const duck = {
      type: t,
      x: fromLeft ? -80 : W + 80,
      y,
      vx: dir * baseSpeed,
      vy: (Math.random() - 0.5) * 40,
      baseY: y,
      phase: Math.random() * Math.PI * 2,
      bobAmp: 12 + Math.random() * 18,
      bobSpeed: 1.5 + Math.random() * 1.5,
      size: 34 * t.size,
      flap: 0,
      alive: true,
      hitFlash: 0,
      angle: 0,
    };
    state.ducks.push(duck);
  }

  // ---------- Particles ----------
  function spawnFeathers(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      state.feathers.push({
        x, y,
        vx: (Math.random() - 0.5) * 220,
        vy: -Math.random() * 160 - 40,
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 8,
        life: 1.2 + Math.random() * 0.8,
        maxLife: 2,
        size: 4 + Math.random() * 6,
        color,
      });
    }
  }

  function spawnBurst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 260;
      state.particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0.4 + Math.random() * 0.4,
        maxLife: 0.8,
        size: 2 + Math.random() * 4,
        color,
      });
    }
  }

  // ---------- Shooting ----------
  function shoot() {
    if (!state.running) return;
    if (state.reloading) return;
    if (state.ammo <= 0) {
      startReload();
      return;
    }
    state.ammo--;
    ammoEl.textContent = state.ammo;
    state.shake = 8;
    state.shots.push({ x: state.mouseX, y: state.mouseY, life: 0.12, maxLife: 0.12 });

    // hit test (topmost duck first)
    let hit = null;
    for (let i = state.ducks.length - 1; i >= 0; i--) {
      const d = state.ducks[i];
      if (!d.alive) continue;
      const dx = state.mouseX - d.x;
      const dy = state.mouseY - d.y;
      const r = d.size * 0.95;
      if (dx * dx + dy * dy <= r * r) { hit = d; break; }
    }

    if (hit) {
      hit.alive = false;
      state.kills++;
      state.score += hit.type.points;
      scoreEl.textContent = state.score;
      spawnFeathers(hit.x, hit.y, hit.type.wing, 14);
      spawnBurst(hit.x, hit.y, "#ffd23f", 12);
      showHitmarker(state.mouseX, state.mouseY);
    } else {
      spawnBurst(state.mouseX, state.mouseY, "#ffffff", 5);
    }

    if (state.ammo === 0) startReload();
  }

  function startReload() {
    if (state.reloading || state.ammo === MAG_SIZE) return;
    state.reloading = true;
    state.reloadT = 0;
    reloadBar.classList.add("active");
  }

  function finishReload() {
    state.reloading = false;
    state.ammo = MAG_SIZE;
    ammoEl.textContent = state.ammo;
    reloadBar.classList.remove("active");
    reloadFill.style.width = "0%";
  }

  function showHitmarker(x, y) {
    hitmarker.style.left = x + "px";
    hitmarker.style.top = y + "px";
    hitmarker.classList.remove("show");
    void hitmarker.offsetWidth;
    hitmarker.classList.add("show");
  }

  // ---------- Input ----------
  window.addEventListener("mousemove", (e) => {
    state.mouseX = e.clientX;
    state.mouseY = e.clientY;
    crosshair.style.left = e.clientX + "px";
    crosshair.style.top = e.clientY + "px";
  });

  window.addEventListener("mousedown", (e) => {
    if (!state.running) return;
    if (e.button === 0) shoot();
    else if (e.button === 2) startReload();
  });

  window.addEventListener("contextmenu", (e) => e.preventDefault());

  window.addEventListener("keydown", (e) => {
    if (e.key === "r" || e.key === "R") startReload();
  });

  // ---------- Update ----------
  function update(dt) {
    if (!state.running) return;

    // timer
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) {
      state.timeLeft = 0;
      timeEl.textContent = "0";
      endGame();
      return;
    }
    timeEl.textContent = Math.ceil(state.timeLeft);

    // reload
    if (state.reloading) {
      state.reloadT += dt;
      const p = Math.min(state.reloadT / RELOAD_TIME, 1);
      reloadFill.style.width = (p * 100) + "%";
      if (p >= 1) finishReload();
    }

    // wave progression
    const newWave = 1 + Math.floor((GAME_TIME - state.timeLeft) / 15);
    if (newWave !== state.wave) {
      state.wave = newWave;
      waveEl.textContent = state.wave;
      state.spawnInterval = Math.max(0.45, 1.1 - state.wave * 0.12);
    }

    // spawn
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnDuck();
      state.spawnTimer = state.spawnInterval * (0.7 + Math.random() * 0.6);
    }

    // ducks
    for (let i = state.ducks.length - 1; i >= 0; i--) {
      const d = state.ducks[i];
      d.x += d.vx * dt;
      d.phase += d.bobSpeed * dt;
      d.y = d.baseY + Math.sin(d.phase) * d.bobAmp;
      d.flap += dt * 12;
      d.angle = Math.sin(d.phase) * 0.15 + (d.vx > 0 ? 0.05 : -0.05);
      if (d.hitFlash > 0) d.hitFlash -= dt;

      // escaped
      if (d.x < -140 || d.x > W + 140) {
        state.ducks.splice(i, 1);
        continue;
      }
      if (!d.alive) {
        // falling
        d.vy += 900 * dt;
        d.y += d.vy * dt;
        d.x += d.vx * dt * 0.3;
        d.angle += dt * 6;
        if (d.y > H + 100) state.ducks.splice(i, 1);
      }
    }

    // particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.life -= dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 500 * dt;
      p.vx *= 0.98;
      if (p.life <= 0) state.particles.splice(i, 1);
    }

    // feathers
    for (let i = state.feathers.length - 1; i >= 0; i--) {
      const f = state.feathers[i];
      f.life -= dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      f.vy += 260 * dt;
      f.vx *= 0.99;
      f.rot += f.vr * dt;
      if (f.life <= 0) state.feathers.splice(i, 1);
    }

    // shots
    for (let i = state.shots.length - 1; i >= 0; i--) {
      state.shots[i].life -= dt;
      if (state.shots[i].life <= 0) state.shots.splice(i, 1);
    }

    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 40);
  }

  // ---------- Draw ----------
  function drawSky() {
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "#1b3a5c");
    g.addColorStop(0.45, "#3f6f9c");
    g.addColorStop(0.75, "#8fb8d6");
    g.addColorStop(1, "#d9e6c8");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    // sun glow
    const sunX = W * 0.78, sunY = H * 0.22;
    const sg = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 260);
    sg.addColorStop(0, "rgba(255,240,180,0.9)");
    sg.addColorStop(0.4, "rgba(255,220,140,0.35)");
    sg.addColorStop(1, "rgba(255,220,140,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);

    // clouds
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    drawCloud(W * 0.2, H * 0.18, 90);
    drawCloud(W * 0.55, H * 0.12, 70);
    drawCloud(W * 0.85, H * 0.3, 110);
  }

  function drawCloud(x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.arc(x + r * 0.8, y + r * 0.2, r * 0.7, 0, Math.PI * 2);
    ctx.arc(x - r * 0.8, y + r * 0.25, r * 0.6, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawGround() {
    const gy = H * 0.82;
    const g = ctx.createLinearGradient(0, gy, 0, H);
    g.addColorStop(0, "#4a6b2f");
    g.addColorStop(1, "#2c3f1c");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(0, gy + 30);
    for (let x = 0; x <= W; x += 40) {
      ctx.lineTo(x, gy + Math.sin(x * 0.01) * 18);
    }
    ctx.lineTo(W, H);
    ctx.lineTo(0, H);
    ctx.closePath();
    ctx.fill();

    // reeds
    ctx.strokeStyle = "rgba(30,50,20,0.7)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 40; i++) {
      const x = (i / 40) * W + Math.sin(i * 3.3) * 20;
      const h = 30 + (i % 5) * 12;
      ctx.beginPath();
      ctx.moveTo(x, gy + 20);
      ctx.quadraticCurveTo(x + 6, gy + 20 - h * 0.6, x + 2, gy + 20 - h);
      ctx.stroke();
    }
  }

  function drawDuck(d) {
    ctx.save();
    ctx.translate(d.x, d.y);
    ctx.rotate(d.angle);
    const s = d.size / 34;
    ctx.scale(s, s);

    const flap = Math.sin(d.flap) * 0.6;
    const dir = d.vx >= 0 ? 1 : -1;
    ctx.scale(dir, 1);

    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.15)";
    ctx.beginPath();
    ctx.ellipse(0, 40, 30, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // body
    ctx.fillStyle = d.type.body;
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 18, 0, 0, Math.PI * 2);
    ctx.fill();

    // wing (flapping)
    ctx.save();
    ctx.translate(-4, -6);
    ctx.rotate(flap);
    ctx.fillStyle = d.type.wing;
    ctx.beginPath();
    ctx.ellipse(-6, 0, 22, 10, -0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // tail
    ctx.fillStyle = d.type.body;
    ctx.beginPath();
    ctx.moveTo(-26, -4);
    ctx.lineTo(-40, -12);
    ctx.lineTo(-38, 2);
    ctx.closePath();
    ctx.fill();

    // neck + head
    ctx.fillStyle = d.type.head;
    ctx.beginPath();
    ctx.ellipse(22, -14, 12, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(14, -6);
    ctx.lineTo(26, -18);
    ctx.lineTo(30, -6);
    ctx.closePath();
    ctx.fill();

    // eye
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(26, -16, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(27, -16, 1.6, 0, Math.PI * 2);
    ctx.fill();

    // beak
    ctx.fillStyle = "#e8a020";
    ctx.beginPath();
    ctx.moveTo(32, -14);
    ctx.lineTo(46, -12);
    ctx.lineTo(32, -8);
    ctx.closePath();
    ctx.fill();

    if (d.hitFlash > 0) {
      ctx.globalAlpha = d.hitFlash * 3;
      ctx.fillStyle = "#fff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 32, 20, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    ctx.restore();
  }

  function draw() {
    ctx.save();
    if (state.shake > 0) {
      ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    }

    drawSky();
    drawGround();

    // ducks
    for (const d of state.ducks) drawDuck(d);

    // feathers
    for (const f of state.feathers) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, f.life / f.maxLife);
      ctx.translate(f.x, f.y);
      ctx.rotate(f.rot);
      ctx.fillStyle = f.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, f.size, f.size * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // particles
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // muzzle flash / shot
    for (const s of state.shots) {
      const a = s.life / s.maxLife;
      ctx.globalAlpha = a;
      const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 60);
      g.addColorStop(0, "rgba(255,255,200,0.9)");
      g.addColorStop(0.4, "rgba(255,180,60,0.5)");
      g.addColorStop(1, "rgba(255,120,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(s.x, s.y, 60, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // vignette
    const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75);
    vg.addColorStop(0, "rgba(0,0,0,0)");
    vg.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, W, H);

    ctx.restore();
  }

  // ---------- Loop ----------
  function loop(t) {
    if (!state.lastTime) state.lastTime = t;
    let dt = (t - state.lastTime) / 1000;
    state.lastTime = t;
    if (dt > 0.05) dt = 0.05;

    update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  // ---------- Game control ----------
  function startGame() {
    state.running = true;
    state.score = 0;
    state.kills = 0;
    state.ammo = MAG_SIZE;
    state.reloading = false;
    state.reloadT = 0;
    state.timeLeft = GAME_TIME;
    state.wave = 1;
    state.spawnTimer = 0.4;
    state.spawnInterval = 1.1;
    state.ducks = [];
    state.particles = [];
    state.feathers = [];
    state.shots = [];
    state.shake = 0;

    scoreEl.textContent = "0";
    ammoEl.textContent = MAG_SIZE;
    timeEl.textContent = GAME_TIME;
    waveEl.textContent = "1";
    reloadBar.classList.remove("active");
    reloadFill.style.width = "0%";

    overlay.classList.add("hidden");
    gameover.classList.add("hidden");
  }

  function endGame() {
    state.running = false;
    finalScore.textContent = state.score;
    finalKills.textContent = state.kills;
    gameover.classList.remove("hidden");
  }

  startBtn.addEventListener("click", (e) => { e.stopPropagation(); startGame(); });
  restartBtn.addEventListener("click", (e) => { e.stopPropagation(); startGame(); });

  // initial crosshair position
  crosshair.style.left = (W / 2) + "px";
  crosshair.style.top = (H / 2) + "px";

  requestAnimationFrame(loop);
})();
>>>>>>> CONTENT
