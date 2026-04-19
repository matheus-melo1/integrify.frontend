import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/app/router/routes";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const startLoginTransition = useAuthStore((s) => s.startLoginTransition);
  const navigate = useNavigate();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: LoginFormData) => {
    setAuth("mock-token", {
      id: "1",
      name: "Mock User",
      email: data.email,
      role: "admin",
    });

    const canAnimate =
      typeof window !== "undefined" &&
      window.matchMedia("(min-width: 768px)").matches &&
      !!document.querySelector("[data-auth-banner]");

    if (canAnimate) {
      startLoginTransition();
    } else {
      navigate(ROUTES.DASHBOARD);
    }
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit,
    isPendingLogin: false,
  };
};
