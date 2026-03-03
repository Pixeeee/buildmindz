import { useEffect, useRef } from 'react';
import Threads from './Threads';
import TextAnimation from './TextAnimation';
import brain1 from '../../assets/images/brain1.png';
import brain2 from '../../assets/images/brain2.png';
import './ScrollTextSection.css';

function RevealImage({ src, alt, direction = 'up' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('ri-visible');
        } else {
          el.classList.remove('ri-visible');
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -5% 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={'st-brain-img ri-base ri-dir-' + direction}
    />
  );
}

export default function ScrollTextSection() {
  return (
    <section className="scroll-text-section" id="scroll-text">

      <div className="st-threads-bg" aria-hidden="true">
        <Threads color={[1, 1, 1]} amplitude={3} distance={0.2} enableMouseInteraction />
      </div>

      {/* Panel 1 — full-width headline */}
      <div className="st-panel st-panel--hero">
        <div className="st-panel-inner">
          <span className="st-label">01</span>
          <TextAnimation
            as="h2"
            text="Creative ideas start here."
            direction="up"
            className="st-headline"
          />
        </div>
      </div>

      {/* Divider */}
      <div className="st-divider" aria-hidden="true" />

      {/* Panel 2 — text LEFT + brain RIGHT */}
      <div className="st-panel st-panel--split">
        <div className="st-split-text st-split-text--left">
          <div className="st-text-group">
            <span className="st-label">02</span>
            <TextAnimation
              as="p"
              text="We use logic and strategy to execute with clinical precision"
              direction="up"
              letterAnime
              className="st-body"
            />
          </div>
        </div>
        <div className="st-split-image">
          <RevealImage src={brain2} alt="brain — logic and strategy" direction="right" />
        </div>
      </div>

      {/* Divider */}
      <div className="st-divider" aria-hidden="true" />

      {/* Panel 3 — brain LEFT + text RIGHT */}
      <div className="st-panel st-panel--split">
        <div className="st-split-image">
          <RevealImage src={brain1} alt="brain — architecture and design" direction="left" />
        </div>
        <div className="st-split-text st-split-text--right">
          <div className="st-text-group">
            <span className="st-label st-label--right">03</span>
            <TextAnimation
              as="h3"
              text="BuildMindz understands architecture and deep design concepts"
              direction="right"
              className="st-subhead"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="st-divider" aria-hidden="true" />

      {/* Panel 4 — closing statement */}
      <div className="st-panel st-panel--closing">
        <div className="st-panel-inner">
          <span className="st-label">04</span>
          <TextAnimation
            as="h3"
            text="WE BUILD MINDS, NOT JUST PRODUCTS"
            direction="up"
            lineAnime
            className="st-closing"
          />
        </div>
      </div>

    </section>
  );
}