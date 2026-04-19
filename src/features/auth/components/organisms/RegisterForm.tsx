import { InputForm } from "@/shared/components/form/InputForm";
import { Button } from "@/shared/components/ui/button";
import { useRegister } from "../../hooks/useRegister";
import { Link } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";

export const RegisterForm = () => {
  const { control, handleSubmit, onSubmit, isPendingRegister } = useRegister();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <div className="space-y-1 text-center">
        <p className="text-3xl font-semibold">Crie sua conta!</p>
        <p className="mb-5 text-lg text-muted-foreground">
          Preencha os dados para se cadastrar.
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <InputForm
          name="name"
          control={control}
          label="Nome"
          placeholder="Digite o Nome"
          className="w-96"
        />

        <InputForm
          name="email"
          control={control}
          label="Email"
          placeholder="Digite o Email"
          type="email"
          className="w-96"
        />

        <InputForm
          name="password"
          control={control}
          label="Senha"
          placeholder="Digite a Senha"
          type="password"
          className="w-96"
        />

        <InputForm
          name="confirmPassword"
          control={control}
          label="Confirme a senha"
          placeholder="Digite a Senha"
          type="password"
          className="w-96"
        />

        <Button
          type="submit"
          disabled={isPendingRegister}
          className="mt-4 w-96 cursor-pointer py-6 text-lg font-semibold"
        >
          {isPendingRegister ? "Cadastrando..." : "Cadastrar"}
        </Button>
      </form>

      <p className="mt-2 text-center">
        Já tem uma conta?{" "}
        <Link
          to={ROUTES.LOGIN}
          className="cursor-pointer underline hover:text-primary"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
};
