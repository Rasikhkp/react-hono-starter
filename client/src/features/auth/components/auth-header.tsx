type AuthHeaderProps = {
  title: string;
  subtitle: string;
};

export default function AuthHeader({ title, subtitle }: AuthHeaderProps) {
  return (
    <div className="text-center mb-10">
      <h1 className="text-3xl font-bold text-[#222222] mb-3">{title}</h1>
      <p className="text-lg text-[#222222]/60">{subtitle}</p>
    </div>
  );
}
