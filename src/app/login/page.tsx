import { requireGuest } from "@/server/users/queries";
import AuthForm from "@/features/auth/components/AuthForm";

export const metadata = {
  title: "Sign In",
};

export default async function LoginPage() {
  await requireGuest();

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-12">
      <AuthForm mode="login" />
    </main>
  );
}