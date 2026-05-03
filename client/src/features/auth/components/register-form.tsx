import AuthInputField from "./auth-input-field";

export default function RegisterForm() {
  return (
    <form className="max-w-2xl" onSubmit={(e) => e.preventDefault()}>

      <AuthInputField
        label="Full Name"
        placeholder="John Doe"
      />

      <AuthInputField
        label="Email Address"
        type="email"
        placeholder="name@company.com"
      />

      <div className="flex gap-4 max-w-xl">
        <AuthInputField
          label="Password"
          type="password"
          placeholder="Create a password"
        />

        <AuthInputField
          label="Confirm Password"
          type="password"
          placeholder="Re-enter your password"
        />
      </div>

      <button
        type="submit"
        className="w-full mt-10 cursor-pointer flex items-center justify-center bg-[#7BD597] text-[#222222] font-bold text-lg py-4 px-8 rounded-full shadow-md hover:bg-[#6ac285] transition duration-150 active:scale-[0.98]"
      >
        Create Account
      </button>
    </form>
  );
}
