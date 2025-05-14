import prisma from "@/lib/db";
import RegisterPage from "./register-page";
import LoginPage from "./login-page";

export const dynamic = "force-dynamic";

export default async function AuthPage() {
  const userCount = await prisma.user.count();
  if (userCount === 0) {
    return <RegisterPage />;
  }
  return <LoginPage />;
}
