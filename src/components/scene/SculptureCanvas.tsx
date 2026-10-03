import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Color, Group, MathUtils, Vector3 } from 'three';
import { sections } from '../../data/sections';
import { getScrollSegment } from './scrollPath';

export type SculptureMode = 'knot' | 'gyro' | 'prism';

function StardustField({ count = 200 }: { count?: number }) {
  const pointsRef = useRef<any>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const warm = new Color('#ff7a45');
    const cool = new Color('#e8dfd3');
    const temp = new Color();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2.4 + Math.random() * 5.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);
      temp.lerpColors(cool, warm, Math.random() * 0.85);
      col[i3] = temp.r;
      col[i3 + 1] = temp.g;
      col[i3 + 2] = temp.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.035;
      pointsRef.current.rotation.x += delta * 0.012;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SculptureMesh({ mode, pulse }: { mode: SculptureMode; pulse: number }) {
  const innerRef = useRef<Group>(null);
  const ringARef = useRef<any>(null);
  const ringBRef = useRef<any>(null);
  const ringCRef = useRef<any>(null);

  useFrame((_, delta) => {
    if (ringARef.current) ringARef.current.rotation.z += delta * 0.45;
    if (ringBRef.current) ringBRef.current.rotation.y += delta * 0.65;
    if (ringCRef.current) ringCRef.current.rotation.x += delta * 0.35;
    if (innerRef.current) innerRef.current.rotation.y -= delta * 0.25;
  });

  const pulseScale = 1 + Math.sin(pulse * Math.PI) * 0.08;

  if (mode === 'gyro') {
    return (
      <group scale={pulseScale}>
        {/* Outer Ring */}
        <mesh ref={ringARef} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[2.08, 0.045, 16, 100]} />
          <meshStandardMaterial color="#d4c5b1" metalness={0.96} roughness={0.18} />
        </mesh>
        {/* Middle Gimbal Ring */}
        <mesh ref={ringBRef} rotation={[Math.PI / 2.5, 0.6, 0]}>
          <torusGeometry args={[1.68, 0.035, 14, 90]} />
          <meshStandardMaterial color="#ff6534" emissive="#ef481d" emissiveIntensity={0.65} metalness={0.4} roughness={0.25} />
        </mesh>
        {/* Inner Ring */}
        <mesh ref={ringCRef} rotation={[0.8, Math.PI / 3, 0.5]}>
          <torusGeometry args={[1.28, 0.03, 14, 80]} />
          <meshStandardMaterial color="#ffffff" metalness={0.92} roughness={0.15} />
        </mesh>
        {/* Center Pulsing Geometric Core */}
        <group ref={innerRef}>
          <mesh>
            <octahedronGeometry args={[0.62, 0]} />
            <meshStandardMaterial color="#ff673c" metalness={0.88} roughness={0.2} emissive="#ff4510" emissiveIntensity={0.3} />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.72, 0]} />
            <meshStandardMaterial color="#f6e8d2" wireframe metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
        {/* Orbiting Satellite Beads */}
        <mesh position={[1.82, 0.9, 0.3]}>
          <sphereGeometry args={[0.13, 20, 16]} />
          <meshStandardMaterial color="#ff7a45" metalness={0.4} roughness={0.2} />
        </mesh>
        <mesh position={[-1.6, -1.1, 0.4]}>
          <sphereGeometry args={[0.09, 18, 14]} />
          <meshStandardMaterial color="#f0dfc8" metalness={0.95} roughness={0.12} />
        </mesh>
      </group>
    );
  }

  if (mode === 'prism') {
    return (
      <group scale={pulseScale}>
        {/* Faceted Core Monolith */}
        <mesh ref={innerRef} rotation={[0.3, 0.5, 0]}>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshStandardMaterial color="#e2d4be" metalness={0.92} roughness={0.16} flatShading />
        </mesh>
        {/* Outer Wireframe Cage */}
        <mesh ref={ringARef} rotation={[0.6, 0.2, 0.4]}>
          <icosahedronGeometry args={[1.72, 0]} />
          <meshStandardMaterial color="#ff6534" wireframe emissive="#f35120" emissiveIntensity={0.5} />
        </mesh>
        {/* Radiant Orbital Halo */}
        <mesh ref={ringBRef} rotation={[Math.PI / 3, 0.3, 0.8]}>
          <torusGeometry args={[2.15, 0.024, 10, 100]} />
          <meshStandardMaterial color="#ff8452" emissive="#ff5821" emissiveIntensity={0.7} metalness={0.3} roughness={0.3} />
        </mesh>
        {/* Floating Faceted Satellites */}
        <mesh position={[1.7, 1.25, 0.2]}>
          <octahedronGeometry args={[0.16, 0]} />
          <meshStandardMaterial color="#ff6a38" metalness={0.6} roughness={0.2} />
        </mesh>
        <mesh position={[-1.45, -1.3, 0.6]}>
          <tetrahedronGeometry args={[0.15, 0]} />
          <meshStandardMaterial color="#faede0" metalness={0.94} roughness={0.14} />
        </mesh>
      </group>
    );
  }

  // Default: Signature Enhanced Tesseract Knot
  return (
    <group scale={pulseScale}>
      {/* Primary Procedural Sculptural Torus Knot */}
      <mesh>
        <torusKnotGeometry args={[1.15, 0.38, 190, 32, 2, 3]} />
        <meshStandardMaterial color="#d9c8b2" metalness={0.96} roughness={0.18} />
      </mesh>
      {/* Glowing Resonance Ring A */}
      <mesh ref={ringARef} rotation={[Math.PI / 2.8, 0.35, 0.6]}>
        <torusGeometry args={[2.08, 0.028, 12, 120]} />
        <meshStandardMaterial color="#ff6534" emissive="#ef481d" emissiveIntensity={0.65} metalness={0.3} roughness={0.25} />
      </mesh>
      {/* Secondary Counter-Orbiting Ring B */}
      <mesh ref={ringBRef} rotation={[-Math.PI / 3.2, 0.5, -0.4]}>
        <torusGeometry args={[1.72, 0.02, 10, 100]} />
        <meshStandardMaterial color="#f5e6d3" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Interior Breathing Core Sphere */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.26, 24, 16]} />
        <meshStandardMaterial color="#ff5821" emissive="#ff4510" emissiveIntensity={0.8} roughness={0.2} />
      </mesh>
      {/* Dynamic Satellite Spheres */}
      <mesh position={[1.82, 1.18, 0.2]}>
        <sphereGeometry args={[0.17, 24, 16]} />
        <meshStandardMaterial color="#ff673c" metalness={0.35} roughness={0.22} />
      </mesh>
      <mesh position={[-1.4, -1.45, 0.5]}>
        <sphereGeometry args={[0.11, 20, 14]} />
        <meshStandardMaterial color="#f4e5cf" metalness={0.94} roughness={0.14} />
      </mesh>
    </group>
  );
}

function Sculpture({
  mode,
  paused,
  onFailure,
  onReady,
}: {
  mode: SculptureMode;
  paused: boolean;
  onFailure: () => void;
  onReady: () => void;
}) {
  const sculpture = useRef<Group>(null);
  const motion = useRef({
    x: 0,
    y: 0,
    scroll: window.scrollY,
    offsets: [0],
    badSeconds: 0,
    elapsed: 0,
    ready: false,
    lowQuality: false,
    sampleTime: 0,
    sampleFrames: 0,
    dragRotX: 0,
    dragRotY: 0,
    dragVelX: 0,
    dragVelY: 0,
    isDragging: false,
    lastPointerX: 0,
    lastPointerY: 0,
    pulseEnergy: 0,
  });
  const target = useMemo(() => new Vector3(-1.7, 0, 0), []);
  const destination = useMemo(() => new Vector3(), []);
  const lookDestination = useMemo(() => new Vector3(), []);
  const [pulseState, setPulseState] = useState(0);
  const { gl, size, setDpr } = useThree();

  useEffect(() => {
    const state = motion.current;
    const measure = () => {
      state.offsets = sections.map(
        section => (document.getElementById(section.id)?.getBoundingClientRect().top ?? 0) + window.scrollY
      );
    };
    const scroll = () => {
      state.scroll = window.scrollY;
    };
    const pointer = (event: PointerEvent) => {
      state.x = event.clientX / innerWidth - 0.5;
      state.y = event.clientY / innerHeight - 0.5;
      if (state.isDragging) {
        const dx = event.clientX - state.lastPointerX;
        const dy = event.clientY - state.lastPointerY;
        state.dragVelY += dx * 0.006;
        state.dragVelX += dy * 0.006;
        state.lastPointerX = event.clientX;
        state.lastPointerY = event.clientY;
      }
    };
    const pointerDown = (event: PointerEvent) => {
      state.isDragging = true;
      state.lastPointerX = event.clientX;
      state.lastPointerY = event.clientY;
      state.pulseEnergy = 1.0;
    };
    const pointerUp = () => {
      state.isDragging = false;
    };
    const lost = (event: Event) => {
      event.preventDefault();
      onFailure();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('pointerup', pointerUp, { passive: true });
    gl.domElement.addEventListener('pointerdown', pointerDown);
    gl.domElement.addEventListener('webglcontextlost', lost);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('pointerup', pointerUp);
      gl.domElement.removeEventListener('pointerdown', pointerDown);
      gl.domElement.removeEventListener('webglcontextlost', lost);
    };
  }, [gl, onFailure]);

  useFrame(({ camera }, frameDelta) => {
    const state = motion.current;
    if (!state.ready) {
      state.ready = true;
      onReady();
    }
    if (paused || document.hidden) return;
    const delta = Math.min(frameDelta, 0.05);
    state.elapsed += delta;

    // Decay drag inertia smoothly
    state.dragRotY += state.dragVelY;
    state.dragRotX += state.dragVelX;
    state.dragVelY = MathUtils.damp(state.dragVelY, 0, 3.2, delta);
    state.dragVelX = MathUtils.damp(state.dragVelX, 0, 3.2, delta);

    // Pulse decay
    if (state.pulseEnergy > 0.01) {
      state.pulseEnergy = MathUtils.damp(state.pulseEnergy, 0, 4.0, delta);
      setPulseState(state.pulseEnergy);
    }

    if (import.meta.env.DEV) {
      state.sampleTime += frameDelta;
      state.sampleFrames++;
      if (state.sampleTime >= 2) {
        gl.domElement.dataset.fps = String(Math.round(state.sampleFrames / state.sampleTime));
        gl.domElement.dataset.drawCalls = String(gl.info.render.calls);
        gl.domElement.dataset.triangles = String(gl.info.render.triangles);
        state.sampleTime = 0;
        state.sampleFrames = 0;
      }
    }

    if (state.elapsed > 5 && frameDelta < 0.25) {
      state.badSeconds = frameDelta > 1 / 28 ? state.badSeconds + frameDelta : Math.max(0, state.badSeconds - frameDelta * 2);
      if (state.badSeconds > 2 && !state.lowQuality) {
        setDpr(1);
        state.lowQuality = true;
        state.badSeconds = 0;
      }
      if (state.badSeconds > 5) {
        onFailure();
        return;
      }
    }

    const { index, progress } = getScrollSegment(state.offsets, state.scroll);
    const a = sections[index];
    const b = sections[index + 1];
    destination.fromArray(a.cameraPosition).lerp(lookDestination.fromArray(b.cameraPosition), progress);
    camera.position.lerp(destination, 1 - Math.exp(-delta * 4));
    destination.fromArray(a.lookAt).lerp(lookDestination.fromArray(b.lookAt), progress);
    target.lerp(destination, 1 - Math.exp(-delta * 4));
    camera.lookAt(target);

    if (sculpture.current) {
      const targetRotY = state.elapsed * 0.12 + state.x * 0.55 + progress * 0.35 + state.dragRotY;
      const targetRotX = 0.35 + state.y * 0.35 + state.dragRotX;
      sculpture.current.rotation.y = MathUtils.damp(sculpture.current.rotation.y, targetRotY, 3, delta);
      sculpture.current.rotation.x = MathUtils.damp(sculpture.current.rotation.x, targetRotX, 3, delta);
      sculpture.current.position.y = Math.sin(state.elapsed * 0.55) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3.5, 5, 5]} intensity={3.4} color="#fff1e0" />
      <pointLight position={[-3, -1, 2]} intensity={24} color="#fa562f" />
      <pointLight position={[3, -2, -3]} intensity={14} color="#ff8452" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={5} position={[0, 5, -3]} scale={[10, 2, 1]} />
        <Lightformer intensity={3.5} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 8, 1]} />
        <Lightformer intensity={4.5} color="#ffc7a8" position={[5, 0, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 7, 1]} />
      </Environment>

      <StardustField count={220} />

      <group
        ref={sculpture}
        rotation={[0.35, 0.2, -0.3]}
        scale={Math.min(0.86, (size.width / size.height) * 0.64)}
      >
        <SculptureMesh mode={mode} pulse={pulseState} />
      </group>
    </>
  );
}

export default function SculptureCanvas({
  mode = 'knot',
  paused,
  onReady,
  onFailure,
}: {
  mode?: SculptureMode;
  paused: boolean;
  onReady: () => void;
  onFailure: () => void;
}) {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.25]}
      camera={{ position: [0, 0, 8.8], fov: 38 }}
      onCreated={({ camera }) => camera.lookAt(...sections[0].lookAt)}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      frameloop={paused || !visible ? 'demand' : 'always'}
      fallback={<span />}
      style={{ cursor: 'grab' }}
    >
      <Sculpture mode={mode} paused={paused} onReady={onReady} onFailure={onFailure} />
    </Canvas>
  );
}

