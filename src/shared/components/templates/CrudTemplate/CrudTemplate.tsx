import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { SearchBar } from "@/shared/components/molecules/SearchBar/SearchBar";
import { Plus } from "lucide-react";

interface CrudTemplateProps {
  title: string;
  createRoute?: string;
  createLabel?: string;
  search?: string;
  onSearchChange?: (value: string) => void;
  children: ReactNode;
}

export const CrudTemplate = ({
  title,
  createRoute,
  createLabel = "Novo",
  search,
  onSearchChange,
  children,
}: CrudTemplateProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">{title}</h1>
      {createRoute && (
        <Button render={<Link to={createRoute} />}>
          <Plus className="mr-2 h-4 w-4" />
          {createLabel}
        </Button>
      )}
    </div>

    {onSearchChange && <SearchBar value={search ?? ""} onChange={onSearchChange} />}

    {children}
  </div>
);
