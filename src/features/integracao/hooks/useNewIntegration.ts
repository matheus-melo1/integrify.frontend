import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import { to } from "@/shared/lib/to";
import {
  integrationSchema,
  type IntegrationFormData,
} from "../schemas/integration.schema";
import type {
  Integration,
  MarketplaceOption,
} from "../types/integration.types";
import { useCreateIntegrationMutation } from "../services/integration.queries";

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

const defaultValues: IntegrationFormData = {
  marketplace: "mercadolibre",
  name: "",
  api_key: "",
  stock_sync: true,
  order_sync: true,
};

type UseNewIntegrationOptions = {
  onSuccess?: (integration: Integration) => void;
  onCancel?: () => void;
};

export const useNewIntegration = (options: UseNewIntegrationOptions = {}) => {
  const navigate = useNavigate();
  const marketplaceOptions = useMemo(() => OPTIONS, []);
  const { mutateAsync, isPending } = useCreateIntegrationMutation();

  const form = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit(async (data) => {
    const [err, created] = await to(mutateAsync(data));
    if (err) return;
    if (options.onSuccess) {
      options.onSuccess(created);
      return;
    }
    navigate(ROUTES.INTEGRACAO);
  });

  const onCancel = () => {
    if (options.onCancel) {
      options.onCancel();
      return;
    }
    navigate(ROUTES.INTEGRACAO);
  };

  return {
    options: marketplaceOptions,
    control: form.control,
    setValue: form.setValue,
    onSubmit,
    onCancel,
    isValid: form.formState.isValid,
    isSubmitting: isPending,
  };
};
