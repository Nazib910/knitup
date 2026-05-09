import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { Lights } from './Lights';
import { GarmentMesh } from './GarmentMesh';
import { CameraRig } from './CameraRig';

// The full 3D scene. Code-split into the editor chunk by Vite (PRD §3 / §10):
// importing this module triggers Three.js to lazy-load.
//
// The Canvas mounts ONCE in EditorLayout and persists across Stitch / Gauge /
// Color step transitions, so the scene state and material textures don't
// flash to white between routes.
export function GarmentScene() {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ fov: 35, position: [0, 0.5, 4], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
      <color attach="background" args={['#ffffff']} />
      <Suspense fallback={null}>
        <Lights />
        {/* Studio HDRI for soft reflections. drei provides a default 'studio' preset
            so we don't have to ship our own HDR file in v0. */}
        <Environment preset="studio" />
        <GarmentMesh />
        <CameraRig />
      </Suspense>
    </Canvas>
  );
}
