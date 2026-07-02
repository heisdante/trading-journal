import { SignupForm } from "@/components/signup-form";

export default function SignupPage({ searchParams }: { searchParams?: { error?: string; message?: string } }) {
  return <SignupForm error={searchParams?.error} message={searchParams?.message} />;
}
