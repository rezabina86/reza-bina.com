import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DeviceFrame from './DeviceFrame';
import type { CaseStudy } from '../data/caseStudy';

/**
 * CaseStudyModal (HANDOFF §7.3) — the ONE React/Framer-Motion island.
 *
 * Progressive enhancement: on mount it intercepts clicks on `triggerSelector`
 * (the featured card's link → /work/zumnum) and opens the modal instead. With
 * JS off, or before hydration, the link just navigates to the real route, whose
 * content mirrors this modal. Modifier/middle clicks are left to the browser.
 *
 * A11y: role="dialog" + aria-modal, labelled title, focus moved in on open and
 * restored to the trigger on close, focus trap on Tab, Esc + scrim-click close,
 * background scroll locked while open.
 */

export interface CaseStudyModalProps {
  triggerSelector: string;
  /** The case study to render — same data the /work/<slug> route uses. */
  study: CaseStudy;
}

export default function CaseStudyModal({ triggerSelector, study }: CaseStudyModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const reduced = useReducedMotion();

  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const openedOnce = useRef(false);

  const close = useCallback(() => setOpen(false), []);
  const titleId = `cs-title-${study.slug}`;

  // Portal only after client mount (avoids SSR/hydration issues).
  useEffect(() => setMounted(true), []);

  // Intercept the trigger link.
  useEffect(() => {
    const trigger = document.querySelector<HTMLElement>(triggerSelector);
    if (!trigger) return;
    const onClick = (e: MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      e.preventDefault();
      triggerRef.current = trigger;
      setOpen(true);
    };
    trigger.addEventListener('click', onClick);
    return () => trigger.removeEventListener('click', onClick);
  }, [triggerSelector]);

  // Scroll lock + Esc + focus trap while open.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into the dialog.
    const raf = requestAnimationFrame(() => closeRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), video, [tabindex]:not([tabindex="-1"])'
        )
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // Restore focus to the trigger after closing.
  useEffect(() => {
    if (open) openedOnce.current = true;
    else if (openedOnce.current) triggerRef.current?.focus();
  }, [open]);

  if (!mounted) return null;

  const scrimTransition = reduced ? { duration: 0 } : { duration: 0.2 };
  const panelInitial = reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 14 };
  const panelAnimate = reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 };
  const panelExit = reduced ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: 10 };
  const panelTransition = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 300, damping: 30 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-scrim"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={scrimTransition}
          onClick={close}
        >
          <motion.div
            className="modal-panel glass"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            ref={panelRef}
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={panelTransition}
            onClick={(e) => e.stopPropagation()}
          >
            <button ref={closeRef} type="button" className="modal-close" onClick={close} aria-label="Close">
              <span aria-hidden="true">✕</span>
            </button>

            {/* Scroll lives on an inner wrapper, not the rounded panel, so the
                scrollbar is clipped to the rounded frame instead of poking past
                the corners — and the close button (a direct child of the panel)
                stays fixed while this scrolls. */}
            <div className="modal-scroll">
              <div className="modal-media">
                <DeviceFrame
                  video={study.video}
                  image={study.shots?.[0]}
                  active={open}
                  label={`${study.name} preview`}
                  appName={study.name}
                />
              </div>

              <div className="modal-body">
                <p className="eyebrow-sm">Case study</p>
                <h2 id={titleId} className="modal-title">
                  {study.name} <span className="modal-tagline">— {study.tagline}</span>
                </h2>
                <p className="modal-summary">{study.summary}</p>

                <ul className="feature-list">
                  {study.features.map((f) => (
                    <li key={f.title}>
                      <strong>{f.title}</strong>
                      <span>{f.body}</span>
                    </li>
                  ))}
                </ul>

                <div className="badges" aria-label="Built with">
                  {study.badges.map((b) => (
                    <span className="badge" key={b}>
                      {b}
                    </span>
                  ))}
                  <span className="badge">{study.platform}</span>
                </div>

                <div className="modal-cta">
                  {study.appStoreUrl ? (
                    <a className="btn primary" href={study.appStoreUrl} target="_blank" rel="noopener">
                      View on the App Store ↗
                    </a>
                  ) : (
                    /* Unreleased: state it plainly rather than linking nowhere. */
                    <span className="badge badge--status">In development · not yet released</span>
                  )}
                  <a className="link-quiet" href={`/work/${study.slug}`}>
                    Open full page →
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
