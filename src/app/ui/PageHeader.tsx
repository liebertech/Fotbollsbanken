/**
 * Sidhuvudet överst i varje vy i planeringsläget (docs/design/designsystem.md avsnitt 6.10):
 * ett gräsrandat band med varumärkesraden och vyns h1. Mittcirkeln, mittlinjen och den gula
 * listen är bakgrunder i CSS, inte innehåll.
 *
 * Rubrikens text är oförändrad från vyerna. Den enda nya texten är varumärkesraden
 * (docs/design/texter.md avsnitt 1).
 */
import type { ReactNode } from 'react';
import { useFocusOnMount } from '../fokus/useFocusOnMount.ts';
import { TEXTS } from '../text/texts.ts';
import { Icon } from './Icon.tsx';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  heading: string;
  /**
   * Flyttar fokus till rubriken när vyn visas, som i bytesvyn (skisser/04-byt-ovning.md).
   * Rubriken får då `tabIndex={-1}`, så att den kan ta fokus utan att hamna i tabbordningen.
   */
  focusHeading?: boolean;
  /** Det som står före rubriken i bandet, till exempel en tillbaka-knapp. */
  children?: ReactNode;
}

/** Rubriken som tar fokus när den monteras. `ref` får bara vara `focusOnMount` (eslint). */
function FocusedHeading({ heading }: { heading: string }) {
  const focusOnMount = useFocusOnMount();
  return (
    <h1 className={styles.heading} tabIndex={-1} ref={focusOnMount}>
      {heading}
    </h1>
  );
}

export function PageHeader({ heading, focusHeading = false, children }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <p className={styles.brand}>
        <Icon name="ball" />
        <span>{TEXTS.app.name}</span>
      </p>
      {children}
      {focusHeading ? (
        <FocusedHeading heading={heading} />
      ) : (
        <h1 className={styles.heading}>{heading}</h1>
      )}
    </div>
  );
}
