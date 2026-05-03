import { Logout } from "iconsax-reactjs";
import { useState } from "react";

export default function UserMenu() {
  const [open, setOpen] = useState(false);

  const user = {
    name: "Rasikh Khalil",
    email: "user@email.com",
  };

  return (
    <div className="relative tracking-widest">
      {/* Trigger */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 flex items-center justify-center rounded-full transition-all cursor-pointer bg-[#7BD597] hover:opacity-90"
      >
        <span className="text-sm font-semibold text-white">
          {user.name.charAt(0)}
        </span>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Popover */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 z-20 rounded-xl border border-gray-200 bg-white shadow-lg p-4">

          {/* Avatar + User Info */}
          <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-[#7BD597] flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {user.name.charAt(0)}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Actions */}
          <button
            onClick={() => {
              setOpen(false);
              console.log("logout");
            }}
            className="cursor-pointer w-full flex items-center gap-3 mt-3 text-left text-sm text-red-500 hover:bg-red-50 rounded-md px-2 py-2 transition"
          >
            <Logout size={16} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
