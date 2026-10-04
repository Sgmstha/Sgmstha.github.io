import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Group, MathUtils, Mesh, Vector3 } from 'three';
import { sections } from '../../data/sections';
import { getScrollSegment } from './scrollPath';

export type SculptureMode = 'knot' | 'gyro' | 'prism';

// Keep the existing mode key so saved controls and scene loading contracts stay stable.
const FIN_COUNT = 24;
const fins = Array.from({ length: FIN_COUNT }, (_, index) => {
  const t = index / (FIN_COUNT - 1);
  return {
    id: index,
    height: (t - 0.5) * 3.75,
    radius: 0.68 + Math.sin(t * Math.PI) * 0.84,
    angle: t * Math.PI * 1.35,
    accent: index === 5 || index === 18,
  };
});

function SculptureMesh({ mode, paused }: { mode: SculptureMode; paused: boolean }) {
  const innerRef = useRef<Group>(null);
  const ringARef = useRef<Mesh>(null);
  const ringBRef = useRef<Mesh>(null);
  const ringCRef = useRef<Mesh>(null);
  const finsRef = useRef<Group>(null);
  const elapsed = useRef(0);

  useFrame((_, frameDelta) => {
    if (paused || document.hidden) return;
    const delta = Math.min(frameDelta, 0.05);
    elapsed.current += delta;
    if (ringARef.current) ringARef.current.rotation.z += delta * 0.18;
    if (ringBRef.current) ringBRef.current.rotation.y += delta * 0.24;
    if (ringCRef.current) ringCRef.current.rotation.x += delta * 0.16;
    if (innerRef.current) innerRef.current.rotation.y -= delta * 0.16;
    if (finsRef.current) {
      for (let index = 0; index < finsRef.current.children.length; index++) {
        finsRef.current.children[index].rotation.y = fins[index].angle
          + Math.sin(elapsed.current * 0.42 + index * 0.16) * 0.2;
      }
    }
  });

  if (mode === 'gyro') {
    return (
      <group>
        <mesh ref={ringARef} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[2.08, 0.045, 12, 96]} />
          <meshStandardMaterial color="#d9e0e8" metalness={0.96} roughness={0.2} />
        </mesh>
        <mesh ref={ringBRef} rotation={[Math.PI / 2.5, 0.6, 0]}>
          <torusGeometry args={[1.68, 0.035, 12, 96]} />
          <meshStandardMaterial color="#315cff" metalness={0.65} roughness={0.25} />
        </mesh>
        <mesh ref={ringCRef} rotation={[0.8, Math.PI / 3, 0.5]}>
          <torusGeometry args={[1.28, 0.03, 12, 80]} />
          <meshStandardMaterial color="#ffffff" metalness={0.92} roughness={0.15} />
        </mesh>
        <group ref={innerRef}>
          <mesh>
            <octahedronGeometry args={[0.62, 0]} />
            <meshStandardMaterial color="#b6c2d2" metalness={0.92} roughness={0.18} />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.72, 0]} />
            <meshStandardMaterial color="#315cff" wireframe metalness={0.5} roughness={0.4} />
          </mesh>
        </group>
      </group>
    );
  }

  if (mode === 'prism') {
    return (
      <group>
        <group ref={innerRef} rotation={[0.3, 0.5, 0]}>
          <mesh>
            <icosahedronGeometry args={[1.2, 0]} />
            <meshStandardMaterial color="#e2e7ee" metalness={0.92} roughness={0.16} flatShading />
          </mesh>
        </group>
        <mesh ref={ringARef} rotation={[0.6, 0.2, 0.4]}>
          <icosahedronGeometry args={[1.72, 0]} />
          <meshStandardMaterial color="#315cff" wireframe />
        </mesh>
        <mesh ref={ringBRef} rotation={[Math.PI / 3, 0.3, 0.8]}>
          <torusGeometry args={[2.15, 0.024, 10, 96]} />
          <meshStandardMaterial color="#dbe5f4" metalness={0.9} roughness={0.22} />
        </mesh>
      </group>
    );
  }

  return (
    <group ref={finsRef} rotation={[0, 0, -0.16]}>
      {fins.map(fin => (
        <group key={fin.id} position={[0, fin.height, 0]} rotation={[0, fin.angle, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} scale={[1.24, 0.62, 0.48]}>
            <torusGeometry args={[fin.radius, 0.065, 8, 80]} />
            <meshStandardMaterial
              color={fin.accent ? '#315cff' : '#d4dce6'}
              metalness={fin.accent ? 0.55 : 0.98}
              roughness={fin.accent ? 0.28 : 0.2}
              envMapIntensity={1.25}
            />
          </mesh>
        </group>
      ))}
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
      if (event.button !== 0) return;
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
    window.addEventListener('pointercancel', pointerUp, { passive: true });
    window.addEventListener('blur', pointerUp);
    gl.domElement.addEventListener('pointerdown', pointerDown);
    gl.domElement.addEventListener('webglcontextlost', lost);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('pointerup', pointerUp);
      window.removeEventListener('pointercancel', pointerUp);
      window.removeEventListener('blur', pointerUp);
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
    state.dragRotY += state.dragVelY * delta * 60;
    state.dragRotX += state.dragVelX * delta * 60;
    state.dragVelY = MathUtils.damp(state.dragVelY, 0, 3.2, delta);
    state.dragVelX = MathUtils.damp(state.dragVelX, 0, 3.2, delta);

    // Pulse decay
    if (state.pulseEnergy > 0.01) {
      state.pulseEnergy = MathUtils.damp(state.pulseEnergy, 0, 4.0, delta);
    } else {
      state.pulseEnergy = 0;
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
      sculpture.current.position.y = Math.sin(state.elapsed * 0.55) * 0.06;
      const baseScale = Math.min(0.86, (size.width / size.height) * 0.64);
      sculpture.current.scale.setScalar(baseScale * (1 + Math.sin(state.pulseEnergy * Math.PI) * 0.06));
    }
  });

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3.5, 5, 5]} intensity={3.4} color="#f2f5ff" />
      <pointLight position={[-3, -1, 2]} intensity={24} color="#5476ff" />
      <pointLight position={[3, -2, -3]} intensity={14} color="#c5d5f5" />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={5} position={[0, 5, -3]} scale={[10, 2, 1]} />
        <Lightformer intensity={3.5} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 8, 1]} />
        <Lightformer intensity={4.5} color="#d8e5ff" position={[5, 0, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 7, 1]} />
      </Environment>

      <group
        ref={sculpture}
        rotation={[0.35, 0.2, -0.3]}
        scale={Math.min(0.86, (size.width / size.height) * 0.64)}
      >
        <SculptureMesh mode={mode} paused={paused} />
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

