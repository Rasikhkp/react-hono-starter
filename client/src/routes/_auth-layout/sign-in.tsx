import { createFileRoute, Link } from "@tanstack/react-router";
import { type } from "arktype";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { SignInForm } from "@/features/auth/components/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FieldDescription } from "@/shared/components/ui/field";
import { Separator } from "@/shared/components/ui/separator";

export const Route = createFileRoute("/_auth-layout/sign-in")({
  validateSearch: type({ redirect: "string?" }),
  component: RouteComponent,
});

function RouteComponent() {
  const { redirect } = Route.useSearch();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SignInForm />
        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <>
            <div className="relative flex items-center gap-2 py-1">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-xs">or</span>
              <Separator className="flex-1" />
            </div>
            <GoogleSignInButton redirectTo={redirect ?? "/admin"} />
          </>
        ) : null}
        <FieldDescription className="text-center">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </FieldDescription>
      </CardContent>
    </Card>
  );
}
