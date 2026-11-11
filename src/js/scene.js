/**
 * Hero 3D scene — a faceted "core" (the model) wrapped in orbit rings (the service layer)
 * inside a constellation of connected data points. Lightweight: < 1k vertices, capped DPR,
 * no external assets (environment reflections are generated procedurally).
 *
 * Scroll story: as the visitor moves from the hero to About, the core turns, grows,
 * shifts colour and the constellation disperses while the layer fades out — then rendering stops.
 */
import {
  AdditiveBlending,
  AmbientLight,
  BufferGeometry,
  Color,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  LineBasicMaterial,
  LineSegments,
  MathUtils,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  NormalBlending,
  PerspectiveCamera,
  PMREMGenerator,
  PointLight,
  Points,
  PointsMaterial,
  Scene,
  TorusGeometry,
  Vector3,
  WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const MAX_DPR = 1.5;
const FOV = 35;
const CAMERA_Z = 9;
const POINT_COUNT = 220;
const LINK_DISTANCE = 0.95;
const MAX_LINKS_PER_POINT = 3;
const FADE_END = 1; // story value (section index) at which the layer is fully hidden

const PALETTE = {
  dark: { core: '#a9afff', coreShift: '#e879f9', accent: '#8b93ff', ring: '#d4d4d8', points: 0.8, lines: 0.12 },
  light: { core: '#6c74f5', coreShift: '#c026d3', accent: '#4f46e5', ring: '#52525b', points: 0.6, lines: 0.11 },
};

const ease = (t) => 1 - Math.pow(1 - t, 3);
/** Deterministic pseudo-random in [0, 1) so the constellation is identical on every visit. */
const hash = (n) => { const s = Math.sin(n * 12.9898) * 43758.5453; return s - Math.floor(s); };

/** Points on a shell (Fibonacci sphere with radial jitter) + short links between neighbours. */
function buildConstellation() {
  const positions = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const pts = [];
  for (let i = 0; i < POINT_COUNT; i++) {
    const y = 1 - (i / (POINT_COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const radius = 2.6 + hash(i) * 1.1;
    const p = new Vector3(Math.cos(theta) * r, y, Math.sin(theta) * r).multiplyScalar(radius);
    pts.push(p);
    positions.push(p.x, p.y, p.z);
  }
  const links = [];
  pts.forEach((a, i) => {
    let n = 0;
    for (let j = i + 1; j < pts.length && n < MAX_LINKS_PER_POINT; j++) {
      if (a.distanceTo(pts[j]) < LINK_DISTANCE) {
        links.push(a.x, a.y, a.z, pts[j].x, pts[j].y, pts[j].z);
        n++;
      }
    }
  });
  const pointGeo = new BufferGeometry();
  pointGeo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const lineGeo = new BufferGeometry();
  lineGeo.setAttribute('position', new Float32BufferAttribute(links, 3));
  return { pointGeo, lineGeo };
}

export function createScene(canvas, { theme = 'dark', story = () => 0, onReady, onFail }) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_DPR));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50);
  camera.position.z = CAMERA_Z;

  const pmrem = new PMREMGenerator(renderer);
  const roomEnv = new RoomEnvironment();
  const envMap = pmrem.fromScene(roomEnv, 0.04).texture;
  scene.environment = envMap;

  // Lights
  const ambient = new AmbientLight(0xffffff, 0.25);
  const key = new DirectionalLight(0xffffff, 0.9);
  key.position.set(3, 4, 5);
  const rim = new PointLight(0x8b93ff, 30, 12);
  rim.position.set(-3, -1, -2);
  scene.add(ambient, key, rim);

  // Core
  const root = new Group();
  const core = new Group();
  const shellMat = new MeshPhysicalMaterial({
    metalness: 0.35,
    roughness: 0.16,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    iridescence: 0.85,
    iridescenceIOR: 1.35,
    envMapIntensity: 0.85,
    flatShading: true,
  });
  const shell = new Mesh(new IcosahedronGeometry(0.95, 1), shellMat);
  const innerMat = new LineBasicMaterial({ transparent: true, opacity: 0.55 });
  const inner = new LineSegments(new EdgesGeometry(new IcosahedronGeometry(1.3, 1)), innerMat);
  const ringMat = new MeshStandardMaterial({ metalness: 1, roughness: 0.25, envMapIntensity: 1.4 });
  const ringA = new Mesh(new TorusGeometry(1.75, 0.01, 8, 180), ringMat);
  const ringB = new Mesh(new TorusGeometry(2.1, 0.007, 8, 200), ringMat);
  ringA.rotation.set(1.2, 0.3, 0);
  ringB.rotation.set(-0.4, 1.1, 0.4);
  core.add(shell, inner, ringA, ringB);

  // Constellation
  const { pointGeo, lineGeo } = buildConstellation();
  const pointMat = new PointsMaterial({ size: 0.035, sizeAttenuation: true, transparent: true, depthWrite: false });
  const lineMat = new LineBasicMaterial({ transparent: true, depthWrite: false, blending: AdditiveBlending });
  const field = new Group();
  field.add(new Points(pointGeo, pointMat), new LineSegments(lineGeo, lineMat));

  root.add(core, field);
  scene.add(root);

  // Theme ----------------------------------------------------------------
  const colors = { core: new Color(), shift: new Color(), mixed: new Color() };
  let palette = PALETTE[theme] || PALETTE.dark;
  function setTheme(next) {
    palette = PALETTE[next] || PALETTE.dark;
    colors.core.set(palette.core);
    colors.shift.set(palette.coreShift);
    innerMat.color.set(palette.accent);
    ringMat.color.set(palette.ring);
    pointMat.color.set(palette.accent);
    lineMat.color.set(palette.accent);
    rim.color.set(palette.accent);
    lineMat.blending = next === 'light' ? NormalBlending : AdditiveBlending;
    lineMat.needsUpdate = true;
    requestFrame();
  }

  // Layout -----------------------------------------------------------------
  let viewW = 10;
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const viewH = 2 * Math.tan(MathUtils.degToRad(FOV / 2)) * CAMERA_Z;
    viewW = viewH * camera.aspect;
    requestFrame();
  }

  // Input ------------------------------------------------------------------
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPointer = (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.ty = (e.clientY / window.innerHeight) * 2 - 1;
  };

  // Loop -------------------------------------------------------------------
  let running = false;
  let last = performance.now();
  let elapsed = 0;

  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    elapsed += dt;

    const t = MathUtils.clamp(story() / FADE_END, 0, 1);
    const e = ease(t);
    const opacity = 1 - MathUtils.smoothstep(t, 0.35, 1);
    canvas.style.opacity = opacity.toFixed(3);
    if (opacity <= 0.001) {
      stop();
      return;
    }

    pointer.x += (pointer.tx - pointer.x) * 0.05;
    pointer.y += (pointer.ty - pointer.y) * 0.05;

    // Position: right of the headline, drifting outward and up on scroll.
    root.position.x = MathUtils.lerp(viewW * 0.25, viewW * 0.32, e) + pointer.x * 0.15;
    root.position.y = MathUtils.lerp(0.05, 0.9, e) - pointer.y * 0.1;
    root.rotation.y = pointer.x * 0.25;
    root.rotation.x = pointer.y * 0.18;

    // Core: idle spin + scroll-driven turn, growth and colour shift.
    core.rotation.y = elapsed * 0.18 + e * Math.PI * 1.25;
    core.rotation.x = Math.sin(elapsed * 0.4) * 0.12 + e * 0.6;
    core.scale.setScalar(MathUtils.lerp(1, 1.3, e) * (1 + Math.sin(elapsed * 1.2) * 0.012));
    inner.rotation.y = -elapsed * 0.25;
    ringA.rotation.z = elapsed * 0.2;
    ringB.rotation.z = -elapsed * 0.14;
    colors.mixed.copy(colors.core).lerp(colors.shift, e * 0.85);
    shellMat.color.copy(colors.mixed);

    // Field: slow drift, disperses on scroll.
    field.rotation.y = elapsed * 0.03;
    field.rotation.x = elapsed * 0.012;
    field.scale.setScalar(MathUtils.lerp(1, 1.7, e));
    pointMat.opacity = palette.points * (1 - e * 0.6);
    lineMat.opacity = palette.lines * (1 - e);

    renderer.render(scene, camera);
  }

  function start() {
    if (running || document.hidden) return;
    running = true;
    last = performance.now();
    renderer.setAnimationLoop(frame);
  }
  function stop() {
    running = false;
    renderer.setAnimationLoop(null);
  }
  /** Re-evaluate whether to render (on scroll, resize, theme change, tab visibility). */
  function requestFrame() {
    if (document.hidden) return stop();
    if (story() < FADE_END) start();
  }

  const onScroll = () => requestFrame();
  const onVisibility = () => (document.hidden ? stop() : requestFrame());
  const onContextLost = (e) => {
    e.preventDefault();
    stop();
    onFail?.();
  };

  window.addEventListener('resize', resize);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointer, { passive: true });
  document.addEventListener('visibilitychange', onVisibility);
  canvas.addEventListener('webglcontextlost', onContextLost);

  setTheme(theme);
  resize();
  renderer.compile(scene, camera);
  frame(performance.now());
  onReady?.();
  requestFrame();

  function dispose() {
    stop();
    window.removeEventListener('resize', resize);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    canvas.removeEventListener('webglcontextlost', onContextLost);
    scene.traverse((obj) => {
      obj.geometry?.dispose();
      obj.material?.dispose();
    });
    envMap.dispose();
    roomEnv.traverse?.((obj) => {
      obj.geometry?.dispose();
      obj.material?.dispose();
    });
    pmrem.dispose();
    renderer.dispose();
  }

  return { setTheme, dispose };
}
