import { AlertTriangle, Trash2 } from "lucide-react";

function ConfirmDelete({
  title,
  message,
  details = [],
  confirmText,
  cancelText,
  loadingText,
  isLoading = false,
  variant = "default",
  onConfirm,
  onCancel,
}) {
  const isDanger = variant === "danger";

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 ${
        isDanger ? "bg-black/70" : "bg-black/60"
      }`}
      onClick={(e) => {
        e.stopPropagation();
        if (!isLoading) onCancel();
      }}
    >
      <div
        className={`w-full rounded-md p-6 ${
          isDanger
            ? "max-w-lg border border-red-500/40 bg-zinc-900 shadow-[0_24px_90px_rgba(239,68,68,0.18)]"
            : "max-w-md border border-zinc-700 bg-zinc-800 shadow-xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {isDanger ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-500/15 text-red-300">
              <AlertTriangle size={26} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-red-200">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{message}</p>
            </div>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-300">{message}</p>
          </>
        )}

        {details.length > 0 && (
          <div className="mt-5 rounded-md border border-red-500/25 bg-red-500/10 p-4">
            <p className="text-sm font-semibold text-red-200">
              You are about to permanently remove:
            </p>
            <ul className="mt-3 space-y-2 text-sm text-zinc-300">
              {details.map((detail) => (
                <li key={detail}>- {detail}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isLoading}
            onClick={onCancel}
            className="rounded-md bg-zinc-700 px-4 py-2 text-white hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cancelText || "Cancel"}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDanger && <Trash2 size={18} />}
            {isLoading ? loadingText || "Deleting..." : confirmText || "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDelete;
