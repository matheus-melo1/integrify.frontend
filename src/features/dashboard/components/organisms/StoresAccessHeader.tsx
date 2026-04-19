import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";

export function StoresAccessHeader() {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h2 className="text-2xl font-light">Minhas Lojas</h2>
        <p className="text-xs text-muted-foreground mt-1">
          3 pessoas e <span className="text-foreground">@matheus</span> têm acesso.
        </p>
      </div>
      <Select defaultValue="finance">
        <SelectTrigger className="w-[130px] h-8 text-xs bg-neutral-900 border-neutral-800">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="finance">Finanças</SelectItem>
          <SelectItem value="ops">Operações</SelectItem>
          <SelectItem value="marketing">Marketing</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
