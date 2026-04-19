export const formatCardValidity = (value: string) => {
  if (!value) return "";
  const cleanedValue = value.replace(/\D/g, "");
  if (cleanedValue.length > 2) {
    return `${cleanedValue.slice(0, 2)}/${cleanedValue.slice(2, 4)}`;
  }
  return cleanedValue;
};