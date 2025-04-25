"use server";

import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import bcrypt from "bcryptjs";
import { type Session, Role } from "@prisma/client";
import prisma from "./db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Hashes a plaintext password before storing it in the database.
 *
 * @param password - The plaintext password to hash.
 * @returns {Promise<string>} - The hashed password.
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

/**
 * Generates a random session token.
 *
 * @returns {string} A random session token encoded in base32.
 */
export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

/**
 * Creates a new session in the database.
 *
 * @param {string} token The session token to associate with the session.
 * @param {number} userId The user ID associated with the session.
 * @returns {Promise<Session>} The created session object.
 */
export async function createSession(
  token: string,
  userId: number
): Promise<Session> {
  const sessionId = await calculateSessionId(token);
  const session: Session = {
    id: sessionId,
    user_id: userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
  };
  await prisma.session.create({
    data: session,
  });
  return session;
}

/**
 * Validates the session token and returns session and user information.
 *
 * @param {string} token The session token to validate.
 * @returns {Promise<SessionValidationResult>} The session validation result.
 */
export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = await calculateSessionId(token);
  const result = await prisma.session.findUnique({
    where: {
      id: sessionId,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
          role: true,
        },
      },
    },
  });
  if (result === null) {
    return { session: null, user: null };
  }
  const { user, ...session } = result;
  if (Date.now() >= session.expiresAt.getTime()) {
    await prisma.session.delete({ where: { id: sessionId } });
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 20) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    await prisma.session.update({
      where: {
        id: session.id,
      },
      data: {
        expiresAt: session.expiresAt,
      },
    });
  }
  return { session, user };
}

/**
 * Invalidates the session by deleting it from the database.
 *
 * @param {string} sessionId The ID of the session to invalidate.
 * @returns {Promise<void>}
 */
export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

/**
 * Sets the session token in a cookie.
 *
 * @param {string} token The session token to set.
 * @param {Date} expiresAt The expiration date of the session token.
 * @returns {Promise<void>}
 */
export async function setSessionTokenCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    path: "/",
  });
}

/**
 * Deletes the session token from the cookie.
 *
 * @returns {Promise<void>}
 */
export async function deleteSessionTokenCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("session", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Retrieves the current session from the cookie and validates it.
 *
 * @returns {Promise<SessionValidationResult>} The current session validation result.
 */
export const getCurrentSession = async (): Promise<SessionValidationResult> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value ?? null;

  if (!token) {
    cookieStore.set("session", "", { expires: new Date(0) });
    return { session: null, user: null };
  }

  const result = await validateSessionToken(token);

  if (!result.session || !result.user) {
    cookieStore.set("session", "", { expires: new Date(0) });
    redirect("/auth");
  }

  return result;
};

/**
 * Logs in the user by validating the password and creating a session.
 *
 * @param {string} email The user ID to authenticate.
 * @param {string} password The password to verify.
 * @returns {Promise<Session>} The created session object.
 * @throws {Error} If the user is not found or password is incorrect.
 */
export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isValidPassword = await verifyPassword(password, user.password);
  if (!isValidPassword) {
    throw new Error("Invalid password");
  }

  const token = await generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token, session.expiresAt);

  return session;
};

/**
 * Logs the user out by deleting the session from the database
 * and clearing all cookies, including the session token.
 *
 * @returns {Promise<void>}
 */
export async function logout(): Promise<void> {
  const cookieStore = cookies();

  const sessionToken = (await cookieStore).get("session")?.value;
  if (!sessionToken) return;

  const sessionId = await calculateSessionId(sessionToken);

  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
  } catch (error) {
    console.log("Error deleting session from database:", error);
  }

  const allCookies = (await cookieStore).getAll();

  for (const cookie of allCookies) {
    (await cookieStore).set(cookie.name, "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
      path: "/",
    });
  }
}

/**
 * Utility to calculate the session ID from a token.
 * (This would use the same hash logic as session creation.)
 *
 * @param {string} token - The session token to hash.
 * @returns {Promise<string>} The hashed session ID.
 */
async function calculateSessionId(token: string): Promise<string> {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

/**
 * Verifies the entered password against the stored hash.
 *
 * @param {string} enteredPassword The password entered by the user.
 * @param {string} storedHash The stored password hash to compare against.
 * @returns {Promise<boolean>} Whether the password is valid.
 */
export async function verifyPassword(
  enteredPassword: string,
  storedHash: string
): Promise<boolean> {
  try {
    const match = await bcrypt.compare(enteredPassword, storedHash);
    return match;
  } catch (error) {
    console.error("Error verifying password:", error);
    return false;
  }
}

/**
 * Registers a new user, creates a session, and refreshes the page.
 *
 * @param {string} email The email of the user to register.
 * @param {string} password The password of the user to register.
 * @returns {Promise<void>} Redirects to the home page after successful registration.
 * @throws {Error} If a user with the given email already exists.
 */
export async function registerAndRefresh(
  username: string,
  email: string,
  password: string
): Promise<void> {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(password);

  const newUser = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const token = generateSessionToken();
  const session = await createSession(await token, newUser.id);
  await setSessionTokenCookie(await token, session.expiresAt);
}

/**
 * Represents the result of session validation.
 *
 * @typedef {Object} SessionValidationResult
 * @property {Session | null} session The session object if valid, otherwise null.
 * @property {User | null} user The user object associated with the session, or null.
 */
export type SessionValidationResult =
  | {
      session: Session;
      user: { id: number; email: string; role: Role; username: string };
    }
  | { session: null; user: null };
