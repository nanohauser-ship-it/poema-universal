type PoetAvatarProps = {
  index: number;
  name?: string;
  size?: number;
  preset?: "default" | "jacobo-blanco";
};

const palettes = [
  {
    background: "#ead9be",
    halo: "#c69a61",
    clothes: "#5e4737",
    accent: "#a45d45",
  },
  {
    background: "#dfe2d5",
    halo: "#80927a",
    clothes: "#3f5148",
    accent: "#b06d4f",
  },
  {
    background: "#e3d6d5",
    halo: "#9a7776",
    clothes: "#563e49",
    accent: "#b8815c",
  },
  {
    background: "#d8dde2",
    halo: "#7b8d9f",
    clothes: "#364654",
    accent: "#b88d57",
  },
  {
    background: "#ebe0ca",
    halo: "#ab8d55",
    clothes: "#604f32",
    accent: "#8c5d45",
  },
  {
    background: "#ded7e5",
    halo: "#8d7a9b",
    clothes: "#4f435b",
    accent: "#b47767",
  },
  {
    background: "#d7e0dc",
    halo: "#6f9189",
    clothes: "#37514c",
    accent: "#b7784d",
  },
  {
    background: "#e7d4c6",
    halo: "#b77b5d",
    clothes: "#634437",
    accent: "#8b5863",
  },
  {
    background: "#d8d8cc",
    halo: "#8d8b67",
    clothes: "#51513d",
    accent: "#a8664a",
  },
  {
    background: "#e2d5c3",
    halo: "#9b7353",
    clothes: "#4d4038",
    accent: "#b45d50",
  },
  {
    background: "#d5dce3",
    halo: "#688092",
    clothes: "#384853",
    accent: "#9f684d",
  },
  {
    background: "#e5d7da",
    halo: "#a16f7a",
    clothes: "#57404a",
    accent: "#a7794e",
  },
];

const skinTones = [
  "#f0c7a5",
  "#e4b58f",
  "#d69870",
  "#bd7957",
  "#925c43",
  "#684333",
  "#f1cbb3",
  "#c98968",
];

const hairColors = [
  "#2c211c",
  "#4a3024",
  "#6a4933",
  "#9c754e",
  "#b8a18a",
  "#d7d0c6",
  "#733f31",
  "#1f252a",
];

const eyeColors = [
  "#342b26",
  "#4a392d",
  "#53635d",
  "#485f72",
];

function Flower({
  color,
}: {
  color: string;
}) {
  return (
    <g transform="translate(82 33)">
      {[0, 72, 144, 216, 288].map(
        (rotation) => (
          <ellipse
            key={rotation}
            cx="0"
            cy="-5"
            rx="3"
            ry="5"
            fill={color}
            transform={`rotate(${rotation})`}
          />
        )
      )}

      <circle
        r="2.2"
        fill="#e6c267"
      />
    </g>
  );
}

function Glasses() {
  return (
    <g
      fill="none"
      stroke="#2e2825"
      strokeWidth="1.8"
      opacity="0.82"
    >
      <circle
        cx="42"
        cy="51"
        r="8"
      />

      <circle
        cx="62"
        cy="51"
        r="8"
      />

      <path d="M50 51h4" />
      <path d="M34 49l-6-2" />
      <path d="M70 49l6-2" />
    </g>
  );
}

function RectangularGlasses() {
  return (
    <g
      fill="rgba(255,255,255,0.12)"
      stroke="#342c28"
      strokeWidth="1.5"
      opacity="0.85"
    >
      <rect
        x="33"
        y="44"
        width="17"
        height="13"
        rx="5"
      />

      <rect
        x="54"
        y="44"
        width="17"
        height="13"
        rx="5"
      />

      <path d="M50 49h4" />
    </g>
  );
}

function PhilosophicalGlasses() {
  return (
    <g
      fill="rgba(255,255,255,0.07)"
      stroke="#493a2e"
      strokeWidth="1.25"
      opacity="0.92"
    >
      <circle
        cx="41"
        cy="50"
        r="7.6"
      />

      <circle
        cx="63"
        cy="50"
        r="7.6"
      />

      <path d="M48.6 50h6.8" />
      <path d="M33.5 48.5 28 46" />
      <path d="M70.5 48.5 76 46" />
    </g>
  );
}

function Beret({
  color,
}: {
  color: string;
}) {
  return (
    <g>
      <ellipse
        cx="52"
        cy="28"
        rx="25"
        ry="9"
        fill={color}
        transform="rotate(-7 52 28)"
      />

      <path
        d="M48 22c1-5 6-6 9-2"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </g>
  );
}

function Pencil({
  color,
}: {
  color: string;
}) {
  return (
    <g transform="translate(80 70) rotate(-24)">
      <rect
        x="-2"
        y="-12"
        width="4"
        height="25"
        rx="1"
        fill={color}
      />

      <path
        d="M-2-12 0-17 2-12Z"
        fill="#32251d"
      />

      <rect
        x="-2"
        y="9"
        width="4"
        height="4"
        fill="#d49a91"
      />
    </g>
  );
}

function TinyBook({
  color,
}: {
  color: string;
}) {
  return (
    <g transform="translate(17 70) rotate(10)">
      <path
        d="M0 0c8-3 14-1 18 3v18c-4-4-10-6-18-3Z"
        fill={color}
      />

      <path
        d="M36 0c-8-3-14-1-18 3v18c4-4 10-6 18-3Z"
        fill={color}
        opacity="0.82"
      />

      <path
        d="M18 3v18"
        stroke="#f2e8d8"
        strokeWidth="1"
      />
    </g>
  );
}

function Feather({
  color,
}: {
  color: string;
}) {
  return (
    <g
      transform="translate(84 61) rotate(20)"
      fill="none"
      stroke={color}
      strokeLinecap="round"
    >
      <path
        d="M0 16C10 8 12-4 5-15C-2-6-4 6 0 16Z"
        fill={color}
      />

      <path
        d="M1 14 6-11"
        stroke="#f4eadc"
        strokeWidth="1"
      />
    </g>
  );
}

function JacoboBook({
  color,
}: {
  color: string;
}) {
  return (
    <g transform="translate(52 83)">
      <path
        d="M-17 0c7-4 13-3 17 1v13c-5-3-10-4-17-1Z"
        fill={color}
      />

      <path
        d="M17 0c-7-4-13-3-17 1v13c5-3 10-4 17-1Z"
        fill={color}
        opacity="0.78"
      />

      <path
        d="M0 1v13"
        fill="none"
        stroke="#f3eadc"
        strokeWidth="1"
        opacity="0.75"
      />

      <path
        d="M-13 4h9M-13 7h8M4 4h9M4 7h8"
        fill="none"
        stroke="#f3eadc"
        strokeWidth="0.65"
        opacity="0.45"
      />
    </g>
  );
}

export default function PoetAvatar({
  index,
  name = "Voz por llegar",
  size = 96,
  preset = "default",
}: PoetAvatarProps) {
  const seed =
    ((index % 60) + 60) % 60;

  const isJacobo =
    preset === "jacobo-blanco";

  const palette = isJacobo
    ? {
        background: "#eee5d8",
        halo: "#b89a6a",
        clothes: "#453d37",
        accent: "#9b784d",
      }
    : palettes[
        seed % palettes.length
      ];

  const skin = isJacobo
    ? "#deb891"
    : skinTones[
        (seed * 3 + 1) %
          skinTones.length
      ];

  const hair = isJacobo
    ? "#56463a"
    : hairColors[
        (seed * 5 + 2) %
          hairColors.length
      ];

  const eyes = isJacobo
    ? "#423a34"
    : eyeColors[
        (seed * 7 + 1) %
          eyeColors.length
      ];

  const hairStyle = isJacobo
    ? -1
    : seed % 8;

  const accessory = isJacobo
    ? -1
    : seed % 12;

  const mouthStyle = isJacobo
    ? 0
    : seed % 5;

  const eyebrowStyle = isJacobo
    ? 2
    : seed % 4;

  const faceShape = isJacobo
    ? 2
    : seed % 3;

  const faceRx =
    faceShape === 0
      ? 22
      : faceShape === 1
        ? 20
        : 24;

  const faceRy =
    faceShape === 0
      ? 27
      : faceShape === 1
        ? 25
        : 29;

  const leftEyeY = isJacobo
    ? 50
    : 50 + (seed % 2);

  const rightEyeY = isJacobo
    ? 50
    : 50 + ((seed + 1) % 2);

  const eyeClosed = isJacobo
    ? false
    : seed % 11 === 0;

  const hasFreckles = isJacobo
    ? false
    : seed % 4 === 0;

  const hasBlush = isJacobo
    ? true
    : seed % 3 === 0;

  const title = `${String(
    index + 1
  ).padStart(2, "0")} · ${name}`;

  return (
    <svg
      role="img"
      aria-label={`Avatar de ${name}`}
      viewBox="0 0 104 104"
      width={size}
      height={size}
      className="block overflow-visible"
    >
      <title>{title}</title>

      <defs>
        <clipPath
          id={`poet-avatar-${seed}-${preset}`}
        >
          <circle
            cx="52"
            cy="52"
            r="50"
          />
        </clipPath>

        <linearGradient
          id={`poet-background-${seed}-${preset}`}
          x1="0"
          y1="0"
          x2="1"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={
              palette.background
            }
          />

          <stop
            offset="100%"
            stopColor={
              palette.halo
            }
            stopOpacity="0.48"
          />
        </linearGradient>

        {isJacobo && (
          <radialGradient
            id="jacobo-halo"
            cx="50%"
            cy="38%"
            r="55%"
          >
            <stop
              offset="0%"
              stopColor="#fff8e9"
              stopOpacity="0.8"
            />

            <stop
              offset="50%"
              stopColor="#c7a66e"
              stopOpacity="0.22"
            />

            <stop
              offset="100%"
              stopColor="#c7a66e"
              stopOpacity="0"
            />
          </radialGradient>
        )}
      </defs>

      <g
        clipPath={`url(#poet-avatar-${seed}-${preset})`}
      >
        <circle
          cx="52"
          cy="52"
          r="50"
          fill={`url(#poet-background-${seed}-${preset})`}
        />

        {isJacobo ? (
          <>
            <circle
              cx="52"
              cy="39"
              r="42"
              fill="url(#jacobo-halo)"
            />

            <circle
              cx="52"
              cy="38"
              r="30"
              fill="none"
              stroke={palette.halo}
              strokeWidth="1"
              opacity="0.2"
            />

            <circle
              cx="52"
              cy="38"
              r="36"
              fill="none"
              stroke={palette.halo}
              strokeWidth="0.6"
              opacity="0.12"
            />

            <path
              d="M17 88c10-7 22-10 35-10s25 3 35 10"
              fill="none"
              stroke={palette.halo}
              strokeWidth="1.3"
              opacity="0.26"
              strokeLinecap="round"
            />
          </>
        ) : (
          <circle
            cx={
              22 +
              (seed % 4) * 19
            }
            cy={
              21 +
              ((seed * 3) % 4) *
                17
            }
            r={
              12 +
              (seed % 3) * 3
            }
            fill={palette.halo}
            opacity="0.13"
          />
        )}

        <path
          d={
            isJacobo
              ? "M7 108C13 79 30 70 52 70C75 70 92 79 98 108Z"
              : "M10 105C15 77 30 71 52 71C75 71 91 78 96 105Z"
          }
          fill={palette.clothes}
        />

        {isJacobo && (
          <>
            <path
              d="M29 79c8 4 15 6 23 6s15-2 23-6"
              fill="none"
              stroke="#c6a46e"
              strokeWidth="1.5"
              opacity="0.5"
            />

            <path
              d="M42 72 52 84 62 72"
              fill="#eee1cf"
              opacity="0.9"
            />

            <path
              d="M42 72 52 84 62 72"
              fill="none"
              stroke="#b89663"
              strokeWidth="0.9"
              opacity="0.5"
            />
          </>
        )}

        {!isJacobo &&
          seed % 3 === 0 && (
            <path
              d="M43 73 52 87 61 73"
              fill="none"
              stroke="#f2e7d8"
              strokeWidth="2.4"
              opacity="0.72"
            />
          )}

        {!isJacobo &&
          seed % 3 === 1 && (
            <path
              d="M33 83c11 6 27 6 38 0"
              fill="none"
              stroke={
                palette.accent
              }
              strokeWidth="3"
              strokeLinecap="round"
            />
          )}

        {!isJacobo &&
          seed % 3 === 2 && (
            <circle
              cx="52"
              cy="83"
              r="4"
              fill={
                palette.accent
              }
              opacity="0.9"
            />
          )}

        <rect
          x="45"
          y="65"
          width="14"
          height="14"
          rx="6"
          fill={skin}
        />

        {hairStyle === 0 && (
          <path
            d="M27 49C25 27 37 16 52 16C72 16 81 31 76 54C72 40 67 33 55 31C43 29 34 34 27 49Z"
            fill={hair}
          />
        )}

        {hairStyle === 1 && (
          <>
            <circle
              cx="30"
              cy="40"
              r="13"
              fill={hair}
            />

            <circle
              cx="74"
              cy="40"
              r="13"
              fill={hair}
            />

            <circle
              cx="39"
              cy="25"
              r="13"
              fill={hair}
            />

            <circle
              cx="62"
              cy="24"
              r="14"
              fill={hair}
            />
          </>
        )}

        {hairStyle === 2 && (
          <>
            <path
              d="M28 48C25 25 40 17 55 18C73 19 80 33 75 54C66 36 52 29 28 48Z"
              fill={hair}
            />

            <circle
              cx="71"
              cy="23"
              r="9"
              fill={hair}
            />
          </>
        )}

        {hairStyle === 3 && (
          <path
            d="M27 50C27 25 42 17 54 17C70 17 79 31 76 58L68 47L66 26L56 36L45 24L36 43Z"
            fill={hair}
          />
        )}

        {hairStyle === 4 && (
          <>
            <path
              d="M28 51C27 28 39 18 53 18C70 18 80 31 76 52C67 35 44 30 28 51Z"
              fill={hair}
            />

            <path
              d="M30 43C19 52 22 70 32 76"
              fill="none"
              stroke={hair}
              strokeWidth="8"
              strokeLinecap="round"
            />

            <path
              d="M74 43C85 52 82 70 72 76"
              fill="none"
              stroke={hair}
              strokeWidth="8"
              strokeLinecap="round"
            />
          </>
        )}

        {hairStyle === 5 && (
          <>
            <path
              d="M29 48C25 29 39 17 53 18C68 18 80 29 75 51C63 37 43 35 29 48Z"
              fill={hair}
            />

            <path
              d="M34 27 28 16M46 21 44 9M59 21 64 9M70 28 79 17"
              stroke={hair}
              strokeWidth="5"
              strokeLinecap="round"
            />
          </>
        )}

        {hairStyle === 6 && (
          <>
            <path
              d="M28 49C28 30 39 18 54 18C69 18 79 31 76 50C65 37 42 34 28 49Z"
              fill={hair}
            />

            <path
              d="M27 45C19 57 23 72 31 77M76 45C84 57 81 72 73 77"
              fill="none"
              stroke={hair}
              strokeWidth="5"
              strokeDasharray="2 4"
              strokeLinecap="round"
            />
          </>
        )}

        {hairStyle === 7 && (
          <>
            <path
              d="M27 49C25 28 38 17 54 18C70 18 79 32 75 51C63 34 42 34 27 49Z"
              fill={hair}
            />

            <path
              d="M34 24C38 14 44 11 49 16M50 19C55 7 62 9 65 18M64 23C71 13 77 18 74 27"
              fill="none"
              stroke={hair}
              strokeWidth="7"
              strokeLinecap="round"
            />
          </>
        )}

        <ellipse
          cx="52"
          cy={isJacobo ? 48 : 49}
          rx={
            isJacobo
              ? 23
              : faceRx
          }
          ry={
            isJacobo
              ? 28
              : faceRy
          }
          fill={skin}
        />

        {isJacobo && (
          <>
            <path
              d="M32 40c3-15 11-23 20-23 10 0 18 8 21 23"
              fill="none"
              stroke="#fff9ee"
              strokeWidth="2"
              opacity="0.18"
              strokeLinecap="round"
            />

            <path
              d="M38 26c4-3 9-5 14-5 6 0 11 2 15 6"
              fill="none"
              stroke="#8e6d50"
              strokeWidth="1"
              opacity="0.17"
              strokeLinecap="round"
            />

            <path
              d="M30 44c1-7 2-11 5-15M74 44c-1-7-2-11-5-15"
              fill="none"
              stroke={hair}
              strokeWidth="2"
              opacity="0.32"
              strokeLinecap="round"
            />
          </>
        )}

        <ellipse
          cx="30"
          cy="52"
          rx="3"
          ry="6"
          fill={skin}
        />

        <ellipse
          cx="74"
          cy="52"
          rx="3"
          ry="6"
          fill={skin}
        />

        {hasBlush && (
          <>
            <ellipse
              cx="37"
              cy="59"
              rx="5"
              ry="2.5"
              fill={
                palette.accent
              }
              opacity={
                isJacobo
                  ? 0.1
                  : 0.18
              }
            />

            <ellipse
              cx="67"
              cy="59"
              rx="5"
              ry="2.5"
              fill={
                palette.accent
              }
              opacity={
                isJacobo
                  ? 0.1
                  : 0.18
              }
            />
          </>
        )}

        {eyebrowStyle === 0 && (
          <>
            <path
              d="M35 43c4-2 8-2 11 0"
              stroke={hair}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M58 43c4-2 8-2 11 0"
              stroke={hair}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )}

        {eyebrowStyle === 1 && (
          <>
            <path
              d="M35 43c4-3 8-2 11 1"
              stroke={hair}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M58 44c3-3 7-4 11-1"
              stroke={hair}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )}

        {eyebrowStyle === 2 && (
          <>
            <path
              d={
                isJacobo
                  ? "M35 43c4 1 8 1 11-1"
                  : "M35 42c4 2 8 2 11 0"
              }
              stroke={hair}
              strokeWidth={
                isJacobo
                  ? 1.5
                  : 1.8
              }
              strokeLinecap="round"
              opacity={
                isJacobo
                  ? 0.72
                  : 1
              }
            />

            <path
              d={
                isJacobo
                  ? "M58 42c3 2 7 2 11 1"
                  : "M58 42c4 2 8 2 11 0"
              }
              stroke={hair}
              strokeWidth={
                isJacobo
                  ? 1.5
                  : 1.8
              }
              strokeLinecap="round"
              opacity={
                isJacobo
                  ? 0.72
                  : 1
              }
            />
          </>
        )}

        {eyebrowStyle === 3 && (
          <>
            <path
              d="M35 44h11"
              stroke={hair}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M58 44h11"
              stroke={hair}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        )}

        {eyeClosed ? (
          <>
            <path
              d="M36 51c3 3 7 3 10 0"
              fill="none"
              stroke={eyes}
              strokeWidth="1.8"
              strokeLinecap="round"
            />

            <path
              d="M58 51c3 3 7 3 10 0"
              fill="none"
              stroke={eyes}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <ellipse
              cx="41"
              cy={leftEyeY}
              rx={
                isJacobo
                  ? 1.85
                  : 2.1
              }
              ry={
                isJacobo
                  ? 2.45
                  : 2.8
              }
              fill={eyes}
            />

            <ellipse
              cx="63"
              cy={rightEyeY}
              rx={
                isJacobo
                  ? 1.85
                  : 2.1
              }
              ry={
                isJacobo
                  ? 2.45
                  : 2.8
              }
              fill={eyes}
            />

            <circle
              cx="41.6"
              cy={
                leftEyeY - 0.7
              }
              r="0.6"
              fill="white"
            />

            <circle
              cx="63.6"
              cy={
                rightEyeY - 0.7
              }
              r="0.6"
              fill="white"
            />
          </>
        )}

        <path
          d={
            isJacobo
              ? "M52 51c-1 4-2 7 1 9"
              : seed % 2 === 0
                ? "M52 51c-2 5-3 8 1 9"
                : "M52 51c2 5 3 8-1 9"
          }
          fill="none"
          stroke="#704d3a"
          strokeWidth={
            isJacobo
              ? 1
              : 1.2
          }
          strokeLinecap="round"
          opacity="0.52"
        />

        {hasFreckles && (
          <g
            fill="#744f3b"
            opacity="0.34"
          >
            <circle
              cx="37"
              cy="56"
              r="0.8"
            />

            <circle
              cx="40"
              cy="58"
              r="0.7"
            />

            <circle
              cx="43"
              cy="56"
              r="0.7"
            />

            <circle
              cx="61"
              cy="56"
              r="0.7"
            />

            <circle
              cx="64"
              cy="58"
              r="0.7"
            />

            <circle
              cx="67"
              cy="56"
              r="0.8"
            />
          </g>
        )}

        {mouthStyle === 0 && (
          <path
            d={
              isJacobo
                ? "M46 64c4 2.5 8 2.5 12 0"
                : "M45 64c4 4 10 4 14 0"
            }
            fill="none"
            stroke="#7a4d48"
            strokeWidth={
              isJacobo
                ? 1.35
                : 1.8
            }
            strokeLinecap="round"
            opacity={
              isJacobo
                ? 0.78
                : 1
            }
          />
        )}

        {mouthStyle === 1 && (
          <path
            d="M46 65c4-2 8-2 12 0"
            fill="none"
            stroke="#7a4d48"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        )}

        {mouthStyle === 2 && (
          <ellipse
            cx="52"
            cy="65"
            rx="3.2"
            ry="2.5"
            fill="#754941"
            opacity="0.78"
          />
        )}

        {mouthStyle === 3 && (
          <path
            d="M45 65c4 1 10 1 14 0"
            fill="none"
            stroke="#7a4d48"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        )}

        {mouthStyle === 4 && (
          <>
            <path
              d="M45 64c4 5 10 5 14 0"
              fill="#f4e5da"
              stroke="#7a4d48"
              strokeWidth="1.3"
            />

            <path
              d="M48 66h8"
              stroke="#d7bfb2"
              strokeWidth="0.8"
            />
          </>
        )}

        {isJacobo && (
          <>
            <PhilosophicalGlasses />

            <path
              d="M35 68c4 4 10 6 17 6s13-2 17-6"
              fill="none"
              stroke="#6d5544"
              strokeWidth="1"
              opacity="0.18"
            />

            <JacoboBook
              color={
                palette.accent
              }
            />

            <circle
              cx="52"
              cy="92"
              r="2.2"
              fill="#c8a769"
              opacity="0.8"
            />
          </>
        )}

        {!isJacobo &&
          accessory === 0 && (
            <Glasses />
          )}

        {!isJacobo &&
          accessory === 1 && (
            <RectangularGlasses />
          )}

        {!isJacobo &&
          accessory === 2 && (
            <Beret
              color={
                palette.accent
              }
            />
          )}

        {!isJacobo &&
          accessory === 3 && (
            <Flower
              color={
                palette.accent
              }
            />
          )}

        {!isJacobo &&
          accessory === 4 && (
            <Pencil color="#d4a047" />
          )}

        {!isJacobo &&
          accessory === 5 && (
            <TinyBook
              color={
                palette.accent
              }
            />
          )}

        {!isJacobo &&
          accessory === 6 && (
            <Feather
              color={
                palette.accent
              }
            />
          )}

        {!isJacobo &&
          accessory === 7 && (
            <g>
              <circle
                cx="76"
                cy="59"
                r="4"
                fill="none"
                stroke={
                  palette.accent
                }
                strokeWidth="1.8"
              />

              <path
                d="M76 63v10"
                stroke={
                  palette.accent
                }
                strokeWidth="1.8"
              />
            </g>
          )}

        {!isJacobo &&
          accessory === 8 && (
            <g
              fill={
                palette.accent
              }
            >
              <circle
                cx="31"
                cy="62"
                r="2.4"
              />

              <circle
                cx="73"
                cy="62"
                r="2.4"
              />

              <path
                d="M31 64v5M73 64v5"
                stroke={
                  palette.accent
                }
                strokeWidth="1.5"
              />
            </g>
          )}

        {!isJacobo &&
          accessory === 9 && (
            <path
              d="M25 31c7-13 18-18 30-17 12 0 21 6 27 17Z"
              fill={
                palette.accent
              }
              opacity="0.9"
            />
          )}

        {!isJacobo &&
          accessory === 10 && (
            <g transform="translate(78 26)">
              <path
                d="M0 7c4-8 9-8 13 0-4 6-9 6-13 0Z"
                fill={
                  palette.accent
                }
              />

              <circle
                cx="6.5"
                cy="7"
                r="1.5"
                fill="#f3e5d5"
              />
            </g>
          )}

        {!isJacobo &&
          accessory === 11 && (
            <g
              fill="none"
              stroke={
                palette.accent
              }
              strokeWidth="1.8"
            >
              <path d="M30 70c5 8 10 12 22 13 12-1 17-5 22-13" />

              <circle
                cx="52"
                cy="83"
                r="3"
                fill={
                  palette.accent
                }
              />
            </g>
          )}
      </g>

      <circle
        cx="52"
        cy="52"
        r="49"
        fill="none"
        stroke="rgba(39,29,21,0.22)"
        strokeWidth="1"
      />

      {isJacobo && (
        <circle
          cx="52"
          cy="52"
          r="46.5"
          fill="none"
          stroke="#b99a68"
          strokeWidth="0.65"
          opacity="0.3"
        />
      )}
    </svg>
  );
}
