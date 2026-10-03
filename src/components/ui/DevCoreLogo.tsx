type DevCoreLogoProps = {
  size?: number;
  className?: string;
};

export default function DevCoreLogo({
  size = 40,
  className,
}: DevCoreLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="DevCore"
      role="img"
    >
      <defs>
        <linearGradient
          id="devcore-gradient"
          x1="7"
          y1="5"
          x2="34"
          y2="36"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="var(--ds-accent-hover)" />
          <stop offset="0.5" stopColor="var(--ds-accent)" />
          <stop offset="1" stopColor="var(--ds-blue)" />
        </linearGradient>

        <radialGradient
          id="devcore-core"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(20 20) rotate(90) scale(8)"
        >
          <stop stopColor="white" />
          <stop offset="0.35" stopColor="var(--ds-accent-hover)" />
          <stop offset="1" stopColor="var(--ds-accent)" />
        </radialGradient>

        <filter
          id="devcore-glow"
          x="-100%"
          y="-100%"
          width="300%"
          height="300%"
        >
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="
              0 0 0 0 0.45
              0 0 0 0 0.35
              0 0 0 0 1
              0 0 0 0.35 0
            "
          />
        </filter>
      </defs>

      {/* Ambient core glow */}
      <circle
        cx="20"
        cy="20"
        r="7"
        fill="var(--ds-accent)"
        opacity="0.28"
        filter="url(#devcore-glow)"
      />

      {/* Outer structural ring */}
      <path
        d="M20 3.5L34.29 11.75V28.25L20 36.5L5.71 28.25V11.75L20 3.5Z"
        stroke="url(#devcore-gradient)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.7"
      />

      {/* Inner structural ring */}
      <path
        d="M20 9L29.5 14.5V25.5L20 31L10.5 25.5V14.5L20 9Z"
        stroke="url(#devcore-gradient)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.9"
      />

      {/* Connections */}
      <path
        d="M20 20L10.5 14.5"
        stroke="var(--ds-accent)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.65"
      />

      <path
        d="M20 20L29.5 14.5"
        stroke="var(--ds-accent)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.65"
      />

      <path
        d="M20 20L20 31"
        stroke="var(--ds-blue)"
        strokeWidth="1.25"
        strokeLinecap="round"
        opacity="0.65"
      />

      {/* Knowledge nodes */}
      <circle
        cx="10.5"
        cy="14.5"
        r="2"
        fill="var(--ds-background)"
        stroke="var(--ds-accent-hover)"
        strokeWidth="1.25"
      />

      <circle
        cx="29.5"
        cy="14.5"
        r="2"
        fill="var(--ds-background)"
        stroke="var(--ds-accent-hover)"
        strokeWidth="1.25"
      />

      <circle
        cx="20"
        cy="31"
        r="2"
        fill="var(--ds-background)"
        stroke="var(--ds-blue)"
        strokeWidth="1.25"
      />

      {/* Central core */}
      <circle
        cx="20"
        cy="20"
        r="4.5"
        fill="var(--ds-background)"
        stroke="url(#devcore-gradient)"
        strokeWidth="1.5"
      />

      <circle
        cx="20"
        cy="20"
        r="2.5"
        fill="url(#devcore-core)"
      />
    </svg>
  );
}