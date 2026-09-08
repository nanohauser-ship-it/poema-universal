import {
  NextRequest,
  NextResponse,
} from "next/server";

import {
  execFile,
} from "node:child_process";

import {
  access,
  mkdtemp,
  readFile,
  rm,
} from "node:fs/promises";

import {
  tmpdir,
} from "node:os";

import path from "node:path";

import {
  promisify,
} from "node:util";

import {
  lookup,
} from "node:dns/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const execFileAsync =
  promisify(execFile);

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

function isPrivateIp(
  address: string,
) {
  if (
    address === "127.0.0.1" ||
    address === "::1"
  ) {
    return true;
  }

  if (
    address.startsWith("10.") ||
    address.startsWith("192.168.")
  ) {
    return true;
  }

  const match =
    address.match(
      /^172\.(\d+)\./,
    );

  if (match) {
    const second =
      Number(match[1]);

    if (
      second >= 16 &&
      second <= 31
    ) {
      return true;
    }
  }

  if (
    address.startsWith(
      "169.254.",
    )
  ) {
    return true;
  }

  return false;
}

async function validateTarget(
  target: URL,
) {
  if (
    ![
      "http:",
      "https:",
    ].includes(
      target.protocol,
    )
  ) {
    throw new Error(
      "Protocolo no permitido",
    );
  }

  const hostname =
    target.hostname
      .toLowerCase();

  if (
    hostname === "localhost" ||
    hostname.endsWith(
      ".localhost",
    )
  ) {
    throw new Error(
      "Destino local no permitido",
    );
  }

  const addresses =
    await lookup(
      hostname,
      {
        all: true,
      },
    );

  if (
    addresses.some(
      ({ address }) =>
        isPrivateIp(address),
    )
  ) {
    throw new Error(
      "Destino privado no permitido",
    );
  }
}

async function findChrome() {
  for (
    const candidate
    of CHROME_CANDIDATES
  ) {
    try {
      await access(
        candidate,
      );

      return candidate;
    } catch {
      // seguimos buscando
    }
  }

  throw new Error(
    "Chrome no encontrado",
  );
}

export async function GET(
  request: NextRequest,
) {
  const raw =
    request.nextUrl
      .searchParams
      .get("url");

  if (!raw) {
    return NextResponse.json(
      {
        error:
          "Falta la URL",
      },
      {
        status: 400,
      },
    );
  }

  let target: URL;

  try {
    target =
      new URL(raw);

    await validateTarget(
      target,
    );
  } catch {
    return NextResponse.json(
      {
        error:
          "URL no disponible",
      },
      {
        status: 400,
      },
    );
  }

  let workingDirectory = "";

  try {
    const chrome =
      await findChrome();

    workingDirectory =
      await mkdtemp(
        path.join(
          tmpdir(),
          "poema-universal-web-",
        ),
      );

    const screenshot =
      path.join(
        workingDirectory,
        "capture.png",
      );

    const profile =
      path.join(
        workingDirectory,
        "profile",
      );

    await execFileAsync(
      chrome,
      [
        "--headless=new",
        "--hide-scrollbars",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",

        `--user-data-dir=${profile}`,

        "--window-size=1365,1024",

        "--force-device-scale-factor=1",

        "--virtual-time-budget=5000",

        "--run-all-compositor-stages-before-draw",

        `--screenshot=${screenshot}`,

        target.toString(),
      ],
      {
        timeout: 14000,
        maxBuffer:
          1024 * 1024 * 4,
      },
    );

    const image =
      await readFile(
        screenshot,
      );

    return new NextResponse(
      new Uint8Array(
        image,
      ),
      {
        status: 200,
        headers: {
          "Content-Type":
            "image/png",

          "Cache-Control":
            "no-store, max-age=0",

          "X-Content-Type-Options":
            "nosniff",
        },
      },
    );
  } catch (error) {
    console.error(
      "[CORAZÓN VIVO · CAPTURA WEB]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No fue posible fotografiar esta página.",
      },
      {
        status: 502,
      },
    );
  } finally {
    if (
      workingDirectory
    ) {
      await rm(
        workingDirectory,
        {
          recursive: true,
          force: true,
        },
      ).catch(
        () => undefined,
      );
    }
  }
}
