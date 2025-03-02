"use server";
import { getCurrentSession, hashPassword } from "@/lib/auth";
import prisma from "@/lib/db";

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
    return { success: true, message: "password successfully changed!" };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
