import { isFirstRun } from "@/lib/firstRun";
import RegisterPage from "./register-page";
import LoginPage from "./login-page";

export const dynamic = "force-dynamic";

export default async function AuthPage() {
  if (await isFirstRun()) {
    return <RegisterPage />;
  }
  return <LoginPage />;
}
