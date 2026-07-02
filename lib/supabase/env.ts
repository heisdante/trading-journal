export function hasValidSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = publishableKey ?? anonKey;

  return Boolean(
    url &&
      key &&
      !url.includes("your-project.supabase.co") &&
      !key.includes("your-supabase-anon-key") &&
      !key.includes("your-supabase-publishable-key"),
  );
}

export function supabaseEnvMessage() {
  return "Set NEXT_PUBLIC_SUPABASE_URL plus NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local to connect this app to your Supabase project.";
}
