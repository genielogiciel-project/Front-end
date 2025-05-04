import { RequestStatus } from "@/lib/types";

interface StatusBadgeProps {
  status: RequestStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig: Record<
    RequestStatus,
    { className: string; label: string }
  > = {
    VALIDATED: {
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
      label: "Approuvé",
    },
    REJECTED: {
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
      label: "Rejeté",
    },
    SUBMITTED: {
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
      label: "En attente",
    },
    SENT: {
      className:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
      label: "Envoyé",
    },
  };

  const config = statusConfig[status] || {
    className: "bg-gray-100 text-gray-800",
    label: status,
  };

  return (
    <div
      className={`px-2 py-1 rounded-full text-xs font-medium ${config.className} text-nowrap`}
    >
      {config.label}
    </div>
  );
}
