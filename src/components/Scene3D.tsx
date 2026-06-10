"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ============================================================
// 滚动追踪
// ============================================================
export function useScrollProgress() {
  const ref = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const h = window.innerHeight;
      const progress = Math.min(window.scrollY / h, 1);
      ref.current = progress;
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return ref;
}

// ============================================================
// 相机摇臂
// ============================================================
function CameraRig({ scrollRef }: { scrollRef: { current: number } }) {
  const { camera } = useThree();

  const positions = useMemo(
    () => ({
      A: new THREE.Vector3(0, 1.5, 8),
      B: new THREE.Vector3(-2, 0.8, 4),
      C: new THREE.Vector3(0, 4.5, 14),
    }),
    []
  );

  useFrame(() => {
    const p = scrollRef.current;
    let target: THREE.Vector3;
    if (p < 0.3) {
      target = positions.A.clone().lerp(positions.B, p / 0.3);
    } else if (p < 0.7) {
      target = positions.B.clone().lerp(positions.C, (p - 0.3) / 0.4);
    } else {
      target = positions.C;
    }
    camera.position.lerp(target, 0.05);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ============================================================
// 粒子场（精细化）
// ============================================================
function ParticleField({ scrollRef }: { scrollRef: { current: number } }) {
  const count = 400;
  const pointsRef = useRef<THREE.Points>(null!);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.cos(phi);
      pos[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // 分层色彩: 粉紫(60%) / 浅粉(30%) / 深玫红(10%)
      const palette = Math.random();
      if (palette < 0.6) {
        // 粉紫 #ECA8D6 系
        col[i * 3] = 0.85 + Math.random() * 0.15;
        col[i * 3 + 1] = 0.50 + Math.random() * 0.25;
        col[i * 3 + 2] = 0.70 + Math.random() * 0.20;
      } else if (palette < 0.9) {
        // 浅粉 #D48BA6 系
        col[i * 3] = 0.75 + Math.random() * 0.20;
        col[i * 3 + 1] = 0.45 + Math.random() * 0.20;
        col[i * 3 + 2] = 0.55 + Math.random() * 0.20;
      } else {
        // 深玫红 #B06D8A 系
        col[i * 3] = 0.60 + Math.random() * 0.15;
        col[i * 3 + 1] = 0.30 + Math.random() * 0.20;
        col[i * 3 + 2] = 0.45 + Math.random() * 0.20;
      }
    }
    return [pos, col];
  }, []);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uScroll: { value: 0 },
        },
        vertexShader: `
          attribute float aSize;
          attribute vec3 aColor;
          varying vec3 vColor;
          uniform float uTime;
          uniform float uScroll;

          void main() {
            vColor = aColor;
            vec3 pos = position;

            // 缓慢的波浪漂移
            float waveX = sin(pos.y * 1.2 + uTime * 0.12) * 0.06;
            float waveY = cos(pos.z * 0.9 + uTime * 0.1) * 0.04;
            float waveZ = sin(pos.x * 1.1 + uTime * 0.08) * 0.06;
            pos += vec3(waveX, waveY, waveZ);

            // 滚动影响：向外扩散
            float spread = 1.0 + uScroll * 0.15;
            pos *= spread;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = aSize * (180.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;

          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float strength = 1.0 - smoothstep(0.0, 0.5, d);
            gl_FragColor = vec4(vColor, strength * 0.55);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  // 每粒子尺寸
  const sizeArr = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      arr[i] = 0.04 + Math.random() * 0.1;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (!pointsRef.current) return;
    shaderMat.uniforms.uTime.value = clock.elapsedTime;
    shaderMat.uniforms.uScroll.value = scrollRef.current;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aColor"
          count={count}
          array={colors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={count}
          array={sizeArr}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={shaderMat} />
    </points>
  );
}

// ============================================================
// 鼠标金色粒子（精细化）
// ============================================================
function MouseParticles() {
  const COUNT = 200;
  const pointsRef = useRef<THREE.Points>(null!);
  const posArr = useMemo(() => new Float32Array(COUNT * 3), []);
  const velArr = useMemo(() => new Float32Array(COUNT * 3), []);
  const lifeArr = useMemo(() => new Float32Array(COUNT), []);
  const sizeArr = useMemo(() => new Float32Array(COUNT), []);
  const alphaArr = useMemo(() => new Float32Array(COUNT), []);
  const emitIdx = useRef(0);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );
  const mousePos = useMemo(() => new THREE.Vector3(), []);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);

  // 初始化死亡
  useEffect(() => {
    for (let i = 0; i < COUNT; i++) {
      posArr[i * 3 + 1] = -100;
      lifeArr[i] = 0;
      alphaArr[i] = 0;
    }
    if (pointsRef.current) {
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      pointsRef.current.geometry.attributes.aSize.needsUpdate = true;
      pointsRef.current.geometry.attributes.aAlpha.needsUpdate = true;
    }
  }, [posArr, lifeArr, alphaArr]);

  const shaderMat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: `
          attribute float aSize;
          attribute float aAlpha;
          varying float vAlpha;
          void main() {
            vAlpha = aAlpha;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = aSize * (220.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying float vAlpha;
          void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float strength = 1.0 - smoothstep(0.0, 0.5, d);
            // 粉紫渐变：中心亮白 → 边缘粉紫
            vec3 pkBright = vec3(1.0, 0.85, 0.95);
            vec3 pkWarm   = vec3(0.83, 0.50, 0.65);
            vec3 color = mix(pkWarm, pkBright, strength);
            gl_FragColor = vec4(color, vAlpha * strength);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    []
  );

  useFrame(({ pointer, camera }) => {
    if (!pointsRef.current) return;

    raycaster.setFromCamera(pointer, camera);
    raycaster.ray.intersectPlane(plane, mousePos);

    // 每帧发射 3 个
    for (let e = 0; e < 3; e++) {
      const i = emitIdx.current % COUNT;
      emitIdx.current++;
      const i3 = i * 3;
      const spread = 0.25;
      posArr[i3] = mousePos.x + (Math.random() - 0.5) * spread;
      posArr[i3 + 1] = mousePos.y + (Math.random() - 0.5) * spread;
      posArr[i3 + 2] = (Math.random() - 0.5) * 0.15;
      velArr[i3] = (Math.random() - 0.5) * 1.0;
      velArr[i3 + 1] = (Math.random() - 0.5) * 1.0;
      velArr[i3 + 2] = (Math.random() - 0.5) * 0.3;
      lifeArr[i] = 1;
      sizeArr[i] = 0.35 + Math.random() * 0.25;
    }

    // 更新粒子
    for (let i = 0; i < COUNT; i++) {
      const i3 = i * 3;
      if (lifeArr[i] > 0) {
        lifeArr[i] -= 0.018;
        const life = lifeArr[i];
        // 速度衰减
        velArr[i3] *= 0.95;
        velArr[i3 + 1] *= 0.95;
        velArr[i3 + 2] *= 0.95;
        // 位置更新
        posArr[i3] += velArr[i3] * 0.016;
        posArr[i3 + 1] += velArr[i3 + 1] * 0.016;
        posArr[i3 + 2] += velArr[i3 + 2] * 0.016;
        // 尺寸和透明度跟随生命周期
        sizeArr[i] = (0.35 + Math.random() * 0.05) * life;
        alphaArr[i] = life * 0.85;
      } else {
        posArr[i3 + 1] = -100;
        sizeArr[i] = 0;
        alphaArr[i] = 0;
      }
    }

    const geom = pointsRef.current.geometry;
    geom.attributes.position.needsUpdate = true;
    geom.attributes.aSize.needsUpdate = true;
    geom.attributes.aAlpha.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={COUNT}
          array={posArr}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={COUNT}
          array={sizeArr}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aAlpha"
          count={COUNT}
          array={alphaArr}
          itemSize={1}
        />
      </bufferGeometry>
      <primitive object={shaderMat} />
    </points>
  );
}

// ============================================================
// 地面网格
// ============================================================
function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]}>
      <ringGeometry args={[2.5, 7, 64]} />
      <meshBasicMaterial
        color="#D48BA6"
        transparent
        opacity={0.15}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ============================================================
// 场景入口
// ============================================================
export default function Scene3D({
  scrollRef,
}: {
  scrollRef: { current: number };
}) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[5, 6, 5]}
        intensity={0.7}
        color="#93C5FD"
      />
      <directionalLight
        position={[-3, 4, -3]}
        intensity={0.3}
        color="#A78BFA"
      />
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#6366F1" />

      <CameraRig scrollRef={scrollRef} />
      <ParticleField scrollRef={scrollRef} />
      <MouseParticles />
      <GridFloor />
    </>
  );
}
