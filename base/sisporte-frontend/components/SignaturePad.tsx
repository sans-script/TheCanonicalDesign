"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/utils";

export type SignaturePadHandle = {
  clear: () => void;
  toDataURL: () => string;
  isEmpty: () => boolean;
};

type SignaturePadProps = {
  width?: number;
  height?: number;
  strokeWidth?: number;
  strokeColor?: string;
  className?: string;
};

export const SignaturePad = forwardRef<SignaturePadHandle, SignaturePadProps>(
  function SignaturePad(
    { width, height, strokeWidth = 2.5, strokeColor = "#0f172a", className },
    ref,
  ) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const drawing = useRef(false);
    const hasInk = useRef(false);
    const points = useRef<{ x: number; y: number }[]>([]);

    const resetCanvas = useCallback(() => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const actualWidth = width ?? container.clientWidth;
      const actualHeight = height ?? container.clientHeight;

      if (actualWidth === 0 || actualHeight === 0) return;

      const dpr =
        typeof window !== "undefined"
          ? Math.max(window.devicePixelRatio || 1, 2)
          : 2;

      canvas.width = Math.round(actualWidth * dpr);
      canvas.height = Math.round(actualHeight * dpr);
      canvas.style.width = `${actualWidth}px`;
      canvas.style.height = `${actualHeight}px`;

      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, actualWidth, actualHeight);

      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowBlur = 0.5;
      ctx.shadowColor = strokeColor;

      hasInk.current = false;
      points.current = [];
    }, [width, height, strokeColor, strokeWidth]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const observer = new ResizeObserver(() => {
        resetCanvas();
      });

      observer.observe(container);
      return () => observer.disconnect();
    }, [resetCanvas]);

    const getPoint = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.setPointerCapture(e.pointerId);
      drawing.current = true;
      const p = getPoint(e);
      points.current = [p];

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, strokeWidth / 2, 0, Math.PI * 2);
        ctx.fillStyle = strokeColor;
        ctx.fill();
        hasInk.current = true;
      }
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!drawing.current) return;
      const p = getPoint(e);

      const lastP = points.current[points.current.length - 1];
      const dist = Math.sqrt(
        Math.pow(p.x - lastP.x, 2) + Math.pow(p.y - lastP.y, 2),
      );

      if (dist > 1) {
        points.current.push(p);

        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        if (points.current.length > 2) {
          const i = points.current.length - 3;
          const p1 = points.current[i];
          const p2 = points.current[i + 1];
          const p3 = points.current[i + 2];

          const xc = (p1.x + p2.x) / 2;
          const yc = (p1.y + p2.y) / 2;
          const xc2 = (p2.x + p3.x) / 2;
          const yc2 = (p2.y + p3.y) / 2;

          ctx.beginPath();
          ctx.moveTo(xc, yc);
          ctx.quadraticCurveTo(p2.x, p2.y, xc2, yc2);
          ctx.stroke();
        }
      }
    };

    const endStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (canvas?.hasPointerCapture(e.pointerId)) {
        canvas.releasePointerCapture(e.pointerId);
      }
      drawing.current = false;
      points.current = [];
    };

    useImperativeHandle(
      ref,
      () => ({
        clear: () => resetCanvas(),
        toDataURL: () => {
          const canvas = canvasRef.current;
          if (!canvas) return "";
          return canvas.toDataURL("image/png", 1.0);
        },
        isEmpty: () => !hasInk.current,
      }),
      [resetCanvas],
    );

    return (
      <div
        ref={containerRef}
        className={cn(
          "w-full h-full min-h-0 min-w-0 overflow-hidden",
          className,
        )}
      >
        <canvas
          ref={canvasRef}
          className="touch-none cursor-crosshair block w-full h-full"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endStroke}
          onPointerCancel={endStroke}
        />
      </div>
    );
  },
);
