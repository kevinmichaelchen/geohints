import { useLocation } from "@builder.io/qwik-city";

/**
 * Returns true only on initial page load (SSR), false for SPA navigations.
 * Use this to conditionally apply entrance animations only on first load.
 */
export function useIsInitialLoad(): boolean {
  const loc = useLocation();
  // prevUrl is undefined on initial SSR load, defined on SPA navigation
  return loc.prevUrl === undefined;
}

/**
 * Returns animation style props for staggered entrance animations.
 * On initial load: applies fade-in-up animation with staggered delay.
 * On SPA navigation: returns empty object for instant display.
 */
export function useEntranceAnimation(
  index: number,
  options: {
    baseDelay?: number;
    stagger?: number;
    duration?: number;
  } = {},
): Record<string, string | number> {
  const isInitialLoad = useIsInitialLoad();

  if (!isInitialLoad) {
    // SPA navigation - show immediately
    return {};
  }

  const { baseDelay = 0, stagger = 0.05, duration = 0.3 } = options;
  const delay = baseDelay + index * stagger;

  return {
    opacity: 0,
    animation: `fade-in-up ${duration}s ease-out ${delay}s forwards`,
  };
}
