let loadingTextInterval;

function startLoading() {
  const intro = document.getElementById('intro');
  const loading = document.getElementById('loadingScreen');

  intro.style.transition = 'opacity 0.5s ease';
  intro.style.opacity = 0;

  setTimeout(() => {
    intro.style.display = 'none';             // Intro を非表示
    loading.style.display = 'flex';           // Loading を表示
    animateLoadingText();                     // Loading アニメーション開始

    setTimeout(() => {
      clearInterval(loadingTextInterval);     // Loadingアニメ終了
      loading.style.display = 'none';         // Loadingを非表示

      const complete = document.getElementById('homepage'); // ロード完了画面
      complete.style.display = 'flex';        // ロード完了画面を表示
      complete.classList.add('fade-in');      // ✅ フェードインさせる
      document.getElementById('bgCanvasMain').style.display = 'block'; // Three.js 背景表示
      initMainScene(); // Three.js 初期化
    }, 3000);
  }, 500);
}

// Three.js 背景（ロード完了画面用）
function initMainScene() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);

  const container = document.getElementById("bgCanvasMain");
  container.innerHTML = ""; // 二重描画防止
  container.appendChild(renderer.domElement);

  const geometry = new THREE.IcosahedronGeometry(10, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x000000, wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 20, 20);
  scene.add(light);

  camera.position.z = 40;

  function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;
    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

// Loading... のアニメーション
function animateLoadingText() {
  const loadingEl = document.querySelector(".loading-text");
  let dots = 1;
  loadingTextInterval = setInterval(() => {
    if (!loadingEl) return;
    loadingEl.textContent = "Loading" + ".".repeat(dots) + " ".repeat(3 - dots);
    dots = (dots % 3) + 1;
  }, 500);
}

// GSAP：WORKカードアニメーション
gsap.registerPlugin(ScrollTrigger);

gsap.utils.toArray(".work-card").forEach(card => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
    },
    opacity: 0,
    y: 50,
    duration: 1,
    stagger: 0.2,
    ease: "power2.out"
  });
});

// GSAP：CONTACTフォームアニメーション
gsap.utils.toArray(".contact-form input, .contact-form textarea").forEach((el, i) => {
  gsap.from(el, {
    scrollTrigger: {
      trigger: el,
      start: "top 90%",
    },
    opacity: 0,
    x: i % 2 === 0 ? -100 : 100,
    duration: 1,
    ease: "power3.out"
  });
});

// ハンバーガーメニュー制御（WORK, CONTACT共通）
function toggleNav(section = "work") {
  const menuId = section === "contact" ? "navMenuContact" : "navMenuWork";
  const nav = document.getElementById(menuId);
  nav.classList.toggle("open");
}

// ホームページ → メインページ遷移時イベント
document.querySelectorAll('#homepage a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // ホーム非表示
    document.getElementById('homepage').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    document.getElementById('bgCanvasMain').style.display = 'none';

    // クリック先リンクIDから表示対象セクションを判断
    const targetId = link.getAttribute('href').replace('#', '');
    showPageSectionById(targetId);
  });
});

// セクションIDを直接使って表示切替（page-work / page-contact）
function showPageSectionById(id) {
  const sections = document.querySelectorAll(".page-section");
  sections.forEach(sec => sec.style.display = "none");

  const target = document.getElementById(id);
  if (target) {
    target.style.display = "block";
  }
}
//たまに動かないのでDOMはこのままでイベント発火させる。
document.addEventListener("DOMContentLoaded", () => {
  /// WORK・CONTACTページのナビゲーションリンクも動作させる
  document.querySelectorAll('.nav-menu a, .nav-menu-work a, .nav-menu-contact a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href').replace('#', '');

      // WORK/CONTACTからHOMEに戻るときは特別対応
      if (targetId === 'homepage') {
        document.getElementById('mainContent').style.display = 'none';
        document.getElementById('homepage').style.display = 'flex';
        document.getElementById('bgCanvasMain').style.display = 'block';
      } else {
        document.getElementById('homepage').style.display = 'none';
        document.getElementById('mainContent').style.display = 'block';
        document.getElementById('bgCanvasMain').style.display = 'none';
        showPageSectionById(targetId);
      }
    });
  });
});