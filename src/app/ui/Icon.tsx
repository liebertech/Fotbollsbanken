/**
 * Appens egen ikonuppsättning (docs/design/designsystem.md avsnitt 6.11): fem ikoner ritade
 * på ett 24 × 24-raster med `currentColor`, så att färgen följer sammanhanget. Ritningarna är
 * egna, förlagan är skissen docs/design/skisser/visuell/riktning-a-grasmattan.html.
 *
 * Ikonerna är alltid dekor bredvid en text som säger samma sak, och syns därför inte för
 * skärmläsare (`aria-hidden`). En knapp som bara har en ikon får sitt namn på knappen.
 */
import type { ReactNode } from 'react';
import styles from './Icon.module.css';

export type IconName = 'ball' | 'warning' | 'yellow-card' | 'drop' | 'back';

const PATHS: Record<IconName, ReactNode> = {
  ball: (
    <>
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
      <polygon points="12,7 16.5,10.3 14.8,15.6 9.2,15.6 7.5,10.3" fill="currentColor" />
      <path
        d="M12 7V2.5M16.5 10.3l4.6-1.4M14.8 15.6l2.8 3.8M9.2 15.6l-2.8 3.8M7.5 10.3L2.9 8.9"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </>
  ),
  warning: (
    <>
      <path
        d="M12 3L22 20H2z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M12 9v5.5M12 17v.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </>
  ),
  'yellow-card': (
    <rect
      x="6"
      y="2.5"
      width="12"
      height="19"
      rx="2"
      fill="currentColor"
      transform="rotate(8 12 12)"
    />
  ),
  drop: <path d="M12 3C8 8.5 6 11.5 6 15a6 6 0 0012 0c0-3.5-2-6.5-6-12z" fill="currentColor" />,
  back: (
    <path
      d="M15 5l-7 7 7 7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  ),
};

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  return (
    <svg
      className={className === undefined ? styles.icon : `${styles.icon} ${className}`}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      data-icon={name}
    >
      {PATHS[name]}
    </svg>
  );
}
