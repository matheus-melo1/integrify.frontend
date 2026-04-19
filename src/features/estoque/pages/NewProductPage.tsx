import { ROUTES } from "@/app/router/routes";
import { NewProductForm } from "../components/organisms/NewProductForm";
import ButtonReturn from "@/shared/components/molecules/ButtonReturn";

const NewProductPage = () => (
  <div className="min-h-full w-full max-w-5xl mx-auto flex flex-col gap-5 p-5">
    <div className="flex flex-col gap-2">
      <ButtonReturn
        className="absolute w-auto h-auto left-5 top-5 z-10"
        text="Estoque"
        to={ROUTES.ESTOQUE}
      />
      <div>
        <h2 className="text-2xl font-light">Novo produto</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Cadastre um novo produto e publique-o no marketplace escolhido.
        </p>
      </div>
    </div>

    <NewProductForm />
  </div>
);

export default NewProductPage;
