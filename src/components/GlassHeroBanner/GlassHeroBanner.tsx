import React, { useMemo, useRef, useState, useEffect } from 'react';
import styles from './GlassHeroBanner.module.css';
import { GlassButton } from '../GlassButton/GlassButton';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { createGlassShaderMaterial, variantTints } from '../../utils/glassShaders';

export interface HeroCtaButton {
  label: string;
  onClick: () => void;
}

export interface GlassHeroBannerProps {
  title: string;
  subtitle?: string;
  ctaButtons?: HeroCtaButton[];
  backgroundImageUrl?: string;
  className?: string;
  /**
   * Optional text colors for better contrast over varied backgrounds.
   * Defaults are tuned for dark-overlaid backgrounds and remain the same across themes.
   */
  textColor?: string;
  mutedColor?: string;
}

const GlassHeroBanner: React.FC<GlassHeroBannerProps> = ({
  title,
  subtitle,
  ctaButtons,
  backgroundImageUrl,
  className,
  textColor,
  mutedColor,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const titleColor = textColor ?? '#e6e7ea';
  const subtitleColor = mutedColor ?? '#b3b8c2';

  return (
    <section
      className={`${styles.root} ${className || ''}`}
      aria-label="Hero banner"
    >
      {backgroundImageUrl && (
        <div
          className={styles.bg}
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
          aria-hidden
        />
      )}

      <div className={styles.content}>
        <div
          className={`${styles.panel} glass-base glass-shadow ${isHovered ? 'glass-hover glass-shadow-hover' : ''}`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className={styles.canvas}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
            >
              <HeroPanelScene isHovered={isHovered} intensity={0.6} />
            </Canvas>
          </div>
          <div className={styles.panelContent}>
            <h1 className={styles.title} style={{ color: titleColor }}>{title}</h1>
            {subtitle && <p className={styles.subtitle} style={{ color: subtitleColor }}>{subtitle}</p>}

            {ctaButtons && ctaButtons.length > 0 && (
              <div className={styles.buttons}>
                {ctaButtons.map((btn, index) => (
                  <div
                    key={`${btn.label}-${index}`}
                    className={styles.buttonWrap}
                    style={{ animationDelay: `${150 + index * 80}ms` }}
                  >
                    <GlassButton
                      label={btn.label}
                      onClick={btn.onClick}
                      variant={index === 0 ? 'primary' : 'default'}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GlassHeroBanner;

interface HeroPanelSceneProps {
  intensity: number;
  isHovered: boolean;
}

function HeroPanelScene({ intensity, isHovered }: HeroPanelSceneProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const shaderMaterial = useMemo(() => {
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
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[10, 6]} />
      <shaderMaterial ref={materialRef} attach="material" {...shaderMaterial} />
    </mesh>
  );
}


