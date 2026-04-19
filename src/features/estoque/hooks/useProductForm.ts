import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { productSchema, type ProductFormData } from "../schemas/product.schema";

const defaultValues: ProductFormData = {
  name: "",
  sku: "",
  marketplace: "mercado-livre",
  status: "active",
  quantity: "",
  price: "",
  imageUrl: "",
  description: "",
};

export const useProductForm = () => {
  const navigate = useNavigate();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit((data) => {
    // TODO: integrar com serviço TanStack Query (product.service.ts)
    console.log("[new product]", data);
    navigate(ROUTES.ESTOQUE);
  });

  const onCancel = () => navigate(ROUTES.ESTOQUE);

  return {
    control: form.control,
    onSubmit,
    onCancel,
    isSubmitting: form.formState.isSubmitting,
  };
};
