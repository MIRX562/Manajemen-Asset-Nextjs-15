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
import { createActivityLog } from "@/actions/activities-actions";

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

export async function generateSessionToken(): Promise<string> {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

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
    await prisma.session.deleteMany({
      where: {
        user_id: session.user_id,
        expiresAt: { lt: new Date() },
      },
    });
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

export async function invalidateSession(sessionId: string): Promise<void> {
  await prisma.session.delete({ where: { id: sessionId } });
}

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

  await prisma.session.deleteMany({
    where: {
      user_id: user.id,
      expiresAt: { lt: new Date() },
    },
  });

  const token = await generateSessionToken();
  const session = await createSession(token, user.id);
  await setSessionTokenCookie(token, session.expiresAt);
  await createActivityLog({
    action: `user ${user.username} logged in`,
    target_id: user.id,
    target_type: "SESSION",
  });

  return session;
};

export async function logout(): Promise<void> {
  const cookieStore = cookies();
  const { user } = await getCurrentSession();
  if (!user) return;

  const sessionToken = (await cookieStore).get("session")?.value;
  if (!sessionToken) return;

  const sessionId = await calculateSessionId(sessionToken);

  try {
    await prisma.session.delete({
      where: { id: sessionId },
    });
    await createActivityLog({
      action: `user ${user.username} logged in`,
      target_id: user.id,
      target_type: "SESSION",
    });
  } catch (error) {
    console.error("Error deleting session from database:", error);
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

async function calculateSessionId(token: string): Promise<string> {
  return encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
}

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

export type SessionValidationResult =
  | {
      session: Session;
      user: { id: number; email: string; role: Role; username: string };
    }
  | { session: null; user: null };
