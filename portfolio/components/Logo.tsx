export default function Logo() {
  return (
    <>
      <svg
        class="site-logo__mark site-logo__mark--stacked"
        viewBox="0 0 64 64"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="60"
          height="60"
          rx="6"
          fill="none"
          stroke="currentColor"
          stroke-width="4"
        />
        <text
          x="32"
          y="29"
          fill="currentColor"
          font-family="system-ui, sans-serif"
          font-size="17"
          font-weight="700"
          letter-spacing="2"
          text-anchor="middle"
        >
          SV
        </text>
        <text
          x="32"
          y="47"
          fill="currentColor"
          font-family="system-ui, sans-serif"
          font-size="17"
          font-weight="700"
          letter-spacing="2"
          text-anchor="middle"
        >
          JX
        </text>
      </svg>
      <svg
        class="site-logo__mark site-logo__mark--inline"
        viewBox="0 0 96 48"
        aria-hidden="true"
      >
        <rect
          x="2"
          y="2"
          width="92"
          height="44"
          rx="4"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        />
        <text
          x="48"
          y="30"
          fill="currentColor"
          font-family="Inter, system-ui, sans-serif"
          font-size="18"
          font-weight="400"
          letter-spacing="3"
          text-anchor="middle"
        >
          SVJX
        </text>
      </svg>
    </>
  );
}
