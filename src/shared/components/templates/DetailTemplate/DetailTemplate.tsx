import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface DetailTemplateProps {
  title: string;
  backRoute?: string;
  actions?: ReactNode;
  children: ReactNode;
}

export const DetailTemplate = ({ title, backRoute, actions, children }: DetailTemplateProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {backRoute && (
            <Button variant="ghost" size="icon" onClick={() => navigate(backRoute)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {children}
    </div>
  );
};
