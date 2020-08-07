import React, { createContext, useRef, useEffect } from 'react';

const ButtonContext = createContext<null | Set<number>>(null);

export function ButtonGroup({ children }: React.PropsWithChildren<{}>) {
  const pointers = useRef<Set<number>>(new Set());

  useEffect(() => {
    const handlePointerUp = (event: PointerEvent) => {
      if (pointers.current.has(event.pointerId)) {
        event.preventDefault();
        pointers.current.delete(event.pointerId);
      }
    };

    document.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('pointercancel', handlePointerUp);

    return () => {
      document.removeEventListener('pointerup', handlePointerUp);
      document.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [pointers]);

  return (
    <ButtonContext.Provider value={pointers.current}>
      {children}
    </ButtonContext.Provider>
  );
}

import { useContext, useCallback } from 'react';

export function useButtonHandlers(
  onPress: (evt: React.PointerEvent) => any,
  onRelease: (evt: React.PointerEvent) => any,
  deps: React.DependencyList = []
) {
  // Get current active pointers
  const pointers = useContext(ButtonContext);

  if (pointers === null) {
    throw Error(
      'useButtonHandlers must be used within a ButtonGroup component'
    );
  }

  // Memoize the callbacks if necessary
  onPress = useCallback(onPress, deps);
  onRelease = useCallback(onRelease, deps);

  // Set up the relevant pointer events
  let onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      event.preventDefault();
      pointers.add(event.pointerId);
      onPress(event);
    },
    [onPress, pointers]
  );

  let onPointerUp = useCallback(
    (event: React.PointerEvent) => {
      if (pointers.has(event.pointerId)) {
        event.preventDefault();
        pointers.delete(event.pointerId);
        onRelease(event);
      }
    },
    [onRelease, pointers]
  );

  let onPointerEnter = useCallback(
    (event: React.PointerEvent) => {
      if (pointers.has(event.pointerId)) {
        onPress(event);
      }
    },
    [onPress, pointers]
  );

  let onPointerLeave = useCallback(
    (event: React.PointerEvent) => {
      if (pointers.has(event.pointerId)) {
        onRelease(event);
      }
    },
    [onRelease, pointers]
  );

  let onPointerCancel = useCallback(
    (event: React.PointerEvent) => {
      if (pointers.has(event.pointerId)) {
        onRelease(event);
      }
    },
    [onRelease, pointers]
  );

  return {
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
    onPointerCancel,
  };
}
