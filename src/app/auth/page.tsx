import prisma from "@/lib/db";
import RegisterPage from "./register-page";
import LoginPage from "./login-page";

export const revalidate = 0; // Revalidate the page every 60 seconds

export default async function AuthPage() {
  // Fetch the user count from the database
  const userCount = await prisma.user.count();

  // Conditionally render either the RegisterPage or LoginPage based on the user count
  if (userCount === 0) {
    return <RegisterPage />;
  } else {
    return <LoginPage />;
  }
}
