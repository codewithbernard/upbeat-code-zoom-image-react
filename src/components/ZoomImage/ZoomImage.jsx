import React, { useRef, useMemo, useEffect, useState } from "react";

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;

const ZoomImage = ({ image }) => {
  const [zoom, setZoom] = useState(1);

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const observer = useRef(null);
  const background = useMemo(() => new Image(), [image]);

  const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

  const handleWheel = (event) => {
    setZoom(
      clamp(zoom + event.deltaY * SCROLL_SENSITIVITY, MIN_ZOOM, MAX_ZOOM)
    );
  };

  useEffect(() => {
    observer.current = new ResizeObserver((entries) => {
      entries.forEach(({ target }) => {
        const { width, height } = background;
        // If width of the container is smaller than image, scale image down
        if (target.clientWidth < width) {
          // Calculate scale
          const scale = target.clientWidth / width;

          // Redraw image
          canvasRef.current.width = width * scale;
          canvasRef.current.height = height * scale;
          canvasRef.current
            .getContext("2d")
            .drawImage(background, 0, 0, width * scale, height * scale);
        }
      });
    });
    observer.current.observe(containerRef.current);

    return () => observer.current.unobserve(containerRef.current);
  }, []);

  useEffect(() => {
    background.src = image;

    if (canvasRef.current) {
      background.onload = () => {
        // Get the image dimensions
        const { width, height } = background;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        const context = canvasRef.current.getContext("2d");

        context.scale(zoom, zoom);

        // Set image as background
        context.drawImage(background, 0, 0);
      };
    }
  }, [background, zoom]);

  return (
    <div ref={containerRef}>
      <canvas onWheel={handleWheel} ref={canvasRef} />
    </div>
  );
};

export default ZoomImage;
