import { VerifyForm } from "@/components/verify-form";
import { verifyAction } from "@/lib/auth/actions";

export default function VerifyPage({ searchParams }: { searchParams?: { email?: string; error?: string } }) {
  return <VerifyForm action={verifyAction} email={searchParams?.email} error={searchParams?.error} />;
}
