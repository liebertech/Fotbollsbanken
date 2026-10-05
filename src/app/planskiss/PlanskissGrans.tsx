/**
 * Felgränsen runt varje skiss (ADR 0012 avsnitt 7, RK-1). Ett oväntat fel när en skiss ritas
 * visar "Planskissen kunde inte visas" för just den skissen. Resten av passet påverkas inte.
 */
import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import type { PlanskissStorlek } from '../../planskiss/index.ts';
import { PlanskissFel } from './Platshallare.tsx';

interface PlanskissGransProps {
  storlek: PlanskissStorlek;
  children: ReactNode;
}

interface PlanskissGransState {
  failed: boolean;
}

export class PlanskissGrans extends Component<PlanskissGransProps, PlanskissGransState> {
  override state: PlanskissGransState = { failed: false };

  static getDerivedStateFromError(): PlanskissGransState {
    return { failed: true };
  }

  override componentDidCatch(error: Error, info: ErrorInfo): void {
    // Bara i utvecklingsläge. Ledaren ser aldrig en teknisk felutskrift (berättelse 06, kriterium 3).
    if (import.meta.env.DEV) {
      console.error('Planskissen kunde inte ritas', error, info.componentStack);
    }
  }

  override render(): ReactNode {
    if (this.state.failed) {
      return <PlanskissFel storlek={this.props.storlek} />;
    }
    return this.props.children;
  }
}
