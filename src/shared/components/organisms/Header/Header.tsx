import { Button } from "@/shared/components/ui/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { Menu, LogOut } from "lucide-react";

export const Header = () => {
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background px-4">
      <Button variant="ghost" size="icon" onClick={toggleSidebar}>
        <Menu />
      </Button>
      <div className="flex items-center gap-3">
        {user && <span className="text-sm text-muted-foreground">{user.email}</span>}
        <Button variant="ghost" size="icon" onClick={logout}>
          <LogOut />
        </Button>
      </div>
    </header>
  );
};
