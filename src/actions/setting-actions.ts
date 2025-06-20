"use server";
import { getCurrentSession, hashPassword } from "@/lib/auth";
import prisma from "@/lib/db";
import { createActivityLog } from "./activities-actions";

interface ResetPassword {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export async function resetPassword(data: ResetPassword) {
  const { user } = await getCurrentSession();
  if (!user) throw new Error("Not Authorized");
  try {
    const hashedCurrentPassword = await hashPassword(data.current_password);
    const dbPassword = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        password: true,
      },
    });
    if (!dbPassword || dbPassword.password !== hashedCurrentPassword) {
      throw new Error("Incorrect Current Password!");
    }
    if (data.confirm_password !== data.new_password) {
      throw new Error("Password do not match!");
    }
    const hashedPassword = await hashPassword(data.new_password);

    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        password: hashedPassword,
      },
    });

    createActivityLog({
      action: `Password changed user: ${user.username}`,
      target_type: "USER",
      target_id: user.id,
    });

    return { success: true, message: "password successfully changed!" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

interface ResetUserPassword {
  user_id: number;
  new_password: string;
  confirm_password: string;
}

export async function resetUserPassword(data: ResetUserPassword) {
  try {
    if (data.confirm_password !== data.new_password) {
      throw new Error("Password do not match!");
    }
    const hashedPassword = await hashPassword(data.new_password);

    const user = await prisma.user.update({
      where: {
        id: data.user_id,
      },
      data: {
        password: hashedPassword,
      },
    });

    createActivityLog({
      action: `Password changed user: ${user.username}`,
      target_type: "USER",
      target_id: user.id,
    });

    return { success: true, message: "password successfully changed!" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}
