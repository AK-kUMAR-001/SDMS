import Layout from "../components/Layout";
import { UpdateProfileForm } from "../components/settings/UpdateProfileForm";
import { ChangePasswordForm } from "../components/settings/ChangePasswordForm";

const Settings = () => {
  return (
    <Layout>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Settings</h1>
      </div>
      <div className="grid gap-6 mt-4">
        <UpdateProfileForm />
        <ChangePasswordForm />
      </div>
    </Layout>
  );
};

export default Settings;