import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GlassProjectCard.module.css';
import { GlassButton } from '../GlassButton/GlassButton';

export interface GlassProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  demoLink?: string;
  codeLink?: string;
  className?: string;
}

const GlassProjectCard: React.FC<GlassProjectCardProps> = ({
  title,
  description,
  imageUrl,
  tags,
  demoLink,
  codeLink,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Detect touch devices to prefer click/tap overlay toggle
  const prefersTap = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: none)').matches;
  }, []);

  useEffect(() => {
    if (!rootRef.current) return;
    const el = rootRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setIsInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const containerClasses = `${styles.card} glass-modal-base glass-modal-shadow ${
    isHovered ? 'glass-modal-hover glass-modal-shadow-hover' : ''
  } ${isInView ? styles.visible : ''} ${className || ''}`;

  const showOverlay = overlayVisible || (isHovered && !prefersTap);

  const onOpenLink = (href?: string) => () => {
    if (!href) return;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      ref={rootRef}
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {
        if (prefersTap) setOverlayVisible((v) => !v);
      }}
      role="article"
      aria-label={`Project card: ${title}`}
    >
      {/* Background image covers entire card */}
      <img className={styles.bgImage} src={imageUrl} alt={title} loading="lazy" />

      {/* Hover/tap overlay */}
      <div
        className={`${styles.imageOverlay} ${showOverlay ? styles.overlayVisible : ''} glass-base glass-shadow`}
        aria-hidden={!showOverlay}
      >
        <div className={styles.overlayButtons} onClick={(e) => e.stopPropagation()}>
          {demoLink && (
            <GlassButton label="View Demo" variant="primary" onClick={onOpenLink(demoLink)} />
          )}
          {codeLink && <GlassButton label="View Code" onClick={onOpenLink(codeLink)} />}
        </div>
      </div>

      {/* Bottom glass info pill/squircle pinned to bottom; never overflows */}
      <div className={`${styles.infoGlass} glass-base glass-shadow`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.infoContent}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          {tags && tags.length > 0 && (
            <ul className={styles.tags} aria-label="Tags">
              {tags.map((tag, idx) => (
                <li key={`${tag}-${idx}`} className={`${styles.tag} glass-base glass-shadow`}>
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlassProjectCard;


