import { useEffect, useRef } from 'react';

export function usePrevious(value: boolean | number) {
  const ref = useRef<boolean | number>();
  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}