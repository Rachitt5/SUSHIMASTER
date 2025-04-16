import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  OrbitControls, 
  useGLTF, 
  Environment, 
  Float, 
  Text, 
  Sparkles,
  useTexture, 
  PresentationControls,
  Center, 
  Html
} from '@react-three/drei';
import { Vector3, MathUtils, Group } from 'three';
import { motion } from 'framer-motion-3d';

// Food model component with animation
const SushiModel = ({ position, rotation, scale = 1, floatIntensity = 1 }) => {
  console.log('SushiModel props:', { position, rotation, scale, floatIntensity });
  // Defensive prop checks
  if (!position || !rotation) {
    console.error('SushiModel: Missing required position or rotation prop', { position, rotation });
    return <group />;
  }
  const group = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = MathUtils.lerp(
        group.current.rotation.y,
        hovered ? rotation[1] + 0.5 : rotation[1],
        0.1
      );
    }
  });

  // This is simulating a GLTF model - in a real implementation, 
  // we'd use actual 3D models of food items
  return (
    <Float
      speed={2 * floatIntensity}
      rotationIntensity={0.5 * floatIntensity}
      floatIntensity={0.5 * floatIntensity}
    >
      <group
        ref={group}
        position={position}
        rotation={rotation}
        scale={[scale, scale, scale]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.8, 0.8, 0.2, 32]} />
          <meshStandardMaterial color={hovered ? "#f5f5dc" : "#f4f1de"} />
        </mesh>
        
        {/* Sushi Rice */}
        <mesh position={[0, 0.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.7, 0.7, 0.1, 32]} />
          <meshStandardMaterial color="#ffffff" roughness={0.8} />
        </mesh>
        
        {/* Toppings */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 0.1, 0.6]} />
          <meshStandardMaterial color="#ef8354" roughness={0.4} />
        </mesh>
        
        {/* Seaweed wrap */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.85, 0.85, 0.22, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} transparent opacity={0.8} />
        </mesh>
      </group>
    </Float>
  );
};

// Floating ingredients with physics motion
// Floating ingredients with physics motion
const FloatingIngredient = ({ position, texture = undefined, size = 1, color = "#ffffff" }) => {
  // Defensive prop checks
  if (!position) {
    console.error('FloatingIngredient: Missing required position prop', { position });
    return <group />;
  }
  const ref = useRef<Group>(null);
  
  // Simulate a texture look
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <mesh position={position} castShadow receiveShadow>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.5} 
          metalness={0.2}
        />
      </mesh>
    </Float>
  );
};

// Background particles effect
const ParticlesEffect = () => {
  return (
    <Sparkles 
      count={100} 
      scale={10} 
      size={0.5} 
      speed={0.3} 
      opacity={0.5} 
      color="#fff8e1" 
    />
  );
};

// Title text floating in 3D space
const TitleText = () => {
  // Simplified to remove framer-motion which might be causing the .lov error
  return (
    <group position={[0, 3, -3]}>
      <Center>
        <Text 
          fontSize={1}
          position={[0, 0, 0]}
          color="#e07a5f"
          anchorX="center"
          anchorY="middle"
          font="https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQZNLo_U2r.woff2"
          letterSpacing={0.05}
          lineHeight={1}
          material-roughness={0.1}
          material-metalness={0.8}
        >
          Culinary Canvas
        </Text>
      </Center>
    </group>
  );
};

// Main scene component for food visualization
const FoodVisualization = () => {
  console.log('FoodVisualization rendering');
  try {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 1, 6);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[5, 10, 7]} angle={0.15} penumbra={1} intensity={1} castShadow />
      <Environment preset="sunset" />
      <ParticlesEffect />
      
      <PresentationControls
        global
        rotation={[0.13, 0.1, 0]}
        polar={[-0.4, 0.2]}
        azimuth={[-1, 0.75]}
        config={{ mass: 2, tension: 400 }}
        snap={{ mass: 4, tension: 400 }}
      >
        <TitleText />
        
        <group position={[0, -1, 0]}>
          <SushiModel 
            position={[0, 0, 0]} 
            rotation={[0, 0, 0]} 
            scale={1.5} 
            floatIntensity={0.5}
          />
          
          <FloatingIngredient position={[2, 1, -1]} size={0.4} color="#81B29A" />
          <FloatingIngredient position={[-2, 1.5, -0.5]} size={0.3} color="#E07A5F" />
          <FloatingIngredient position={[1.5, 2, 1]} size={0.5} color="#3D405B" />
          <FloatingIngredient position={[-1.5, 0.5, 1.5]} size={0.35} color="#F4F1DE" />
          <FloatingIngredient position={[0, 2.5, -2]} size={0.45} color="#F2CC8F" />
        </group>
      </PresentationControls>
      
      <OrbitControls 
        enableZoom={false} 
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
  } catch (err) {
    console.error('FoodVisualization error:', err);
    return (
      <group>
        <Html>
          <div style={{ color: 'red', background: '#fff', padding: 16 }}>
            <b>3D Scene Error:</b> {err?.toString()}
          </div>
        </Html>
      </group>
    );
  }
};

// Canvas wrapper component
const Scene3D = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-navy via-navy/90 to-navy/80">
      <Canvas shadows dpr={[1, 2]} className="w-full h-screen">
        <FoodVisualization />
      </Canvas>
      
      <div className="absolute bottom-8 left-0 right-0 text-center text-white">
        <p className="text-xl">Click and drag to explore the 3D space</p>
      </div>
    </div>
  );
};

export default Scene3D;