import type { Pack } from "@/content/schema";

/** Illustrations dessinées des packs (livre et plume, lauriers, trophée). */
export function PackIllustration({ id }: { id: Pack["id"] }) {
  if (id === "senghor")
    return (
      <svg width="88" height="88" viewBox="0 0 88 88" aria-label="Illustration : livre et plume" role="img">
        <circle cx="44" cy="44" r="42" fill="#E8EFFA" stroke="#001636" strokeWidth="2" />
        <path d="M18 58V30c9-4 18-4 26 2 8-6 17-6 26-2v28c-9-4-18-4-26 2-8-6-17-6-26-2z" fill="#fff" stroke="#001636" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M44 32v26" stroke="#001636" strokeWidth="2" />
        <path d="M24 38h12M24 44h12M52 38h12M52 44h10" stroke="#114DA8" strokeWidth="2" strokeLinecap="round" />
        <path d="M66 14c-10 6-16 16-18 26 6-4 12-6 16-12 3-4 3-9 2-14z" fill="#FFBD59" stroke="#001636" strokeWidth="2" strokeLinejoin="round" />
      </svg>
    );
  if (id === "ciceron")
    return (
      <svg width="88" height="88" viewBox="0 0 88 88" aria-label="Illustration : couronne de lauriers" role="img">
        <circle cx="44" cy="44" r="42" fill="#FFF3DC" stroke="#001636" strokeWidth="2" />
        <path d="M30 66C18 58 16 40 24 26M58 66c12-8 14-26 6-40" stroke="#001636" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <g fill="#FFBD59" stroke="#001636" strokeWidth="1.8">
          <ellipse cx="22" cy="34" rx="4" ry="8" transform="rotate(-20 22 34)" />
          <ellipse cx="20" cy="46" rx="4" ry="8" transform="rotate(-50 20 46)" />
          <ellipse cx="25" cy="57" rx="4" ry="8" transform="rotate(-70 25 57)" />
          <ellipse cx="66" cy="34" rx="4" ry="8" transform="rotate(20 66 34)" />
          <ellipse cx="68" cy="46" rx="4" ry="8" transform="rotate(50 68 46)" />
          <ellipse cx="63" cy="57" rx="4" ry="8" transform="rotate(70 63 57)" />
        </g>
        <path d="M38 66h12" stroke="#114DA8" strokeWidth="3" strokeLinecap="round" />
        <circle cx="44" cy="44" r="4" fill="#114DA8" />
      </svg>
    );
  return (
    <svg width="88" height="88" viewBox="0 0 88 88" aria-label="Illustration : trophée" role="img">
      <circle cx="44" cy="44" r="42" fill="#FFBD59" stroke="#001636" strokeWidth="2" />
      <path d="M30 20h28v14c0 10-6 16-14 16s-14-6-14-16z" fill="#fff" stroke="#001636" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M30 24h-8c0 8 4 12 9 12M58 24h8c0 8-4 12-9 12" stroke="#001636" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <path d="M44 50v8M34 66h20l-2-8H36z" fill="#114DA8" stroke="#001636" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M44 27l2 4 4 .6-3 3 .8 4.4-3.8-2-3.8 2 .8-4.4-3-3 4-.6z" fill="#FFBD59" />
    </svg>
  );
}
