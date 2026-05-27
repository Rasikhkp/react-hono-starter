import { ProfileGoogleCard } from "./ProfileGoogleCard";
import { ProfileIdentityCard } from "./ProfileIdentityCard";

export function AccountProfile() {
  return (
    <div className="max-w-lg mx-auto space-y-8">
      <ProfileIdentityCard />
      <ProfileGoogleCard />
    </div>
  );
}
