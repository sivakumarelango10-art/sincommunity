import type { ReactNode, SVGProps } from "react";
import { SITE } from "../config/site";
import { useMagnetic } from "../motion/hooks";

/* ---------------------------------------------------------------- icons (stroke, currentColor) */
type IconProps = SVGProps<SVGSVGElement>;
const base = (p: IconProps) => ({
  viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2,
  strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true, ...p,
});
export const IconArrowUpRight = (p: IconProps) => (
  <svg {...base(p)} className={`icon icon-arrow ${p.className ?? ""}`}><path d="M7 17 17 7" /><path d="M8 7h9v9" /></svg>
);
export const IconArrowRight = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></svg>
);
export const IconArrowLeft = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M19 12H5" /><path d="m11 6-6 6 6 6" /></svg>
);
export const IconArrowUp = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></svg>
);
export const IconPlay = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M8 5.5v13l10.5-6.5z" fill="currentColor" stroke="none" /></svg>
);
export const IconPause = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M8 5v14M16 5v14" /></svg>
);
export const IconReplay = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
);
export const IconInstagram = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}>
    <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);
/* LinkedIn and GitHub outlines adapted from Feather Icons (MIT) */
export const IconLinkedIn = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
  </svg>
);
export const IconGitHub = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);
export const IconClose = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconPlus = (p: IconProps) => (
  <svg {...base(p)} className={`icon ${p.className ?? ""}`}><path d="M12 5v14M5 12h14" /></svg>
);

/* ---------------------------------------------------------------- logo */
export function Logo({ size = 44, className = "", alt = "", eager = false }: { size?: number; className?: string; alt?: string; eager?: boolean }) {
  return (
    <img
      className={`logo ${className}`}
      src="/images/brand/sinc-logo-256.webp"
      srcSet="/images/brand/sinc-logo-96.webp 96w, /images/brand/sinc-logo-256.webp 256w, /images/brand/sinc-logo-512.webp 512w"
      sizes={`${size}px`}
      width={size}
      height={size}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

/** Transparent version of the same supplied artwork, for use on blue backgrounds. */
export function LogoMark({ width = 160, className = "", alt = "", eager = false }: { width?: number; className?: string; alt?: string; eager?: boolean }) {
  return (
    <img
      className={`logo-mark ${className}`}
      src="/images/brand/sinc-mark-480.webp"
      srcSet="/images/brand/sinc-mark-160.webp 160w, /images/brand/sinc-mark-480.webp 480w, /images/brand/sinc-mark-900.webp 900w"
      sizes={`${width}px`}
      width={width}
      height={Math.round((width * 920) / 1052)}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

/* ---------------------------------------------------------------- actions */
export function JoinButton({ children = "Join SINC", variant = "primary", small = false, magnetic = true, className = "" }: {
  children?: ReactNode; variant?: "primary" | "white" | "ghost"; small?: boolean; magnetic?: boolean; className?: string;
}) {
  const ref = useMagnetic<HTMLAnchorElement>(magnetic ? 0.25 : 0);
  const cls = ["btn", variant === "white" && "btn-white", variant === "ghost" && "btn-ghost", small && "btn-small", className]
    .filter(Boolean).join(" ");
  return (
    <a ref={magnetic ? ref : undefined} className={cls} href={SITE.links.join} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      <IconArrowUpRight />
      <span className="sr-only">(opens the SINC platform in a new tab)</span>
    </a>
  );
}

export function LoginLink({ className = "text-link", children = "Log In" }: { className?: string; children?: ReactNode }) {
  return (
    <a className={className} href={SITE.links.login} target="_blank" rel="noopener noreferrer">
      {children}
      <span className="sr-only">(opens the SINC platform in a new tab)</span>
    </a>
  );
}
