import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react";

const toastBase = [
  // layout
  "group/toast relative flex w-full items-start gap-3 p-4 pr-10",
  "rounded-2xl text-sm text-white/95 select-none",
  "min-h-[3.5rem]",

  // solid surface
  "bg-neutral-900 border border-white/10",

  // depth — outer shadow + subtle colored glow
  "shadow-[0_10px_40px_-12px_rgba(0,0,0,0.7),0_2px_8px_-2px_rgba(0,0,0,0.4)]",

  // per-type accent glow on the ring (subtle)
  "data-[type=success]:shadow-[0_10px_40px_-12px_rgba(16,185,129,0.25),0_2px_8px_-2px_rgba(0,0,0,0.5)]",
  "data-[type=error]:shadow-[0_10px_40px_-12px_rgba(244,63,94,0.3),0_2px_8px_-2px_rgba(0,0,0,0.5)]",
  "data-[type=warning]:shadow-[0_10px_40px_-12px_rgba(245,158,11,0.25),0_2px_8px_-2px_rgba(0,0,0,0.5)]",
  "data-[type=info]:shadow-[0_10px_40px_-12px_rgba(56,189,248,0.25),0_2px_8px_-2px_rgba(0,0,0,0.5)]",
].join(" ");

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      offset={16}
      gap={10}
      icons={{
        success: <CircleCheckIcon className="size-[18px] text-emerald-300" />,
        info: <InfoIcon className="size-[18px] text-sky-300" />,
        warning: <TriangleAlertIcon className="size-[18px] text-amber-300" />,
        error: <OctagonXIcon className="size-[18px] text-rose-300" />,
        loading: (
          <Loader2Icon className="size-[18px] animate-spin text-white/80" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: toastBase,
          icon: "relative z-[1] mt-0.5 shrink-0",
          content: "relative z-[1] flex flex-col gap-0.5 flex-1 min-w-0",
          title: "font-medium leading-tight text-white truncate",
          description: "text-xs text-white/65 leading-relaxed",
          actionButton: [
            "relative z-[1] rounded-lg px-3 py-1.5 text-xs font-medium",
            "bg-white/10 hover:bg-white/20 text-white",
            "border border-white/15 backdrop-blur-md transition-colors",
          ].join(" "),
          cancelButton: [
            "relative z-[1] rounded-lg px-3 py-1.5 text-xs font-medium",
            "bg-transparent hover:bg-white/5 text-white/60 hover:text-white/90",
            "transition-colors",
          ].join(" "),
          closeButton: [
            "!absolute !top-2 !right-2 !left-auto !z-[2]",
            "!size-6 !rounded-full",
            "!bg-white/8 hover:!bg-white/20 !border-white/15",
            "!text-white/70 hover:!text-white",
            "backdrop-blur-md transition-colors",
          ].join(" "),
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
