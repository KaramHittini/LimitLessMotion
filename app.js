/* -------------------- DOM & STATE -------------------- */
const pages = {
  home: document.getElementById('view-home'),
  categories: document.getElementById('view-categories'),
  detail: document.getElementById('view-detail'),
};
const grid = document.getElementById('category-grid');
const detailList = document.getElementById('detail-list');
const crumbCat = document.getElementById('crumb-cat');
const detailTitle = document.getElementById('detail-title');
const upBtn = document.getElementById('to-top');
const dateSpan = document.getElementById('today-date');

let suppressNextRoute = false;
let isTransitioning = false;

/* -------------------- UTIL -------------------- */
function show(page) {
  Object.values(pages).forEach(p => p.classList.remove('active'));
  pages[page].classList.add('active');
  document.body.classList.toggle('is-home', page === 'home');
}

function lockScrollToTop() {
  window.scrollTo({ top: 0, behavior: 'auto' });
  pages.home.scrollTop = 0;
  pages.categories.scrollTop = 0;
}

/* -------------------- DATA -------------------- */
const samplePoster = "https://images.unsplash.com/photo-1599050751791-5ad824b5b2bd?q=80&w=1200&auto=format&fit=crop";
const sampleVideo  = "Bi.mp4";

/* FULL EXERCISES OBJECT */
const EXERCISES = {
  Arm: [
    { name: "Seated Bicep Curls", desc: "Light dumbbells or band. Elbows tucked, slow curl.", more: "Aim for controlled reps; maintain tall posture and avoid shrugging.", more2: "Start with 1–2 sets of 8–10 slow reps. Rest 45–60s. Progress weekly by small increases in reps or range.", video: sampleVideo, poster: samplePoster },
    { name: "Resistance Band Row (Seated)", desc: "Anchor low; squeeze shoulder blades.", more: "Keep ribs down, neck long; pause 1–2s in end range.", more2: "2 sets of 8–12 reps; smooth return.", video: sampleVideo, poster: samplePoster },
    { name: "Wrist Flex & Extend", desc: "Gentle range of motion; avoid pain.", more: "Support forearm on armrest/pillow for comfort.", more2: "30–45s of gentle movement, 2–3 rounds.", video: sampleVideo, poster: samplePoster },
    { name: "Overhead Press (Assisted)", desc: "Light load, pain-free range.", more: "Use minimal weight; stop with neck strain.", more2: "1–2 sets of 6–8 reps; exhale as you press.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Lateral Raise", desc: "Raise arms to sides within comfort.", more: "Tiny range is fine; avoid shoulder hiking.", more2: "2 sets of 8–12 reps at slow tempo.", video: sampleVideo, poster: samplePoster },
    { name: "Hammer Curls (Seated)", desc: "Neutral grip curl.", more: "Keep elbows by sides; control lowering.", more2: "1–2 sets of 8–12 reps.", video: sampleVideo, poster: samplePoster },
    { name: "Isometric Hand Squeeze", desc: "Squeeze soft ball or towel.", more: "Gentle holds; stop if tingling.", more2: "5–8 holds of 5s each per hand.", video: sampleVideo, poster: samplePoster },
    { name: "Band Triceps Kickback", desc: "Light band; extend elbow back.", more: "Elbow stays by side; small range.", more2: "8–12 reps; 1–2 sets.", video: sampleVideo, poster: samplePoster },
  ],
  Leg: [
    { name: "Seated Marches", desc: "Lift knees alternately, torso tall.", more: "Begin with small range; add ankle weight only if cleared.", more2: "20–40s per round, 2–3 rounds.", video: sampleVideo, poster: samplePoster },
    { name: "Ankle Pumps", desc: "Point & flex feet to mobilize.", more: "Great for circulation after long sitting.", more2: "30–60s gentle tempo; 2–3 rounds.", video: sampleVideo, poster: samplePoster },
    { name: "Knee Extensions (Seated)", desc: "Straighten knee, pause, lower slow.", more: "Avoid locking the knee; control descent.", more2: "1–2 sets of 8–10 reps per side.", video: sampleVideo, poster: samplePoster },
    { name: "Glute Squeezes", desc: "Isometric 5–10s, relax, repeat.", more: "Minimal joint load; easy breathing.", more2: "8–12 gentle squeezes; 1–2 sets.", video: sampleVideo, poster: samplePoster },
    { name: "Adductor Squeeze (Ball)", desc: "Squeeze soft ball between knees.", more: "Gentle pressure only; breathe.", more2: "8–12 squeezes; 2 rounds.", video: sampleVideo, poster: samplePoster },
    { name: "Toe Raises (Seated)", desc: "Lift toes while heels down.", more: "Shins work; keep rhythm easy.", more2: "20–40s continuous.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Hamstring Curl (Band)", desc: "Pull heel back against band.", more: "Small range; avoid cramps.", more2: "8–10 reps/side; 1–2 sets.", video: sampleVideo, poster: samplePoster },
    { name: "Ankle Eversion/Inversion (Band)", desc: "Turn foot out/in vs band.", more: "Slow; no pinching pain.", more2: "8–10 reps each way.", video: sampleVideo, poster: samplePoster },
  ],
  Neck: [
    { name: "Neck Rotations", desc: "Turn gently side to side.", more: "Stay in a pain-free range.", more2: "5–8 slow reps each direction.", video: sampleVideo, poster: samplePoster },
    { name: "Chin Tucks (Seated)", desc: "Draw chin straight back, hold 3s.", more: "Avoid looking up/down.", more2: "6–10 gentle holds of 3–5s.", video: sampleVideo, poster: samplePoster },
    { name: "Lateral Flexion", desc: "Ear toward shoulder; avoid shrugging.", more: "Stop before pain; slow breaths.", more2: "5–8 reps per side.", video: sampleVideo, poster: samplePoster },
    { name: "Levator Scapulae Stretch", desc: "Look down to armpit, gentle hold.", more: "Only mild stretch; shoulders low.", more2: "10–20s each side.", video: sampleVideo, poster: samplePoster },
    { name: "Isometric Neck Press", desc: "Press head lightly into hand.", more: "Front/side/back directions.", more2: "5 holds of 3–5s each direction.", video: sampleVideo, poster: samplePoster },
    { name: "Neck Flexion/Extension ROM", desc: "Small nod yes/no.", more: "Smooth, pain-free.", more2: "5–8 reps each direction.", video: sampleVideo, poster: samplePoster },
  ],
  Back: [
    { name: "Seated Cat–Cow", desc: "Alternate rounding and extending.", more: "Exhale to round, inhale to extend.", more2: "30–45s gentle rhythm, 2 rounds.", video: sampleVideo, poster: samplePoster },
    { name: "Band Pull-Apart", desc: "Open arms; squeeze between blades.", more: "Wrists neutral; lower ribs soft.", more2: "2 sets of 8–12 reps.", video: sampleVideo, poster: samplePoster },
    { name: "Pelvic Tilts (Seated)", desc: "Tilt pelvis forward/back.", more: "Small range—comfort first.", more2: "30–45s continuous movement.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Thoracic Rotations", desc: "Rotate torso side to side.", more: "Hips forward; rotate from mid-back.", more2: "5–8 reps each side.", video: sampleVideo, poster: samplePoster },
    { name: "Scapular Retraction Holds", desc: "Pinch shoulder blades lightly.", more: "Neck long; avoid shrugging.", more2: "5–8 holds of 5s.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Side Bends", desc: "Hand slides down thigh; alternate.", more: "Stay tall; small range is fine.", more2: "6–10 total reps.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Back Extension Isometric", desc: "Gently press back into chair.", more: "Low effort; no pain.", more2: "5–8 holds of 5s.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Bird-Dog (Arms Only)", desc: "Reach one arm forward; alternate.", more: "Ribs soft; no back sway.", more2: "6–10 total reps.", video: sampleVideo, poster: samplePoster },
  ],
  Hip: [
    { name: "Seated Hip Abduction", desc: "Loop band above knees; press out.", more: "Press only as far as comfortable.", more2: "2 sets of 8–12 reps.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Figure-4 Stretch", desc: "Ankle over opposite knee; hinge slightly.", more: "Support thigh with towel.", more2: "Hold 15–30s, 2–3x/side.", video: sampleVideo, poster: samplePoster },
    { name: "Heel Slides", desc: "Slide heel toward hips and back.", more: "Use towel for less friction.", more2: "8–12 reps/side; 1–2 sets.", video: sampleVideo, poster: samplePoster },
    { name: "Hip Adduction Squeeze", desc: "Squeeze pillow between knees.", more: "Gentle pressure; breathe.", more2: "8–12 reps; 2 sets.", video: sampleVideo, poster: samplePoster },
    { name: "Butterfly Stretch (Seated)", desc: "Soles together; knees open.", more: "Support knees if needed.", more2: "Hold 15–30s; easy breath.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Hip Flexion Lift", desc: "Lift knee a little; alternate.", more: "Slow; no pinching pain.", more2: "6–10 reps/side.", video: sampleVideo, poster: samplePoster },
  ],
  "Sit to Stand": [
    { name: "Sit-to-Stand (Assisted)", desc: "From chair, use armrests/support to stand.", more: "Feet under knees, hinge forward, press through legs.", more2: "3–6 reps with full control.", video: sampleVideo, poster: samplePoster },
    { name: "Partial Sit-to-Stand", desc: "Lift a few inches, re-seat.", more: "Build confidence and strength.", more2: "4–8 partial reps.", video: sampleVideo, poster: samplePoster },
    { name: "Eccentric Sit-Down", desc: "Slow lower back to seat.", more: "Use rails for control.", more2: "3–5 slow lowers.", video: sampleVideo, poster: samplePoster },
  ],
  "Balance exercises": [
    { name: "Seated Weight Shifts", desc: "Shift weight side-to-side.", more: "Both sit bones grounded.", more2: "20–40s; steady breathing.", video: sampleVideo, poster: samplePoster },
    { name: "Reaching Balance (Seated)", desc: "Reach forward and return.", more: "Small range; avoid collapsing.", more2: "6–10 reps.", video: sampleVideo, poster: samplePoster },
    { name: "Anterior/Posterior Shifts", desc: "Lean slightly forward/back.", more: "Slow, controlled.", more2: "20–30s, 2 rounds.", video: sampleVideo, poster: samplePoster },
  ],
  "Seated Knee Raises": [
    { name: "Alternating Knee Raises", desc: "Lift knee toward chest.", more: "Brace gently; no leaning back.", more2: "10–12 alternating reps.", video: sampleVideo, poster: samplePoster },
    { name: "March with Hold", desc: "Hold the top briefly.", more: "Stay tall; breathe out on lift.", more2: "6–8 holds per side.", video: sampleVideo, poster: samplePoster },
    { name: "March Ladder", desc: "Add a rep each round.", more: "Stop before fatigue.", more2: "2–3 ladders.", video: sampleVideo, poster: samplePoster },
  ],
  "Side Twists Wheelchair Exercises": [
    { name: "Seated Side Twists", desc: "Gentle torso rotations.", more: "Rotate from ribs; shoulders relaxed.", more2: "5–8 reps per side.", video: sampleVideo, poster: samplePoster },
    { name: "Cross-Body Reach", desc: "Reach across midline.", more: "Small, controlled range.", more2: "6–10 total reps.", video: sampleVideo, poster: samplePoster },
    { name: "Diagonal Band Chops (Light)", desc: "Short, gentle diagonal pulls.", more: "Minimal resistance; control.", more2: "6–8 small reps per side.", video: sampleVideo, poster: samplePoster },
  ],
  "Seated Tricep Dips": [
    { name: "Chair/Armrest Dips", desc: "Shallow elbow bend.", more: "Shoulders away from ears.", more2: "1–2 sets of 6–8 shallow reps.", video: sampleVideo, poster: samplePoster },
    { name: "Isometric Dip Hold", desc: "Tiny unweighted hold.", more: "Stop with wrist pain.", more2: "3–5 holds of 3–5s.", video: sampleVideo, poster: samplePoster },
    { name: "Band Triceps Press", desc: "Band behind chair, press.", more: "Light band; smooth return.", more2: "8–12 reps, 1–2 sets.", video: sampleVideo, poster: samplePoster },
  ],
  "Aerobic / Cardiovascular Exercise": [
    { name: "Seated Shadow Boxing", desc: "Rhythmic punches in the air.", more: "Light, continuous pace; shoulders relaxed.", more2: "2–4 min easy intervals; rest as needed.", video: sampleVideo, poster: samplePoster },
    { name: "Arm Ergometer (UBE)", desc: "Cycling motion with arms.", more: "Smooth circles; posture tall.", more2: "3–5 min at easy effort.", video: sampleVideo, poster: samplePoster },
    { name: "Fast March (Seated)", desc: "Quicker seated marching.", more: "Short bouts; steady breathing.", more2: "30–60s × 2–3 rounds.", video: sampleVideo, poster: samplePoster },
    { name: "Arms-Only Jacks", desc: "Arms out-in like jumping jacks.", more: "Keep range comfortable.", more2: "30–45s, 2 rounds.", video: sampleVideo, poster: samplePoster },
  ],
  "Flexibility & Range of Motion": [
    { name: "Ankle Circles", desc: "Circle ankles both directions.", more: "Small, pain-free circles.", more2: "5–8 each way.", video: sampleVideo, poster: samplePoster },
    { name: "Shoulder Rolls", desc: "Roll shoulders back gently.", more: "Slow, relaxed movement.", more2: "20–30s continuous.", video: sampleVideo, poster: samplePoster },
    { name: "Wrist Circles", desc: "Gentle circles both ways.", more: "Elbows supported.", more2: "5–8 each way.", video: sampleVideo, poster: samplePoster },
    { name: "Seated Hamstring Stretch", desc: "Gently extend knee & hinge.", more: "Mild stretch only.", more2: "10–20s per side.", video: sampleVideo, poster: samplePoster },
  ],
  "Step-Ups (using a low step or platform with rails)": [
    { name: "Assisted Step-Ups", desc: "Light step-up with rail.", more: "Whole foot on step; slow up/down.", more2: "3–6 reps per side.", video: sampleVideo, poster: samplePoster },
    { name: "Toe Taps to Step", desc: "Tap toe on step repeatedly.", more: "Small range; balance support.", more2: "20–40s gentle tempo.", video: sampleVideo, poster: samplePoster },
    { name: "Side Step-Ups", desc: "Step sideways onto step.", more: "Use rails; tiny range ok.", more2: "2–4 reps per side.", video: sampleVideo, poster: samplePoster },
  ],
  "Aquatic Exercises (walking, jogging, or resistance in water)": [
    { name: "Pool Walking (Shallow)", desc: "Walk in water with support.", more: "Use rails/partner assist.", more2: "2–4 min, easy pace.", video: sampleVideo, poster: samplePoster },
    { name: "Water Marching", desc: "Knee lift marching in water.", more: "Small range; steady breathing.", more2: "30–60s × 2 rounds.", video: sampleVideo, poster: samplePoster },
    { name: "Lateral Water Walking", desc: "Side steps through water.", more: "Stay upright; slow steps.", more2: "1–2 min, easy.", video: sampleVideo, poster: samplePoster },
  ],
  "Light Resistance Band Training": [
    { name: "Band Chest Press (Seated)", desc: "Push band forward from chest.", more: "Elbows slightly down; control return.", more2: "2 sets of 8–12 reps.", video: sampleVideo, poster: samplePoster },
    { name: "Band Seated Row", desc: "Pull band toward midline.", more: "Squeeze shoulder blades gently.", more2: "2 sets of 8–12 reps.", video: sampleVideo, poster: samplePoster },
    { name: "Band External Rotation", desc: "Rotate forearm out, elbow at side.", more: "Tiny range is fine; no pain.", more2: "8–10 reps per side.", video: sampleVideo, poster: samplePoster },
    { name: "Band Biceps Curl (Seated)", desc: "Curl band handles.", more: "Wrists neutral; slow return.", more2: "8–12 reps; 1–2 sets.", video: sampleVideo, poster: samplePoster },
  ],
};

/* Category config */
const categories = [
  { id: 'arm',  label: 'Arm exercises',  icon: armIcon },
  { id: 'leg',  label: 'Leg exercises',  icon: legIcon },
  { id: 'neck', label: 'Neck exercises', icon: neckIcon },
  { id: 'back', label: 'Back exercises', icon: backIcon },
  { id: 'hip',  label: 'Hip exercises',  icon: hipIcon },

  { id: 'sit-to-stand', label: 'Sit to Stand', icon: () => baseIcon('<path d="M10 3h4v4h-4zM8 21v-6H6v-2h5l1 8H8zM16 21l-1-8h3v2h-2v6h0z"/>') },
  { id: 'balance', label: 'Balance exercises', icon: () => baseIcon('<path d="M12 3l3 5h-6l3-5zm-4 8h8l-2 8H10l-2-8z"/>') },
  { id: 'seated-knee-raises', label: 'Seated Knee Raises', icon: () => baseIcon('<path d="M7 3h4v6l3 3 3 8H9l1.5-6L7 10V3z"/>') },
  { id: 'side-twists-wheelchair', label: 'Side Twists Wheelchair', icon: () => baseIcon('<path d="M6 8a4 4 0 118 0 4 4 0 01-8 0zm2 8a6 6 0 1012 0H8z"/>') },
  { id: 'seated-tricep-dips', label: 'Seated Tricep Dips', icon: () => baseIcon('<path d="M5 20h6v-2H7v-5H5v7zm14-7h-2v5h-4v2h6v-7z"/>') },

  { id: 'aerobic', label: 'Aerobic / Cardiovascular Exercise', icon: () => baseIcon('<path d="M4 12a8 8 0 1016 0 8 8 0 10-16 0zm3 0h8M12 5v14"/>') },
  { id: 'flexibility', label: 'Flexibility & Range of Motion', icon: () => baseIcon('<path d="M4 12h16M12 4v16M5 7l14 10"/>') },
  { id: 'step-ups', label: 'Step-Ups (low step with rails)', icon: () => baseIcon('<path d="M4 18h8v2H4v-2zm8-4h4v2h-4v-2zm4-4h4v2h-4V10z"/>') },
  { id: 'aquatic', label: 'Aquatic Exercises', icon: () => baseIcon('<path d="M3 15c2 0 2-2 4-2s2 2 4 2 2-2 4-2 2 2 4 2v3H3v-3z"/>') },
  { id: 'light-band', label: 'Light Resistance Band Training', icon: () => baseIcon('<path d="M4 12l6-4 4 8 6-4-4 8-8-8z"/>') },
];

const idToName = {
  'arm':'Arm','leg':'Leg','neck':'Neck','back':'Back','hip':'Hip',
  'sit-to-stand':'Sit to Stand',
  'balance':'Balance exercises',
  'seated-knee-raises':'Seated Knee Raises',
  'side-twists-wheelchair':'Side Twists Wheelchair Exercises',
  'seated-tricep-dips':'Seated Tricep Dips',
  'aerobic':'Aerobic / Cardiovascular Exercise',
  'flexibility':'Flexibility & Range of Motion',
  'step-ups':'Step-Ups (using a low step or platform with rails)',
  'aquatic':'Aquatic Exercises (walking, jogging, or resistance in water)',
  'light-band':'Light Resistance Band Training',
};

/* -------------------- RENDERERS -------------------- */
function renderCategories() {
  grid.innerHTML = '';
  categories.forEach(cat => {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = `#/category/${cat.id}`;
    card.setAttribute('role', 'listitem');
    card.innerHTML = `
      <div class="icon" aria-hidden="true">${cat.icon()}</div>
      <h3>${cat.label}</h3>
      <p class="muted">Curated moves and mobility drills.</p>
      <span class="go link">Open ${arrowRight()}</span>
    `;
    grid.appendChild(card);
  });
}

function renderExercises(catId) {
  const name = idToName[catId] || (catId.charAt(0).toUpperCase() + catId.slice(1));
  crumbCat.textContent = name;
  detailTitle.textContent = `${name} Exercises`;
  const items = EXERCISES[name] || [];

  detailList.innerHTML = '';
  items.forEach((ex, idx) => {
    const item = document.createElement('article');
    item.className = 'acc-item';
    item.setAttribute('role', 'listitem');
    item.setAttribute('aria-expanded', 'false');
    const id = `${catId}-ex-${idx}`;

    item.innerHTML = `
      <button class="acc-hd" aria-controls="${id}" aria-expanded="false">
        <div>
          <div class="acc-title">${ex.name}</div>
          <div class="acc-desc">${ex.desc}</div>
        </div>
        <span class="acc-icon" aria-hidden="true">${chevronDown()}</span>
      </button>
      <div class="acc-panel" id="${id}">
        <div class="acc-inner">
          <div class="acc-body">
            <p class="acc-more">${ex.more || "Work within a comfortable, pain-free range. Move slowly and breathe naturally."}</p>
            <p class="acc-more-2">${ex.more2 || "Suggested start: 1–2 sets of 6–10 slow reps (or 20–40 seconds for holds), resting 45–60 seconds. Progress gradually week to week."}</p>
            <div class="video-wrap" data-video="${ex.video}" data-poster="${ex.poster}">
              <div class="muted" style="padding:1rem">Loading video…</div>
            </div>
          </div>
        </div>
      </div>
    `;

    const btn  = item.querySelector('.acc-hd');
    const wrap = item.querySelector('.video-wrap');

    const loadVideo = () => {
      if (wrap.dataset.loaded) return;
      const vid = document.createElement('video');
      vid.controls = true;
      vid.playsInline = true;
      vid.preload = 'metadata';
      if (wrap.dataset.poster) vid.poster = wrap.dataset.poster;
      const src = document.createElement('source');
      src.src = wrap.dataset.video;
      src.type = 'video/mp4';
      vid.appendChild(src);
      wrap.innerHTML = '';
      wrap.appendChild(vid);
      wrap.dataset.loaded = '1';
    };

    btn.addEventListener('click', () => {
      const expanded = item.getAttribute('aria-expanded') === 'true';
      item.setAttribute('aria-expanded', String(!expanded));
      btn.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) loadVideo();
    });

    detailList.appendChild(item);
  });
}

/* -------------------- ICONS -------------------- */
function arrowRight(){ return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` }
function chevronDown(){ return `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>` }
function armIcon(){ return baseIcon('<path d="M13 4c-1.657 0-3 1.343-3 3v2H8a3 3 0 0 0 0 6h2v2a3 3 0 0 0 6 0v-2h1a3 3 0 1 0 0-6h-1V7c0-1.657-1.343-3-3-3Z"/>') }
function legIcon(){ return baseIcon('<path d="M7 3h4v6l3 3 3 8H9l1.5-6L7 10V3Z"/>') }
function neckIcon(){ return baseIcon('<path d="M12 3a4 4 0 0 1 4 4 4 4 0 1 1-8 0 4 4 0 0 1 4-4Zm-6 16c0-2.761 3.582-5 6-5s6 2.239 6 5v2H6v-2Z"/>') }
function backIcon(){ return baseIcon('<path d="M12 2c2 2 5 5 5 9s-3 7-5 9c-2-2-5-5-5-9s3-7 5-9Z"/>') }
function hipIcon(){ return baseIcon('<path d="M8 4c3 0 3 3 4 6s1 6 4 6 4-2 4-4-1-6-4-8-7-2-8 0 1 0 0 0Z"/>') }
function baseIcon(path){ return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${path}</svg>` }

/* -------------------- ROUTER -------------------- */
function handleRoute() {
  if (suppressNextRoute || isTransitioning) return;

  const hash = location.hash || '#/';
  if (hash === '#/' || hash.startsWith('#?')) {
    show('home');
    const start = document.getElementById('home-start');
    if (start) start.focus({ preventScroll: true });
  } else if (hash.startsWith('#/categories')) {
    show('categories');
    renderCategories();
  } else if (hash.startsWith('#/category/')) {
    const catId = hash.split('/')[2] || '';
    if (!Object.prototype.hasOwnProperty.call(idToName, catId)) {
      location.hash = '#/categories';
      return;
    }
    show('detail');
    renderExercises(catId);
  } else {
    location.hash = '#/';
  }
}

window.addEventListener('hashchange', handleRoute);

/* -------------------- TRANSITION: Home -> Categories -------------------- */
function startHomeToCategoriesTransition() {
  if (isTransitioning) return;
  isTransitioning = true;
  suppressNextRoute = true;

  renderCategories();
  lockScrollToTop();
  document.body.classList.add('transitioning');
  pages.home.classList.add('active');
  pages.categories.classList.add('active');

  requestAnimationFrame(() => {
    pages.home.classList.add('anim-out');
    pages.categories.classList.add('anim-in');

    const finish = () => {
      pages.home.classList.remove('anim-out');
      pages.categories.classList.remove('anim-in');
      document.body.classList.remove('transitioning');
      show('categories');
      location.hash = '#/categories';
      setTimeout(() => {
        suppressNextRoute = false;
        isTransitioning = false;
      }, 0);
    };

    const fallback = setTimeout(finish, 900);
    pages.categories.addEventListener('animationend', () => {
      clearTimeout(fallback);
      finish();
    }, { once: true });
  });
}

/* Intercept “Browse Exercises” */
document.addEventListener('click', (e) => {
  const a = e.target.closest('#home-start');
  if (!a) return;
  e.preventDefault();
  startHomeToCategoriesTransition();
});

/* Also intercept topbar “Exercises” while on Home */
document.addEventListener('click', (e) => {
  const navToCats = e.target.closest('a[href="#/categories"]');
  if (!navToCats) return;
  const onHome = pages.home.classList.contains('active');
  if (!onHome) return;
  e.preventDefault();
  startHomeToCategoriesTransition();
});

/* -------------------- MISC UX -------------------- */
window.addEventListener('load', () => {
  handleRoute();
  if (dateSpan) {
    const d = new Date();
    const opts = { year: 'numeric', month: 'long', day: 'numeric' };
    dateSpan.textContent = d.toLocaleDateString(undefined, opts);
  }
});

window.addEventListener('scroll', () => {
  const onHome = pages.home.classList.contains('active');
  upBtn.hidden = !(onHome && window.scrollY > 200);
});
upBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

grid.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const a = e.target.closest('a');
    if (a) a.click();
  }
});

/* ==================== OFFLINE AI (keyword intents) — UPGRADED ==================== */
const ai = {
  toggle: document.getElementById('ai-toggle'),
  drawer: document.getElementById('ai-drawer'),
  close:  document.getElementById('ai-close'),
  log:    document.getElementById('ai-log'),
  form:   document.getElementById('ai-form'),
  input:  document.getElementById('ai-input'),
  history: []
};

// --- Tiny local "memory" ---
const memory = {
  get intensity(){ return localStorage.getItem('lm_intensity') || 'easy'; },
  set intensity(v){ localStorage.setItem('lm_intensity', v); },
  get lastCat(){ return localStorage.getItem('lm_lastCat') || ''; },
  set lastCat(v){ localStorage.setItem('lm_lastCat', v); },
};

// --- Helpers ---
function sanitize(s){
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML.replace(/\n/g,'<br/>');
}
function aiAppend(role, text, chips = []){
  const el = document.createElement('div');
  el.className = `ai-msg ${role}`;
  el.innerHTML = `<span class="who">${role === 'user' ? 'You' : 'AI'}</span>${sanitize(text)}`;
  if (chips.length){
    const wrap = document.createElement('div');
    wrap.style.marginTop = '.5rem';
    chips.forEach(label => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'btn';
      b.style.marginRight = '.4rem';
      b.textContent = label;
      b.addEventListener('click', () => {
        ai.input.value = label;
        ai.form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
      });
      wrap.appendChild(b);
    });
    el.appendChild(wrap);
  }
  ai.log.appendChild(el);
  ai.log.scrollTop = ai.log.scrollHeight;
}
function openCategoriesAI(){
  if (!pages.categories.classList.contains('active')) {
    location.hash = '#/categories';
  } else {
    renderCategories();
  }
}
function openCategory(catId, expandFirst = true){
  memory.lastCat = catId;
  location.hash = `#/category/${catId}`;
  requestAnimationFrame(() => {
    if (!expandFirst) return;
    const first = document.querySelector('#detail-list .acc-item .acc-hd');
    if (first) first.click();
  });
}
function goHome(){ location.hash = '#/'; window.scrollTo({ top: 0, behavior: 'smooth' }); }
function goTop(){ window.scrollTo({ top: 0, behavior: 'smooth' }); }

// --- Category detection ---
const categoryAliases = {
  'arm': ['arm','arms','bicep','biceps','tricep','triceps','upper body','shoulder','shoulders'],
  'leg': ['leg','legs','thigh','thighs','knee','knees','ankle','ankles','calf','calves','quads','hamstring','hamstrings'],
  'neck': ['neck','cervical'],
  'back': ['back','spine','thoracic','lower back','upper back'],
  'hip': ['hip','hips','glute','glutes','pelvis','pelvic'],
  'sit-to-stand': ['sit to stand','sit-to-stand','chair stand','sit stand','sit to stand up'],
  'balance': ['balance','stability','posture','postural'],
  'seated-knee-raises': ['knee raise','knee raises','seated knee','marches','marching','knee lift'],
  'side-twists-wheelchair': ['twist','twists','side twist','wheelchair twist','rotation','rotations'],
  'seated-tricep-dips': ['tricep dip','tricep dips','chair dip','dips'],
  'aerobic': ['aerobic','cardio','conditioning','endurance','ube','shadow boxing','arms only jacks'],
  'flexibility': ['stretch','flexibility','range of motion','rom','mobility'],
  'step-ups': ['step up','step-ups','steps','stair','box step'],
  'aquatic': ['aquatic','pool','water','swim','water walking'],
  'light-band': ['band','resistance band','theraband','elastic','bands']
};
function detectCategoryId(text){
  const t = text.toLowerCase();
  for (const [id, words] of Object.entries(categoryAliases)) {
    if (words.some(w => t.includes(w))) return id;
  }
  const m = t.match(/(?:open|go to|show)\s+([a-z\- ]+)/);
  if (m){
    const q = m[1].trim();
    for (const [id, words] of Object.entries(categoryAliases)) {
      if (id === q || words.some(w => q.includes(w))) return id;
    }
  }
  return null;
}

// --- Fuzzy exercise finder (by name/desc) ---
function findExercise(query){
  const q = query.toLowerCase();
  let best = null;
  let bestCatId = null;
  let bestScore = 0;

  function score(str){
    const s = str.toLowerCase();
    let sc = 0;
    if (s.includes(q)) sc += 3;
    q.split(/\s+/).forEach(tok => { if (tok && s.includes(tok)) sc += 1; });
    return sc;
  }

  for (const [catName, arr] of Object.entries(EXERCISES)) {
    const catId = Object.entries(idToName).find(([id, name]) => name === catName)?.[0];
    if (!catId) continue;
    arr.forEach((ex, idx) => {
      const s = score(`${ex.name} ${ex.desc} ${ex.more||''} ${ex.more2||''}`);
      if (s > bestScore) {
        bestScore = s;
        best = { catId, idx, ex, catName };
      }
    });
  }
  return bestScore >= 3 ? best : null;
}

// --- Small talk & utilities ---
function randomFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
const greetings = ["Hey! 👋", "Hi there! 🙌", "Welcome!", "Yo!"];
const motivates = [
  "Small steps add up. One gentle set now beats zero. 💪",
  "Move how you can, not how you can’t. 🌿",
  "Consistency > intensity. You’ve got this. ✨"
];
const jokes = [
  "Why did the dumbbell go to school? It wanted to get a little *smarter*!",
  "I tried to do a plank, but my snack plank interrupted. 🍪"
];

// --- Intent engine (richer) ---
function handleOfflineIntent(userText){
  const t = userText.trim().toLowerCase();

  // Guardrails
  if (/diagnose|injur|pain|doctor|medical|prescrib|contraindicat/.test(t)) {
    return { reply:
      "I can share general, educational exercise info only—no medical advice. If you feel pain, dizziness, or shortness of breath, stop and talk with a qualified professional." };
  }

  // Greetings / small talk
  if (/^(hi|hello|hey|yo)\b/.test(t)) {
    return { reply: `${randomFrom(greetings)} Want a quick warm-up, or should I open a body area?` ,
             chips: ['Warm-up', 'Open Arms', 'Open Legs'] };
  }
  if (/\b(thanks|thank you|appreciate)\b/.test(t)) {
    return { reply: "Anytime! Want a 10-minute routine or to browse categories?" ,
             chips: ['10-minute routine', 'Browse exercises'] };
  }

  // Navigation
  if (/^home$|go home|back home/.test(t)) {
    goHome();
    return { reply: "Back to Home. What’s next?" };
  }
  if (/^categories?$|open categories|browse exercises|show exercises$/.test(t)) {
    openCategoriesAI();
    return { reply: "Here are all categories. Say a body area (e.g., “arms”, “neck”)." };
  }
  if (/top|scroll up|back to top|go to top/.test(t)) {
    goTop();
    return { reply: "Up we go. 👆" };
  }

  // Intensity memory
  if (/\b(easy|light|gentle)\b/.test(t)) { memory.intensity = 'easy'; return { reply: "Got it—keeping things gentle. 🌱" }; }
  if (/\b(medium|moderate|normal)\b/.test(t)) { memory.intensity = 'moderate'; return { reply: "Okay—moderate pace noted. 🚶" }; }
  if (/\b(hard|intense|challenging)\b/.test(t)) { memory.intensity = 'hard'; return { reply: "Understood—cautiously upping challenge. ⚠️ Keep it safe." }; }

  // Warm-up / Cool-down / Hydration
  if (/warm.?up/.test(t)) {
    return { reply:
`Quick warm-up (${memory.intensity}):
• 30–45s Shoulder Rolls
• 30–45s Ankle Pumps
• 30–45s Seated Cat–Cow
• Easy Neck Rotations 5–8/side
Ready for a focus area?`,
      chips: ['Open Arms', 'Open Back', 'Open Legs']
    };
  }
  if (/cool.?down|stretch/.test(t)) {
    return { reply:
`Cool-down idea:
• Seated Hamstring Stretch 10–20s/side
• Shoulder Rolls 20–30s
• Wrist Circles 5–8 each way
• Gentle breathing 3× (inhale 4s, exhale 6s)` };
  }
  if (/drink|water|hydrate|hydration/.test(t)) {
    return { reply: "Sip water regularly; small sips before and after short sessions are great. 🥤" };
  }

  // Motivation / joke
  if (/motivat|inspire/.test(t)) {
    return { reply: randomFrom(motivates) };
  }
  if (/joke|funny/.test(t)) {
    return { reply: randomFrom(jokes) };
  }

  // Open category (by alias)
  const catId = detectCategoryId(t);
  if (catId) {
    openCategory(catId, true);
    const pretty = (idToName[catId] || catId).replace(/&/g,'&amp;');
    return {
      reply: `Opening ${pretty}. I’ll expand the first item—want sets/reps guidance or a quick 10-minute routine?`,
      chips: ['Give me a 10-minute routine', 'Beginner sets & reps', 'Back to Categories']
    };
  }

  // Find a specific exercise by name/term (fuzzy)
  if (/video|show|how to|tutorial|exercise|do\b/.test(t) || t.length > 3) {
    const hit = findExercise(t);
    if (hit) {
      openCategory(hit.catId, false);
      // expand the exact item after DOM renders
      setTimeout(() => {
        const btns = document.querySelectorAll('#detail-list .acc-item .acc-hd');
        if (btns[hit.idx]) btns[hit.idx].click();
      }, 80);
      return { reply: `Here’s **${hit.ex.name}** in **${hit.catName}**. Need coaching cues or a rep scheme?`,
               chips: ['Coaching cues', 'Beginner sets & reps'] };
    }
  }

  // Routines
  if (/routine|plan|program|workout|10.?minute/.test(t)) {
    const easy = memory.intensity === 'easy';
    return {
      reply:
`Try this ${easy ? 'gentle' : memory.intensity} 10-minute seated plan (educational only):
• Warm-up (2 min): Shoulder rolls, Ankle pumps
• Main (6 min): Seated Marches 3×40s (20s rest), Band Seated Row 2×10 slow reps, Seated Cat–Cow 45s
• Finish (2 min): Wrist circles, Seated Hamstring Stretch (10–20s/side)
Say a body area and I’ll tailor it further.`,
      chips: ['Arms focus', 'Back focus', 'Legs focus']
    };
  }

  // Equipment / schedule
  if (/equipment|need.*(band|weights?|dumbbell|chair)/.test(t)) {
    return { reply: "You can do most moves with just a sturdy chair. Bands/light dumbbells help, but not required. ✅" };
  }
  if (/schedule|days?|week|how often/.test(t)) {
    return { reply:
`Simple schedule:
• 3×/week: strength/mobility (20–30 min)
• Most days: light cardio (even 5–10 min seated)
• Stretching on easy days
Rest if symptoms flare and consult a pro if unsure.` };
  }

  // Last category shortcut
  if (/again|repeat|same as last time/.test(t) && memory.lastCat) {
    openCategory(memory.lastCat, true);
    const pretty = idToName[memory.lastCat];
    return { reply: `Back to **${pretty}**. Want me to start a 10-minute block?`,
             chips: ['Start 10-minute block', 'Beginner sets & reps'] };
  }

  // Fallback
  return {
    reply: "I can jump you to any section: Arms, Legs, Neck, Back, Hip, Balance, Aerobic, Flexibility, Step-Ups, Aquatic, Light Band… or ask for a specific move (e.g., “show seated marches”).",
    chips: ['Arms','Legs','Neck','Back','Hip','Balance','Aerobic','Flexibility']
  };
}

// --- Wire up (no network; purely offline) ---
ai.toggle?.addEventListener('click', () => {
  ai.drawer.hidden = !ai.drawer.hidden;
  if (!ai.drawer.hidden) ai.input.focus();
});
ai.close?.addEventListener('click', () => { ai.drawer.hidden = true; });

ai.form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const content = ai.input.value.trim();
  if (!content) return;
  ai.input.value = '';

  ai.history.push({ role:'user', content });
  aiAppend('user', content);

  const { reply, chips } = handleOfflineIntent(content);
  ai.history.push({ role:'assistant', content: reply });
  aiAppend('assistant', reply, chips);
});
