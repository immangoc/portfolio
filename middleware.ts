import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  // Protect /admin sub-paths EXCEPT /admin/login and /api/auth
  matcher: ["/admin/((?!login).*)"],
};
