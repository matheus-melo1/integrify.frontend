export const formatPrice = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

export const formatPriceInput = (value: string | number): string => {
  if (!value) return "R$ 0,00";

  const numericValue = Number(
    String(value).replace(/\D/g, ""), // Remove tudo que não é dígito
  );

  return (numericValue / 100).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};
