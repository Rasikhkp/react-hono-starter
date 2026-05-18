import { createFileRoute, Link } from "@tanstack/react-router";

/**
 * Popup GIS auth-code flow uses redirect_uri = window.location.origin only — Google does not send users here.
 * Use this route only if you switch useGoogleLogin to ux_mode: "redirect" with redirect_uri pointing here.
 */
export const Route = createFileRoute("/auth/google/callback")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-md space-y-4 p-8">
      <h1 className="font-semibold text-lg">Google callback</h1>
      <p className="text-muted-foreground text-sm">
        The default &quot;Continue with Google&quot; flow uses a popup and does
        not open this URL. If you see this page without a{" "}
        <code className="text-xs">code</code> query param, use sign-in instead.
      </p>
      <Link className="text-primary underline text-sm" to="/sign-in">
        Go to sign in
      </Link>
    </div>
  );
}
