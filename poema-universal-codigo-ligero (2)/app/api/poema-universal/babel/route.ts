import nodemailer from "nodemailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SubmissionPayload = {
  name?: unknown;
  email?: unknown;
  country?: unknown;
  language?: unknown;
  title?: unknown;
  poem?: unknown;
  translation?: unknown;
  authorship?: unknown;
  website?: unknown;
  startedAt?: unknown;
};

function readText(value: unknown) {
  return typeof value === "string"
    ? value.trim()
    : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function cleanSubject(value: string) {
  return value
    .replace(/[\r\n]+/g, " ")
    .trim();
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    value
  );
}

export async function POST(
  request: Request
) {
  try {
    const body =
      (await request.json()) as
        SubmissionPayload;

    const name = readText(body.name);

    const email = readText(
      body.email
    ).toLowerCase();

    const country =
      readText(body.country);

    const language =
      readText(body.language);

    const title =
      readText(body.title);

    const poem =
      readText(body.poem);

    const translation =
      readText(body.translation);

    const website =
      readText(body.website);

    if (website) {
      return Response.json({
        ok: true,
        message:
          "Tu voz ha llegado a la Torre de Babel.",
      });
    }

    const startedAt =
      typeof body.startedAt === "number"
        ? body.startedAt
        : 0;

    const elapsed =
      Date.now() - startedAt;

    if (
      !startedAt ||
      elapsed < 1500 ||
      elapsed > 21600000
    ) {
      return Response.json(
        {
          ok: false,
          message:
            "No se pudo validar el envío. Recarga la página e inténtalo de nuevo.",
        },
        {
          status: 429,
        }
      );
    }

    if (
      !email ||
      !country ||
      !language ||
      !poem
    ) {
      return Response.json(
        {
          ok: false,
          message:
            "Completa el correo, el país, el idioma y el poema original.",
        },
        {
          status: 400,
        }
      );
    }

    if (!isValidEmail(email)) {
      return Response.json(
        {
          ok: false,
          message:
            "Introduce un correo electrónico válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (body.authorship !== true) {
      return Response.json(
        {
          ok: false,
          message:
            "Debes confirmar la autoría del poema.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      name.length > 120 ||
      email.length > 254 ||
      country.length > 100 ||
      language.length > 100 ||
      title.length > 200 ||
      poem.length > 30000 ||
      translation.length > 30000
    ) {
      return Response.json(
        {
          ok: false,
          message:
            "Uno de los campos supera la extensión permitida.",
        },
        {
          status: 400,
        }
      );
    }

    const gmailUser =
      process.env
        .BABEL_GMAIL_USER
        ?.trim();

    const gmailPassword =
      process.env
        .BABEL_GMAIL_APP_PASSWORD
        ?.replace(/\s+/g, "")
        .trim();

    if (
      !gmailUser ||
      !gmailPassword ||
      gmailPassword.includes(
        "REEMPLAZA"
      )
    ) {
      console.error(
        "Faltan las variables privadas "
        + "del correo de Babel."
      );

      return Response.json(
        {
          ok: false,
          message:
            "El correo de la convocatoria todavía no está configurado.",
        },
        {
          status: 500,
        }
      );
    }

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailPassword,
        },
      });

    const displayName =
      name || "Participación anónima";

    const displayTitle =
      title || "Sin título";

    const safeName =
      escapeHtml(displayName);

    const safeEmail =
      escapeHtml(email);

    const safeCountry =
      escapeHtml(country);

    const safeLanguage =
      escapeHtml(language);

    const safeTitle =
      escapeHtml(displayTitle);

    const safePoem =
      escapeHtml(poem);

    const safeTranslation =
      escapeHtml(translation);

    await transporter.sendMail({
      from:
        `"Torre de Babel · Poema Universal" <${gmailUser}>`,

      to: gmailUser,

      replyTo: email,

      subject:
        `Nueva voz · ${cleanSubject(
          country
        )} · ${cleanSubject(
          displayName
        )}`,

      text: [
        "NUEVA CANDIDATURA",
        "",
        `Nombre: ${displayName}`,
        `Correo: ${email}`,
        `País o territorio: ${country}`,
        `Idioma: ${language}`,
        `Título: ${displayTitle}`,
        "",
        "POEMA ORIGINAL",
        "",
        poem,
        "",
        "TRADUCCIÓN",
        "",
        translation ||
          "No se ha incluido traducción.",
      ].join("\n"),

      html: `
        <div style="
          max-width:720px;
          margin:0 auto;
          padding:40px;
          background:#f4eadb;
          color:#332116;
          font-family:Arial,sans-serif;
        ">
          <p style="
            margin:0 0 24px;
            font-size:11px;
            letter-spacing:0.25em;
            text-transform:uppercase;
            color:#8a6239;
          ">
            Nueva voz · Torre de Babel
          </p>

          <h1 style="
            margin:0 0 30px;
            font-family:Georgia,serif;
            font-size:38px;
            font-weight:400;
          ">
            ${safeTitle}
          </h1>

          <p>
            <strong>Nombre:</strong>
            ${safeName}
          </p>

          <p>
            <strong>Correo:</strong>
            ${safeEmail}
          </p>

          <p>
            <strong>País:</strong>
            ${safeCountry}
          </p>

          <p>
            <strong>Idioma:</strong>
            ${safeLanguage}
          </p>

          <hr style="
            margin:32px 0;
            border:0;
            border-top:1px solid
              rgba(75,52,32,0.2);
          " />

          <h2 style="
            font-family:Georgia,serif;
            font-weight:400;
          ">
            Poema original
          </h2>

          <div style="
            white-space:pre-wrap;
            font-family:Georgia,serif;
            font-size:18px;
            line-height:1.75;
          ">${safePoem}</div>

          ${
            translation
              ? `
                <hr style="
                  margin:32px 0;
                  border:0;
                  border-top:1px solid
                    rgba(75,52,32,0.2);
                " />

                <h2 style="
                  font-family:Georgia,serif;
                  font-weight:400;
                ">
                  Traducción
                </h2>

                <div style="
                  white-space:pre-wrap;
                  font-family:Georgia,serif;
                  font-size:17px;
                  line-height:1.75;
                ">${safeTranslation}</div>
              `
              : ""
          }
        </div>
      `,
    });

    try {
      await transporter.sendMail({
        from:
          `"Poema Universal" <${gmailUser}>`,

        to: email,

        subject:
          "Hemos recibido tu voz · Poema Universal",

        text: [
          `Hola ${name || ""}`.trim(),
          "",
          "Tu poema ha llegado correctamente a la Torre de Babel de Poema Universal.",
          "",
          "La recepción no implica su selección automática para la edición fundacional.",
          "",
          "Gracias por confiar tu voz a esta casa.",
          "",
          "Poema Universal",
        ].join("\n"),

        html: `
          <div style="
            max-width:640px;
            margin:0 auto;
            padding:42px;
            background:#21170f;
            color:#f1e5d1;
            font-family:Arial,sans-serif;
          ">
            <p style="
              margin:0 0 26px;
              color:#c7a467;
              font-size:10px;
              letter-spacing:0.28em;
              text-transform:uppercase;
            ">
              Poema Universal
            </p>

            <h1 style="
              margin:0 0 28px;
              font-family:Georgia,serif;
              font-size:38px;
              font-weight:400;
            ">
              Tu voz ha llegado.
            </h1>

            <p style="
              color:rgba(241,229,209,0.72);
              font-size:16px;
              line-height:1.8;
            ">
              Hemos recibido correctamente
              tu poema en la Torre de Babel.
            </p>

            <p style="
              color:rgba(241,229,209,0.5);
              font-size:14px;
              line-height:1.8;
            ">
              La recepción de la obra no
              implica su selección automática
              para la edición fundacional.
            </p>

            <p style="
              margin-top:34px;
              font-family:Georgia,serif;
              font-size:20px;
            ">
              Gracias por confiar tu voz
              a esta casa.
            </p>
          </div>
        `,
      });
    } catch (confirmationError) {
      console.error(
        "La candidatura llegó, pero falló "
        + "el correo de confirmación:",
        confirmationError
      );
    }

    return Response.json(
      {
        ok: true,
        message:
          "Tu voz ha llegado a la Torre de Babel. Revisa también tu correo.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Error recibiendo una candidatura:",
      error
    );

    return Response.json(
      {
        ok: false,
        message:
          "La Torre no ha podido recibir el poema. Inténtalo de nuevo dentro de unos minutos.",
      },
      {
        status: 500,
      }
    );
  }
}
