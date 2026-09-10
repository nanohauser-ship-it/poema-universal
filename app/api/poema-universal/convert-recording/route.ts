import {
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
  writeFile,
} from "node:fs/promises";

import {
  tmpdir,
} from "node:os";

import path from "node:path";

import {
  promisify,
} from "node:util";

export const runtime =
  "nodejs";

export const dynamic =
  "force-dynamic";

const execFileAsync =
  promisify(execFile);

async function findFfmpeg() {
  const candidates = [
    process.env.FFMPEG_PATH,

    path.join(
      process.cwd(),
      "node_modules",
      "ffmpeg-static",
      "ffmpeg",
    ),

    "/opt/homebrew/bin/ffmpeg",
    "/usr/local/bin/ffmpeg",
  ].filter(Boolean) as string[];

  for (
    const candidate
    of candidates
  ) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // siguiente
    }
  }

  throw new Error(
    "FFmpeg no disponible",
  );
}

export async function POST(
  request: Request,
) {
  let work = "";

  try {
    const form =
      await request.formData();

    const value =
      form.get("file");

    if (
      !value ||
      typeof value === "string"
    ) {
      return NextResponse.json(
        {
          error:
            "Falta la grabación",
        },
        {
          status: 400,
        },
      );
    }

    const file =
      value as File;

    const ffmpeg =
      await findFfmpeg();

    work =
      await mkdtemp(
        path.join(
          tmpdir(),
          "corazon-vivo-",
        ),
      );

    const extension =
      file.type.includes("mp4")
        ? "mp4"
        : "webm";

    const input =
      path.join(
        work,
        `entrada.${extension}`,
      );

    const output =
      path.join(
        work,
        "lectura.mp4",
      );

    await writeFile(
      input,
      Buffer.from(
        await file.arrayBuffer(),
      ),
    );

    await execFileAsync(
      ffmpeg,
      [
        "-y",

        "-i",
        input,

        /*
         * Vídeo compatible:
         * H.264 + dimensiones pares.
         */
        "-map",
        "0:v:0",

        "-map",
        "0:a:0?",

        "-vf",
        "scale=trunc(iw/2)*2:trunc(ih/2)*2",

        "-c:v",
        "libx264",

        "-preset",
        "veryfast",

        "-crf",
        "20",

        "-pix_fmt",
        "yuv420p",

        "-tag:v",
        "avc1",

        /*
         * Audio compatible.
         */
        "-c:a",
        "aac",

        "-b:a",
        "192k",

        "-ar",
        "48000",

        /*
         * Permite reproducción
         * inmediata al compartir.
         */
        "-movflags",
        "+faststart",

        output,
      ],
      {
        timeout:
          10 * 60 * 1000,

        maxBuffer:
          1024 * 1024 * 16,
      },
    );

    const mp4 =
      await readFile(
        output,
      );

    return new NextResponse(
      new Uint8Array(mp4),
      {
        status: 200,

        headers: {
          "Content-Type":
            "video/mp4",

          "Content-Disposition":
            'inline; filename="poema-universal-lectura.mp4"',

          "Cache-Control":
            "no-store",
        },
      },
    );
  } catch (error) {
    console.error(
      "[CORAZÓN VIVO · MP4]",
      error,
    );

    return NextResponse.json(
      {
        error:
          "No se pudo generar el MP4.",
      },
      {
        status: 500,
      },
    );
  } finally {
    if (work) {
      await rm(
        work,
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
