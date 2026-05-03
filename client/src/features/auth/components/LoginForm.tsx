import { useState } from "react";
import AuthInputField from "./auth-input-field";

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit() {
    console.log('masuk')

    const res = await fetch("http://localhost:4000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      console.log("error", data);
      return;
    }

    console.log("data", data);
  }

  return (
    <form className="w-full" onSubmit={(e) => e.preventDefault()}>
      <AuthInputField
        value={email}
        onValueChange={setEmail}
        label="Email Address"
        placeholder="name@company.com"
      />
      <AuthInputField
        value={password}
        onValueChange={setPassword}
        label="Password"
        type="password"
        placeholder="Enter your password"
      />

      <div className="flex justify-end mb-8 -mt-2">
        <a
          href="#"
          className="text-sm text-gray-500 hover:text-[#222222] transition"
        >
          Forgot password?
        </a>
      </div>

      <button
        onClick={submit}
        type="submit"
        className="cursor-pointer w-full flex items-center justify-center bg-[#7bd596] text-[#222222] font-bold text-lg py-4 px-8 rounded-full shadow-md hover:bg-[#6ac285] transition duration-150 active:scale-[0.98]"
      >
        Login
      </button>
    </form>
  );
}
