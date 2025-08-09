/**
 * Usage:
 *
 * <GlassButton 
 *   label="Continue" 
 *   variant="primary"
 *   onClick={() => console.log('clicked')}
 * />
 */
import React, { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlassShaderMaterial, variantTints } from '../../utils/glassShaders';
import styles from './GlassButton.module.css';

export interface GlassButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger';
  intensity?: number;
  disabled?: boolean;
  className?: string;
}

interface GlassButtonSceneProps {
  variant: 'default' | 'primary' | 'danger';
  intensity: number;
  isHovered: boolean;
  disabled: boolean;
}

function GlassButtonScene({ variant, intensity, isHovered, disabled }: GlassButtonSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const shaderMaterial = useMemo(() => {
    return createGlassShaderMaterial(variantTints[variant], intensity, disabled);
  }, [variant, intensity, disabled]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTintColor.value = variantTints[variant];
      materialRef.current.uniforms.uIntensity.value = intensity;
      materialRef.current.uniforms.uDisabled.value = disabled ? 1.0 : 0.0;
    }
  }, [variant, intensity, disabled]);

  useFrame((state) => {
    if (!materialRef.current) return;

    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    
    const targetHover = isHovered ? 1.0 : 0.0;
    const currentHover = materialRef.current.uniforms.uHoverFactor.value;
    materialRef.current.uniforms.uHoverFactor.value = THREE.MathUtils.lerp(
      currentHover,
      targetHover,
      0.08
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[2.5, 0.8]} />
      <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
    </mesh>
  );
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  onClick,
  variant = 'default',
  intensity = 0.6,
  disabled = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleClick = useCallback(() => {
    if (!disabled && onClick) {
      onClick();
    }
  }, [disabled, onClick]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  return (
    <div 
      className={`${styles.container} glass-base glass-shadow ${className || ''} ${isHovered ? 'glass-hover glass-shadow-hover' : ''}`}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      aria-disabled={disabled}
      aria-label={label}
    >
      <div className={styles.canvas}>
        <Canvas
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true 
          }}
        >
          <GlassButtonScene
            variant={variant}
            intensity={intensity}
            isHovered={isHovered || isFocused}
            disabled={disabled}
          />
        </Canvas>
      </div>

      <div className={`${styles.label} ${disabled ? styles.disabled : ''}`}>
        {label}
      </div>

      {isFocused && <div className={styles.focusRing} />}
    </div>
  );
}; 