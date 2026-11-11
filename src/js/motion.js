/** Shared motion language — mirrors the CSS custom properties in styles.css. */
export const EASE = 'expo.out'; // ≈ cubic-bezier(0.22, 1, 0.36, 1)
export const DUR = { fast: 0.18, base: 0.35, slow: 0.9 };
export const STAGGER = 0.08;
export const PRELOADER_MS = 1100;
const SOFTWARE_GL = /swiftshader|llvmpipe|software|basic render/i;

export const media = {
  reducedMotion: () => matchMedia('(prefers-reduced-motion: reduce)').matches,
  finePointer: () => matchMedia('(hover: hover) and (pointer: fine)').matches,
  /** Large screens with enough headroom get the full 3D scene; others keep the static fallback. */
  canRun3D: () => {
    if (!matchMedia('(min-width: 1024px)').matches) return false;
    if (navigator.connection?.saveData) return false;
    if ((navigator.hardwareConcurrency || 4) < 4) return false;
    try {
      const gl = document.createElement('canvas').getContext('webgl2') || document.createElement('canvas').getContext('webgl');
      if (!gl) return false;
      // Software rasterisers (no GPU) would make the scene janky — keep the static fallback instead.
      const info = gl.getExtension('WEBGL_debug_renderer_info');
      const renderer = info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return !SOFTWARE_GL.test(String(renderer));
    } catch {
      return false;
    }
  },
};
