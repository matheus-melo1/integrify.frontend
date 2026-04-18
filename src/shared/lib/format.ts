import { format as dfFormat } from "date-fns";

export const formatDate = (date: Date | string, pattern = "dd/MM/yyyy") =>
  dfFormat(typeof date === "string" ? new Date(date) : date, pattern);

export const formatCurrency = (value: number, currency = "BRL", locale = "pt-BR") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
