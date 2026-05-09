import { useEffect, useRef } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import * as THREE from 'three';
import { useSceneStore } from '@/store/scene';

// Camera rig with subtle pointer-tracking parallax when Navigate 3D is OFF.
// PRD §6.5 + §9 polish:
// - Navigate 3D OFF: idle pose at HOME, with a small lerp-towards-pointer offset
//   (max ±0.15 units). Very subtle — adds life without being distracting.
// - Navigate 3D ON: full OrbitControls with damping.
// - Toggling OFF tweens camera back home over 600ms power2.out.

const HOME_POS: [number, number, number] = [0, 0.5, 4];
const HOME_TGT: [number, number, number] = [0, 0.5, 0];
const PARALLAX_STRENGTH = 0.15;

export function CameraRig() {
  const navigate3d = useSceneStore((s) => s.navigate3d);
  const { camera, size } = useThree();
  const controlsRef = useRef<{ reset?: () => void } | null>(null);
  const targetOffset = useRef(new THREE.Vector2(0, 0));

  // Apply home pose on first mount.
  useEffect(() => {
    camera.position.set(...HOME_POS);
    camera.lookAt(...HOME_TGT);
  }, [camera]);

  // Track pointer position on the canvas to drive parallax.
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      // Normalize pointer to [-1, 1] within the viewport
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      targetOffset.current.set(x, -y);
    };
    window.addEventListener('pointermove', handler, { passive: true });
    return () => window.removeEventListener('pointermove', handler);
  }, [size]);

  // Per-frame: when not in Navigate 3D mode, lerp camera position to
  // HOME + parallax offset.
  useFrame(() => {
    if (navigate3d) return;
    const offX = targetOffset.current.x * PARALLAX_STRENGTH;
    const offY = targetOffset.current.y * PARALLAX_STRENGTH;
    camera.position.x += (HOME_POS[0] + offX - camera.position.x) * 0.05;
    camera.position.y += (HOME_POS[1] + offY - camera.position.y) * 0.05;
    camera.lookAt(...HOME_TGT);
  });

  // Tween camera back to home when Navigate 3D is turned off.
  useEffect(() => {
    if (navigate3d) return;
    const obj = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };
    gsap.to(obj, {
      x: HOME_POS[0],
      y: HOME_POS[1],
      z: HOME_POS[2],
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => {
        camera.position.set(obj.x, obj.y, obj.z);
        camera.lookAt(...HOME_TGT);
      },
      onComplete: () => {
        controlsRef.current?.reset?.();
      },
    });
  }, [navigate3d, camera]);

  return (
    <OrbitControls
      ref={controlsRef as never}
      enabled={navigate3d}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      target={HOME_TGT}
      enableDamping={true}
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.8}
      panSpeed={0.6}
      maxPolarAngle={Math.PI * 0.85}
      minPolarAngle={Math.PI * 0.1}
      minDistance={2}
      maxDistance={7}
    />
  );
}
