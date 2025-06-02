"use server";

import { getCurrentSession, hashPassword } from "@/lib/auth";
import prisma from "@/lib/db";
import { addUserSchema, editUserSchema } from "@/schemas/user-schema";
import { Prisma, User } from "@prisma/client";
import { z } from "zod";
import { createActivityLog } from "./activities-actions";

export const addUser = async (data: z.infer<typeof addUserSchema>) => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const value = addUserSchema.parse(data);

    // Check for unique constraints
    const existingUser = await prisma.user.findUnique({
      where: { email: value.email },
    });
    if (existingUser) {
      throw new Error("Email already in use");
    }

    const hashedPassword = await hashPassword(value.password);
    const newUser = await prisma.user.create({
      data: {
        username: value.username,
        email: value.email,
        password: hashedPassword,
        role: value.role,
      },
    });
    createActivityLog({
      action: `Add new user: ${newUser.username}`,
      target_type: "USER",
      target_id: newUser.id,
    });
    return newUser;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("Unique constraint failed");
      }
    }
    throw new Error("Failed to add user: " + error.message);
  }
};

export const editUser = async (data: z.infer<typeof editUserSchema>) => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const value = editUserSchema.parse(data);

    const updatedUser = await prisma.user.update({
      where: {
        id: value.id,
      },
      data: {
        username: value.username,
        email: value.email,
        role: value.role,
      },
    });
    createActivityLog({
      action: `Updated user: ${updatedUser.username}`,
      target_type: "USER",
      target_id: updatedUser.id,
    });
    return updatedUser;
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        "Validation failed: " + error.errors.map((e) => e.message).join(", ")
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("User not found");
      }
      if (error.code === "P2002") {
        throw new Error("Unique constraint failed");
      }
    }
    throw new Error("Failed to edit user: " + error.message);
  }
};

export const deleteUser = async (data: User) => {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    await prisma.user.delete({
      where: {
        id: data.id,
      },
    });
    createActivityLog({
      action: `Deleted user: : ${data.username}`,
      target_type: "USER",
      target_id: data.id,
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("User not found");
      }
    }
    throw new Error("Failed to delete user: " + error.message);
  }
};

export async function getUserDetail(user_id: number) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const data = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
      include: {
        activityLogs: true,
        CheckInOut: {
          include: {
            asset: {
              select: {
                name: true,
              },
            },
            employee: {
              select: {
                name: true,
              },
            },
          },
        },
        maintenances: {
          include: {
            asset: {
              select: {
                name: true,
              },
            },
          },
        },
        Session: true,
      },
    });
    return data;
  } catch (error) {
    console.error(error);
  }
}
