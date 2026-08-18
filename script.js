const PASSCODE = "171023";
let inputPasscode = "";

function switchScreen(fromId, toId) {
  document.getElementById(fromId).classList.remove('active');
  document.getElementById(toId).classList.add('active');
}

function pressKey(val) {
  if (val === '⌫') {
    inputPasscode = inputPasscode.slice(0, -1);
  } else if (inputPasscode.length < 6) {
    inputPasscode += val;
  }
  
  updateDots();

  if (inputPasscode.length === 6) {
    if (inputPasscode === PASSCODE) {
      setTimeout(startUnlockSequence, 300);
    } else {
      setTimeout(() => {
        alert("Incorrect passcode!");
        inputPasscode = "";
        updateDots();
      }, 200);
    }
  }
}

function updateDots() {
  const dots = document.querySelectorAll('.passcode-dot');
  dots.forEach((dot, index) => {
    dot.textContent = index < inputPasscode.length ? "•" : "";
  });
}

function startUnlockSequence() {
  switchScreen('screen-passcode', 'screen-date');
  setTimeout(() => {
    switchScreen('screen-date', 'screen-loading');
    runLoadingBar();
  }, 1800);
}

function runLoadingBar() {
  let progress = 0;
  const bar = document.getElementById('loading-bar');
  const interval = setInterval(() => {
    progress += 4;
    bar.style.width = progress + '%';
    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        switchScreen('screen-loading', 'screen-envelope');
      }, 400);
    }
  }, 80);
}

function openEnvelope() {
  switchScreen('screen-envelope', 'screen-hero');
}

function showLetter() {
  switchScreen('screen-hero', 'screen-letter');
}

function showWishScreen() {
  switchScreen('screen-letter', 'screen-wish');
}

function blowCandles() {
  const flames = document.querySelectorAll('.flame');
  flames.forEach(f => f.classList.add('off'));
  
  const wishScreen = document.getElementById('screen-wish');
  wishScreen.classList.add('celebrate');
  
  document.getElementById('wish-title').style.display = 'none';
  document.getElementById('music-badge').style.display = 'flex';
  
  startFireworks();
}

/* Canvas Fireworks Animation */
function startFireworks() {
  const canvas = document.getElementById('fireworks-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particles = [];
  const colors = ['#ff4d6d', '#ffb703', '#3a86ff', '#8338ec', '#06d6a0'];

  function createFirework(x, y) {
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: x,
        y: y,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 5 + 2,
        radius: Math.random() * 3 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1
      });
    }
  }

  setInterval(() => {
    createFirework(
      Math.random() * canvas.width,
      Math.random() * canvas.height * 0.7
    );
  }, 500);

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p, index) => {
      p.x += Math.cos(p.angle) * p.speed;
      p.y += Math.sin(p.angle) * p.speed;
      p.alpha -= 0.015;

      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.restore();

      if (p.alpha <= 0) particles.splice(index, 1);
    });
    requestAnimationFrame(loop);
  }
  loop();
}