import { useGetMyUser, useUpdateMyUser } from "@/api/MyUserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

const UserProfilePage = () => {
  const { updateUser, isLoading } = useUpdateMyUser();
  const { user, isPending } = useGetMyUser();

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (!user) {
    return <div>Uuable to load user profile</div>;
  }
  return (
    <UserProfileForm
      currentUser={user}
      onSave={updateUser}
      isLoading={isLoading}
    />
  );
};

export default UserProfilePage;
