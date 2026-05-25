import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/app/router/routes";
import { Skeleton } from "@/shared/components/ui/skeleton";
import ButtonReturn from "@/shared/components/molecules/ButtonReturn";
import { NewProductForm } from "../components/organisms/NewProductForm";
import { useStorageQuery } from "../services/storage.queries";

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useStorageQuery(id ?? "");

  useEffect(() => {
    if (isError) {
      toast.error("Produto não encontrado");
      navigate(ROUTES.ESTOQUE);
    }
  }, [isError, navigate]);

  return (
    <div className="min-h-full w-full max-w-5xl mx-auto flex flex-col gap-5 p-5">
      <div className="flex flex-col gap-2">
        <ButtonReturn
          className="absolute w-auto h-auto left-5 top-5 z-10"
          text="Estoque"
          to={ROUTES.ESTOQUE}
        />
        <div>
          <h2 className="text-2xl font-light">Editar produto</h2>
          <p className="text-xs text-muted-foreground mt-1">
            Atualize os dados do produto e salve as alterações.
          </p>
        </div>
      </div>

      {isLoading || !data ? (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
      ) : (
        <NewProductForm mode="edit" initialStock={data} />
      )}
    </div>
  );
};

export default EditProductPage;
