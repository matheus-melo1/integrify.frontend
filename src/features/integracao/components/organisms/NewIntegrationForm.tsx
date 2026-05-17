import { useNewIntegration } from "../../hooks/useNewIntegration";
import type { Integration } from "../../types/integration.types";
import { IntegrationFormView } from "./IntegrationFormView";

export { NEW_INTEGRATION_FORM_ID } from "./IntegrationFormView";

type NewIntegrationFormProps = {
  variant?: "page" | "drawer";
  onSuccess?: (integration: Integration) => void;
  onCancel?: () => void;
  hideActions?: boolean;
};

export function NewIntegrationForm({
  variant = "page",
  onSuccess,
  onCancel,
  hideActions = false,
}: NewIntegrationFormProps) {
  const controller = useNewIntegration({ onSuccess, onCancel });
  return (
    <IntegrationFormView
      controller={controller}
      variant={variant}
      hideActions={hideActions}
    />
  );
}
