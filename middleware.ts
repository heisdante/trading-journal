import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const protectedRoutes = ["/dashboard", "/log", "/trades", "/import", "/rules", "/review", "/coach", "/profile", "/billing", "/playbooks", "/weekly", "/report"];
const authRoutes = ["/login", "/signup", "/verify"];

function matchesRoute(pathname: string, route: string) {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !supabaseKey) {
    return response;
  }

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const pathname = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => matchesRoute(pathname, route));
  const isAuthRoute = authRoutes.some((route) => matchesRoute(pathname, route));

  if (isAuthRoute) {
    return response;
  }

  const { data: claimsData } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(claimsData?.claims);

  if (isProtected && !isAuthenticated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
