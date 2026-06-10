'use client';

import { useRef, useEffect } from 'react';
import { Text, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface CharacterCardProps {
  caricature: {
    file: string;
    features: number[];
    isVisible: boolean;
  };
  position: [number, number, number];
  isVisible: boolean;
  onCardClick?: (caricature: { file: string; features: number[] }) => void;
}

export default function CharacterCard({ caricature, position, isVisible, onCardClick }: CharacterCardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const targetY = useRef(0);
  const currentY = useRef(0);

  // Cargar la textura usando el hook de drei
  const texture = useTexture(`/caricatures/${caricature.file}`);

  // Actualizar la posición objetivo cuando cambia la visibilidad
  useEffect(() => {
    targetY.current = isVisible ? 0 : -3; // Se desliza hacia abajo cuando no es visible
  }, [isVisible]);

  // Animación suave de deslizamiento vertical
  useFrame((state, delta) => {
    if (groupRef.current) {
      const diff = targetY.current - currentY.current;
      if (Math.abs(diff) > 0.01) {
        currentY.current += diff * delta * 2; // Velocidad de animación
        groupRef.current.position.y = currentY.current;
      }
    }
  });

  // Si no es visible y ya se deslizó completamente, no renderizar
  if (!isVisible && currentY.current < -2.9) {
    return null;
  }

  return (
    <group position={position}>
      {/* Grupo que contiene el marco, imagen y texto - todo se desliza junto */}
      <group 
        ref={groupRef} 
        position={[0, 0, 0.05]}
        userData={{ isCard: true, cardId: caricature.file }}
      >
        {/* Marco de la ficha */}
        <mesh>
          <boxGeometry args={[1, 1.2, 0.1]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Imagen del personaje - anclada al frente del marco */}
        <mesh position={[0, 0.1, 0.05]}>
          <planeGeometry args={[0.8, 0.8]} />
          <meshStandardMaterial map={texture} side={THREE.FrontSide} />
        </mesh>

        {/* Nombre del personaje - anclado al frente del marco */}
        <Text
          position={[0, -0.4, 0.05]}
          fontSize={0.08}
          color="#333"
          anchorX="center"
          anchorY="middle"
        >
          {caricature.file.replace('.png', '')}
        </Text>
      </group>

      {/* Bisagra en la parte inferior - no rota */}
      <mesh position={[0, -0.6, 0]}>
        <meshStandardMaterial color="#666" />
      </mesh>
    </group>
  );
} 