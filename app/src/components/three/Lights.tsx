// Studio-style lighting rig. PRD §6.5: directional key (top-front, 1.4),
// ambient (0.6), rim light back-left (0.8). Soft and minimal so the
// garment material reads cleanly without harsh shadows.
export function Lights() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 4, 3]} intensity={1.4} castShadow={false} />
      <directionalLight position={[-3, 2, -2]} intensity={0.8} color="#ffffff" />
    </>
  );
}
