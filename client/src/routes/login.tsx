import AuthCard from '#/modules/auth/components/auth-card';
import AuthHeader from '#/modules/auth/components/auth-header';
import LoginForm from '#/modules/auth/components/login-form';
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col items-center justify-center p-6 tracking-widest">

      {/* Branding */}
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-[#222222]">Finora</h2>
      </div>

      {/* Card */}
      <AuthCard>
        <AuthHeader
          title="Sign In"
          subtitle="Welcome back—pick up where you left off."
        />
        <LoginForm />


        <p className="text-base text-[#222222]/90 mt-12">
          New to Finora?{" "}
          <Link
            to="/register"
            className="font-semibold text-[#7BD597] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </AuthCard>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400">
        © 2026 Finora Inc.
      </footer>
    </div>
  );
}
