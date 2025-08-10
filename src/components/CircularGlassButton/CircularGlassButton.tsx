import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlassShaderMaterial, variantTints } from '../../utils/glassShaders';
import styles from './CircularGlassButton.module.css';

export type CircularGlassKind = 'close' | 'info' | 'prev' | 'next' | 'default' | 'custom';

export interface CircularGlassButtonProps {
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'danger';
  intensity?: number;
  disabled?: boolean;
  className?: string;
  /**
   * Size of the circular button. If number, treated as pixels.
   */
  size?: number | 'sm' | 'md' | 'lg';
  /**
   * Built-in kinds. Use 'custom' with `icon` to render a simple node, or 'default' with `children` for arbitrary content.
   */
  kind?: CircularGlassKind;
  /**
   * Custom icon node. Only used when kind === 'custom'.
   */
  icon?: React.ReactNode;
  /**
   * Arbitrary content shown in the center when kind === 'default'.
   */
  children?: React.ReactNode;
  /**
   * Accessible label. Defaults to kind-specific label.
   */
  ariaLabel?: string;
}

interface SceneProps {
  variant: 'default' | 'primary' | 'danger';
  intensity: number;
  isHovered: boolean;
  disabled: boolean;
}

function CircularScene({ variant, intensity, isHovered, disabled }: SceneProps) {
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

  // Use a square plane; fragment shader masks to a circle
  return (
    <mesh position={[0, 0, 0]}> 
      <planeGeometry args={[1, 1]} />
      {/* attach full shader material instance */}
      <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
    </mesh>
  );
}

function resolveSizePx(size: CircularGlassButtonProps['size']): number {
  if (typeof size === 'number') return size;
  switch (size) {
    case 'sm':
      return 32;
    case 'lg':
      return 56;
    case 'md':
    default:
      return 44;
  }
}

function defaultIconForKind(kind: CircularGlassKind): React.ReactNode {
  switch (kind) {
    case 'close':
      return '×';
    case 'info':
      return 'i';
    case 'prev':
      return '‹';
    case 'next':
      return '›';
    case 'default':
    case 'custom':
    default:
      return null;
  }
}

function defaultAriaForKind(kind: CircularGlassKind): string | undefined {
  switch (kind) {
    case 'close':
      return 'Close';
    case 'info':
      return 'Info';
    case 'prev':
      return 'Previous';
    case 'next':
      return 'Next';
    case 'custom':
    default:
      return undefined;
  }
}

export const CircularGlassButton: React.FC<CircularGlassButtonProps> = ({
  onClick,
  variant = 'default',
  intensity = 0.6,
  disabled = false,
  className,
  size = 'md',
  kind = 'default',
  icon,
  ariaLabel,
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const label = ariaLabel ?? defaultAriaForKind(kind) ?? 'Button';
  const contentNode =
    kind === 'custom' ? icon : kind === 'default' ? children : defaultIconForKind(kind);
  const pixelSize = resolveSizePx(size);

  const handleClick = useCallback(() => {
    if (!disabled && onClick) onClick();
  }, [disabled, onClick]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return (
    <div
      className={`${styles.container} glass-base glass-shadow ${className || ''} ${
        isHovered ? 'glass-hover glass-shadow-hover' : ''
      }`}
      style={{ width: pixelSize, height: pixelSize }}
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
          gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        >
          <CircularScene
            variant={variant}
            intensity={intensity}
            isHovered={isHovered || isFocused}
            disabled={disabled}
          />
        </Canvas>
      </div>

      <div className={`${styles.icon} ${disabled ? styles.disabled : ''}`}>{contentNode}</div>

      {isFocused && <div className={styles.focusRing} />}
    </div>
  );
};



