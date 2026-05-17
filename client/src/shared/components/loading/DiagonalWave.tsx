export function DiagonalWave({ glow = false, tone = "dark" } = {}) {
  return (
    <>
      <style>{`
        .loader-diagonal-wave {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2px;
          width: 18px;
          height: 18px;
        }
        .loader-diagonal-wave .dot {
          aspect-ratio: 1;
          border-radius: 50%;
          background-color: currentColor;
          animation: diagonal-wave-pulse 1.4s ease-in-out infinite;
          animation-delay: calc(var(--d) * 0.2s);
        }
        .loader-diagonal-wave.glow .dot {
          box-shadow:
            0 0 3px currentColor,
            0 0 9px currentColor;
        }
        .loader-diagonal-wave.glow.light .dot {
          box-shadow:
            0 0 1px rgb(0 0 0 / 0.2),
            0 0 0 3px rgb(0 0 0 / 0.04);
        }
        @keyframes diagonal-wave-pulse {
          0%, 100% { opacity: 0.15; }
          30%, 50% { opacity: 1; }
          80% { opacity: 0.15; }
        }
      `}</style>
      <div
        className={`loader-diagonal-wave ${glow ? "glow" : ""} ${tone === "light" ? "light" : ""}`}
      >
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="dot"
            style={{ "--d": Math.floor(i / 3) + (i % 3) }}
          />
        ))}
      </div>
    </>
  );
}
