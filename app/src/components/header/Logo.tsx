// KnitStudio wordmark logo (placeholder, neutral generic brand per PRD §17 Q6).
// Kept simple so it can be swapped for an SVG asset later.
export function Logo() {
  return (
    <span
      className="font-display text-knitup-gray select-none"
      style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em' }}
    >
      knit<span style={{ fontWeight: 400 }}>studio</span>
    </span>
  );
}
