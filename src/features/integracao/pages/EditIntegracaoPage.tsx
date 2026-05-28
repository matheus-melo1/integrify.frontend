import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { ROUTES } from "@/app/router/routes";
import ButtonReturn from "@/shared/components/molecules/ButtonReturn";
import { IntegrationFormView } from "../components/organisms/IntegrationFormView";
import { useEditIntegration } from "../hooks/useEditIntegration";

const EditIntegracaoPage = () => {
  const { id } = useParams<{ id: string }>();
  const controller = useEditIntegration(id!);

  return (
    <div className="min-h-full w-full max-w-5xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <ButtonReturn
          className="absolute w-auto h-auto left-5 top-5 z-10"
          text="Integrações"
          to={ROUTES.INTEGRACAO}
        />
        <div>
          <h2 className="text-2xl font-light">Editar integração</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Atualize as configurações desta integração.
          </p>
        </div>
      </div>

      {controller.isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <IntegrationFormView controller={controller} submitLabel="Salvar alterações" />
      )}
    </div>
  );
};

export default EditIntegracaoPage;
