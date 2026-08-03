let musicPlaying = false;
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicVisualizer = document.querySelector('.music-visualizer');

let audioContext;
let analyser;
let dataArray;
let audioSource;

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    dataArray = new Uint8Array(analyser.frequencyBinCount);

    audioSource = audioContext.createMediaElementSource(bgMusic);
    audioSource.connect(analyser);
    analyser.connect(audioContext.destination);
  }
}

function toggleMusic() {
  if (musicPlaying) {
    bgMusic.pause();
    musicVisualizer.classList.remove('active');
    musicToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    `;
  } else {
    initAudioContext();
    bgMusic.play().catch(e => console.log('Audio play failed:', e));
    musicVisualizer.classList.add('active');
    musicToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    `;
  }
  musicPlaying = !musicPlaying;
}

bgMusic.volume = 0.5;

function openModal(title, issuer, filePath) {
  const modal = document.getElementById('certificate-modal');
  const contentArea = document.getElementById('modal-content-area');

  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-issuer').textContent = `Issued by: ${issuer}`;

    contentArea.innerHTML = `<img src="${filePath}" alt="${title}" class="certificate-image">`;

  modal.style.display = 'block';
  document.body.classList.add('modal-open');
}

function closeModal() {
  const modal = document.getElementById('certificate-modal');
  modal.style.display = 'none';
  document.body.classList.remove('modal-open');

  setTimeout(() => {
    document.getElementById('modal-content-area').innerHTML = `
      <div class="certificate-placeholder">
        <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M12 15l-2 5l2-2l2 2l-2-5z"/>
          <path d="M12 3l2 5l-2-2l-2 2l2-5z"/>
          <circle cx="12" cy="9" r="3"/>
        </svg>
        <p>Certificate Image</p>
        <p class="placeholder-text">Add certificate images to the certificates folder to display them here</p>
      </div>
    `;
  }, 300);
}

window.onclick = function(event) {
  const modal = document.getElementById('certificate-modal');
  if (event.target == modal) {
    closeModal();
  }
}

const canvas = document.getElementById('spiderweb');
const ctx = canvas.getContext('2d');
let time = 0;
let mouse = { x: null, y: null };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

window.addEventListener('mousemove', (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

window.addEventListener('mouseleave', () => {
  mouse.x = null;
  mouse.y = null;
});

// Touch support for mobile
window.addEventListener('touchmove', (e) => {
  mouse.x = e.touches[0].clientX;
  mouse.y = e.touches[0].clientY;
});

window.addEventListener('touchend', () => {
  mouse.x = null;
  mouse.y = null;
});

function drawGrid() {
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let audioBoost = 0;
  if (analyser && musicPlaying) {
    analyser.getByteFrequencyData(dataArray);
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    audioBoost = (average / 255) * 0.3;
  }

  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 2
  );
  gradient.addColorStop(0, `rgba(100, 200, 255, ${0.03 + audioBoost * 0.1})`);
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const gridSize = 50;
  const offsetX = (time * 10) % gridSize;
  const offsetY = (time * 5) % gridSize;

  for (let x = -gridSize; x < canvas.width + gridSize; x += gridSize) {
    for (let y = 0; y < canvas.height; y += 5) {
      const screenX = x + offsetX;
      const screenY = y + offsetY;

      let alpha = 0.08 + audioBoost;

      if (mouse.x && mouse.y) {
        const dx = mouse.x - screenX;
        const dy = mouse.y - screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          alpha = 0.08 + audioBoost + (200 - distance) / 200 * 0.4;
        }
      }

      ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
      ctx.lineWidth = 1 + audioBoost * 2;

      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(screenX, screenY + 3);
      ctx.stroke();
    }
  }

  for (let y = -gridSize; y < canvas.height + gridSize; y += gridSize) {
    for (let x = 0; x < canvas.width; x += 5) {
      const screenX = x + offsetX;
      const screenY = y + offsetY;

      let alpha = 0.08 + audioBoost;

      if (mouse.x && mouse.y) {
        const dx = mouse.x - screenX;
        const dy = mouse.y - screenY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 200) {
          alpha = 0.08 + audioBoost + (200 - distance) / 200 * 0.4;
        }
      }

      ctx.strokeStyle = `rgba(100, 200, 255, ${alpha})`;
      ctx.lineWidth = 1 + audioBoost * 2;

      ctx.beginPath();
      ctx.moveTo(screenX, screenY);
      ctx.lineTo(screenX + 3, screenY);
      ctx.stroke();
    }
  }
}

function animate() {
  time += 0.02;
  drawGrid();
  requestAnimationFrame(animate);
}

animate();

const cursor = document.querySelector('.cursor');

document.addEventListener('mousemove', (e) => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
});

document.addEventListener('mouseup', () => {
  cursor.style.transform = 'translate(-50%, -50%) scale(1)';
});

document.querySelectorAll('a, button, .certificate-item').forEach(link => {
  link.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });

  link.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});

// Contact Form <3

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const submitBtn = document.getElementById('submit-btn');

contactForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  // Change button text while sending
  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;

  const formData = new FormData(contactForm);

  try {
    // Replace with your Formspree endpoint URL
    const response = await fetch('https://formspree.io/f/xpqvvjvv', {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      formStatus.style.display = 'block';
      formStatus.style.color = '#4CAF50'; // Green text
      formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
      contactForm.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    formStatus.style.display = 'block';
    formStatus.style.color = '#f44336'; // Red text
    formStatus.textContent = 'Oops! Something went wrong. Please try again.';
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});
