import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { to } from "@/shared/lib/to";
import {
  integrationSchema,
  type IntegrationFormData,
} from "../schemas/integration.schema";
import type { MarketplaceOption } from "../types/integration.types";
import {
  useIntegrationQuery,
  useUpdateIntegrationMutation,
} from "../services/integration.queries";

const OPTIONS: MarketplaceOption[] = [
  {
    marketplace: "mercadolibre",
    description: "Conecte sua conta do Mercado Livre via OAuth.",
  },
  {
    marketplace: "shoppe",
    description: "Sincronize anúncios e pedidos da sua loja Shopee.",
  },
  { marketplace: "amazon", description: "Vendor Central · Brasil." },
  {
    marketplace: "magalu",
    description: "Integre seu seller Magalu via API.",
  },
];

export const useEditIntegration = (id: string) => {
  const navigate = useNavigate();
  const marketplaceOptions = useMemo(() => OPTIONS, []);
  const { data, isLoading } = useIntegrationQuery(id);
  const { mutateAsync, isPending } = useUpdateIntegrationMutation(id);

  const form = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    mode: "onChange",
    defaultValues: {
      marketplace: "mercadolibre",
      name: "",
      api_key: "",
      stock_sync: true,
      order_sync: true,
    },
  });

  useEffect(() => {
    if (!data) return;
    form.reset({
      marketplace: data.marketplace,
      name: data.name,
      api_key: data.api_key,
      stock_sync: data.stock_sync,
      order_sync: data.order_sync,
    });
  }, [data, form]);

  const onSubmit = form.handleSubmit(async (values) => {
    const [err] = await to(mutateAsync(values));
    if (err) return;
    navigate(ROUTES.INTEGRACAO);
  });

  const onCancel = () => navigate(ROUTES.INTEGRACAO);

  return {
    options: marketplaceOptions,
    control: form.control,
    setValue: form.setValue,
    onSubmit,
    onCancel,
    isValid: form.formState.isValid,
    isSubmitting: isPending,
    isLoading,
  };
};
