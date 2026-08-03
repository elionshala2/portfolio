let musicPlaying = false;
let welcomeMusicOff = false;
const bgMusic = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
const musicVisualizer = document.querySelector('.music-visualizer');
const welcomeMusicToggle = document.getElementById('welcome-music-toggle');
const welcomeScreen = document.getElementById('welcome-screen');

// Credly Badge IDs - Add your badge IDs here (the last part of the Credly URL)
const credlyBadgeIds = [
  '0ee9fe05-921f-4c7a-8751-c2b0b4a57505',
  '9a1a911c-e9a3-4899-88c4-c07ec8687425',
  '1293938a-522e-4c89-a702-20d7a07ac061',
  'b1c43842-7b38-41a9-9201-83fe975f4e73',
  'cc885d10-9eb0-4e04-803c-3a2269037022',
  '40e5f291-4445-4f8e-935b-354b81a8ae15',
  '8ce9141d-ae9e-4743-84ce-8bfa581356cb',
  // Add more badge IDs as you earn them
];

// Initialize welcome screen state
document.body.classList.add('welcome-active');

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

function toggleWelcomeMusic() {
  welcomeMusicOff = !welcomeMusicOff;
  if (welcomeMusicOff) {
    welcomeMusicToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    `;
  } else {
    welcomeMusicToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M9 18V5l12-2v13"/>
        <circle cx="6" cy="18" r="3"/>
        <circle cx="18" cy="16" r="3"/>
      </svg>
    `;
  }
}

function enterSite() {
  welcomeScreen.classList.add('hidden');
  document.body.classList.remove('welcome-active');

  // Trigger hero animations
  const heroH1 = document.querySelector('.hero h1');
  const heroSubtitle = document.querySelector('.subtitle');
  const heroDescription = document.querySelector('.hero-description');
  const navLinks = document.querySelector('.nav-links');

  if (heroH1) heroH1.classList.add('animate-in');
  if (heroSubtitle) heroSubtitle.classList.add('animate-in');
  if (heroDescription) heroDescription.classList.add('animate-in');
  if (navLinks) navLinks.classList.add('animate-in');

  if (!welcomeMusicOff) {
    initAudioContext();
    bgMusic.play().catch(e => console.log('Audio play failed:', e));
    musicPlaying = true;
    musicVisualizer.classList.add('active');
    musicToggle.innerHTML = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="6" y="4" width="4" height="16"/>
        <rect x="14" y="4" width="4" height="16"/>
      </svg>
    `;
  }
}

welcomeScreen.addEventListener('click', (e) => {
  if (e.target !== welcomeMusicToggle && !welcomeMusicToggle.contains(e.target)) {
    enterSite();
  }
});

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
    for (let y = -gridSize; y < canvas.height + gridSize; y += 5) {
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
    for (let x = -gridSize; x < canvas.width + gridSize; x += 5) {
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

// Credly Badges Loader
function loadCredlyBadges() {
  const badgesContainer = document.getElementById('individual-badges-container');
  if (!badgesContainer) return;

  credlyBadgeIds.forEach(badgeId => {
    const badgeUrl = `https://www.credly.com/badges/${badgeId}`;
    // Try local images first (badges folder), then fallback to online
    const localImageUrls = [
      `badges/${badgeId}.png`,
      `badges/${badgeId}.jpg`
    ];

    createBadgeElement(badgeUrl, localImageUrls, badgesContainer);
  });

  if (badgesContainer.children.length === 0) {
    badgesContainer.innerHTML = '<p class="no-badges">Add your badge IDs to the credlyBadgeIds array at the top of app.js</p>';
  }
}

function createBadgeElement(url, imageUrls, container) {
  const badgeWrapper = document.createElement('div');
  badgeWrapper.className = 'badge-item';

  const link = document.createElement('a');
  link.href = url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';

  const img = document.createElement('img');
  img.alt = 'Credly Badge';
  img.className = 'badge-image';

  // Handle array of image URLs with fallback
  let currentTry = 0;

  function tryNextImage() {
    if (currentTry < imageUrls.length) {
      img.src = imageUrls[currentTry];
      currentTry++;
    } else {
      // If all local images fail, try online fallback
      const badgeId = url.split('/').pop();
      const onlineFallbacks = [
        `https://images.credly.com/images/${badgeId}/large.png`,
        `https://images.credly.com/images/${badgeId}/medium.png`,
        `https://images.credly.com/images/${badgeId}.png`
      ];

      let onlineTry = 0;
      function tryOnline() {
        if (onlineTry < onlineFallbacks.length) {
          img.src = onlineFallbacks[onlineTry];
          onlineTry++;
        } else {
          // Final fallback: placeholder
          img.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2364c8ff" stroke-width="1"%3E%3Ccircle cx="12" cy="8" r="4"/%3E%3Cpath d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/%3E%3C/svg%3E';
        }
      }
      tryOnline();
    }
  }

  img.onload = function() {
    console.log('Badge loaded successfully:', img.src);
  };

  img.onerror = function() {
    console.log('Failed to load badge image, trying next option:', imageUrls[currentTry]);
    tryNextImage();
  };

  // Start with first image URL
  tryNextImage();

  link.appendChild(img);
  badgeWrapper.appendChild(link);
  container.appendChild(badgeWrapper);
}

// Load badges when page loads
document.addEventListener('DOMContentLoaded', loadCredlyBadges);

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
      formStatus.className = 'form-status success show';
      formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
      contactForm.reset();
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    formStatus.className = 'form-status error show';
    formStatus.textContent = 'Oops! Something went wrong. Please try again.';
  } finally {
    submitBtn.textContent = 'Send Message';
    submitBtn.disabled = false;
  }
});
