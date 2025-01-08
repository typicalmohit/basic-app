import { theme } from "@/constants/theme";

export const getStatusColor = (
  status: string,
  type: "booking" | "payment" | "oil" = "booking"
) => {
  const statusLower = status.toLowerCase();

  switch (type) {
    case "booking":
      switch (statusLower) {
        case "booked":
          return theme.colors.status.booked;
        case "confirmed":
          return theme.colors.status.confirmed;
        case "completed":
          return theme.colors.status.completed;
        case "cancelled":
          return theme.colors.status.cancelled;
        default:
          return theme.colors.gray;
      }

    case "payment":
      switch (statusLower) {
        case "pending":
          return theme.colors.status.pending;
        case "partial":
          return theme.colors.status.partial;
        case "paid":
          return theme.colors.status.paid;
        case "unpaid":
          return theme.colors.status.unpaid;
        case "completed":
          return theme.colors.status.paid;
        default:
          return theme.colors.status.pending;
      }

    case "oil":
      switch (statusLower) {
        case "included":
          return theme.colors.status.included;
        case "not_included":
          return theme.colors.status.not_included;
        default:
          return theme.colors.status.not_included;
      }

    default:
      return theme.colors.gray;
  }
};
