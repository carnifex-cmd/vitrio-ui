import React, { useEffect, useMemo, useRef, useState } from 'react';
import styles from './GlassProjectCard.module.css';
import { GlassButton } from '../GlassButton/GlassButton';
import { CircularGlassButton } from '../CircularGlassButton/CircularGlassButton';

export interface GlassProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tags?: string[];
  demoLink?: string;
  codeLink?: string;
  className?: string;
  /** Theme for action button icon/text color */
  buttonTextTheme?: 'light' | 'dark';
}

const GlassProjectCard: React.FC<GlassProjectCardProps> = ({
  title,
  description,
  imageUrl,
  tags,
  demoLink,
  codeLink,
  className,
  buttonTextTheme = 'dark',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

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

  const onOpenLink = (href?: string) => () => {
    if (!href) return;
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  const actionTextColor = buttonTextTheme === 'light' ? '#ffffff' : '#000000';
  const actionTextStyle = { ['--text' as any]: actionTextColor } as React.CSSProperties;

  const MonitorIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M3 5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-5v2h3a1 1 0 1 1 0 2H7a1 1 0 1 1 0-2h3v-2H5a2 2 0 0 1-2-2V5zm2 0v10h14V5H5z"/>
    </svg>
  );

  const GithubIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-3.162 19.492c.5.09.683-.217.683-.483 0-.237-.01-1.024-.014-1.858-2.782.604-3.369-1.19-3.369-1.19-.455-1.156-1.111-1.465-1.111-1.465-.909-.621.069-.608.069-.608 1.005.071 1.534 1.032 1.534 1.032.894 1.531 2.347 1.089 2.918.833.091-.647.35-1.089.636-1.34-2.221-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.273.098-2.654 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.505.337 1.909-1.294 2.748-1.025 2.748-1.025.545 1.381.202 2.401.1 2.654.64.699 1.028 1.592 1.028 2.683 0 3.842-2.338 4.688-4.566 4.937.36.31.68.921.68 1.855 0 1.338-.012 2.418-.012 2.746 0 .268.18.577.688.479A10.001 10.001 0 0 0 12 2z"/>
    </svg>
  );

  return (
    <div
      ref={rootRef}
      className={containerClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => {}}
      role="article"
      aria-label={`Project card: ${title}`}
    >
      {/* Background image covers entire card */}
      <img className={styles.bgImage} src={imageUrl} alt={title} loading="lazy" />

      {/* Bottom glass info pill/squircle pinned to bottom; never overflows */}
      <div className={`${styles.infoGlass} glass-base glass-shadow`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.infoContent}>
          <div className={styles.headerRow}>
            <h3 className={styles.title}>{title}</h3>
            <div className={styles.actions} style={actionTextStyle}>
              {demoLink && (
                <CircularGlassButton kind="default" size={36} onClick={onOpenLink(demoLink)} ariaLabel="View demo">
                  {MonitorIcon}
                </CircularGlassButton>
              )}
              {codeLink && (
                <CircularGlassButton kind="default" size={36} onClick={onOpenLink(codeLink)} ariaLabel="View code">
                  {GithubIcon}
                </CircularGlassButton>
              )}
            </div>
          </div>
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


