"use server";
import { validateSessionToken } from "@/lib/auth"; // Assuming validateSessionToken is from your auth file

export async function getCurrentUser() {
  const cookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("session="));
  if (!cookie) {
    return null; // No session cookie
  }
  const sessionToken = cookie.split("=")[1];

  const { session, user } = await validateSessionToken(sessionToken);

  if (!session || !user) {
    return null; // Invalid session or no user found
  }

  return user;
}
