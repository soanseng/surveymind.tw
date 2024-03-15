import { useState, useEffect } from 'react';

/**
 * A hook that tracks the state of a CSS media query.
 * @param query The media query to track.
 * @returns A boolean indicating if the media query matches.
 */
const useMediaQuery = (query: string): boolean => {
  const getMatches = (query: string): boolean => {
    // Prevents SSR issues
    if (typeof window !== 'undefined') {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches(query));

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const documentChangeHandler = () => setMatches(mediaQueryList.matches);

    // Listen for changes
    mediaQueryList.addEventListener('change', documentChangeHandler);

    documentChangeHandler(); // Initial check

    return () => {
      mediaQueryList.removeEventListener('change', documentChangeHandler);

    };
  }, [query]);

  return matches;
};

export default useMediaQuery;