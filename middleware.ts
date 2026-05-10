import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/admin/login" },
});

export const config = {
  // Protect /admin and all sub-paths EXCEPT /admin/login
  matcher: ["/admin", "/admin/((?!login).*)"],
};
