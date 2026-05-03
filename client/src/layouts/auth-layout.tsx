import type { ReactNode } from "react"

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-[#F5F5F3] flex flex-col items-center justify-center p-6 tracking-widest">

      {/* Branding */}
      <div className="mb-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-[#222222]">Finora</h2>
      </div>

      {/* Card */}
      <div className="w-full max-w-2xl bg-[#FBFBFB] p-10 md:p-16 rounded-[40px] border border-gray-100 flex flex-col items-center">
        {children}
      </div>

      {/* Footer */}
      <footer className="mt-12 text-sm text-gray-400">
        © 2026 Finora Inc.
      </footer>
    </div>
  )
}
