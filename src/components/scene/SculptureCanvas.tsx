import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Group, MathUtils, Vector3 } from 'three';
import { sections } from '../../data/sections';
import { getScrollSegment } from './scrollPath';

function Sculpture({ paused, onFailure, onReady }: { paused: boolean; onFailure: () => void; onReady: () => void }) {
  const sculpture = useRef<Group>(null);
  const motion = useRef({ x: 0, y: 0, scroll: window.scrollY, offsets: [0], badSeconds: 0, elapsed: 0, ready: false, lowQuality: false, sampleTime: 0, sampleFrames: 0 });
  const target = useMemo(() => new Vector3(-1.7, 0, 0), []);
  const destination = useMemo(() => new Vector3(), []);
  const lookDestination = useMemo(() => new Vector3(), []);
  const { gl, size, setDpr } = useThree();

  useEffect(() => {
    const state = motion.current;
    const measure = () => { state.offsets = sections.map(section => (document.getElementById(section.id)?.getBoundingClientRect().top ?? 0) + window.scrollY); };
    const scroll = () => { state.scroll = window.scrollY; };
    const pointer = (event: PointerEvent) => { state.x = event.clientX / innerWidth - .5; state.y = event.clientY / innerHeight - .5; };
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('pointermove', pointer, { passive: true });
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('pointermove', pointer);
      gl.domElement.removeEventListener('webglcontextlost', lost);
    };
  }, [gl, onFailure]);

  useFrame(({ camera }, frameDelta) => {
    const state = motion.current;
    if (!state.ready) { state.ready = true; onReady(); }
    if (paused || document.hidden) return;
    const delta = Math.min(frameDelta, .05);
    state.elapsed += delta;
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
    // Ignore startup and tab restoration; sustained slow rendering drops to static art.
    if (state.elapsed > 5 && frameDelta < .25) {
      state.badSeconds = frameDelta > 1 / 28 ? state.badSeconds + frameDelta : Math.max(0, state.badSeconds - frameDelta * 2);
      if (state.badSeconds > 2 && !state.lowQuality) {
        setDpr(1);
        state.lowQuality = true;
        state.badSeconds = 0;
      }
      if (state.badSeconds > 5) { onFailure(); return; }
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
      sculpture.current.rotation.y = MathUtils.damp(sculpture.current.rotation.y, state.elapsed * .11 + state.x * .5 + progress * .3, 3, delta);
      sculpture.current.rotation.x = MathUtils.damp(sculpture.current.rotation.x, .35 + state.y * .3, 3, delta);
      sculpture.current.position.y = Math.sin(state.elapsed * .55) * .09;
    }
  });

  return <>
    <ambientLight intensity={.5} />
    <directionalLight position={[3, 5, 5]} intensity={3} color="#fff0df" />
    <pointLight position={[-3, -1, 2]} intensity={20} color="#fa562f" />
    <Environment resolution={128} frames={1}>
      <Lightformer intensity={5} position={[0, 5, -3]} scale={[10, 2, 1]} />
      <Lightformer intensity={3} position={[-5, 1, 2]} rotation={[0, Math.PI / 2, 0]} scale={[3, 8, 1]} />
      <Lightformer intensity={4} color="#ffc7a8" position={[5, 0, 1]} rotation={[0, -Math.PI / 2, 0]} scale={[2, 7, 1]} />
    </Environment>
    <group ref={sculpture} rotation={[.35, .2, -.3]} scale={Math.min(.84, size.width / size.height * .62)}>
      <mesh>
        <torusKnotGeometry args={[1.15, .38, 180, 28, 2, 3]} />
        <meshStandardMaterial color="#d9c8b2" metalness={.96} roughness={.19} />
      </mesh>
      <mesh rotation={[Math.PI / 2.8, .35, .6]}>
        <torusGeometry args={[2.04, .027, 10, 120]} />
        <meshStandardMaterial color="#ff6534" emissive="#ef481d" emissiveIntensity={.6} metalness={.3} roughness={.3} />
      </mesh>
      <mesh position={[1.8, 1.18, .2]}><sphereGeometry args={[.17, 24, 16]} /><meshStandardMaterial color="#ff673c" metalness={.3} roughness={.22} /></mesh>
      <mesh position={[-1.4, -1.45, .5]}><sphereGeometry args={[.1, 20, 14]} /><meshStandardMaterial color="#f4e5cf" metalness={.9} roughness={.15} /></mesh>
    </group>
  </>;
}

export default function SculptureCanvas({ paused, onReady, onFailure }: { paused: boolean; onReady: () => void; onFailure: () => void }) {
  const [visible, setVisible] = useState(!document.hidden);
  useEffect(() => {
    const update = () => setVisible(!document.hidden);
    document.addEventListener('visibilitychange', update);
    return () => document.removeEventListener('visibilitychange', update);
  }, []);
  return <Canvas dpr={[1, 1.25]} camera={{ position: [0, 0, 8.8], fov: 38 }} onCreated={({ camera }) => camera.lookAt(...sections[0].lookAt)} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }} frameloop={paused || !visible ? 'demand' : 'always'} fallback={<span />}>
    <Sculpture paused={paused} onReady={onReady} onFailure={onFailure} />
  </Canvas>;
}
