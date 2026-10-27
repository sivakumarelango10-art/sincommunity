import type { Leader } from "../data/leadership";
import { focusClass } from "../data/team";

/**
 * A leader's photo on their own profile page. The files are named for the person and role
 * (e.g. karmjit-sg-co-founder-sinc.jpg) and appear on no other page, so search engines tie the
 * image to the page that names the person. WebP for browsers, the JPEG as the img src (the same
 * URL as the page's social preview and structured data), and a visible caption.
 */
export function LeaderPhoto({ leader }: { leader: Leader }) {
  const m = leader.member;
  const [w, h] = leader.photoSize;
  const base = `/images/team/${leader.photo}`;
  const webp = w > 480 ? `${base}-480.webp 480w, ${base}-800.webp ${w}w` : `${base}-800.webp ${w}w`;
  return (
    <figure className="leader-photo">
      <div className="founder-hero__photo" data-reveal="mask">
        <picture>
          <source type="image/webp" srcSet={webp} sizes="(min-width: 900px) 40vw, 90vw" />
          <img src={`${base}.jpg`} width={w} height={h} alt={`${m.name}, ${m.role} of SINC`}
            className={focusClass(m)} fetchPriority="high" decoding="async" />
        </picture>
      </div>
      <figcaption className="leader-photo__caption" data-reveal>{`${m.name}, ${m.role} of SINC`}</figcaption>
    </figure>
  );
}
