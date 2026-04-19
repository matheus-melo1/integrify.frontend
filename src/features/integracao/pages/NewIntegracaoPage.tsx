import { ROUTES } from "@/app/router/routes";
import { NewIntegrationForm } from "../components/organisms/NewIntegrationForm";
import ButtonReturn from "@/shared/components/molecules/ButtonReturn";

const NewIntegracaoPage = () => (
  <div className="min-h-full w-full max-w-5xl mx-auto flex flex-col gap-6">
    <div className="flex flex-col gap-2">
      <ButtonReturn
        className="absolute w-auto h-auto left-5 top-5 z-10"
        text="Integrações"
        to={ROUTES.INTEGRACAO}
      />
      <div>
        <h2 className="text-2xl font-light">Nova integração</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Conecte mais um marketplace à sua carteira em dois passos.
        </p>
      </div>
    </div>

    <NewIntegrationForm />
  </div>
);

export default NewIntegracaoPage;
