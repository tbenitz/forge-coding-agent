*** CREATE: index.html ***
<<<<<<< CONTENT
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Neon Dodge</title>
<style>
  :root {
    --bg: #0b0f1a;
    --accent: #00e5ff;
    --accent2: #ff2e88;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    height: 100%;
    background: radial-gradient(circle at 50% 20%, #131a2e 0%, var(--bg) 70%);
    color: #e6f1ff;
    font-family: "Segoe UI", system-ui, -apple-system, sans-serif;
    overflow: hidden;
    user-select: none;
  }
  #wrap {
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  canvas {
    display: block;
    background: #070a12;
    border-radius: 14px;
    box-shadow: 0 0 40px rgba(0, 229, 255, 0.25), 0 0 120px rgba(255, 46, 136, 0.12);
    touch-action: none;
    max-width: 100%;
    max-height: 100%;
  }
  #hud {
    position: absolute;
    top: 18px;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    gap: 40px;
    pointer-events: none;
    font-variant-numeric: tabular-nums;
    letter-spacing: 1px;
    text-shadow: 0 0 12px rgba(0, 229, 255, 0.6);
  }
  #hud .label { font-size: 12px; opacity: 0.6; text-transform: uppercase; }
  #hud .value { font-size: 26px; font-weight: 700; }
  #overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 18px;
    background: rgba(7, 10, 18, 0.82);
    backdrop-filter: blur(6px);
    border-radius: 14px;
    text-align: center;
    padding: 24px;
  }
  #overlay.hidden { display: none; }
  #overlay h1 {
    margin: 0;
    font-size: clamp(32px, 7vw, 64px);
    letter-spacing: 4px;
    background: linear-gradient(90deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    text-transform: uppercase;
  }
  #overlay p { margin: 0; opacity: 0.8; max-width: 420px; line-height: 1.5; }
  #overlay .final { font-size: 20px; color: var(--accent); }
  button {
    margin-top: 8px;
    padding: 14px 42px;
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #04121a;
    background: linear-gradient(90deg, var(--accent), #7bffd4);
    border: none;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 0 24px rgba(0, 229, 255, 0.5);
    transition: transform 0.12s ease, box-shadow 0.12s ease;
  }
  button:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 0 36px rgba(0, 229, 255, 0.8); }
  button:active { transform: scale(0.97); }
  .hint { font-size: 13px; opacity: 0.55; }
</style>
</head>
<body>
<div id="wrap">
  <canvas id="game"></canvas>
  <div id="hud">
    <div><div class="label">Score</div><div class="value" id="score">0</div></div>
    <div><div class="label">Best</div><div class="value" id="best">0</div></div>
  </div>
  <div id="overlay">
    <h1>Neon Dodge</h1>
    <p>Move with <strong>mouse</strong>, <strong>touch</strong>, or <strong>WASD / arrow keys</strong>. Dodge the falling neon blocks and survive as long as you can.</p>
    <button id="startBtn">Play</button>
    <div class="hint">Collect glowing orbs for bonus points</div>
  </div>
</div>
<script>
(() => {
  const canvas = document.getElementById('game');
  const ctx = canvas.getContext('2d');
  const overlay = document.getElementById('overlay');
  const startBtn = document.getElementById('startBtn');
  const scoreEl = document.getElementById('score');
  const bestEl = document.getElementById('best');

  let W = 0, H = 0, DPR = 1;

  function resize() {
    const maxW = Math.min(window.innerWidth - 24, 900);
    const maxH = Math.min(window.innerHeight - 24, 700);
    W = maxW;
    H = maxH;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', resize);
  resize();

  const state = {
    running: false,
    score: 0,
    best: Number(localStorage.getItem('neonDodgeBest') || 0),
    time: 0,
    spawnTimer: 0,
    orbTimer: 0,
    shake: 0,
    particles: [],
    stars: [],
  };
  bestEl.textContent = state.best;

  const player = {
    x: W / 2,
    y: H - 70,
    r: 14,
    targetX: W / 2,
    targetY: H - 70,
    vx: 0,
    vy: 0,
  };

  const keys = {};
  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(e.key.toLowerCase())) e.preventDefault();
  });
  window.addEventListener('keyup', (e) => { keys[e.key.toLowerCase()] = false; });

  let pointerActive = false;
  function setPointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    player.targetX = clientX - rect.left;
    player.targetY = clientY - rect.top;
    pointerActive = true;
  }
  canvas.addEventListener('mousemove', (e) => setPointer(e.clientX, e.clientY));
  canvas.addEventListener('touchstart', (e) => { setPointer(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', (e) => { setPointer(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }, { passive: false });

  const obstacles = [];
  const orbs = [];

  function spawnObstacle() {
    const size = 18 + Math.random() * 34;
    const speed = 130 + state.time * 6 + Math.random() * 90;
    obstacles.push({
      x: Math.random() * (W - size) + size / 2,
      y: -size,
      w: size,
      h: size,
      vy: speed,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 3,
      hue: Math.random() < 0.5 ? 190 : 330,
    });
  }

  function spawnOrb() {
    const r = 9;
    orbs.push({
      x: Math.random() * (W - 60) + 30,
      y: -r,
      r,
      vy: 110 + state.time * 3,
      phase: Math.random() * Math.PI * 2,
    });
  }

  function burst(x, y, color, count) {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 260;
      state.particles.push({
        x, y,
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
        life: 0.5 + Math.random() * 0.5,
        max: 1,
        color,
        size: 2 + Math.random() * 3,
      });
    }
  }

  function initStars() {
    state.stars = [];
    for (let i = 0; i < 70; i++) {
      state.stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random() * 0.8 + 0.2,
        s: Math.random() * 1.6 + 0.4,
      });
    }
  }
  initStars();

  function reset() {
    obstacles.length = 0;
    orbs.length = 0;
    state.particles.length = 0;
    state.score = 0;
    state.time = 0;
    state.spawnTimer = 0;
    state.orbTimer = 1.5;
    state.shake = 0;
    player.x = W / 2;
    player.y = H - 70;
    player.targetX = W / 2;
    player.targetY = H - 70;
    player.vx = 0;
    player.vy = 0;
    pointerActive = false;
    scoreEl.textContent = '0';
    initStars();
  }

  function start() {
    reset();
    state.running = true;
    overlay.classList.add('hidden');
  }

  function gameOver() {
    state.running = false;
    state.shake = 18;
    burst(player.x, player.y, '#ff2e88', 40);
    if (state.score > state.best) {
      state.best = Math.floor(state.score);
      localStorage.setItem('neonDodgeBest', state.best);
      bestEl.textContent = state.best;
    }
    overlay.querySelector('h1').textContent = 'Game Over';
    overlay.querySelector('p').innerHTML = `You scored <span class="final">${Math.floor(state.score)}</span> points.`;
    overlay.querySelector('button').textContent = 'Play Again';
    overlay.classList.remove('hidden');
  }

  startBtn.addEventListener('click', start);

  let last = performance.now();
  function loop(now) {
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.05) dt = 0.05;

    update(dt);
    render(dt);
    requestAnimationFrame(loop);
  }

  function update(dt) {
    // stars drift
    for (const s of state.stars) {
      s.y += (10 + s.z * 40) * dt * (state.running ? 1 : 0.3);
      if (s.y > H) { s.y = -2; s.x = Math.random() * W; }
    }

    // particles
    for (let i = state.particles.length - 1; i >= 0; i--) {
      const p = state.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 320 * dt;
      p.vx *= 0.98;
      p.life -= dt;
      if (p.life <= 0) state.particles.splice(i, 1);
    }

    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt * 60);

    if (!state.running) return;

    state.time += dt;
    state.score += dt * 10;

    // keyboard movement
    const speed = 520;
    let kx = 0, ky = 0;
    if (keys['a'] || keys['arrowleft']) kx -= 1;
    if (keys['d'] || keys['arrowright']) kx += 1;
    if (keys['w'] || keys['arrowup']) ky -= 1;
    if (keys['s'] || keys['arrowdown']) ky += 1;
    if (kx || ky) {
      const len = Math.hypot(kx, ky) || 1;
      player.targetX += (kx / len) * speed * dt;
      player.targetY += (ky / len) * speed * dt;
      pointerActive = false;
    }

    // smooth follow
    const follow = pointerActive ? 0.22 : 0.16;
    player.x += (player.targetX - player.x) * Math.min(1, follow * 60 * dt);
    player.y += (player.targetY - player.y) * Math.min(1, follow * 60 * dt);
    player.x = Math.max(player.r, Math.min(W - player.r, player.x));
    player.y = Math.max(player.r, Math.min(H - player.r, player.y));

    // spawn
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnObstacle();
      const interval = Math.max(0.22, 0.85 - state.time * 0.012);
      state.spawnTimer = interval * (0.7 + Math.random() * 0.6);
    }
    state.orbTimer -= dt;
    if (state.orbTimer <= 0) {
      spawnOrb();
      state.orbTimer = 2.5 + Math.random() * 3;
    }

    // obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const o = obstacles[i];
      o.y += o.vy * dt;
      o.rot += o.vr * dt;
      if (o.y - o.h > H) { obstacles.splice(i, 1); continue; }
      // collision (circle vs rotated square approximated by circle)
      const cx = Math.max(o.x - o.w / 2, Math.min(player.x, o.x + o.w / 2));
      const cy = Math.max(o.y - o.h / 2, Math.min(player.y, o.y + o.h / 2));
      const dx = player.x - cx, dy = player.y - cy;
      if (dx * dx + dy * dy < player.r * player.r * 0.85) {
        gameOver();
        return;
      }
    }

    // orbs
    for (let i = orbs.length - 1; i >= 0; i--) {
      const orb = orbs[i];
      orb.y += orb.vy * dt;
      orb.phase += dt * 4;
      if (orb.y - orb.r > H) { orbs.splice(i, 1); continue; }
      const dx = player.x - orb.x, dy = player.y - orb.y;
      if (dx * dx + dy * dy < (player.r + orb.r) * (player.r + orb.r)) {
        state.score += 25;
        burst(orb.x, orb.y, '#7bffd4', 14);
        orbs.splice(i, 1);
      }
    }

    scoreEl.textContent = Math.floor(state.score);
  }

  function render() {
    ctx.save();
    if (state.shake > 0) {
      ctx.translate((Math.random() - 0.5) * state.shake, (Math.random() - 0.5) * state.shake);
    }

    // background
    ctx.fillStyle = '#070a12';
    ctx.fillRect(-20, -20, W + 40, H + 40);

    // stars
    for (const s of state.stars) {
      ctx.globalAlpha = 0.25 + s.z * 0.6;
      ctx.fillStyle = '#9fd8ff';
      ctx.fillRect(s.x, s.y, s.s, s.s);
    }
    ctx.globalAlpha = 1;

    // grid glow
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.06)';
    ctx.lineWidth = 1;
    const gs = 48;
    for (let x = 0; x <= W; x += gs) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y <= H; y += gs) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    // orbs
    for (const orb of orbs) {
      const pulse = 1 + Math.sin(orb.phase) * 0.18;
      ctx.save();
      ctx.shadowColor = '#7bffd4';
      ctx.shadowBlur = 22;
      ctx.fillStyle = '#7bffd4';
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.r * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // obstacles
    for (const o of obstacles) {
      ctx.save();
      ctx.translate(o.x, o.y);
      ctx.rotate(o.rot);
      ctx.shadowColor = `hsl(${o.hue}, 100%, 60%)`;
      ctx.shadowBlur = 18;
      ctx.fillStyle = `hsl(${o.hue}, 100%, 58%)`;
      ctx.fillRect(-o.w / 2, -o.h / 2, o.w, o.h);
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(255,255,255,0.7)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-o.w / 2, -o.h / 2, o.w, o.h);
      ctx.restore();
    }

    // particles
    for (const p of state.particles) {
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // player
    if (state.running || state.shake > 0) {
      ctx.save();
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 26;
      const grad = ctx.createRadialGradient(player.x, player.y, 2, player.x, player.y, player.r * 1.6);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#00e5ff');
      grad.addColorStop(1, 'rgba(0,229,255,0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r * 1.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eaffff';
      ctx.beginPath();
      ctx.arc(player.x, player.y, player.r * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  requestAnimationFrame(loop);
})();
</script>
</body>
</html>
>>>>>>> CONTENT
