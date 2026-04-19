export default function parseCurrencyBR(valueStr: string) {
  return Number(
    String(valueStr)
      .replace(/[^\d,]/g, "") // mantém apenas dígitos e vírgula
      .replace(",", "."), // troca vírgula por ponto
  );
}
