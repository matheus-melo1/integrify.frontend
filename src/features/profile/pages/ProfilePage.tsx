import { useIsMobile } from "@/shared/hooks/use-mobile";
import { useProfileData } from "../hooks/useProfileData";
import { ProfileHero } from "../components/organisms/ProfileHero";
import { ProfileStats } from "../components/organisms/ProfileStats";
import { ProfileMobileMenu } from "../components/organisms/ProfileMobileMenu";
import { ProfileWorkTabs } from "../components/organisms/ProfileWorkTabs";

const ProfilePage = () => {
  const profile = useProfileData();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col gap-5">
      <ProfileHero profile={profile} isMobile={isMobile} />
      {isMobile ? (
        <>
          <ProfileStats profile={profile} compact />
          <ProfileMobileMenu />
        </>
      ) : (
        <ProfileWorkTabs profile={profile} />
      )}
    </div>
  );
};

export default ProfilePage;
