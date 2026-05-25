import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ROUTES } from "@/app/router/routes";
import { formatPrice } from "@/shared/utils/format-price";
import { productSchema, type ProductFormData } from "../schemas/product.schema";
import {
  useCreateStorageMutation,
  useUpdateStorageMutation,
} from "../services/storage.queries";
import type { Stock } from "../types/stock.types";

const createDefaults: ProductFormData = {
  name: "",
  sku: "",
  marketplace: "mercadolibre",
  status: "active",
  stock: "",
  price: "",
  image: "",
  description: "",
};

const stockToFormData = (stock: Stock): ProductFormData => ({
  name: stock.name,
  sku: stock.sku,
  marketplace: stock.marketplace,
  status: stock.status,
  stock: String(stock.stock),
  price: formatPrice(stock.price),
  image: stock.image ?? "",
  description: stock.description ?? "",
});

type UseProductFormOptions = {
  mode?: "create" | "edit";
  initialStock?: Stock;
  onSuccess?: (data: ProductFormData) => void;
  onCancel?: () => void;
};

export const useProductForm = (options: UseProductFormOptions = {}) => {
  const navigate = useNavigate();
  const mode = options.mode ?? "create";
  const isEdit = mode === "edit" && !!options.initialStock;

  const createMutation = useCreateStorageMutation();
  const updateMutation = useUpdateStorageMutation();
  const mutation = isEdit ? updateMutation : createMutation;

  const defaultValues =
    isEdit && options.initialStock
      ? stockToFormData(options.initialStock)
      : createDefaults;

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      if (isEdit && options.initialStock) {
        await updateMutation.mutateAsync({ id: options.initialStock.id, data });
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createMutation.mutateAsync(data);
        toast.success("Produto criado com sucesso!");
      }
      if (options.onSuccess) {
        options.onSuccess(data);
      } else {
        navigate(ROUTES.ESTOQUE);
      }
    } catch {
      toast.error(
        isEdit
          ? "Erro ao atualizar produto. Tente novamente."
          : "Erro ao criar produto. Tente novamente.",
      );
    }
  });

  const onCancel = () => {
    if (options.onCancel) {
      options.onCancel();
    } else {
      navigate(ROUTES.ESTOQUE);
    }
  };

  return {
    control: form.control,
    onSubmit,
    onCancel,
    reset: form.reset,
    isSubmitting: mutation.isPending,
    mode,
  };
};
