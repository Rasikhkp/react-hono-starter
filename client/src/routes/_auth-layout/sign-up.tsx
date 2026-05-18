import { createFileRoute, Link } from "@tanstack/react-router";
import { GoogleSignInButton } from "@/features/auth/components/GoogleSignInButton";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FieldDescription } from "@/shared/components/ui/field";
import { Separator } from "@/shared/components/ui/separator";

export const Route = createFileRoute("/_auth-layout/sign-up")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create your account</CardTitle>
        <CardDescription>
          Enter your email below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SignUpForm />
        {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
          <>
            <div className="relative flex items-center gap-2 py-1">
              <Separator className="flex-1" />
              <span className="text-muted-foreground text-xs">or</span>
              <Separator className="flex-1" />
            </div>
            <GoogleSignInButton redirectTo="/admin" />
          </>
        ) : null}
        <FieldDescription className="text-center">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </FieldDescription>
      </CardContent>
    </Card>
  );
}
