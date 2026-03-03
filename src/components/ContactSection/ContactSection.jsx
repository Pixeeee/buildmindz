import { useState, useEffect, useRef } from "react";
import "./ContactSection.css";

// ── Reveal hook ──────────────────────────────────────────────────────────────
function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Field ────────────────────────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="cs-field">
      <label className="cs-label">{label}</label>
      {children}
    </div>
  );
}

// ── Form ─────────────────────────────────────────────────────────────────────
function ContactForm() {
  const [form,   setForm  ] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
      setTimeout(() => setStatus("idle"), 3500);
    }, 1200);
  };
  return (
    <form onSubmit={submit} className="cs-form" noValidate>
      <Field label="Name">
        <input className="cs-input" name="name" value={form.name}
          onChange={set("name")} placeholder="Your name" required />
      </Field>
      <Field label="Email">
        <input className="cs-input" name="email" type="email" value={form.email}
          onChange={set("email")} placeholder="your@email.com" required />
      </Field>
      <Field label="Message">
        <textarea className="cs-input cs-textarea" name="message" rows={5}
          value={form.message} onChange={set("message")}
          placeholder="Tell us about your project…" required />
      </Field>
      <button
        className={"cs-btn" + (status === "sent" ? " cs-btn--sent" : "")}
        type="submit" disabled={status === "sending" || status === "sent"}
      >
        {status === "sending" && <span className="cs-btn-inner"><span className="cs-spinner" /> Sending…</span>}
        {status === "sent"    && <span className="cs-btn-inner"><span className="cs-check" /> Message received</span>}
        {status === "idle"    && <span className="cs-btn-inner">Send message <span className="cs-arrow">→</span></span>}
      </button>
    </form>
  );
}

// ── Accordion ────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "What kind of projects do you take on?",
    a: "We work across web platforms, digital products, brand systems, and custom-built tools. If it's ambitious and purposeful, we're interested."
  },
  {
    q: "How long does a typical project take?",
    a: "Scope varies — a focused MVP can land in 4–6 weeks; a full product build typically runs 2–4 months. We'll give you a clear timeline after our first call."
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Absolutely. We're comfortable working from a rough idea. We'll help you shape the brief, validate direction, and move into execution quickly."
  },
  {
    q: "What does your process look like?",
    a: "Discovery → Strategy → Design → Build → Launch. Each phase has clear deliverables and sign-off points. You're never left wondering where things stand."
  },
  {
    q: "How do we get started?",
    a: "Send us a message using the form. We'll get back within 24 hours to set up a short call, understand your goals, and see if we're a good fit."
  },
  {
    q: "Do you offer ongoing support after launch?",
    a: "Yes. Most clients stay with us post-launch for iteration, feature work, and maintenance. We build for the long run, not just the handoff."
  },
];

function AccordionItem({ q, a, open, onToggle, index }) {
  const panelRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (panelRef.current) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setHeight(open ? panelRef.current.scrollHeight : 0);
    }
  }, [open]);

  return (
    <div className={"cs-faq-item" + (open ? " cs-faq-item--open" : "")}>
      <button
        className="cs-faq-header"
        onClick={onToggle}
        aria-expanded={open}
      >
        <span className="cs-faq-num">0{index + 1}</span>
        <span className="cs-faq-q">{q}</span>
        <span className="cs-faq-icon" aria-hidden="true">
          <span className="cs-faq-icon-bar cs-faq-icon-bar--h" />
          <span className="cs-faq-icon-bar cs-faq-icon-bar--v" />
        </span>
      </button>
      <div
        className="cs-faq-panel"
        style={{ height }}
        aria-hidden={!open}
      >
        <div ref={panelRef} className="cs-faq-panel-inner">
          {a}
        </div>
      </div>
    </div>
  );
}

function Accordion() {
  const [openIndex, setOpenIndex] = useState(null);
  const col1 = FAQ.slice(0, 3);
  const col2 = FAQ.slice(3, 6);

  const toggle = (i) => setOpenIndex(prev => prev === i ? null : i);

  return (
    <div className="cs-faq-grid">
      <div className="cs-faq-col">
        {col1.map((item, i) => (
          <AccordionItem
            key={i} {...item} index={i}
            open={openIndex === i}
            onToggle={() => toggle(i)}
          />
        ))}
      </div>
      <div className="cs-faq-col">
        {col2.map((item, i) => (
          <AccordionItem
            key={i + 3} {...item} index={i + 3}
            open={openIndex === i + 3}
            onToggle={() => toggle(i + 3)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main section ─────────────────────────────────────────────────────────────
export default function ContactSection() {
  const [wrapRef, wrapVisible] = useReveal(0.1);
  const [infoRef, infoVisible] = useReveal(0.15);
  const [formRef, formVisible] = useReveal(0.15);
  const [faqRef,  faqVisible ] = useReveal(0.1);

  return (
    <section id="contact" className="cs-section">

      {/* ── Eyebrow ── */}
      <div ref={wrapRef} className={"cs-eyebrow-row" + (wrapVisible ? " cs-reveal" : "")}>
        <span className="cs-eyebrow-line" />
        <span className="cs-eyebrow-text">Get in touch</span>
        <span className="cs-eyebrow-line" />
      </div>

      {/* ── Headline ── */}
      <h2 className={"cs-headline" + (wrapVisible ? " cs-reveal" : "")}>
        Let's build<br />
        <em>something remarkable.</em>
      </h2>

      {/* ── Contact split ── */}
      <div className="cs-body">
        <aside ref={infoRef} className={"cs-info" + (infoVisible ? " cs-reveal" : "")}>
          <p className="cs-tagline">
            We turn ambitious ideas into precise, purposeful products.
            Drop us a line — we respond within 24 hours.
          </p>
          <ul className="cs-contact-list">
            <li className="cs-contact-item">
              <span className="cs-contact-label">Email</span>
              <a href="mailto:hello@buildmindz.com" className="cs-contact-value">hello@buildmindz.com</a>
            </li>
            <li className="cs-contact-item">
              <span className="cs-contact-label">Based in</span>
              <span className="cs-contact-value">Global · Remote‑first</span>
            </li>
            <li className="cs-contact-item">
              <span className="cs-contact-label">Availability</span>
              <span className="cs-contact-value cs-available">
                <span className="cs-pulse" aria-hidden="true" />
                Open to new projects
              </span>
            </li>
          </ul>
        </aside>

        <div ref={formRef} className={"cs-form-wrap" + (formVisible ? " cs-reveal" : "")}>
          <ContactForm />
        </div>
      </div>

      {/* ── FAQ divider ── */}
      <div ref={faqRef} className={"cs-faq-section" + (faqVisible ? " cs-reveal" : "")}>
        <div className="cs-faq-heading-row">
          <span className="cs-eyebrow-text">FAQ</span>
          <h3 className="cs-faq-heading">Common questions</h3>
        </div>
        <Accordion />
      </div>

    </section>
  );
}