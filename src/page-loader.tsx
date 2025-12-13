import * as React from "react";

export function PageLoader({ progress }: { progress: number }) {
  const [show, setShow] = React.useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = React.useState(false);
  const [visualProgress, setVisualProgress] = React.useState(0);

  // 1. Enforce minimum duration of 1.5s
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // 2. Smoothly update visual progress
  React.useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setVisualProgress((prev) => {
        if (prev >= progress) return progress;

        const diff = progress - prev;
        // Increase speed: maxStep 3.0 allows full bar in ~0.5s (30-40 frames) if data is ready
        const maxStep = 3.0;

        // Easing: move faster (10% of gap) and ensure minimum movement
        const step = Math.min(Math.max(diff * 0.1, 0.5), maxStep);

        return Math.min(prev + step, progress);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [progress]);

  // 3. Hide when done AND min time elapsed AND visual progress is complete
  React.useEffect(() => {
    if (minTimeElapsed && progress === 100 && visualProgress >= 99.9) {
      // Small delay to let the bar hit 100 visual
      const t = setTimeout(() => setShow(false), 200);
      return () => clearTimeout(t);
    }
  }, [minTimeElapsed, progress, visualProgress]);

  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-loader-bg)",
        transition: "opacity 0.5s ease-out",
        opacity: minTimeElapsed && progress === 100 && visualProgress >= 99.9 ? 0 : 1,
        pointerEvents: minTimeElapsed && progress === 100 && visualProgress >= 99.9 ? "none" : "auto",
      }}
    >
      <div
        style={{
          width: "200px",
          backgroundColor: "var(--color-loader-bar-bg)",
          height: "4px",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            transformOrigin: "left",
            backgroundColor: "var(--color-loader-bar-fill)",
            transform: `scaleX(${visualProgress / 100})`,
            // Removed transition property to rely on JS animation frame updates for smoothness
          }}
        />
      </div>
    </div>
  );
}
