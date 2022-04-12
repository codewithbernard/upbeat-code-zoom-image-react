import React, { useRef, useMemo, useEffect } from "react";

const ZoomImage = ({ image }) => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const observer = useRef(null);
  const background = useMemo(() => new Image(), [image]);

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

        // Set image as background
        canvasRef.current.getContext("2d").drawImage(background, 0, 0);
      };
    }
  }, [background]);

  return (
    <div ref={containerRef}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default ZoomImage;
