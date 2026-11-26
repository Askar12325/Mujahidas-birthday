/**
 * TOXIC ROMANCE EXPERIENCE - ISHAQ & MUJAHIDA
 * Author: Askar Dev
 */

// ==========================================
// 1. THREE.JS 3D LUXURY SCENE
// ==========================================
function initThreeScene() {
  const canvas = document.getElementById('webgl-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 25;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0x200812, 1.8);
  scene.add(ambientLight);

  const goldLight = new THREE.PointLight(0xffdf78, 3, 50);
  goldLight.position.set(10, 10, 15);
  scene.add(goldLight);

  const crimsonLight = new THREE.PointLight(0x9b111e, 2.5, 50);
  crimsonLight.position.set(-10, -10, 10);
  scene.add(crimsonLight);

  // Central Luxury Torus Knot (Symbol of unbreakable, toxic intertwined bond)
  const knotGeometry = new THREE.TorusKnotGeometry(6, 1.6, 120, 24, 2, 3);
  const knotMaterial = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.28,
    metalness: 0.85,
    wireframe: false,
  });
  const torusKnot = new THREE.Mesh(knotGeometry, knotMaterial);
  torusKnot.position.set(0, 0, -4);
  scene.add(torusKnot);

  // Floating Golden & Ruby Shards
  const shardsGroup = new THREE.Group();
  const shardGeometries = [
    new THREE.OctahedronGeometry(0.8, 0),
    new THREE.TetrahedronGeometry(0.9, 0),
    new THREE.IcosahedronGeometry(0.7, 0)
  ];
  
  const goldShardMat = new THREE.MeshStandardMaterial({
    color: 0xfbeea4,
    metalness: 0.9,
    roughness: 0.2,
  });

  const crimsonShardMat = new THREE.MeshStandardMaterial({
    color: 0x800b21,
    metalness: 0.7,
    roughness: 0.3,
  });

  const shardCount = 28;
  const shards = [];

  for (let i = 0; i < shardCount; i++) {
    const geom = shardGeometries[Math.floor(Math.random() * shardGeometries.length)];
    const mat = Math.random() > 0.4 ? goldShardMat : crimsonShardMat;
    const mesh = new THREE.Mesh(geom, mat);

    const radius = 10 + Math.random() * 16;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos((Math.random() * 2) - 1);

    mesh.position.set(
      radius * Math.sin(phi) * Math.cos(theta),
      radius * Math.sin(phi) * Math.sin(theta),
      radius * Math.cos(phi) - 5
    );

    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.scale.setScalar(0.6 + Math.random() * 0.8);

    mesh.userData = {
      rotSpeedX: (Math.random() - 0.5) * 0.02,
      rotSpeedY: (Math.random() - 0.5) * 0.02,
      orbitSpeed: 0.002 + Math.random() * 0.003,
      angle: theta,
      distance: radius,
      yPos: mesh.position.y
    };

    shardsGroup.add(mesh);
    shards.push(mesh);
  }
  scene.add(shardsGroup);

  // Sparkling Golden Stardust Particles
  const particleCount = 220;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const goldColor = new THREE.Color(0xf3e5ab);
  const crimsonColor = new THREE.Color(0xe63946);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 70;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 70;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

    const chosenColor = Math.random() > 0.35 ? goldColor : crimsonColor;
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.45,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    targetX += (mouseX * 4 - targetX) * 0.05;
    targetY += (mouseY * 4 - targetY) * 0.05;

    // Rotate Torus Knot
    torusKnot.rotation.x = elapsedTime * 0.25 + targetY * 0.15;
    torusKnot.rotation.y = elapsedTime * 0.35 + targetX * 0.15;
    torusKnot.position.y = Math.sin(elapsedTime * 0.8) * 0.8;

    // Orbit Shards
    shards.forEach((shard) => {
      shard.rotation.x += shard.userData.rotSpeedX;
      shard.rotation.y += shard.userData.rotSpeedY;
      shard.userData.angle += shard.userData.orbitSpeed;
      shard.position.x = Math.cos(shard.userData.angle) * shard.userData.distance;
      shard.position.z = Math.sin(shard.userData.angle) * shard.userData.distance - 6;
      shard.position.y = shard.userData.yPos + Math.sin(elapsedTime + shard.userData.angle) * 1.2;
    });

    // Rotate Particles
    particleSystem.rotation.y = elapsedTime * 0.04;
    particleSystem.rotation.x = elapsedTime * 0.02;

    // Camera sway
    camera.position.x = targetX * 0.8;
    camera.position.y = targetY * 0.8;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// ==========================================
// 2. LUXURY DARK ROMANCE AUDIO SYNTHESIZER
// ==========================================
class DarkRomanceAudio {
  constructor() {
    this.audioCtx = null;
    this.isPlaying = false;
    this.masterGain = null;
    this.oscillators = [];
  }

  init() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);

    // Warm Low-pass filter for sultry romantic tone
    this.filter = this.audioCtx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);

    // Subtle reverb / delay simulator
    this.delay = this.audioCtx.createDelay();
    this.delay.delayTime.setValueAtTime(0.4, this.audioCtx.currentTime);
    this.delayGain = this.audioCtx.createGain();
    this.delayGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

    this.filter.connect(this.masterGain);
    this.filter.connect(this.delay);
    this.delay.connect(this.delayGain);
    this.delayGain.connect(this.masterGain);
    this.masterGain.connect(this.audioCtx.destination);
  }

  start() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }

    // Lush D-minor 9th romantic chord frequencies: D3, F3, A3, C4, E4
    const chordFrequencies = [146.83, 174.61, 220.0, 261.63, 329.63];
    
    this.oscillators = chordFrequencies.map((freq, idx) => {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      
      osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Gentle LFO vibrato
      const lfo = this.audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.2 + idx * 0.1, this.audioCtx.currentTime);
      const lfoGain = this.audioCtx.createGain();
      lfoGain.gain.setValueAtTime(1.5, this.audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);
      lfo.start();

      gain.gain.setValueAtTime(0.05 / chordFrequencies.length, this.audioCtx.currentTime);
      osc.connect(gain);
      gain.connect(this.filter);
      osc.start();

      return { osc, gain, lfo };
    });

    // Smooth fade in
    this.masterGain.gain.exponentialRampToValueAtTime(0.4, this.audioCtx.currentTime + 3);
    this.isPlaying = true;
    updateAudioUI(true);
  }

  stop() {
    if (!this.audioCtx || !this.isPlaying) return;
    this.masterGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 1.5);
    setTimeout(() => {
      this.oscillators.forEach(o => {
        try { o.osc.stop(); o.lfo.stop(); } catch(e) {}
      });
      this.oscillators = [];
      this.isPlaying = false;
      updateAudioUI(false);
    }, 1500);
  }

  toggle() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.start();
    }
  }
}

const romanceAudio = new DarkRomanceAudio();

function updateAudioUI(playing) {
  const btn = document.getElementById('audio-toggle-btn');
  const label = document.getElementById('audio-label');
  const eq = document.getElementById('audio-eq');
  if (!btn) return;

  if (playing) {
    label.textContent = 'Intimate Mood: ON';
    eq.classList.remove('opacity-30');
    eq.classList.add('opacity-100');
  } else {
    label.textContent = 'Intimate Mood: OFF';
    eq.classList.remove('opacity-100');
    eq.classList.add('opacity-30');
  }
}

// ==========================================
// 3. THE 3D NON-SCROLLING MEDIA STAGE
// ==========================================
const mediaData = [
  {
    id: 0,
    type: 'image',
    src: 'MUJA-1.jpeg',
    badge: 'Ishaq & Mujahida',
    title: 'The Collision of Two Souls',
    caption: 'Where quiet calm was set ablaze. No ordinary love — a gilded, intoxicating storm.',
    tag: 'Together • Photo'
  },
  {
    id: 1,
    type: 'video',
    src: 'MUJA-2.mp4',
    badge: 'Her Elegance',
    title: 'Untamed Radiance',
    caption: 'Every motion carries an effortless command. She holds the room without uttering a single word.',
    tag: 'Mujahida • Film'
  },
  {
    id: 2,
    type: 'video',
    src: 'MUJA-3.mp4',
    badge: 'Obsession',
    title: 'Eyes Like Poison & Gold',
    caption: 'A stare that pierces straight through the soul. Dangerous to love, impossible to leave.',
    tag: 'Mujahida • Film'
  },
  {
    id: 3,
    type: 'video',
    src: 'MUJA-4.mp4',
    badge: 'Our Unbroken Bond',
    title: 'Two In The Storm',
    caption: 'Through arguments, laughter, and relentless passion — we are locked together forever.',
    tag: 'Together • Film'
  }
];

let currentIndex = 0;

function setupMediaStage() {
  const cards = document.querySelectorAll('.media-3d-card');
  const indicators = document.querySelectorAll('.stage-indicator');
  const titleEl = document.getElementById('stage-title');
  const badgeEl = document.getElementById('stage-badge');
  const captionEl = document.getElementById('stage-caption');
  const counterEl = document.getElementById('stage-counter');
  const playBtn = document.getElementById('stage-play-toggle');
  const soundBtn = document.getElementById('stage-sound-toggle');

  function renderStage(newIndex) {
    currentIndex = (newIndex + mediaData.length) % mediaData.length;
    const total = mediaData.length;

    // Pause all playing videos when switching
    cards.forEach((card) => {
      const vid = card.querySelector('video');
      if (vid) {
        vid.pause();
        vid.currentTime = 0;
      }
    });

    cards.forEach((card, idx) => {
      card.className = 'media-3d-card absolute inset-0 w-full h-full rounded-2xl overflow-hidden glass-panel border transition-all duration-700 select-none';
      
      const diff = (idx - currentIndex + total) % total;

      if (diff === 0) {
        // Active Center Card
        card.classList.add('active');
        const activeVid = card.querySelector('video');
        if (activeVid) {
          activeVid.play().catch(() => {});
        }
      } else if (diff === 1 || diff === -(total - 1)) {
        // Next Card (Right)
        card.classList.add('next');
      } else if (diff === total - 1 || diff === -1) {
        // Prev Card (Left)
        card.classList.add('prev');
      } else {
        // Behind
        card.classList.add('hidden-card');
      }
    });

    // Update details
    const current = mediaData[currentIndex];
    if (titleEl) titleEl.textContent = current.title;
    if (badgeEl) badgeEl.textContent = current.badge;
    if (captionEl) captionEl.textContent = current.caption;
    if (counterEl) counterEl.textContent = `0${currentIndex + 1} / 04`;

    // Indicators
    indicators.forEach((ind, i) => {
      if (i === currentIndex) {
        ind.className = 'stage-indicator px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 bg-gradient-to-r from-amber-400 to-yellow-600 text-black shadow-lg shadow-amber-500/20';
      } else {
        ind.className = 'stage-indicator px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 bg-white/5 text-gray-400 hover:text-white border border-white/10 hover:border-amber-400/30';
      }
    });

    // Update Play/Pause button icon state
    if (playBtn) {
      if (current.type === 'video') {
        playBtn.classList.remove('hidden');
        playBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5 text-amber-300"></i>';
      } else {
        playBtn.classList.add('hidden');
      }
      lucide.createIcons();
    }
  }

  // Navigation handlers
  const prevBtn = document.getElementById('stage-prev-btn');
  const nextBtn = document.getElementById('stage-next-btn');

  if (prevBtn) prevBtn.addEventListener('click', () => renderStage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => renderStage(currentIndex + 1));

  indicators.forEach((ind, idx) => {
    ind.addEventListener('click', () => renderStage(idx));
  });

  // Clicking side cards switches to them
  cards.forEach((card, idx) => {
    card.addEventListener('click', () => {
      if (idx !== currentIndex) {
        renderStage(idx);
      }
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') renderStage(currentIndex - 1);
    if (e.key === 'ArrowRight') renderStage(currentIndex + 1);
  });

  // Play / Pause Toggle Button for active video
  if (playBtn) {
    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const activeCard = document.querySelector('.media-3d-card.active');
      const vid = activeCard ? activeCard.querySelector('video') : null;
      if (vid) {
        if (vid.paused) {
          vid.play();
          playBtn.innerHTML = '<i data-lucide="pause" class="w-5 h-5 text-amber-300"></i>';
        } else {
          vid.pause();
          playBtn.innerHTML = '<i data-lucide="play" class="w-5 h-5 text-amber-300"></i>';
        }
        lucide.createIcons();
      }
    });
  }

  // Mute / Unmute Toggle Button for videos
  if (soundBtn) {
    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const allVideos = document.querySelectorAll('.media-3d-card video');
      const isMuted = allVideos[0] ? allVideos[0].muted : true;
      allVideos.forEach(v => v.muted = !isMuted);
      soundBtn.innerHTML = !isMuted 
        ? '<i data-lucide="volume-x" class="w-5 h-5 text-gray-400"></i>'
        : '<i data-lucide="volume-2" class="w-5 h-5 text-amber-400"></i>';
      lucide.createIcons();
    });
  }

  // Cinema Mode Modal
  const cinemaBtn = document.getElementById('stage-cinema-btn');
  const cinemaModal = document.getElementById('cinema-modal');
  const cinemaClose = document.getElementById('cinema-close');
  const cinemaMediaContainer = document.getElementById('cinema-media-container');
  const cinemaTitle = document.getElementById('cinema-title');
  const cinemaCaption = document.getElementById('cinema-caption');

  if (cinemaBtn && cinemaModal) {
    cinemaBtn.addEventListener('click', () => {
      const current = mediaData[currentIndex];
      cinemaMediaContainer.innerHTML = '';

      if (current.type === 'image') {
        const img = document.createElement('img');
        img.src = current.src;
        img.className = 'w-full h-auto max-h-[75vh] object-contain rounded-xl border border-amber-500/30 shadow-2xl';
        cinemaMediaContainer.appendChild(img);
      } else {
        const vid = document.createElement('video');
        vid.src = current.src;
        vid.controls = true;
        vid.autoplay = true;
        vid.playsInline = true;
        vid.className = 'w-full h-auto max-h-[75vh] rounded-xl border border-amber-500/30 shadow-2xl';
        cinemaMediaContainer.appendChild(vid);
      }

      cinemaTitle.textContent = current.title;
      cinemaCaption.textContent = current.caption;
      cinemaModal.classList.remove('hidden');
      cinemaModal.classList.add('flex');
    });

    cinemaClose.addEventListener('click', () => {
      cinemaMediaContainer.innerHTML = '';
      cinemaModal.classList.add('hidden');
      cinemaModal.classList.remove('flex');
    });
  }

  renderStage(0);
}

// ==========================================
// 4. WAX SEAL & INTIMATE SWEET LETTER
// ==========================================
function setupLetterExperience() {
  const seal = document.getElementById('wax-seal-btn');
  const envelopeFront = document.getElementById('envelope-cover');
  const letterBody = document.getElementById('letter-content');
  const closeLetterBtn = document.getElementById('close-letter-btn');

  if (!seal || !letterBody) return;

  seal.addEventListener('click', () => {
    // Golden and crimson confetti burst
    if (window.confetti) {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.65 },
        colors: ['#d4af37', '#ffdf78', '#9b111e', '#e63946', '#ffffff']
      });
    }

    // Play subtle audio if not started
    if (!romanceAudio.isPlaying) {
      romanceAudio.start();
    }

    envelopeFront.style.transform = 'translateY(15px) scale(0.96)';
    envelopeFront.style.opacity = '0';
    setTimeout(() => {
      envelopeFront.classList.add('hidden');
      letterBody.classList.remove('hidden');
      letterBody.classList.add('opacity-100');
    }, 400);
  });

  if (closeLetterBtn) {
    closeLetterBtn.addEventListener('click', () => {
      letterBody.classList.add('hidden');
      envelopeFront.classList.remove('hidden');
      envelopeFront.style.transform = 'translateY(0) scale(1)';
      envelopeFront.style.opacity = '1';
    });
  }
}

// ==========================================
// 5. INTERACTIVE VOW & CHAMPAGNE TOAST
// ==========================================
function setupInteractiveVow() {
  const toastBtn = document.getElementById('champagne-toast-btn');
  const vowBtn = document.getElementById('flame-vow-btn');
  const vowFill = document.getElementById('vow-fill-bar');
  const vowStatus = document.getElementById('vow-status-text');

  if (toastBtn && window.confetti) {
    toastBtn.addEventListener('click', () => {
      confetti({
        particleCount: 120,
        spread: 100,
        startVelocity: 45,
        origin: { y: 0.8 },
        colors: ['#ffd700', '#d4af37', '#ff0a54', '#ff477e', '#ffffff']
      });

      // Sound feedback or pulse
      toastBtn.classList.add('scale-105');
      setTimeout(() => toastBtn.classList.remove('scale-105'), 300);
    });
  }

  // Hold to ignite vow
  let holdInterval = null;
  let charge = 0;

  if (vowBtn && vowFill && vowStatus) {
    const startCharge = () => {
      holdInterval = setInterval(() => {
        charge += 4;
        if (charge > 100) charge = 100;
        vowFill.style.width = `${charge}%`;

        if (charge >= 100) {
          clearInterval(holdInterval);
          vowStatus.innerHTML = '<span class="text-amber-300 font-semibold">⚡ SOULS FOREVER BOUND: ISHAQ × MUJAHIDA ⚡</span>';
          if (window.confetti) {
            confetti({
              particleCount: 150,
              spread: 120,
              origin: { y: 0.7 },
              colors: ['#d4af37', '#e63946', '#ffd700']
            });
          }
        } else {
          vowStatus.textContent = `Igniting Toxic Bond... ${charge}%`;
        }
      }, 50);
    };

    const stopCharge = () => {
      if (holdInterval) clearInterval(holdInterval);
      if (charge < 100) {
        charge = 0;
        vowFill.style.width = '0%';
        vowStatus.textContent = 'Hold to solidify our eternal pact';
      }
    };

    vowBtn.addEventListener('mousedown', startCharge);
    vowBtn.addEventListener('mouseup', stopCharge);
    vowBtn.addEventListener('mouseleave', stopCharge);

    vowBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startCharge();
    });
    vowBtn.addEventListener('touchend', stopCharge);
  }
}

// ==========================================
// 6. CUSTOM GLOWING CURSOR
// ==========================================
function setupCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');

  if (!dot || !ring || window.innerWidth < 768) return;

  window.addEventListener('mousemove', (e) => {
    dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    ring.style.transform = `translate(${e.clientX - 15}px, ${e.clientY - 15}px)`;
  });

  document.querySelectorAll('button, a, .wax-seal, .media-3d-card').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      ring.style.width = '55px';
      ring.style.height = '55px';
      ring.style.borderColor = '#d4af37';
    });
    el.addEventListener('mouseleave', () => {
      ring.style.width = '38px';
      ring.style.height = '38px';
      ring.style.borderColor = 'rgba(212, 175, 55, 0.45)';
    });
  });
}

// Initialize everything on load
document.addEventListener('DOMContentLoaded', () => {
  initThreeScene();
  setupMediaStage();
  setupLetterExperience();
  setupInteractiveVow();
  setupCursor();

  // Audio Toggle Button
  const audioBtn = document.getElementById('audio-toggle-btn');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      romanceAudio.toggle();
    });
  }

  // Initialize Lucide icons
  if (window.lucide) {
    lucide.createIcons();
  }
});
