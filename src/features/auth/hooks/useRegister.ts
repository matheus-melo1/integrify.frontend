import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/app/router/routes";
import { registerSchema, type RegisterFormData } from "../schemas/auth.schema";

export const useRegister = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = (data: RegisterFormData) => {
    if (data.password !== data.confirmPassword) {
      return;
    }
    setAuth(
      {
        accessToken: "mock-token",
        refreshToken: "mock-refresh",
        expiresAt: "",
        refreshExpiresAt: "",
      },
      {
        id: "1",
        name: data.name,
        email: data.email,
        role: "admin",
      },
    );
    navigate(ROUTES.DASHBOARD);
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit,
    isPendingRegister: false,
  };
};
