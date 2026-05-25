import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { ROUTES } from "@/app/router/routes";
import { loginSchema, type LoginFormData } from "../schemas/auth.schema";
import { useLoginMutation } from "../services/auth.queries";
import { authService } from "../services/auth.service";

const AUTH_LAYOUT_FADE_MS = 350;

const decodeJwt = (token: string): Record<string, string> => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return {};
  }
};

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const startLoginTransition = useAuthStore((s) => s.startLoginTransition);
  const advanceToFading = useAuthStore((s) => s.advanceToFading);
  const navigate = useNavigate();
  const mutation = useLoginMutation();

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const { access_token, refresh_token, expires_at, refresh_expires_at } =
        await mutation.mutateAsync(data);

      const claims = decodeJwt(access_token);
      const userId = claims.user_id ?? "";
      const email = claims.email ?? data.email;

      const tokens = {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expires_at,
        refreshExpiresAt: refresh_expires_at,
      };

      setAuth(tokens, {
        id: userId,
        name: email.split("@")[0],
        email,
        role: "admin",
      });

      // Busca nome real em background sem bloquear a navegação
      authService.getUser(userId).then((user) => {
        const name = `${user.first_name} ${user.last_name}`.trim() || email.split("@")[0];
        setAuth(tokens, { id: userId, name, email: user.email, role: "admin" });
      }).catch(() => {});

      const canAnimate =
        typeof window !== "undefined" &&
        window.matchMedia("(min-width: 768px)").matches &&
        !!document.querySelector("[data-auth-banner]");

      if (canAnimate) {
        startLoginTransition();
        setTimeout(() => {
          advanceToFading();
          navigate(ROUTES.DASHBOARD);
        }, AUTH_LAYOUT_FADE_MS);
        return;
      }

      navigate(ROUTES.DASHBOARD);
    } catch {
      toast.error("Email ou senha inválidos");
    }
  };

  return {
    control: form.control,
    handleSubmit: form.handleSubmit,
    onSubmit,
    isPendingLogin: mutation.isPending,
  };
};
