import type { ReactNode } from "react";
import { Label } from "@/shared/components/ui/label";
import { cn } from "@/shared/lib/cn";

interface FormFieldProps {
  label: string;
  error?: string;
  children: ReactNode;
  className?: string;
}

export const FormField = ({ label, error, children, className }: FormFieldProps) => (
  <div className={cn("space-y-1.5", className)}>
    <Label>{label}</Label>
    {children}
    {error && <p className="text-sm text-destructive">{error}</p>}
  </div>
);
