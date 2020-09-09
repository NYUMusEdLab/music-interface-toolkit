import React from 'react';

import '../fonts/Chords.css';
import styles from './Chord.module.css';

export const Diminished = () => (
  <span className={styles['chord-symbol']}>&#xE870;</span>
);
export const HalfDiminished = () => (
  <span className={styles['chord-symbol']}>&#xE871;</span>
);
export const Augmented = () => (
  <span className={styles['chord-symbol']}>&#xE872;</span>
);
export const Major = () => (
  <span className={styles['chord-symbol']}>&#xE873;</span>
);
export const Minor = () => (
  <span className={styles['chord-symbol']}>&#xE874;</span>
);
