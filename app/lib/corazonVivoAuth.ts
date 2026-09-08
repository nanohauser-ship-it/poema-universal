import {
  createHash,
  createHmac,
  timingSafeEqual,
} from "node:crypto";

export const
  CORAZON_COOKIE =
    "poema_corazon_owner";

const SESSION_MESSAGE =
  "sala-corazon-vivo-owner-v1";

function safeEqual(
  a: string,
  b: string,
) {
  const left =
    Buffer.from(a);

  const right =
    Buffer.from(b);

  if (
    left.length !==
    right.length
  ) {
    return false;
  }

  return timingSafeEqual(
    left,
    right,
  );
}

export function
verifyCorazonPassword(
  password: string,
) {
  const expected =
    process.env
      .CORAZON_VIVO_PASSWORD_SHA256;

  if (!expected) {
    return false;
  }

  const received =
    createHash("sha256")
      .update(password)
      .digest("hex");

  return safeEqual(
    received,
    expected,
  );
}

export function
createCorazonSession() {
  const secret =
    process.env
      .CORAZON_VIVO_SESSION_SECRET;

  if (!secret) {
    throw new Error(
      "Falta CORAZON_VIVO_SESSION_SECRET",
    );
  }

  return createHmac(
    "sha256",
    secret,
  )
    .update(
      SESSION_MESSAGE,
    )
    .digest("hex");
}

export function
verifyCorazonSession(
  token:
    | string
    | undefined,
) {
  if (!token) {
    return false;
  }

  try {
    const expected =
      createCorazonSession();

    return safeEqual(
      token,
      expected,
    );
  } catch {
    return false;
  }
}
