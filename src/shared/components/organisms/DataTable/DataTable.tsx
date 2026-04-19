import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { EmptyState } from "@/shared/components/molecules/EmptyState/EmptyState";

export interface ColumnDef<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[];
  rows: T[];
  isLoading?: boolean;
  emptyTitle?: string;
}

export const DataTable = <T,>({
  columns,
  rows,
  isLoading,
  emptyTitle = "Nenhum registro encontrado",
}: DataTableProps<T>) => {
  if (isLoading) return <div className="py-8 text-center text-sm text-muted-foreground">Carregando...</div>;
  if (rows.length === 0) return <EmptyState title={emptyTitle} />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead key={col.key}>{col.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {columns.map((col) => (
              <TableCell key={col.key}>{col.cell(row)}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
