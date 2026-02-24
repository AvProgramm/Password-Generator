// ===== DOM ELEMENTS =====
const generateBtn = document.getElementById('generateBtn');
const refreshBtn = document.getElementById('refreshBtn');
const copyBtn = document.getElementById('copyBtn');
const inputEl = document.getElementById('input');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValue = document.getElementById('lengthValue');
const passwordDisplay = document.getElementById('passwordDisplay');
const mainCard = document.getElementById('mainCard');
const toast = document.getElementById('toast');

// Strength meter
const bars = [document.getElementById('bar1'), document.getElementById('bar2'), document.getElementById('bar3'), document.getElementById('bar4')];
const strengthLabel = document.getElementById('strengthLabel');

// Checkboxes
const uppercaseEl = document.getElementById('uppercase');
const lowercaseEl = document.getElementById('lowercase');
const numbersEl = document.getElementById('numbers');
const symbolsEl = document.getElementById('symbols');

// ===== CHARACTER SETS =====
const CHARS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?'
};

// ===== SLIDER =====
lengthSlider.addEventListener('input', () => {
  lengthValue.textContent = lengthSlider.value;
  // Animate the number
  lengthValue.style.transform = 'scale(1.3)';
  setTimeout(() => lengthValue.style.transition = 'transform 0.2s', 0);
  setTimeout(() => lengthValue.style.transform = 'scale(1)', 150);
});

// ===== PASSWORD GENERATION =====
function createPassword() {
  let charPool = '';
  if (uppercaseEl.checked) charPool += CHARS.uppercase;
  if (lowercaseEl.checked) charPool += CHARS.lowercase;
  if (numbersEl.checked) charPool += CHARS.numbers;
  if (symbolsEl.checked) charPool += CHARS.symbols;

  if (charPool.length === 0) {
    inputEl.value = '';
    inputEl.placeholder = 'Select at least one option!';
    updateStrength('');
    return;
  }

  const length = parseInt(lengthSlider.value);
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    password += charPool[randomIndex];
  }

  // Animated reveal
  animatePasswordReveal(password);
  updateStrength(password);

  // Card shake + flash
  mainCard.classList.add('shake');
  passwordDisplay.classList.add('flash');
  setTimeout(() => {
    mainCard.classList.remove('shake');
    passwordDisplay.classList.remove('flash');
  }, 600);
}

function animatePasswordReveal(password) {
  const scrambleChars = '!@#$%^&*0123456789ABCDEFabcdef';
  let iterations = 0;
  const maxIterations = 8;

  const interval = setInterval(() => {
    inputEl.value = password
      .split('')
      .map((char, index) => {
        if (index < iterations) return password[index];
        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
      })
      .join('');

    iterations += password.length / maxIterations;
    if (iterations >= password.length) {
      clearInterval(interval);
      inputEl.value = password;
    }
  }, 40);
}

// ===== STRENGTH METER =====
function updateStrength(password) {
  // Clear all
  bars.forEach(bar => bar.className = 'bar');

  if (!password) {
    strengthLabel.textContent = '—';
    strengthLabel.style.color = 'var(--text-muted)';
    return;
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 16) score++;
  if (password.length >= 24) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  let level, label, color;
  if (score <= 2) {
    level = 1; label = 'Weak'; color = 'var(--danger)';
  } else if (score <= 3) {
    level = 2; label = 'Fair'; color = 'var(--warning)';
  } else if (score <= 4) {
    level = 3; label = 'Strong'; color = 'var(--success)';
  } else {
    level = 4; label = 'Insane'; color = 'var(--accent-cyan)';
  }

  const classes = ['active-weak', 'active-medium', 'active-strong', 'active-insane'];
  for (let i = 0; i < level; i++) {
    bars[i].classList.add(classes[Math.min(level - 1, 3)]);
  }

  strengthLabel.textContent = label;
  strengthLabel.style.color = color;
}

// ===== COPY =====
function copyPassword() {
  if (!inputEl.value) return;
  inputEl.select();
  inputEl.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(inputEl.value);

  // Show toast
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ===== EVENT LISTENERS =====
generateBtn.addEventListener('click', createPassword);
refreshBtn.addEventListener('click', createPassword);
copyBtn.addEventListener('click', copyPassword);

// Generate on load
createPassword();

// ===== PARTICLE SYSTEM =====
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.5;
    this.speedY = (Math.random() - 0.5) * 0.5;
    this.opacity = Math.random() * 0.5 + 0.1;
    this.hue = Math.random() > 0.5 ? 180 : 290; // cyan or magenta
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.opacity})`;
    ctx.fill();
  }
}

const particles = [];
const PARTICLE_COUNT = 80;

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        const opacity = (1 - distance / 120) * 0.12;
        ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.update();
    p.draw();
  });

  drawConnections();
  requestAnimationFrame(animateParticles);
}

animateParticles();