export const formatCardNumber = (value: string) => {
  if (!value) return "";
  const cleanedValue = value.replace(/\D/g, "");
  const match = cleanedValue.match(/.{1,4}/g);
  return match ? match.join(" ") : cleanedValue;
};