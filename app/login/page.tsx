import { AuthForm } from "@/components/auth-form";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string; message?: string; next?: string } }) {
  return <AuthForm next={searchParams?.next} error={searchParams?.error} message={searchParams?.message} />;
}
