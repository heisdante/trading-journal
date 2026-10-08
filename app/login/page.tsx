import { AuthForm } from "@/components/auth-form";
import { magicLinkAction } from "@/lib/auth/actions";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string; message?: string; next?: string } }) {
  return <AuthForm mode="login" magicLinkAction={magicLinkAction} next={searchParams?.next} error={searchParams?.error} message={searchParams?.message} />;
}
