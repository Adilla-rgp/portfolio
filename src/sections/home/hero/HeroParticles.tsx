"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRafTicker } from "@/hooks/useRafTicker";
import {
  convergence,
  createParticles,
  particleConfig,
  placeParticle,
  waveLineOpacity,
  waveY,
  type Particle,
  type Pointer,
} from "@/lib/particles";
import { useParticlesControl } from "./ParticlesControl";

interface FieldState {
  context: CanvasRenderingContext2D | null;
  particles: Particle[];
  width: number;
  height: number;
  /** Ticker time of the last (re)start, so replay restarts the convergence. */
  startedAt: number;
  lastT: number;
  pointer: Pointer | null;
  isReduced: boolean;
  colors: { dot: string; hot: string };
}

/** Time used for the static, already-formed wave under reduced motion. */
const STATIC_T = 0;
const FULL_TURN = Math.PI * 2;

function draw(field: FieldState, t: number, progress: number, pointer: Pointer | null) {
  const { context, particles, width, height, colors } = field;
  if (!context) return;

  context.clearRect(0, 0, width, height);

  const lineOpacity = waveLineOpacity(progress);
  if (lineOpacity > 0) {
    const { sampleStep, lineWidth } = particleConfig.wave;
    context.globalAlpha = lineOpacity;
    context.strokeStyle = colors.hot;
    context.lineWidth = lineWidth;
    context.beginPath();
    for (let x = 0; x <= width + sampleStep; x += sampleStep) {
      const y = waveY(x, t, width, height);
      if (x === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.stroke();
  }

  for (const particle of particles) {
    const dot = placeParticle(particle, t, progress, width, height, pointer);
    context.globalAlpha = dot.opacity;
    context.fillStyle = dot.isHot ? colors.hot : colors.dot;
    context.beginPath();
    context.arc(dot.x, dot.y, dot.radius, 0, FULL_TURN);
    context.fill();
  }
  context.globalAlpha = 1;
}

/** Draws the current state once, outside the ticker (resize, pause, reduced motion). */
function drawStill(field: FieldState) {
  if (field.isReduced) draw(field, STATIC_T, 1, null);
  else draw(field, field.lastT, convergence(field.lastT - field.startedAt), field.pointer);
}

/**
 * Canvas 2D particle field behind the hero title. Everything per frame lives
 * in a ref and is drawn imperatively from the ticker callback; React renders
 * this component once.
 */
export function HeroParticles() {
  const { registerReplay } = useParticlesControl();
  const fieldRef = useRef<FieldState>({
    context: null,
    particles: [],
    width: 0,
    height: 0,
    startedAt: 0,
    lastT: 0,
    pointer: null,
    isReduced: false,
    colors: { dot: "", hot: "" },
  });

  const onFrame = useCallback((t: number) => {
    const field = fieldRef.current;
    field.lastT = t;
    draw(field, t, convergence(t - field.startedAt), field.pointer);
  }, []);

  const { ref: canvasRef, reducedMotion } = useRafTicker<HTMLCanvasElement>({ onFrame });

  useEffect(() => {
    fieldRef.current.isReduced = reducedMotion;
    if (reducedMotion) fieldRef.current.pointer = null;
    drawStill(fieldRef.current);
  }, [reducedMotion]);

  // Size the backing store to the element and the device pixel ratio.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const field = fieldRef.current;
    field.context = canvas.getContext("2d");
    const styles = getComputedStyle(canvas);
    field.colors = {
      dot: styles.getPropertyValue("--color-fg").trim(),
      hot: styles.getPropertyValue("--color-signal").trim(),
    };

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      const ratio = window.devicePixelRatio || 1;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      field.context?.setTransform(ratio, 0, 0, ratio, 0, 0);
      field.width = width;
      field.height = height;
      field.particles = createParticles(width, height);
      drawStill(field);
    });
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [canvasRef]);

  // Repulsion is listened on the hero so the text on top does not block it.
  // Passive listeners plus touch-action: pan-y on the hero keep scrolling free.
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    const field = fieldRef.current;
    const move = (event: PointerEvent) => {
      if (field.isReduced) return;
      const rect = canvas.getBoundingClientRect();
      field.pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    };
    const leave = () => {
      field.pointer = null;
    };

    host.addEventListener("pointermove", move, { passive: true });
    host.addEventListener("pointerleave", leave, { passive: true });
    host.addEventListener("pointercancel", leave, { passive: true });
    return () => {
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerleave", leave);
      host.removeEventListener("pointercancel", leave);
    };
  }, [canvasRef]);

  useEffect(() => {
    registerReplay(() => {
      const field = fieldRef.current;
      field.startedAt = field.lastT;
    });
    return () => registerReplay(null);
  }, [registerReplay]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full"
    />
  );
}
