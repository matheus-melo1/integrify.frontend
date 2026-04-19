import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import type { ReactNode } from "react";
import { ThemeProvider } from "@/shared/components/theme-provider";
import { TooltipProvider } from "@/shared/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export const AppProviders = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        {children}
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);
