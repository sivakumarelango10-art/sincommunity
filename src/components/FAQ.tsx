import { useRef, useState } from "react";
import { FAQS } from "../data/content";
import { useSectionReveal } from "../motion/hooks";
import "./FAQ.css";

export function FAQ() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<Set<string>>(() => new Set([FAQS[0].id]));
  useSectionReveal(root, []);
  const toggle = (id: string) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  return (
    <section className="faq section" id="faq" ref={root} aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div className="faq__head">
          <p className="eyebrow" data-reveal>FAQ</p>
          <h2 id="faq-title" className="heading-xl" data-reveal>Questions, answered.</h2>
        </div>
        <ul className="faq__list">
          {FAQS.map((f) => {
            const isOpen = open.has(f.id);
            return (
              <li key={f.id} className={`faq__item${isOpen ? " is-open" : ""}`} data-reveal>
                <h3 className="faq__q">
                  <button type="button" id={`faq-btn-${f.id}`} aria-expanded={isOpen} aria-controls={`faq-panel-${f.id}`} onClick={() => toggle(f.id)}>
                    <span>{f.q}</span>
                    <span className="faq__icon" aria-hidden="true"><i /><i /></span>
                    <span className="sr-only">{isOpen ? "(expanded)" : ""}</span>
                  </button>
                </h3>
                <div className="faq__panel" id={`faq-panel-${f.id}`} role="region" aria-labelledby={`faq-btn-${f.id}`} inert={!isOpen || undefined}>
                  <div><p>{f.a}</p></div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
