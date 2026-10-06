/**
 * Emblème de marque : micro à main stylisé, cerclé d'un anneau doré.
 * Tracé vectoriel maison — aucune dépendance, aucun emoji.
 */
export function MicEmblem({ className = "" }: { className?: string }) {
  return (
    <div className={`relative aspect-square w-full max-w-[420px] ${className}`}>
      <div
        aria-hidden
        className="absolute inset-[14%] rounded-full bg-royal/45 blur-[75px]"
      />

      <svg
        viewBox="0 0 400 400"
        fill="none"
        role="img"
        aria-label="Micro, emblème de Lieben Éloquence"
        className="floaty relative h-full w-full"
      >
        <defs>
          <linearGradient id="leq-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FFD08A" />
            <stop offset="52%" stopColor="#FFBD59" />
            <stop offset="100%" stopColor="#FF5E01" />
          </linearGradient>
          <radialGradient id="leq-head" cx="0.34" cy="0.28" r="0.9">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#CBD6E7" />
            <stop offset="100%" stopColor="#5B6B8B" />
          </radialGradient>
          <linearGradient id="leq-collar" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0F4FA" />
            <stop offset="100%" stopColor="#8093B2" />
          </linearGradient>
          <linearGradient id="leq-grip" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#DDE5F1" />
            <stop offset="42%" stopColor="#A7B6CE" />
            <stop offset="100%" stopColor="#6A7B99" />
          </linearGradient>
        </defs>

        {/* anneau ouvert */}
        <path
          d="M316 132a134 134 0 1 1-110-58"
          stroke="url(#leq-ring)"
          strokeWidth="18"
          strokeLinecap="round"
        />
        <circle
          cx="200"
          cy="200"
          r="160"
          stroke="#FFBD59"
          strokeOpacity="0.2"
          strokeWidth="1.5"
          strokeDasharray="3 11"
        />

        {/* micro incliné */}
        <g transform="rotate(-30 200 205)">
          {/* manche */}
          <path
            d="M182 226h36v96a18 18 0 0 1-18 18 18 18 0 0 1-18-18v-96Z"
            fill="url(#leq-grip)"
          />
          {/* embout */}
          <path
            d="M182 316h36v6a18 18 0 0 1-18 18 18 18 0 0 1-18-18v-6Z"
            fill="#4D1D09"
          />
          {/* collier */}
          <rect
            x="172"
            y="206"
            width="56"
            height="22"
            rx="10"
            fill="url(#leq-collar)"
          />
          <rect x="176" y="212" width="48" height="4" rx="2" fill="#5B6B8B" opacity="0.5" />

          {/* tête sphérique */}
          <circle cx="200" cy="150" r="60" fill="url(#leq-head)" />
          {/* grille : arcs verticaux + lignes horizontales */}
          <g stroke="#3F4E6B" strokeOpacity="0.34" strokeWidth="1.7" fill="none">
            <path d="M160 132h80M154 150h92M160 168h80M172 186h56M172 114h56" />
            <path d="M200 90v120M176 94v112M224 94v112M156 112v76M244 112v76" />
          </g>
          {/* reflet */}
          <ellipse
            cx="181"
            cy="130"
            rx="17"
            ry="12"
            fill="#FFFFFF"
            opacity="0.5"
            transform="rotate(-28 181 130)"
          />
        </g>

        {/* étincelle d'accent */}
        <path
          d="M112 256c15-4 23-13 27-28 4 15 12 24 27 28-15 4-23 13-27 28-4-15-12-24-27-28Z"
          fill="url(#leq-ring)"
        />
      </svg>
    </div>
  );
}
