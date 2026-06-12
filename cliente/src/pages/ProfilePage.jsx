import { useState } from "react";
import { formatDate } from "../utils/formatDate";
import {
  AlertTriangle,
  CalendarDays,
  KeyRound,
  Mail,
  Pencil,
  ShieldCheck,
  Trash2,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmDelete from "../components/ConfirmDelete";
import PageGlow from "../components/PageGlow";

function ProfilePage() {
  const {
    user,
    updateUsername,
    updateEmail,
    updatePassword,
    deleteAccount,
    updateAvatar,
  } = useAuth();
  const [activePanel, setActivePanel] = useState(null);

  const [usernameValue, setUsernameValue] = useState(user?.username || "");
  const [emailValue, setEmailValue] = useState(user?.email || "");
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [passwordValue, setPasswordValue] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const accountCreated = formatDate(user?.createdAt, "Not available");

  const clearProfileFeedback = () => {
    setProfileMessage("");
    setProfileError("");
  };

  const handleUpdateUsername = async (e) => {
    e.preventDefault();

    clearProfileFeedback();

    const result = await updateUsername(usernameValue);

    if (result.ok) {
      setProfileMessage("Username updated successfully");
      setActivePanel(null);
    } else {
      setProfileError(result.errors[0]);
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();

    clearProfileFeedback();

    const result = await updateEmail(emailValue);

    if (result.ok) {
      setProfileMessage("Email updated successfully");
      setActivePanel(null);
    } else {
      setProfileError(result.errors[0]);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    clearProfileFeedback();

    if (passwordValue.newPassword !== passwordValue.confirmPassword) {
      setProfileError("New passwords do not match");
      return;
    }

    const result = await updatePassword({
      currentPassword: passwordValue.currentPassword,
      newPassword: passwordValue.newPassword,
    });

    if (result.ok) {
      setProfileMessage("Password updated successfully");
      setActivePanel(null);
      setPasswordValue({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      setProfileError(result.errors[0]);
    }
  };

  const handleDeleteAccount = async () => {
    clearProfileFeedback();
    setIsDeletingAccount(true);

    const result = await deleteAccount();

    if (result.ok) {
      window.location.replace("/");
    } else {
      setProfileError(result.errors[0]);
      setIsDeletingAccount(false);
      setShowDeleteAccountModal(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    clearProfileFeedback();

    if (!file.type.startsWith("image/")) {
      setProfileError("Please select an image file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Image must be smaller than 2MB");
      return;
    }

    const result = await updateAvatar(file);

    if (result.ok) {
      setProfileMessage("Profile photo updated successfully");
    } else {
      setProfileError(result.errors[0]);
    }

    e.target.value = "";
  };

  return (
    <div className="relative isolate flex min-h-[calc(100vh-120px)] items-start justify-center px-4 py-8">
      <PageGlow />

      <section className="w-full max-w-2xl rounded-md border border-zinc-700 bg-zinc-800/85 p-5 shadow-[0_24px_90px_rgba(147,51,234,0.10)] sm:p-8">
        <header className="mb-8">
          <label className="group relative mb-4 flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-purple-600/20 text-purple-300 ">
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt="Profile"
                className="h-full w-full object-cover transition duration-300 ease-in-out group-hover:scale-110"
              />
            ) : (
              <User size={38} />
            )}

            <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
              Change
            </span>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>

          <h1 className="text-3xl font-bold ">Profile</h1>
          <p className="mt-1 text-zinc-400">
            Manage your personal information and account security.
          </p>
        </header>

        <div className="space-y-4">
          <div className="rounded-md border border-zinc-700 bg-zinc-900/30 p-5">
            <h2 className="mb-4 text-xl font-bold">Personal Information</h2>

            <div className="grid gap-4">
              <div className="flex items-center gap-3">
                <User size={20} className="text-purple-300" />
                <div>
                  <p className="text-sm text-zinc-400">Username</p>
                  <p className="font-semibold">{user?.username}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={20} className="text-purple-300" />
                <div>
                  <p className="text-sm text-zinc-400">Email</p>
                  <p className="break-all font-semibold">{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <CalendarDays size={20} className="text-purple-400" />
                <div>
                  <p className="text-sm text-zinc-400">Account created</p>
                  <p className="font-semibold">{accountCreated}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-zinc-700 bg-zinc-900/30 p-5">
            <h2 className="mb-4 text-xl font-bold">Account settings</h2>

            <div className="grid gap-3 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setActivePanel("username")}
                className="flex items-center justify-start gap-2 rounded-md bg-zinc-700 px-4 py-3 hover:bg-zinc-600"
              >
                <Pencil size={18} />
                Username
              </button>

              <button
                type="button"
                onClick={() => setActivePanel("email")}
                className="flex items-center justify-start gap-2 rounded-md bg-zinc-700 px-4 py-3 hover:bg-zinc-600"
              >
                <Mail size={18} />
                Email
              </button>

              <button
                type="button"
                onClick={() => setActivePanel("password")}
                className="flex items-center justify-start gap-2 rounded-md bg-zinc-700 px-4 py-3 hover:bg-zinc-600"
              >
                <KeyRound size={18} />
                Password
              </button>
            </div>

            {activePanel && (
              <div className="mt-5 rounded-md border border-zinc-700 bg-zinc-800 p-4">
                <div className="flex items-start gap-2 text-zinc-300">
                  <ShieldCheck size={18} className="text-purple-300" />
                  <div className="flex-1">
                    {activePanel === "username" && (
                      <form
                        onSubmit={handleUpdateUsername}
                        className="space-y-3"
                      >
                        <label
                          htmlFor="username"
                          className="text-sm text-zinc-300"
                        >
                          New username
                        </label>

                        <input
                          id="username"
                          type="text"
                          value={usernameValue}
                          onChange={(e) => setUsernameValue(e.target.value)}
                          className="w-full rounded-md bg-zinc-700 px-4 py-2 text-white"
                          placeholder="New username"
                        />

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePanel(null);
                              setUsernameValue(user?.username || "");
                              clearProfileFeedback();
                            }}
                            className="rounded-md bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 hover:bg-indigo-700"
                          >
                            Save username
                          </button>
                        </div>
                      </form>
                    )}

                    {activePanel === "email" && (
                      <form onSubmit={handleUpdateEmail} className="space-y-3">
                        <label
                          htmlFor="email"
                          className="text-sm text-zinc-300"
                        >
                          New email
                        </label>

                        <input
                          id="email"
                          type="email"
                          value={emailValue}
                          onChange={(e) => setEmailValue(e.target.value)}
                          className="w-full rounded-md bg-zinc-700 px-4 py-2 text-white"
                          placeholder="New email"
                        />

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePanel(null);
                              setEmailValue(user?.email || "");
                              clearProfileFeedback();
                            }}
                            className="rounded-md bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 hover:bg-indigo-700"
                          >
                            Save email
                          </button>
                        </div>
                      </form>
                    )}

                    {activePanel === "password" && (
                      <form
                        onSubmit={handleUpdatePassword}
                        className="space-y-3"
                      >
                        <label
                          htmlFor="currentPassword"
                          className="text-sm text-zinc-300"
                        >
                          Current password
                        </label>

                        <input
                          id="currentPassword"
                          type="password"
                          value={passwordValue.currentPassword}
                          onChange={(e) =>
                            setPasswordValue({
                              ...passwordValue,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-md bg-zinc-700 px-4 py-2 text-white"
                          placeholder="Current password"
                        />

                        <label
                          htmlFor="newPassword"
                          className="text-sm text-zinc-300"
                        >
                          New password
                        </label>

                        <input
                          id="newPassword"
                          type="password"
                          value={passwordValue.newPassword}
                          onChange={(e) =>
                            setPasswordValue({
                              ...passwordValue,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-md bg-zinc-700 px-4 py-2 text-white"
                          placeholder="New password"
                        />

                        <label
                          htmlFor="confirmPassword"
                          className="text-sm text-zinc-300"
                        >
                          Confirm new password
                        </label>

                        <input
                          id="confirmPassword"
                          type="password"
                          value={passwordValue.confirmPassword}
                          onChange={(e) =>
                            setPasswordValue({
                              ...passwordValue,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full rounded-md bg-zinc-700 px-4 py-2 text-white"
                          placeholder="Confirm new password"
                        />

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setActivePanel(null);
                              setPasswordValue({
                                currentPassword: "",
                                newPassword: "",
                                confirmPassword: "",
                              });
                              clearProfileFeedback();
                            }}
                            className="rounded-md bg-zinc-700 px-4 py-2 hover:bg-zinc-600"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="rounded-md bg-indigo-600 px-4 py-2 hover:bg-indigo-700"
                          >
                            Save password
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {profileMessage && (
            <p className="mb-3 rounded-md bg-green-600 px-4 py-2 text-sm text-white">
              {profileMessage}
            </p>
          )}

          {profileError && (
            <p className="mb-3 rounded-md bg-red-600 px-4 py-2 text-sm text-white">
              {profileError}
            </p>
          )}

          <div className="rounded-md border border-red-500/30 bg-red-500/10 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
              <AlertTriangle className="mt-1 text-red-400" size={22} />

              <div className="flex-1">
                <h2 className="text-xl font-bold text-red-300">Danger zone</h2>
                <p className="mt-1 text-sm text-zinc-300">
                  Delete your account and all tasks permanently. This action
                  cannot be undone.
                </p>

                <button
                  type="button"
                  onClick={() => setShowDeleteAccountModal(true)}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 sm:w-auto"
                >
                  <Trash2 size={18} />
                  Delete account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showDeleteAccountModal && (
        <ConfirmDelete
          title="Delete account permanently?"
          message="This will delete your account, all your tasks, and your saved progress. This action cannot be undone."
          details={[
            "Your profile information",
            "Every task connected to this account",
            "Your dashboard history and progress",
          ]}
          confirmText="Delete account"
          cancelText="Cancel"
          loadingText="Deleting..."
          isLoading={isDeletingAccount}
          variant="danger"
          onCancel={() => setShowDeleteAccountModal(false)}
          onConfirm={handleDeleteAccount}
        />
      )}
    </div>
  );
}

export default ProfilePage;
