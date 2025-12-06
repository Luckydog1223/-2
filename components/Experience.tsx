import React, { Suspense } from 'react';
import { Canvas, ThreeElements } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { ArixTree } from './ArixTree';
import { GoldenStar } from './GoldenStar';
import { GreetingText } from './GreetingText';
import { TreeState } from '../types';
import { CONFIG } from '../constants';
import { Vector3 } from 'three';

interface ExperienceProps {
  treeState: TreeState;
}

export const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  const isTreeForm = treeState === TreeState.TREE_SHAPE;

  // Star and Text positions relative to tree top
  const topPosition = new Vector3(0, CONFIG.TREE_HEIGHT / 2 + 1, 0);
  const textPosition = new Vector3(0, CONFIG.TREE_HEIGHT / 2 + 3, 0);

  return (
    <Canvas dpr={[1, 2]} gl={{ antialias: false }}>
      <PerspectiveCamera makeDefault position={[0, 0, 30]} fov={45} />
      
      {/* Controls: AutoRotate when formed to show off the tree */}
      <OrbitControls 
        enablePan={false} 
        minPolarAngle={Math.PI / 3} 
        maxPolarAngle={Math.PI / 1.5}
        autoRotate={isTreeForm}
        autoRotateSpeed={0.5}
        zoomSpeed={0.5}
      />

      {/* Lighting for Luxury Feel */}
      <ambientLight intensity={0.2} color="#001100" />
      <spotLight 
        position={[10, 20, 10]} 
        angle={0.5} 
        penumbra={1} 
        intensity={2} 
        color="#ffeebb" 
        castShadow 
      />
      <pointLight position={[-10, -5, -10]} intensity={1} color="#00ff44" />
      
      {/* Environment reflections */}
      <Environment preset="city" />

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Main Content */}
      <Suspense fallback={null}>
        <group position={[0, -2, 0]}>
          <ArixTree treeState={treeState} />
          <GoldenStar position={topPosition} visible={isTreeForm} />
          <GreetingText position={textPosition} visible={isTreeForm} />
        </group>
      </Suspense>

      {/* Post Processing for Cinematic Look */}
      <EffectComposer disableNormalPass>
        <Bloom 
          luminanceThreshold={0.5} 
          mipmapBlur 
          intensity={1.5} 
          radius={0.6} 
        />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
        <Noise opacity={0.02} />
      </EffectComposer>
    </Canvas>
  );
};