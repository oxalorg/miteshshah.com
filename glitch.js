// WebGL2 Glitch Overlay Engine
// Renders procedural glitch artifacts (noise, tears, blocks, VHS tracking)
// on a transparent fullscreen canvas overlay.

class GlitchEngine {
  constructor() {
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.uniforms = {};
    this.isGlitching = false;
    this.ambientStarted = false;
    this.animationId = null;
  }

  init() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    this.createCanvas();
    const gl = this.canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
    });
    if (!gl) return; // No WebGL2 support
    this.gl = gl;

    this.compileShaders();
    this.setupFullscreenQuad();
    this.cacheUniformLocations();
    this.handleResize();
    window.addEventListener('resize', () => this.handleResize());

    this.bindTriggers();
  }

  createCanvas() {
    const c = document.createElement('canvas');
    c.id = 'glitch-canvas';
    Object.assign(c.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      zIndex: '9998',
      pointerEvents: 'none',
      display: 'none',
      mixBlendMode: 'screen',
    });
    document.body.prepend(c);
    this.canvas = c;
  }

  handleResize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
    if (this.gl) {
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  compileShaders() {
    const gl = this.gl;

    const vs = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

    const fs = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform float u_time;
uniform float u_noiseIntensity;
uniform float u_blockGlitch;
uniform float u_tearCount;
uniform float u_vhsTracking;
uniform vec2  u_resolution;
uniform float u_rgbSplit;
uniform float u_seed;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 uv) {
  return hash(uv * u_resolution + u_seed * 100.0);
}

vec4 blockGlitch(vec2 uv) {
  float blockY = floor(uv.y * 20.0);
  float blockX = floor(uv.x * 10.0);
  float h = hash(vec2(blockY, u_seed));
  if (h > 0.85) {
    float intensity = hash(vec2(blockX, blockY + u_seed));
    return vec4(0.102, 0.62, 0.102, intensity * 0.3 * u_blockGlitch);
  }
  return vec4(0.0);
}

vec4 tearLines(vec2 uv) {
  vec4 result = vec4(0.0);
  for (float i = 0.0; i < 8.0; i++) {
    if (i >= u_tearCount) break;
    float lineY = fract(hash(vec2(i, u_seed)) + u_time * (0.5 + hash(vec2(i, 0.0))));
    float dist = abs(uv.y - lineY);
    if (dist < 0.003) {
      result += vec4(0.102, 0.62, 0.102, 0.3);
    }
  }
  return result;
}

vec4 vhsTracking(vec2 uv) {
  if (u_vhsTracking < 0.01) return vec4(0.0);
  float bandY = fract(uv.y * 3.0 - u_time * 2.0);
  float band = smoothstep(0.0, 0.05, bandY) * (1.0 - smoothstep(0.1, 0.15, bandY));
  float n = noise(uv * 4.0) * band;
  return vec4(vec3(n * 0.8), n * 0.2 * u_vhsTracking);
}

void main() {
  vec2 uv = v_uv;
  vec4 color = vec4(0.0);

  // Static noise — green-tinted
  if (u_noiseIntensity > 0.001) {
    float n = noise(uv);
    color += vec4(n * 0.3, n * 1.0, n * 0.3, n * u_noiseIntensity);
  }

  // Block displacement
  if (u_blockGlitch > 0.01) {
    color += blockGlitch(uv);
  }

  // Tear lines
  if (u_tearCount > 0.0) {
    color += tearLines(uv);
  }

  // VHS tracking
  color += vhsTracking(uv);

  fragColor = clamp(color, 0.0, 1.0);
}`;

    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vs);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fs);
    gl.compileShader(fShader);

    this.program = gl.createProgram();
    gl.attachShader(this.program, vShader);
    gl.attachShader(this.program, fShader);
    gl.linkProgram(this.program);
    gl.useProgram(this.program);
  }

  setupFullscreenQuad() {
    const gl = this.gl;
    const verts = new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(this.program, 'a_position');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  cacheUniformLocations() {
    const gl = this.gl;
    const names = [
      'u_time',
      'u_noiseIntensity',
      'u_blockGlitch',
      'u_tearCount',
      'u_vhsTracking',
      'u_resolution',
      'u_rgbSplit',
      'u_seed',
    ];
    for (const n of names) {
      this.uniforms[n] = gl.getUniformLocation(this.program, n);
    }
  }

  setUniforms({ noiseIntensity = 0, blockGlitch = 0, tearCount = 0, vhsTracking = 0, rgbSplit = 0, time = 0, seed = 0 }) {
    const gl = this.gl;
    gl.uniform1f(this.uniforms.u_time, time);
    gl.uniform1f(this.uniforms.u_noiseIntensity, noiseIntensity);
    gl.uniform1f(this.uniforms.u_blockGlitch, blockGlitch);
    gl.uniform1f(this.uniforms.u_tearCount, tearCount);
    gl.uniform1f(this.uniforms.u_vhsTracking, vhsTracking);
    gl.uniform2f(this.uniforms.u_resolution, this.canvas.width, this.canvas.height);
    gl.uniform1f(this.uniforms.u_rgbSplit, rgbSplit);
    gl.uniform1f(this.uniforms.u_seed, seed);
  }

  render() {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  showCanvas() {
    this.canvas.style.display = 'block';
  }

  hideCanvas() {
    this.canvas.style.display = 'none';
    cancelAnimationFrame(this.animationId);
  }

  // --- Main glitch sequence (2.5s) ---

  async triggerGlitch(variant = 'default') {
    if (this.isGlitching || !this.gl) return;
    this.isGlitching = true;

    const debugEl = document.getElementById('debug-trigger');
    const cmdEl = debugEl?.querySelector('.debug-cmd');
    const origText = cmdEl ? cmdEl.textContent : '';

    // Flash red
    if (debugEl) debugEl.classList.add('active');
    if (cmdEl) this.scrambleText(cmdEl, '> SYSTEM FAULT DETECTED', 300);

    this.showCanvas();
    this.scheduleCSSGlitches(variant);

    const duration = variant === 'intense' ? 3500 : 8500;
    await this.animateTimeline(duration);

    this.hideCanvas();
    // Clean up any lingering CSS glitch classes
    document.body.classList.remove('glitch-rgb', 'glitch-invert', 'glitch-skew');

    // Recover debug trigger
    if (debugEl) debugEl.classList.remove('active');
    if (cmdEl) {
      this.scrambleText(cmdEl, '> debug_mode: active', 400);
    }

    this.isGlitching = false;

    if (!this.ambientStarted) {
      this.ambientStarted = true;
      this.startAmbientScheduler();
    }
  }

  animateTimeline(duration) {
    return new Promise((resolve) => {
      const start = performance.now();
      const intense = duration > 3000;
      const animate = () => {
        const elapsed = performance.now() - start;
        if (elapsed >= duration) {
          this.hideCanvas();
          resolve();
          return;
        }
        const p = elapsed / duration;

        // Noise: heavy at start, fades out
        const noiseIntensity = p < 0.2
          ? 0.15 + 0.35 * (1 - p / 0.2)
          : Math.max(0, 0.15 * (1 - (p - 0.2) / 0.8));

        // Block glitch: ramps up in middle
        const blockGlitch = p > 0.2 && p < 0.7
          ? Math.sin((p - 0.2) * Math.PI / 0.5) * (intense ? 1.3 : 1)
          : 0;

        // Tear lines
        const tearCount = p > 0.15 && p < 0.8
          ? 3 + Math.random() * 5
          : 0;

        // VHS tracking
        const vhsTracking = p > 0.4 && p < 0.75
          ? Math.sin((p - 0.4) * Math.PI / 0.35) * (intense ? 1.2 : 1)
          : 0;

        this.setUniforms({
          noiseIntensity,
          blockGlitch,
          tearCount,
          vhsTracking,
          time: elapsed / 1000,
          seed: Math.random(),
        });
        this.render();
        this.animationId = requestAnimationFrame(animate);
      };
      animate();
    });
  }

  // --- CSS effects during main glitch sequence ---
  // Fires rapid CSS body distortions (RGB split, invert, skew) so text+content glitches too
  scheduleCSSGlitches(variant) {
    const duration = variant === 'intense' ? 3500 : 8500;
    const effects = [
      { cls: 'glitch-rgb', minDelay: 200, maxDelay: 800, dur: 100 },
      { cls: 'glitch-invert', minDelay: 400, maxDelay: 1200, dur: 60 },
      { cls: 'glitch-skew', minDelay: 300, maxDelay: 1000, dur: 120 },
    ];
    let elapsed = 0;
    for (const fx of effects) {
      let t = fx.minDelay + Math.random() * (fx.maxDelay - fx.minDelay);
      while (t < duration - 200) {
        const fireAt = t;
        setTimeout(() => {
          document.body.classList.add(fx.cls);
          setTimeout(() => document.body.classList.remove(fx.cls), fx.dur);
        }, fireAt);
        // Space out: more frequent in the intense variant
        const gap = variant === 'intense'
          ? 300 + Math.random() * 500
          : 500 + Math.random() * 1200;
        t += gap;
      }
    }
  }

  startAmbientScheduler() {
    const schedule = () => {
      const delay = 5000 + Math.random() * 25000;
      setTimeout(() => {
        if (!this.isGlitching) this.triggerAmbientGlitch();
        schedule();
      }, delay);
    };
    schedule();
  }

  triggerAmbientGlitch() {
    const effects = ['tear', 'block', 'noise', 'rgbCSS', 'invertCSS', 'skewCSS', 'greenFlash', 'scanlineRoll'];
    const count = 1 + Math.floor(Math.random() * 2);
    const picked = this.shuffle(effects).slice(0, count);

    const needsWebGL = picked.some((e) => ['tear', 'block', 'noise', 'greenFlash', 'scanlineRoll'].includes(e));
    const duration = 80 + Math.random() * 220;

    // CSS effects
    picked.filter((e) => e.endsWith('CSS')).forEach((e) => {
      const cls = 'glitch-' + e.replace('CSS', '');
      document.body.classList.add(cls);
      setTimeout(() => document.body.classList.remove(cls), duration);
    });

    // WebGL effects
    if (needsWebGL && this.gl) {
      this.showCanvas();
      const startTime = performance.now();
      const animate = () => {
        const elapsed = performance.now() - startTime;
        if (elapsed > duration) {
          this.hideCanvas();
          return;
        }
        const t = elapsed / duration;
        const seed = Math.random();

        const noiseIntensity = picked.includes('noise') ? 0.08 + Math.random() * 0.07 : 0;
        const tearCount = picked.includes('tear') ? 1 + Math.random() * 3 : 0;
        const blockGlitch = picked.includes('block') ? 0.5 + Math.random() * 0.5 : 0;
        const vhsTracking = picked.includes('scanlineRoll') ? 0.6 : 0;

        this.setUniforms({
          noiseIntensity: picked.includes('greenFlash') ? 0.05 : noiseIntensity,
          blockGlitch,
          tearCount,
          vhsTracking,
          time: elapsed / 1000,
          seed,
        });
        this.render();
        this.animationId = requestAnimationFrame(animate);
      };
      animate();
    }
  }

  bindTriggers() {
    // Debug trigger
    const debugEl = document.getElementById('debug-trigger');
    if (debugEl) {
      debugEl.addEventListener('click', () => this.triggerGlitch('default'));
    }

    // HELP!!! easter egg
    const helpEl = document.querySelector('.help-easter-egg');
    if (helpEl) {
      helpEl.addEventListener('click', () => this.triggerGlitch('chaos'));
    }

    // Enhance existing konami code
    this.hookKonami();
  }

  hookKonami() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let idx = 0;
    document.addEventListener('keydown', (e) => {
      if (e.keyCode === konamiCode[idx]) {
        idx++;
        if (idx === konamiCode.length) {
          idx = 0;
          this.triggerGlitch('intense');
        }
      } else {
        idx = 0;
      }
    });
  }

  scrambleText(el, target, duration) {
    const chars = '!@#$%^&*01_-=+<>?/~';
    const start = performance.now();
    let resolved = 0;
    const interval = setInterval(() => {
      const elapsed = performance.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      resolved = Math.floor(progress * target.length);
      el.textContent = target
        .split('')
        .map((c, i) => {
          if (i < resolved) return c;
          if (c === ' ') return ' ';
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');
      if (progress >= 1) {
        clearInterval(interval);
        el.textContent = target;
      }
    }, 30);
  }

  shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.glitchEngine = new GlitchEngine();
  window.glitchEngine.init();
});
