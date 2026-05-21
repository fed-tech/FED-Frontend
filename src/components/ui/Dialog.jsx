import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styles from "./Dialog.module.scss";

const ANIMATION_MS = 180;

const getFocusableElements = (container) => {
  if (!container) return [];
  const selectors = [
    "a[href]",
    "area[href]",
    "button:not([disabled])",
    "input:not([disabled]):not([type='hidden'])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "iframe",
    "object",
    "embed",
    "[contenteditable='true']",
    "[tabindex]:not([tabindex='-1'])",
  ];
  return Array.from(container.querySelectorAll(selectors.join(","))).filter(
    (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
  );
};

const Dialog = ({
  open,
  defaultOpen = false,
  onOpenChange,
  closeOnBackdrop = true,
  closeOnEsc = true,
  size = "md",
  initialFocusRef,
  ariaLabel,
  ariaLabelledBy,
  ariaDescribedBy,
  role = "dialog",
  className = "",
  overlayClassName = "",
  contentClassName = "",
  contentStyle,
  children,
}) => {
  const isControlled = open !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? open : uncontrolledOpen;
  const [shouldRender, setShouldRender] = useState(isOpen);
  const contentRef = useRef(null);
  const lastActiveElementRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      return undefined;
    }
    const timer = setTimeout(() => setShouldRender(false), ANIMATION_MS);
    return () => clearTimeout(timer);
  }, [isOpen]);

  const requestClose = () => {
    if (!isControlled) {
      setUncontrolledOpen(false);
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return undefined;

    const body = document.body;
    const html = document.documentElement;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    body.classList.add("fed-modal-open");
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.classList.remove("fed-modal-open");
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    lastActiveElementRef.current = document.activeElement;
    const focusTarget =
      initialFocusRef?.current ||
      getFocusableElements(contentRef.current)[0] ||
      contentRef.current;

    if (focusTarget && focusTarget.focus) {
      focusTarget.focus();
    }

    return () => {
      if (
        lastActiveElementRef.current &&
        lastActiveElementRef.current.focus
      ) {
        lastActiveElementRef.current.focus();
      }
    };
  }, [isOpen, initialFocusRef]);

  useEffect(() => {
    if (!isOpen || !closeOnEsc) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        requestClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeOnEsc]);

  const handleKeyDown = (event) => {
    if (event.key !== "Tab") return;

    const focusable = getFocusableElements(contentRef.current);
    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey) {
      if (active === first || active === contentRef.current) {
        event.preventDefault();
        last.focus();
      }
    } else if (active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const portalTarget = useMemo(() => {
    if (typeof document === "undefined") return null;
    return document.body;
  }, []);

  if (!shouldRender || !portalTarget) return null;

  return createPortal(
    <div
      className={`${styles.dialogRoot} ${className}`.trim()}
      data-state={isOpen ? "open" : "closed"}
      data-size={size}
      role={role}
      aria-modal="true"
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      onKeyDown={handleKeyDown}
    >
      <div
        className={`${styles.dialogOverlay} ${overlayClassName}`.trim()}
        onMouseDown={(event) => {
          if (!closeOnBackdrop) return;
          if (event.target === event.currentTarget) {
            requestClose();
          }
        }}
      />
      <div
        className={`${styles.dialogContent} ${contentClassName}`.trim()}
        style={contentStyle}
        ref={contentRef}
        tabIndex={-1}
      >
        {children}
      </div>
    </div>,
    portalTarget
  );
};

export default Dialog;
