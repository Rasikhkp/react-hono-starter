import type { ReactNode } from "react";

type AuthCardProps = {
  children: ReactNode;
};

export default function AuthCard({ children }: AuthCardProps) {
  return (
    <div className="w-full max-w-2xl bg-[#FBFBFB] p-10 md:p-16 rounded-[40px] border border-gray-100 flex flex-col items-center">
      {children}
    </div>
  );
}
