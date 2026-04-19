import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/app/router/routes";
import {
  integrationSchema,
  type IntegrationFormData,
} from "../schemas/integration.schema";
import type { MarketplaceOption } from "../types/integration.types";

const OPTIONS: MarketplaceOption[] = [
  {
    marketplace: "mercado-livre",
    description: "Conecte sua conta do Mercado Livre via OAuth.",
  },
  {
    marketplace: "shopee",
    description: "Sincronize anúncios e pedidos da sua loja Shopee.",
  },
  { marketplace: "amazon", description: "Vendor Central · Brasil." },
  { marketplace: "amazon-us", description: "Seller Central · Estados Unidos." },
  { marketplace: "magalu", description: "Marketplace Magalu via Magalu Pay." },
];

const defaultValues: IntegrationFormData = {
  marketplace: "mercado-livre",
  name: "",
  apiKey: "",
  syncStock: true,
  syncOrders: true,
};

export const useNewIntegration = () => {
  const navigate = useNavigate();
  const options = useMemo(() => OPTIONS, []);

  const form = useForm<IntegrationFormData>({
    resolver: zodResolver(integrationSchema),
    defaultValues,
    mode: "onChange",
  });

  const onSubmit = form.handleSubmit((data) => {
    // TODO: integrar com serviço TanStack Query (integration.service.ts)
    console.log("[new integration]", data);
    navigate(ROUTES.INTEGRACAO);
  });

  const onCancel = () => navigate(ROUTES.INTEGRACAO);

  return {
    options,
    control: form.control,
    setValue: form.setValue,
    onSubmit,
    onCancel,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
  };
};
