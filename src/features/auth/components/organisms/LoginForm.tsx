import { InputForm } from "@/shared/components/form/InputForm";
import { useLogin } from "../../hooks/useLogin";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { Lock, Mail } from "lucide-react";
import { ShimmerButton } from "@/shared/components/ui/shimmer-button";

const LOGIN_FORM_ID = "login-form";

export const LoginForm = () => {
  const { control, handleSubmit, onSubmit, isPendingLogin } = useLogin();

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 px-6 font-light overflow-y-auto max-md:pt-28 max-md:pb-8 md:justify-center">
      <div className="order-1 w-full max-w-sm space-y-1 text-center">
        <p className="text-2xl sm:text-3xl font-light tracking-tight bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent">
          Bem vindo de volta!
        </p>
        <p className="mb-5 text-base sm:text-lg text-muted-foreground">
          Faça login para continuar.
        </p>
      </div>

      <form
        id={LOGIN_FORM_ID}
        className="order-2 flex w-full max-w-sm flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputForm
          name="email"
          control={control}
          label="Email"
          placeholder="Digite o Email"
          type="email"
          className="w-full"
          icon={Mail}
        />

        <InputForm
          name="password"
          control={control}
          label="Senha"
          placeholder="Digite a Senha"
          type="password"
          className="w-full"
          icon={Lock}
        />
      </form>

      <p className="order-3 md:order-4 max-md:mt-auto text-center text-sm sm:text-base">
        Não tem uma conta?{" "}
        <Link
          to={ROUTES.REGISTER}
          className="cursor-pointer underline hover:text-primary"
        >
          Cadastre-se
        </Link>
      </p>

      <ShimmerButton
        form={LOGIN_FORM_ID}
        type="submit"
        disabled={isPendingLogin}
        className="order-4 md:order-3 w-full max-w-sm cursor-pointer text-white! py-3 text-sm font-normal"
        shimmerColor={"rgba(255, 255, 255, 1)"}
        background={"#000"}
      >
        {isPendingLogin ? "Entrando..." : "Entrar"}
      </ShimmerButton>
    </div>
  );
};
