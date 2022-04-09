import { useEffect, useRef, useState } from "react";

export default function Canvas() {
  const ref = useRef();

  const getPixelRatio = (context) => {
    var backingStore =
      context.backingStorePixelRatio ||
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1;

    return (window.devicePixelRatio || 1) / backingStore;
  };

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    let ratio = getPixelRatio(ctx);
    let width = getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
    let height = getComputedStyle(canvas)
      .getPropertyValue("height")
      .slice(0, -2);

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    for (var x = 0.5; x < 700; x += 30) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 730);
    }

    for (var y = 0.5; y < 700; y += 30) {
      ctx.moveTo(0, y);
      ctx.lineTo(730, y);
    }

    ctx.stroke();
  }, []);

  return (
    <canvas
      style={{ width: "1200px", height: "700px", border: "1px solid black" }}
      ref={ref}
    ></canvas>
  );
}
