/**
 * Usage:
 *
 * <GlassModal 
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <p>Are you sure you want to proceed?</p>
 * </GlassModal>
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlassShaderMaterial, variantTints } from '../../utils/glassShaders';
import { GlassButton } from '../GlassButton/GlassButton';
import styles from './GlassModal.module.css';

export interface GlassModalProps {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  intensity?: number;
  className?: string;
}

interface GlassModalSceneProps {
  intensity: number;
  isHovered: boolean;
}

function GlassModalScene({ intensity, isHovered }: GlassModalSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const shaderMaterial = React.useMemo(() => {
    return createGlassShaderMaterial(variantTints.modal, intensity, false);
  }, [intensity]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTintColor.value = variantTints.modal;
      materialRef.current.uniforms.uIntensity.value = intensity;
      materialRef.current.uniforms.uDisabled.value = 0.0;
    }
  }, [intensity]);

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
      <planeGeometry args={[8, 6]} />
      <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
    </mesh>
  );
}

export const GlassModal: React.FC<GlassModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  intensity = 0.6,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleBackdropClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && onClose) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && onClose) {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div 
        className={`${styles.modal} ${styles[size]} glass-modal-base glass-modal-shadow ${className || ''} ${isHovered ? 'glass-modal-hover glass-modal-shadow-hover' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
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
            <GlassModalScene
              intensity={intensity}
              isHovered={isHovered}
            />
          </Canvas>
        </div>

        <div className={styles.content}>
          {title && (
            <div className={styles.header}>
              <h2 id="modal-title" className={styles.title}>{title}</h2>
              {onClose && (
                <div className={styles.closeButtonContainer}>
                  <GlassButton 
                    label="×"
                    onClick={onClose}
                    aria-label="Close modal"
                  />
                </div>
              )}
            </div>
          )}
          
          <div className={styles.body}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}; 