import { AuthLayout } from "@/layouts/auth-layout"
import { Link } from "@tanstack/react-router"
import LoginForm from "../components/LoginForm"

export const LoginPage = () => {
  return (
    <AuthLayout>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#222222] mb-3">Sign In</h1>
        <p className="text-lg text-[#222222]/60">Welcome back—pick up where you left off.</p>
      </div>

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
    </AuthLayout>
  )
}
