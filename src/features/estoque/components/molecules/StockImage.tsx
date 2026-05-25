import { useState } from "react";
import { RiImageCircleAiLine } from "react-icons/ri";
import { cn } from "@/shared/lib/utils";

type Props = {
  src?: string | null;
  alt: string;
  className?: string;
  iconClassName?: string;
};

export function StockImage({ src, alt, className, iconClassName }: Props) {
  const [hasError, setHasError] = useState(false);
  const hasSrc = !!src && src.length > 0 && !hasError;

  if (!hasSrc) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-neutral-800",
          className,
        )}
      >
        <RiImageCircleAiLine
          aria-label={alt}
          className={cn("size-12 text-neutral-500", iconClassName)}
        />
      </div>
    );
  }

  return (
    <img
      src={src ?? ""}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
