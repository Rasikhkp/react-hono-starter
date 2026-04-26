type AuthInputFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export default function AuthInputField({
  value,
  onValueChange,
  label,
  type = "text",
  placeholder,
}: AuthInputFieldProps) {
  return (
    <div className="mb-6 w-full text-left">
      <label className="block text-sm font-medium text-[#222222]/70 mb-2 ml-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onValueChange?.(e.target.value)}
        className="w-full px-6 py-4 bg-white border border-gray-200 rounded-full text-[#222222] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FBD545]/50 focus:border-[#FBD545] transition"
      />
    </div>
  );
}
