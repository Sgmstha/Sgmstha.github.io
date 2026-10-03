import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { Color, Group } from 'three';
import type { SculptureMode } from './SculptureCanvas';

type MaterialTheme = 'titanium' | 'amber' | 'emerald' | 'wireframe';

interface SpatialStudioProps {
  isOpen: boolean;
  onClose: () => void;
  currentMode: SculptureMode;
  onModeChange: (mode: SculptureMode) => void;
}

function StudioMesh({
  mode,
  theme,
  speed,
  wireframe,
}: {
  mode: SculptureMode;
  theme: MaterialTheme;
  speed: number;
  wireframe: boolean;
}) {
  const meshGroup = useRef<Group>(null);
  const ringARef = useRef<any>(null);
  const ringBRef = useRef<any>(null);

  const colors = useMemo(() => {
    switch (theme) {
      case 'amber':
        return { primary: '#ff6534', emissive: '#ef481d', intensity: 0.7, metal: 0.4, rough: 0.2 };
      case 'emerald':
        return { primary: '#10b981', emissive: '#047857', intensity: 0.6, metal: 0.8, rough: 0.2 };
      case 'wireframe':
        return { primary: '#38bdf8', emissive: '#0284c7', intensity: 0.8, metal: 0.2, rough: 0.5 };
      case 'titanium':
      default:
        return { primary: '#e2d4be', emissive: '#000000', intensity: 0.0, metal: 0.95, rough: 0.15 };
    }
  }, [theme]);

  useFrame((_, delta) => {
    const d = delta * speed;
    if (meshGroup.current) {
      meshGroup.current.rotation.y += d * 0.45;
      meshGroup.current.rotation.x += d * 0.2;
    }
    if (ringARef.current) ringARef.current.rotation.z += d * 0.6;
    if (ringBRef.current) ringBRef.current.rotation.y -= d * 0.5;
  });

  return (
    <group ref={meshGroup}>
      {mode === 'gyro' && (
        <group>
          <mesh ref={ringARef} rotation={[0.4, 0.2, 0]}>
            <torusGeometry args={[2.1, 0.05, 16, 100]} />
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.emissive}
              emissiveIntensity={colors.intensity}
              metalness={colors.metal}
              roughness={colors.rough}
              wireframe={wireframe}
            />
          </mesh>
          <mesh ref={ringBRef} rotation={[Math.PI / 2.5, 0.6, 0]}>
            <torusGeometry args={[1.7, 0.04, 14, 90]} />
            <meshStandardMaterial
              color="#ff6534"
              emissive="#ef481d"
              emissiveIntensity={0.65}
              metalness={0.5}
              roughness={0.2}
              wireframe={wireframe}
            />
          </mesh>
          <mesh>
            <octahedronGeometry args={[0.7, 0]} />
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.emissive}
              emissiveIntensity={colors.intensity}
              metalness={colors.metal}
              roughness={colors.rough}
              wireframe={wireframe}
            />
          </mesh>
        </group>
      )}

      {mode === 'prism' && (
        <group>
          <mesh rotation={[0.3, 0.5, 0]}>
            <icosahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.emissive}
              emissiveIntensity={colors.intensity}
              metalness={colors.metal}
              roughness={colors.rough}
              flatShading
              wireframe={wireframe}
            />
          </mesh>
          <mesh ref={ringARef} rotation={[0.6, 0.2, 0.4]}>
            <icosahedronGeometry args={[1.8, 0]} />
            <meshStandardMaterial color="#ff6534" wireframe emissive="#f35120" emissiveIntensity={0.6} />
          </mesh>
        </group>
      )}

      {mode === 'knot' && (
        <group>
          <mesh>
            <torusKnotGeometry args={[1.15, 0.38, 190, 32, 2, 3]} />
            <meshStandardMaterial
              color={colors.primary}
              emissive={colors.emissive}
              emissiveIntensity={colors.intensity}
              metalness={colors.metal}
              roughness={colors.rough}
              wireframe={wireframe}
            />
          </mesh>
          <mesh ref={ringARef} rotation={[Math.PI / 2.8, 0.35, 0.6]}>
            <torusGeometry args={[2.1, 0.03, 12, 120]} />
            <meshStandardMaterial color="#ff6534" emissive="#ef481d" emissiveIntensity={0.65} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function StudioParticles({ count = 250 }: { count?: number }) {
  const pointsRef = useRef<any>(null);
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const warm = new Color('#ff7a45');
    const cool = new Color('#e8dfd3');
    const temp = new Color();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2.5 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);
      temp.lerpColors(cool, warm, Math.random() * 0.9);
      col[i3] = temp.r;
      col[i3 + 1] = temp.g;
      col[i3 + 2] = temp.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.75} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export function SpatialStudioModal({
  isOpen,
  onClose,
  currentMode,
  onModeChange,
}: SpatialStudioProps) {
  const [theme, setTheme] = useState<MaterialTheme>('titanium');
  const [speed, setSpeed] = useState<number>(1);
  const [wireframe, setWireframe] = useState<boolean>(false);
  const [particles, setParticles] = useState<boolean>(true);
  const [xrSupported, setXrSupported] = useState<boolean | null>(null);
  const [xrType, setXrType] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Detect WebXR capability
    if (typeof navigator !== 'undefined' && 'xr' in navigator && (navigator as any).xr) {
      const xr = (navigator as any).xr;
      xr.isSessionSupported('immersive-ar')
        .then((supported: boolean) => {
          if (supported) {
            setXrSupported(true);
            setXrType('AR');
          } else {
            return xr.isSessionSupported('immersive-vr');
          }
        })
        .then((vrSupported?: boolean) => {
          if (vrSupported !== undefined) {
            setXrSupported(vrSupported);
            if (vrSupported) setXrType('VR');
          }
        })
        .catch(() => setXrSupported(false));
    } else {
      setXrSupported(false);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  const launchWebXR = async () => {
    if (typeof navigator === 'undefined' || !('xr' in navigator)) return;
    const xr = (navigator as any).xr;
    try {
      const sessionMode = xrType === 'AR' ? 'immersive-ar' : 'immersive-vr';
      await xr.requestSession(sessionMode, {
        optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'],
      });
    } catch (err) {
      console.warn('WebXR Session launch notice:', err);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="spatial-studio-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-label="Spatial 3D Studio & WebXR Inspector"
        >
          <motion.div
            className="spatial-studio-panel"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          >
            {/* Studio Header */}
            <div className="spatial-studio-header">
              <div className="studio-brand">
                <span className="eyebrow"><i /> Spatial 3D Studio &amp; WebXR Lab</span>
                <h2>Procedural Geometry Inspection</h2>
                <p>Interact with real-time WebGL/WebXR shaders and procedural topology.</p>
              </div>
              <div className="studio-top-actions">
                {xrSupported && (
                  <button
                    type="button"
                    className="xr-launch-pill"
                    onClick={launchWebXR}
                    title="Launch WebXR Session on headset or AR mobile"
                  >
                    <span>🥽</span> Enter WebXR ({xrType})
                  </button>
                )}
                <button
                  type="button"
                  className="studio-close-btn"
                  onClick={onClose}
                  aria-label="Close Spatial Studio"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Studio Canvas Area */}
            <div className="spatial-canvas-wrapper">
              <Canvas
                camera={{ position: [0, 0, 7.5], fov: 42 }}
                gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
              >
                <ambientLight intensity={0.65} />
                <directionalLight position={[4, 5, 5]} intensity={3.2} color="#fff2e0" />
                <pointLight position={[-3, -2, 2]} intensity={18} color="#ff6b35" />
                <pointLight position={[3, -2, -3]} intensity={12} color="#38bdf8" />
                <Environment resolution={128} frames={1}>
                  <Lightformer intensity={4} position={[0, 5, -3]} scale={[10, 2, 1]} />
                  <Lightformer intensity={3} color="#ff7a45" position={[-5, 1, 2]} scale={[3, 8, 1]} />
                </Environment>

                {particles && <StudioParticles count={260} />}

                <StudioMesh
                  mode={currentMode}
                  theme={theme}
                  speed={speed}
                  wireframe={wireframe}
                />
              </Canvas>

              {/* Interactive Telemetry Overlay */}
              <div className="studio-telemetry" aria-hidden="true">
                <div>
                  <span>TOPOLOGY</span>
                  <strong>{currentMode.toUpperCase()} MESH</strong>
                </div>
                <div>
                  <span>RENDER ENGINE</span>
                  <strong>THREE.JS WEBGL / XR</strong>
                </div>
                <div>
                  <span>POLYGONS</span>
                  <strong>~13,720 TRIANGLES</strong>
                </div>
                <div>
                  <span>SHADING</span>
                  <strong>{theme.toUpperCase()} {wireframe ? '(WIRE)' : '(SOLID)'}</strong>
                </div>
              </div>
            </div>

            {/* Studio Control Toolbar */}
            <div className="spatial-controls-bar">
              {/* Geometry Mode Selectors */}
              <div className="control-group">
                <span className="control-label">GEOMETRY:</span>
                <div className="button-group">
                  {(['knot', 'gyro', 'prism'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      className={`ctrl-btn ${currentMode === m ? 'active' : ''}`}
                      onClick={() => onModeChange(m)}
                    >
                      {m.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Material Shader Themes */}
              <div className="control-group">
                <span className="control-label">MATERIAL PRESET:</span>
                <div className="button-group">
                  {(['titanium', 'amber', 'emerald', 'wireframe'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`ctrl-btn ${theme === t ? 'active' : ''}`}
                      onClick={() => setTheme(t)}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed & Physics */}
              <div className="control-group">
                <span className="control-label">SPIN VELOCITY:</span>
                <div className="button-group">
                  {[0, 1, 2].map(s => (
                    <button
                      key={s}
                      type="button"
                      className={`ctrl-btn ${speed === s ? 'active' : ''}`}
                      onClick={() => setSpeed(s)}
                    >
                      {s === 0 ? 'FREEZE' : `${s}X`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="control-group toggles-group">
                <button
                  type="button"
                  className={`ctrl-toggle ${wireframe ? 'active' : ''}`}
                  onClick={() => setWireframe(v => !v)}
                >
                  WIREFRAME: {wireframe ? 'ON' : 'OFF'}
                </button>
                <button
                  type="button"
                  className={`ctrl-toggle ${particles ? 'active' : ''}`}
                  onClick={() => setParticles(v => !v)}
                >
                  STARDUST: {particles ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
