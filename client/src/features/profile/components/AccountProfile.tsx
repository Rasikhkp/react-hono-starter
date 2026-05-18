import { ProfileGoogleCard } from "./ProfileGoogleCard";
import { ProfileIdentityCard } from "./ProfileIdentityCard";
import { ProfilePasswordCard } from "./ProfilePasswordCard";

export function AccountProfile() {
  return (
    <div className="max-w-lg mx-auto space-y-8">
      <ProfileIdentityCard />
      <ProfilePasswordCard />
      <ProfileGoogleCard />
    </div>
  );
}
