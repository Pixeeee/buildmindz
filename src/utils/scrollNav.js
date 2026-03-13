/**
 * scrollNav — cross-section navigation with Lenis smooth scroll.
 *
 * lenisRef   : holds the real Lenis instance (set by LandingPage on mount)
 * navState   : isNavigating flag — HorizontalSection's onScroll bails when true
 * resetRef   : HorizontalSection sets this to its internal progress-reset fn
 *
 * Upward jumps past HorizontalSection:
 *   1. navState.isNavigating = true        → scroll handler goes silent
 *   2. resetRef.current()                  → zero progress + transform
 *   3. lenis.scrollTo(target, immediate)   → instant jump via Lenis
 *   4. 600ms later: isNavigating = false
 */

export const lenisRef  = { current: null };
export const resetRef  = { current: null };
export const navState  = { isNavigating: false };

export function scrollNav(targetSelector) {
  const target = document.querySelector(targetSelector);
  if (!target) return;

  const targetTop  = target.getBoundingClientRect().top + window.scrollY;
  const currentPos = window.scrollY;
  const goingUp    = targetTop < currentPos;

  if (goingUp) {
    const hsWrapper = document.querySelector(".hs-wrapper");
    if (hsWrapper) {
      const hsTop = hsWrapper.getBoundingClientRect().top + window.scrollY;

      if (currentPos > hsTop && targetTop <= hsTop) {
        // Step 1 — silence HorizontalSection scroll handler
        navState.isNavigating = true;

        // Step 2 — reset horizontal progress so section shows values panel
        resetRef.current?.();

        // Step 3 — instant jump via Lenis (or native fallback)
        if (lenisRef.current?.scrollTo) {
          lenisRef.current.scrollTo(targetTop, { immediate: true });
        } else {
          window.scrollTo({ top: targetTop, behavior: "instant" });
        }

        // Step 4 — re-enable after paint settles
        setTimeout(() => { navState.isNavigating = false; }, 600);
        return;
      }
    }
  }

  // Normal smooth scroll via Lenis
  if (lenisRef.current?.scrollTo) {
    lenisRef.current.scrollTo(target, {
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    });
  } else {
    target.scrollIntoView({ behavior: "smooth" });
  }
}