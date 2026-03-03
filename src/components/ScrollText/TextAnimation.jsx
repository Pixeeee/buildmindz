import { useEffect, useRef } from 'react';
import './TextAnimation.css';

/**
 * TextAnimation
 *
 * Props:
 *  text        string   — text to animate
 *  as          string   — HTML tag ('h1','h2','p', etc.)
 *  className   string   — extra CSS classes on the wrapper
 *  direction   'up' | 'down' | 'left' | 'right'  — slide-in direction
 *  letterAnime boolean  — animate letter-by-letter
 *  lineAnime   boolean  — animate as a single block
 *  threshold   number   — IntersectionObserver threshold (default 0.2)
 *  delay       number   — base delay in seconds before first unit appears
 */
export default function TextAnimation({
  text        = '',
  as          = 'h2',
  className   = '',
  direction   = 'up',
  letterAnime = false,
  lineAnime   = false,
  threshold   = 0.2,
  delay       = 0,
}) {
  const Tag = as;
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('ta-visible');
        } else {
          el.classList.remove('ta-visible');
        }
      },
      // threshold=0 means fire immediately (used in sticky panel mode)
      { threshold, rootMargin: threshold === 0 ? '0px' : '0px 0px -5% 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  // ── Build render units ──────────────────────────────────────────────────
  // lineAnime  → single span wrapping all text
  // letterAnime → one span per character, spaces rendered as plain gaps
  // default    → one span per word, spaces handled by CSS gap

  if (lineAnime) {
    return (
      <Tag
        ref={ref}
        className={`text-animation ta-dir-${direction} ${className}`}
        aria-label={text}
      >
        <span
          className="ta-unit"
          aria-hidden="true"
          style={{ transitionDelay: `${delay}s` }}
        >
          {text}
        </span>
      </Tag>
    );
  }

  if (letterAnime) {
    // Split into words first, then letters — so we can preserve word spacing
    const words = text.split(' ');
    let letterIndex = 0;

    return (
      <Tag
        ref={ref}
        className={`text-animation ta-letter ta-dir-${direction} ${className}`}
        aria-label={text}
      >
        {words.map((word, wi) => (
          <span key={wi} className="ta-word" aria-hidden="true">
            {word.split('').map((char) => {
              const i = letterIndex++;
              // Cap stagger at 1.2s total to avoid over-long waits
              const staggerDelay = Math.min(i * 0.03, 1.2);
              return (
                <span
                  key={i}
                  className="ta-unit"
                  style={{ transitionDelay: `${delay + staggerDelay}s` }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
      </Tag>
    );
  }

  // Default: word-by-word
  const words = text.split(' ').filter(Boolean);
  return (
    <Tag
      ref={ref}
      className={`text-animation ta-word-mode ta-dir-${direction} ${className}`}
      aria-label={text}
    >
      {words.map((word, i) => {
        const staggerDelay = Math.min(i * 0.09, 0.9);
        return (
          <span
            key={i}
            className="ta-unit"
            aria-hidden="true"
            style={{ transitionDelay: `${delay + staggerDelay}s` }}
          >
            {word}
          </span>
        );
      })}
    </Tag>
  );
}