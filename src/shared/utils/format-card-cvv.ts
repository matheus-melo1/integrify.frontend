export const formatCardCvv = (value: string) => {
  if (!value) return "";
  const cleanedValue = value.replace(/\D/g, "");
  return cleanedValue.slice(0, 4);
};