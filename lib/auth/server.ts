import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
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

export async function loginWithFormData(formData: FormData) {
  "use server";

  const email = requiredString(formData, "email");
  const password = requiredString(formData, "password");
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirectWithError("/login", error.message);
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
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
