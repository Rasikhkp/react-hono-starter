import { createFileRoute, Link } from "@tanstack/react-router";
import { SignInForm } from "@/features/auth/components/SignInForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FieldDescription } from "@/shared/components/ui/field";

export const Route = createFileRoute("/_auth-layout/sign-in")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SignInForm />
        <FieldDescription className="text-center">
          Don't have an account? <Link to="/sign-up">Sign up</Link>
        </FieldDescription>
      </CardContent>
    </Card>
  );
}
