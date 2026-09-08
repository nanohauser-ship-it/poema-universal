import type {
  ReactNode,
} from "react";

import type {
  Metadata,
} from "next";

import {
  cookies,
} from "next/headers";

import PrivateLogin from
  "./PrivateLogin";

import {
  CORAZON_COOKIE,
  verifyCorazonSession,
} from "../../lib/corazonVivoAuth";

export const metadata:
  Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function
CorazonVivoPrivateLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore =
    await cookies();

  const session =
    cookieStore.get(
      CORAZON_COOKIE,
    )?.value;

  if (
    !verifyCorazonSession(
      session,
    )
  ) {
    return (
      <PrivateLogin />
    );
  }

  return children;
}
