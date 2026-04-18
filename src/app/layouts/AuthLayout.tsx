import { Outlet } from "react-router-dom";

export const AuthLayout = () => (
  <div className="flex min-h-screen items-center justify-center">
    <div className="w-full max-w-md p-6">
      <Outlet />
    </div>
  </div>
);
