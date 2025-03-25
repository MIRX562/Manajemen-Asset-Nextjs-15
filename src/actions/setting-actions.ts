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
  try {
    const { user } = await getCurrentSession();
    if (!user) {
      return null;
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
    console.log(error);
    throw error;
  }
}
