import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useSceneStore } from '@/store/scene';

// Procedural pullover-ish mesh. PRD §16: proper GLB models arrive in v0.1+;
// for now we build a CC0-friendly approximation from primitive shapes.
//
// Body: a tall capsule with a slight torso taper.
// Sleeves: two angled cylinders.
// Neck: a small ring.
//
// All meshes share one Material instance so color and stitch-texture changes
// cascade automatically. GSAP tweens the color value smoothly when picked.

export function GarmentMesh() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const color = useSceneStore((s) => s.color);
  const materialBaseColor = useSceneStore((s) => s.materialBaseColor);
  const materialRoughness = useSceneStore((s) => s.materialRoughness);
  const materialTextureUrl = useSceneStore((s) => s.materialTextureUrl);
  const stitchTextureUrl = useSceneStore((s) => s.stitchTextureUrl);
  const uvRepeat = useSceneStore((s) => s.uvRepeat);
  const navigate3d = useSceneStore((s) => s.navigate3d);

  // The visible color = picked color (if any) overlayed on the material's
  // own base. Stitch texture takes precedence; otherwise the material weave.
  const activeTextureUrl = stitchTextureUrl ?? materialTextureUrl;

  // Smooth color transition (PRD §9 — 350 ms ease).
  useEffect(() => {
    if (!materialRef.current) return;
    const target = new THREE.Color(color);
    const current = materialRef.current.color.clone();
    const obj = { t: 0 };
    gsap.to(obj, {
      t: 1,
      duration: 0.35,
      ease: 'power2.out',
      onUpdate: () => {
        materialRef.current?.color.copy(current).lerp(target, obj.t);
      },
    });
  }, [color]);

  // Tween the material's base color when no explicit color picked yet.
  // Picking a Material on /design/material instantly nudges the mesh towards
  // the new yarn's natural shade so the 3D preview is alive.
  useEffect(() => {
    if (!materialRef.current) return;
    const target = new THREE.Color(materialBaseColor);
    const current = materialRef.current.color.clone();
    const obj = { t: 0 };
    gsap.to(obj, {
      t: 1,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        materialRef.current?.color.copy(current).lerp(target, obj.t);
      },
    });
  }, [materialBaseColor]);

  // Tween roughness so cashmere visibly looks silkier than cotton.
  useEffect(() => {
    if (!materialRef.current) return;
    const from = { r: materialRef.current.roughness };
    gsap.to(from, {
      r: materialRoughness,
      duration: 0.45,
      ease: 'power2.out',
      onUpdate: () => {
        if (materialRef.current) {
          materialRef.current.roughness = from.r;
          materialRef.current.needsUpdate = true;
        }
      },
    });
  }, [materialRoughness]);

  // Idle gentle rotation when Navigate 3D is OFF (subtle product showcase).
  useFrame((_, delta) => {
    if (!groupRef.current || navigate3d) return;
    groupRef.current.rotation.y += delta * 0.15;
  });

  // Optional stitch texture map.
  // useTexture only fires when a non-null url is provided; we wrap to avoid
  // tripping suspense before a stitch is actually picked.
  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      <SharedMaterial materialRef={materialRef} textureUrl={activeTextureUrl} repeat={uvRepeat} />

      {/* Body */}
      <mesh position={[0, 0.7, 0]}>
        <capsuleGeometry args={[0.7, 0.9, 6, 24]} />
        <primitive object={materialRef.current ?? new THREE.MeshStandardMaterial()} attach="material" />
      </mesh>

      {/* Left sleeve */}
      <mesh position={[-0.85, 0.85, 0]} rotation={[0, 0, Math.PI / 5]}>
        <cylinderGeometry args={[0.18, 0.22, 1.1, 16]} />
        <primitive object={materialRef.current ?? new THREE.MeshStandardMaterial()} attach="material" />
      </mesh>

      {/* Right sleeve */}
      <mesh position={[0.85, 0.85, 0]} rotation={[0, 0, -Math.PI / 5]}>
        <cylinderGeometry args={[0.18, 0.22, 1.1, 16]} />
        <primitive object={materialRef.current ?? new THREE.MeshStandardMaterial()} attach="material" />
      </mesh>

      {/* Neck ring */}
      <mesh position={[0, 1.45, 0]}>
        <torusGeometry args={[0.22, 0.05, 12, 24]} />
        <meshStandardMaterial color="#b5b5b5" roughness={0.85} />
      </mesh>
    </group>
  );
}

// Material is rendered once and re-used so color/texture changes apply
// to all sub-meshes simultaneously. Texture loading is conditional so
// suspense doesn't unmount the scene when no stitch is picked.
function SharedMaterial({
  materialRef,
  textureUrl,
  repeat,
}: {
  materialRef: React.MutableRefObject<THREE.MeshStandardMaterial | null>;
  textureUrl: string | null;
  repeat: { u: number; v: number };
}) {
  const map = textureUrl ? <TextureLoader url={textureUrl} repeat={repeat} materialRef={materialRef} /> : null;
  const material = useMemo(() => {
    const m = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.85,
      metalness: 0.02,
    });
    materialRef.current = m;
    return m;
  }, [materialRef]);
  // We render an invisible primitive just so React keeps the material alive.
  return (
    <>
      <primitive object={material} />
      {map}
    </>
  );
}

function TextureLoader({
  url,
  repeat,
  materialRef,
}: {
  url: string;
  repeat: { u: number; v: number };
  materialRef: React.MutableRefObject<THREE.MeshStandardMaterial | null>;
}) {
  const tex = useTexture(url);
  useEffect(() => {
    if (!materialRef.current) return;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(repeat.u, repeat.v);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 8;
    materialRef.current.map = tex;
    materialRef.current.needsUpdate = true;
    return () => {
      if (materialRef.current) {
        materialRef.current.map = null;
        materialRef.current.needsUpdate = true;
      }
    };
  }, [tex, repeat.u, repeat.v, materialRef]);
  return null;
}
