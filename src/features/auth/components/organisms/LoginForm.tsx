import { InputForm } from "@/shared/components/form/InputForm";
import { useLogin } from "../../hooks/useLogin";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { Lock, Mail } from "lucide-react";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";

export const LoginForm = () => {
  const { control, handleSubmit, onSubmit, isPendingLogin } = useLogin();

  return (
    <div className="flex h-full font-light w-full flex-col items-center justify-center gap-4">
      <div className="space-y-1 text-center">
        <p className="text-3xl font-light tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Bem vindo de volta!
        </p>
        <p className="mb-5 text-lg text-muted-foreground">
          Faça login para continuar.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <InputForm
          name="email"
          control={control}
          label="Email"
          placeholder="Digite o Email"
          type="email"
          className="w-96"
          icon={Mail}
        />

        <InputForm
          name="password"
          control={control}
          label="Senha"
          placeholder="Digite a Senha"
          type="password"
          className="w-96"
          icon={Lock}
        />

        <ShimmerButton
          type="submit"
          disabled={isPendingLogin}
          className="mt-4 w-96 cursor-pointer text-white! py-3 text-sm font-normal"
          shimmerColor={"rgba(255, 255, 255, 1)"}
          background={"#000"}
        >
          {isPendingLogin ? "Entrando..." : "Entrar"}
        </ShimmerButton>
      </form>

      <p className="mt-2 text-center">
        Não tem uma conta?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="cursor-pointer underline hover:text-primary"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  );
};
