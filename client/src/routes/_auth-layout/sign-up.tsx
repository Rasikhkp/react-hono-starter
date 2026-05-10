import { createFileRoute, Link } from "@tanstack/react-router";
import { SignUpForm } from "@/features/auth/components/SignUpForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FieldDescription } from "@/shared/components/ui/field";

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
        <FieldDescription className="text-center">
          Already have an account? <Link to="/sign-in">Sign in</Link>
        </FieldDescription>
      </CardContent>
    </Card>
  );
}
