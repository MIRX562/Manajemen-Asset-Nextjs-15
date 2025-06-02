"use server";

import { validateSessionToken } from "@/lib/auth";

export async function getCurrentUser() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("session="));
  if (!cookie) {
    return null;
  }
  const sessionToken = cookie.split("=")[1];

  const { session, user } = await validateSessionToken(sessionToken);

  if (!session || !user) {
    return null;
  }

  return user;
}
