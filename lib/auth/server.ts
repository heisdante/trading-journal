import { revalidatePath } from "next/cache";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export function requiredString(formData: FormData, name: string) {
  const value = String(formData.get(name) ?? "").trim();
  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

export function redirectWithError(path: string, error: string) {
  redirect(`${path}?error=${encodeURIComponent(error)}`);
}

function safeNextPath(value: FormDataEntryValue | string | null) {
  const path = String(value ?? "").trim();
  return path.startsWith("/") && !path.startsWith("//") && !path.includes("\\") ? path : "/dashboard";
}

export async function loginWithFormData(formData: FormData) {
  "use server";

  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?next=${encodeURIComponent(safeNextPath(formData.get("next")))}&error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/dashboard");
  redirect(safeNextPath(formData.get("next")));
}

export async function magicLinkWithFormData(formData: FormData) {
  "use server";

  const email = requiredString(formData, "email");
  const next = safeNextPath(formData.get("next"));
  const supabase = createClient();
  const requestHeaders = headers();
  cookies().set("trading-journal-login-next", next, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/auth/callback", maxAge: 300 });
  const siteUrl = requestHeaders.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });
  if (error) {
    cookies().delete("trading-journal-login-next");
    redirect(`/login?next=${encodeURIComponent(next)}&error=${encodeURIComponent("Could not send a sign-in link. Check the email address and try again.")}`);
  }
  redirect(`/login?next=${encodeURIComponent(next)}&message=${encodeURIComponent("If this email belongs to an account, a secure sign-in link is on its way.")}`);
}

export async function signupWithFormData(formData: FormData) {
  "use server";

  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");
  const supabase = createClient();
  const requestHeaders = headers();
  const siteUrl =
    requestHeaders.get("origin") ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });
  if (error) {
    redirectWithError("/signup", error.message);
  }

  if (!data.session) {
    redirect(`/verify?email=${encodeURIComponent(email)}`);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function verifyWithFormData(formData: FormData) {
  "use server";

  const email = requiredString(formData, "email");
  const token = requiredString(formData, "token");
  const supabase = createClient();

  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: "signup",
  });

  if (error) {
    redirectWithError(`/verify?email=${encodeURIComponent(email)}`, error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
