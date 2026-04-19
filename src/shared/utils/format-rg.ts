export function formatRG(rg: string) {
  const rg_value = rg ? rg : "";
  return rg_value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})$/, "$1-$2");
}
