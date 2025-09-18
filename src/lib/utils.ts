import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatDateForSQL = (date: Date | string) => {
      if (typeof date === "string") {
        return new Date(date).toISOString().split("T")[0];
      }
      return date.toISOString().split("T")[0];
    };

export   const formatDate = (dateInput: Date | string) => {
    const date =
      typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    return format(date, "dd/MM/yyyy");
  };