const heartsLayer = document.querySelector(".hearts");

for (let i = 0; i < 34; i += 1) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.style.setProperty("--x", `${Math.random() * 100}%`);
  heart.style.setProperty("--size", `${8 + Math.random() * 18}px`);
  heart.style.setProperty("--speed", `${5 + Math.random() * 7}s`);
  heart.style.setProperty("--delay", `${Math.random() * -10}s`);
  heart.style.setProperty("--drift", `${-50 + Math.random() * 100}px`);
  heartsLayer.appendChild(heart);
}

const canvas = document.getElementById("loveCanvas");
const ctx = canvas.getContext("2d");
const particles = [];
const totalParticles = 760;
let width = 0;
let height = 0;
let startTime = performance.now();

function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  width = rect.width;
  height = rect.height;
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function spiralPoint(index, progress) {
  const centerX = width / 2;
  const centerY = height * 0.46;
  const t = index / totalParticles;
  const angle = t * Math.PI * 10 + progress * 1.8;
  const radius = 12 + t * Math.min(width, height) * 0.32;

  return {
    x: centerX + Math.cos(angle) * radius,
    y: centerY + Math.sin(angle) * radius * 0.78,
  };
}

function heartPoint(index, progress) {
  const centerX = width / 2;
  const centerY = height * 0.45;
  const t = (index / totalParticles) * Math.PI * 2;
  const scale = Math.min(width, height) * 0.018;
  const wobble = Math.sin(progress * 2 + index) * 1.8;
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));

  return {
    x: centerX + x * scale + wobble,
    y: centerY + y * scale + wobble * 0.35,
  };
}

function createParticles() {
  particles.length = 0;

  for (let i = 0; i < totalParticles; i += 1) {
    particles.push({
      x: width / 2 + (Math.random() - 0.5) * width,
      y: height / 2 + (Math.random() - 0.5) * height,
      size: 1.1 + Math.random() * 2.5,
      speed: 0.035 + Math.random() * 0.045,
      hue: 324 + Math.random() * 34,
      alpha: 0.55 + Math.random() * 0.45,
    });
  }
}

function drawSparkle(x, y, size, hue, alpha) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = `hsl(${hue} 100% 75%)`;
  ctx.shadowColor = `hsl(${hue} 100% 70%)`;
  ctx.shadowBlur = 14;
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function animate(now) {
  const elapsed = (now - startTime) / 1000;
  const loop = elapsed % 9;
  const morph = Math.min(Math.max((loop - 3) / 2.6, 0), 1);
  const easedMorph = morph * morph * (3 - 2 * morph);

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "rgba(6, 5, 9, 0.16)";
  ctx.fillRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    const a = spiralPoint(index, elapsed);
    const b = heartPoint(index, elapsed);
    const targetX = a.x + (b.x - a.x) * easedMorph;
    const targetY = a.y + (b.y - a.y) * easedMorph;

    particle.x += (targetX - particle.x) * particle.speed;
    particle.y += (targetY - particle.y) * particle.speed;

    const pulse = 0.75 + Math.sin(elapsed * 4 + index * 0.22) * 0.25;
    drawSparkle(particle.x, particle.y, particle.size * pulse, particle.hue, particle.alpha);
  });

  const centerGlow = ctx.createRadialGradient(width / 2, height * 0.45, 20, width / 2, height * 0.45, width * 0.42);
  centerGlow.addColorStop(0, "rgba(255, 81, 158, 0.24)");
  centerGlow.addColorStop(1, "rgba(255, 81, 158, 0)");
  ctx.fillStyle = centerGlow;
  ctx.fillRect(0, 0, width, height);

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
requestAnimationFrame(animate);
