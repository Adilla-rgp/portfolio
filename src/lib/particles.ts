/**
 * Noise → signal particle field for the Home hero, after
 * docs/design-reference/Home.dc.html. Pure geometry: the component owns the
 * canvas and the clock. The reference is authored on a 1440×800 board; widths
 * are normalized to it so the wave keeps the same number of cycles at any size.
 */

const REFERENCE_WIDTH = 1440;
const REFERENCE_HEIGHT = 800;

export const particleConfig = {
  count: { desktop: 150, compact: 80 },
  /** Below this canvas width (CSS px) the compact count is used. */
  compactBelow: 640,
  /** Horizontal inset of the first and last target, in reference units. */
  edgeInset: 20,
  jitter: { amplitude: 8, speedX: 1.7, speedY: 1.3 },
  convergence: { delay: 0.5, duration: 2.4 },
  wave: {
    /** Baseline as a fraction of the canvas height. */
    baseline: 600 / REFERENCE_HEIGHT,
    primary: { amplitude: 58 / REFERENCE_HEIGHT, frequency: 0.0105, speed: 1.1 },
    secondary: { amplitude: 20 / REFERENCE_HEIGHT, frequency: 0.029, speed: -0.7 },
    /**
     * Narrow screens stack the hero copy taller, so the wave sits lower and
     * flatter to stay clear of the intro paragraph.
     */
    compact: { baseline: 0.84, amplitudeScale: 0.6 },
    /** Line appears over the last 20% of the convergence. */
    lineFrom: 0.8,
    lineOpacity: 0.55,
    lineWidth: 1.5,
    sampleStep: 16,
  },
  pointer: { radius: 160, push: 110, hotThreshold: 0.05 },
  dot: { radius: 1.6, radiusGain: 1.2, hotGain: 2, opacity: 0.35, opacityGain: 0.5 },
} as const;

export interface Particle {
  /** Target x on the wave, in CSS px. */
  targetX: number;
  /** Noise position, in CSS px. */
  noiseX: number;
  noiseY: number;
  phase: number;
}

export interface Pointer {
  x: number;
  y: number;
}

export interface DrawnParticle {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  isHot: boolean;
}

const SEED = 7;
const LCG_MULTIPLIER = 16807;
const LCG_MODULUS = 2147483647;
const FULL_TURN = Math.PI * 2;

/** Deterministic PRNG (Park–Miller), so the noise is the same on every visit. */
function createRandom(seed = SEED) {
  let state = seed;
  return () => {
    state = (state * LCG_MULTIPLIER) % LCG_MODULUS;
    return (state - 1) / (LCG_MODULUS - 1);
  };
}

export function particleCount(width: number): number {
  return width < particleConfig.compactBelow
    ? particleConfig.count.compact
    : particleConfig.count.desktop;
}

export function createParticles(width: number, height: number): Particle[] {
  const random = createRandom();
  const count = particleCount(width);
  const inset = (particleConfig.edgeInset / REFERENCE_WIDTH) * width;
  const span = width - inset * 2;

  return Array.from({ length: count }, (_, index) => ({
    targetX: inset + (index * span) / (count - 1),
    noiseX: random() * width,
    noiseY: random() * height,
    phase: random() * FULL_TURN,
  }));
}

export function waveY(x: number, t: number, width: number, height: number): number {
  const { primary, secondary, compact } = particleConfig.wave;
  const isCompact = width < particleConfig.compactBelow;
  const baseline = isCompact ? compact.baseline : particleConfig.wave.baseline;
  const scale = isCompact ? compact.amplitudeScale : 1;
  const u = (x / width) * REFERENCE_WIDTH;
  return (
    baseline * height +
    scale * primary.amplitude * height * Math.sin(u * primary.frequency + t * primary.speed) +
    scale * secondary.amplitude * height * Math.sin(u * secondary.frequency + t * secondary.speed)
  );
}

function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

function easeOutCubic(value: number) {
  return 1 - Math.pow(1 - value, 3);
}

/** 0 = pure noise, 1 = settled on the wave. `elapsed` counts from the last (re)start. */
export function convergence(elapsed: number): number {
  const { delay, duration } = particleConfig.convergence;
  return easeOutCubic(clamp01((elapsed - delay) / duration));
}

export function waveLineOpacity(progress: number): number {
  const { lineFrom, lineOpacity } = particleConfig.wave;
  return progress > lineFrom ? ((progress - lineFrom) / (1 - lineFrom)) * lineOpacity : 0;
}

export function placeParticle(
  particle: Particle,
  t: number,
  progress: number,
  width: number,
  height: number,
  pointer: Pointer | null,
): DrawnParticle {
  const { jitter, pointer: pointerConfig, dot } = particleConfig;
  const jitterX = particle.noiseX + jitter.amplitude * Math.sin(t * jitter.speedX + particle.phase);
  const jitterY = particle.noiseY + jitter.amplitude * Math.cos(t * jitter.speedY + particle.phase);
  let x = jitterX + (particle.targetX - jitterX) * progress;
  let y = jitterY + (waveY(particle.targetX, t, width, height) - jitterY) * progress;

  let heat = 0;
  if (pointer) {
    const dx = x - pointer.x;
    const dy = y - pointer.y;
    const distance = Math.hypot(dx, dy) || 1;
    if (distance < pointerConfig.radius) {
      heat = (pointerConfig.radius - distance) / pointerConfig.radius;
      x += (dx / distance) * heat * pointerConfig.push;
      y += (dy / distance) * heat * pointerConfig.push;
    }
  }

  return {
    x,
    y,
    radius: dot.radius + progress * dot.radiusGain + heat * dot.hotGain,
    opacity: dot.opacity + progress * dot.opacityGain,
    isHot: heat > pointerConfig.hotThreshold,
  };
}
