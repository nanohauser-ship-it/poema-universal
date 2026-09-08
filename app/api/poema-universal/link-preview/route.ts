import {
  NextRequest,
  NextResponse,
} from "next/server";

function extractMeta(
  html: string,
  key: string,
) {
  const patterns = [
    new RegExp(
      `<meta[^>]+(?:property|name)=["']${key}["'][^>]+content=["']([^"']+)["'][^>]*>`,
      "i",
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["']${key}["'][^>]*>`,
      "i",
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);

    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return "";
}

function extractTitle(
  html: string,
) {
  const og =
    extractMeta(
      html,
      "og:title",
    );

  if (og) return og;

  const match =
    html.match(
      /<title[^>]*>([\s\S]*?)<\/title>/i,
    );

  return (
    match?.[1]
      ?.replace(/\s+/g, " ")
      .trim() || ""
  );
}

function blockedHost(
  hostname: string,
) {
  const host =
    hostname.toLowerCase();

  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host === "::1" ||
    host.startsWith("192.168.") ||
    host.startsWith("10.")
  );
}

export async function GET(
  request: NextRequest,
) {
  const raw =
    request.nextUrl.searchParams
      .get("url");

  if (!raw) {
    return NextResponse.json(
      {
        error:
          "URL no indicada",
      },
      { status: 400 },
    );
  }

  let target: URL;

  try {
    target =
      new URL(raw);
  } catch {
    return NextResponse.json(
      {
        error:
          "URL no válida",
      },
      { status: 400 },
    );
  }

  if (
    !["http:", "https:"].includes(
      target.protocol,
    ) ||
    blockedHost(
      target.hostname,
    )
  ) {
    return NextResponse.json(
      {
        error:
          "URL no disponible para previsualización",
      },
      { status: 400 },
    );
  }

  const controller =
    new AbortController();

  const timer =
    setTimeout(
      () =>
        controller.abort(),
      6500,
    );

  try {
    const response =
      await fetch(
        target.toString(),
        {
          signal:
            controller.signal,
          redirect:
            "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 PoemaUniversal/1.0",
            Accept:
              "text/html,application/xhtml+xml",
          },
        },
      );

    const type =
      response.headers.get(
        "content-type",
      ) || "";

    if (
      !type.includes(
        "text/html",
      )
    ) {
      return NextResponse.json({
        title:
          target.hostname,
        description: "",
        image: "",
        domain:
          target.hostname,
        url:
          target.toString(),
      });
    }

    const html =
      (
        await response.text()
      ).slice(
        0,
        1_500_000,
      );

    const title =
      extractTitle(html) ||
      target.hostname;

    const description =
      extractMeta(
        html,
        "og:description",
      ) ||
      extractMeta(
        html,
        "description",
      );

    const rawImage =
      extractMeta(
        html,
        "og:image",
      ) ||
      extractMeta(
        html,
        "twitter:image",
      );

    let image = "";

    if (rawImage) {
      try {
        image =
          new URL(
            rawImage,
            target,
          ).toString();
      } catch {
        image = "";
      }
    }

    return NextResponse.json({
      title,
      description,
      image,
      domain:
        target.hostname.replace(
          /^www\./,
          "",
        ),
      url:
        target.toString(),
    });
  } catch {
    return NextResponse.json({
      title:
        target.hostname,
      description: "",
      image: "",
      domain:
        target.hostname.replace(
          /^www\./,
          "",
        ),
      url:
        target.toString(),
    });
  } finally {
    clearTimeout(timer);
  }
}
