import { AuthForm } from "@/components/auth-form";
import { loginAction } from "@/lib/auth/actions";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  return <AuthForm mode="login" action={loginAction} error={searchParams?.error} message={searchParams?.message} />;
}
