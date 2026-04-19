import { Link } from "react-router-dom";
import GradientBorder from "./GradientBorder/GradientBorder";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/shared/lib/cn";

interface Props {
  className?: string;
  children?: React.ReactNode;
  text: string;
  to: string;
}

export default function ButtonReturn(props: Props) {
  const { className, text, to } = props;

  return (
    <Link to={to}>
      <GradientBorder
        className={cn(
          className,
          "w-auto h-auto p-[0.8px]! from-white/30 via-white/5  to-white/20 rounded-xl!",
        )}
      >
        <Button
          variant="secondary"
          className="h-7 px-2 flex text-xs text-muted-foreground gap-1.5 w-fit"
        >
          <ArrowLeft size={14} />
          {text}
        </Button>
      </GradientBorder>
    </Link>
  );
}
