import React, { useEffect, useRef, useState } from "react";

export const Pictogram = ({
  totalPoints = 100,
  activePointsRatio = 0.3,
  color = "#4D908E",
  activeColor = "#adf7b6",
  borderColor = "Black",
  sex,
  data,
}) => {
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [showActiveColor, setShowActiveColor] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const updateSize = () => {
      const scaleFactor = window.devicePixelRatio;
      const width = canvas.clientWidth * scaleFactor;
      const height = canvas.clientHeight * scaleFactor;

      ctx.scale(scaleFactor, scaleFactor);
      setSize({ width, height });
    };

    const debounce = (func, delay) => {
      let debounceTimer;
      return function () {
        const context = this;
        const args = arguments;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(context, args), delay);
      };
    };

    const debouncedUpdateSize = debounce(updateSize, 500);

    updateSize();
    window.addEventListener("resize", debouncedUpdateSize);

    return () => window.removeEventListener("resize", debouncedUpdateSize);
  }, []);

  useEffect(() => {
    if (!size.width || !size.height) return;

    const ctx = canvasRef.current.getContext("2d");
    const padding = 20;
    const drawingWidth = size.width - 2 * padding;
    const drawingHeight = size.height - 2 * padding;

    var numCols = Math.ceil(
      Math.sqrt(totalPoints * (drawingWidth / drawingHeight)),
    );
    var numRows = Math.ceil(totalPoints / numCols);

    const radius = Math.min(
      drawingWidth / (numCols * 2),
      drawingHeight / (numRows * 1.5),
    );

    numCols = Math.ceil(drawingWidth / (radius * 2));
    numRows = Math.ceil(drawingHeight / (radius * 1.5));

    ctx.clearRect(0, 0, size.width, size.height);

    const numPoints = numCols * numRows;
    let activePointsCount = Math.floor(numPoints * activePointsRatio);

    const data = Array.from({ length: numPoints }, (_, i) => i);

    let activeIndices = new Set();

    while (activeIndices.size < activePointsCount) {
      const randomIndex = Math.floor(Math.random() * numPoints);
      activeIndices.add(randomIndex);
    }

    const horizontalOffset =
      padding + (drawingWidth - (numCols * radius * 2 - radius)) / 2;
    const patternHeight = numRows * radius * 1.4 - radius / 2;
    const verticalOffset = padding + (drawingHeight - patternHeight) / 2;

    ctx.save();
    ctx.translate(horizontalOffset, verticalOffset);

    // Add drop shadow effect
    ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
    ctx.shadowBlur = 5;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    data.forEach((d) => {
      const cx =
        (d % numCols) * radius * 2 + (Math.floor(d / numCols) % 2) * radius;
      const cy = Math.floor(d / numCols) * radius * 1.5;

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);

      // Set the color with a transition
      ctx.fillStyle =
        showActiveColor && activeIndices.has(d) ? activeColor : color;

      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      ctx.fill();
      ctx.stroke();
    });

    ctx.restore();
  }, [size.width, sex, data, showActiveColor]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowActiveColor(true);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
      }}
      width={size.width}
      height={size.height}
    ></canvas>
  );
};
