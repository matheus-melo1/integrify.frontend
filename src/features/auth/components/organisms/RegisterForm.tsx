import { InputForm } from "@/shared/components/form/InputForm";
import { Button } from "@/shared/components/ui/button";
import { useRegister } from "../../hooks/useRegister";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";

const REGISTER_FORM_ID = "register-form";

export const RegisterForm = () => {
  const { control, handleSubmit, onSubmit, isPendingRegister } = useRegister();

  return (
    <div className="flex h-full w-full flex-col items-center gap-4 px-6 overflow-y-auto max-md:pt-28 max-md:pb-8 md:justify-center">
      <div className="order-1 w-full max-w-sm space-y-1 text-center">
        <p className="text-2xl sm:text-3xl font-semibold">Crie sua conta!</p>
        <p className="mb-5 text-base sm:text-lg text-muted-foreground">
          Preencha os dados para se cadastrar.
        </p>
      </div>

      <form
        id={REGISTER_FORM_ID}
        className="order-2 flex w-full max-w-sm flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <InputForm
          name="name"
          control={control}
          label="Nome"
          placeholder="Digite o Nome"
          className="w-full"
        />

        <InputForm
          name="email"
          control={control}
          label="Email"
          placeholder="Digite o Email"
          type="email"
          className="w-full"
        />

        <InputForm
          name="password"
          control={control}
          label="Senha"
          placeholder="Digite a Senha"
          type="password"
          className="w-full"
        />

        <InputForm
          name="confirmPassword"
          control={control}
          label="Confirme a senha"
          placeholder="Digite a Senha"
          type="password"
          className="w-full"
        />
      </form>

      <p className="order-3 md:order-4 max-md:mt-auto text-center text-sm sm:text-base">
        Já tem uma conta?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="cursor-pointer underline hover:text-primary"
        >
          Entrar
        </Link>
      </p>

      <Button
        form={REGISTER_FORM_ID}
        type="submit"
        disabled={isPendingRegister}
        className="order-4 md:order-3 w-full max-w-sm cursor-pointer py-6 text-base sm:text-lg font-semibold"
      >
        {isPendingRegister ? "Cadastrando..." : "Cadastrar"}
      </Button>
    </div>
  );
};
