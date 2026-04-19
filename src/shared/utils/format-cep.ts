export function formatCEP(value: string): string {
  const values = value ? value : "";
  return values
    .replace(/\D/g, "")
    .replace(/^(\d{5})(\d)/, "$1-$2")
    .slice(0, 9);
}
