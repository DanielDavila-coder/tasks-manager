import { useNotification } from "../context/NotificationContext";

const notificationStyles = {
  success: "bg-green-600 border-green-500",
  error: "bg-red-600 border-red-500",
  warning: "bg-yellow-500 border-yellow-400 text-zinc-900",
  info: "bg-zinc-700 border-zinc-600",
};

export function Notification() {
  const { notification, clearNotification } = useNotification();

  if (!notification) return null;

  return (
    <div
      className={`fixed left-4 right-4 top-4 z-50 rounded-md border px-4 py-3 text-white shadow-lg sm:left-auto sm:right-6 sm:top-6 sm:max-w-sm ${
        notificationStyles[notification.type] || notificationStyles.info
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm font-medium">{notification.message}</p>

        <button
          type="button"
          onClick={clearNotification}
          className="text-lg leading-none opacity-80 hover:opacity-100"
        >
          x
        </button>
      </div>
    </div>
  );
}

export default Notification;
