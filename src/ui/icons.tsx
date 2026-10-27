import { useEffect, useRef } from 'react';
import { go } from '../nav';
import type { View } from '../scene/layout';
import { hud } from '../content';

export const IconArrowDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 2v12M3 9l5 5 5-5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
export const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M1 8h14M10 3l5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
export const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d="M4 2l10 6-10 6z" fill="currentColor" />
  </svg>
);
export const IconDownload = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8 1v11M3 7l5 5 5-5M2 15h12" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);
export const IconSoundOn = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 7h3l4-3v10l-4-3H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M12 6.5a3.5 3.5 0 010 5M14 4.5a6.3 6.3 0 010 9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
export const IconSoundOff = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 7h3l4-3v10l-4-3H2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M12 7l4 4M16 7l-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);
export const IconHanger = () => (
  <svg width="40" height="30" viewBox="0 0 40 30" fill="none" aria-hidden="true">
    <path d="M20 9a3.5 3.5 0 113.5-3.5M20 9v3L3 26h34L20 12" stroke="#bdbdbd" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export function Back({ to = 'set', label = hud.back }: { to?: View; label?: string }) {
  return (
    <button className="back" onClick={() => go(to)}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
        <path d="M13 7H1M6 2L1 7l5 5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      {label}
    </button>
  );
}

/** focus on mount without showing the keyboard focus ring (it still shows once the user tabs) */
export function useQuietFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    ref.current?.focus({ preventScroll: true, focusVisible: false } as FocusOptions);
  }, []);
  return ref;
}
