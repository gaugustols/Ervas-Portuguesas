// Pure render: no hooks, client directive, stylesheet or browser bundle.
const masks = [
  "linear-gradient(to bottom, transparent 0%, black 12.5%, black 25%, transparent 37.5%)",
  "linear-gradient(to bottom, transparent 12.5%, black 25%, black 37.5%, transparent 50%)",
  "linear-gradient(to bottom, transparent 25%, black 37.5%, black 50%, transparent 62.5%)",
  "linear-gradient(to bottom, transparent 37.5%, black 50%, black 62.5%, transparent 75%)",
  "linear-gradient(to bottom, transparent 50%, black 62.5%, black 75%, transparent 87.5%)",
  "linear-gradient(to bottom, transparent 62.5%, black 75%, black 87.5%, transparent 100%)",
  "linear-gradient(to bottom, transparent 75%, black 87.5%, black 100%)",
  "linear-gradient(to bottom, transparent 87.5%, black 100%)",
];

export default function ProgressiveBlur() {
  return (
    <div data-progressive-blur="" aria-hidden="true" style={{
      position: "fixed", bottom: 0, left: 0, width: "100%", height: "200px",
      zIndex: 999, pointerEvents: "none",
    }}>
      {masks.map((mask, index) => (
        <div key={mask} style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backdropFilter: `blur(${0.25 * 2 ** index}px)`,
          WebkitBackdropFilter: `blur(${0.25 * 2 ** index}px)`,
          maskImage: mask, WebkitMaskImage: mask,
        }} />
      ))}
    </div>
  );
}
