import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  editProfileSchema,
  type EditProfileFormData,
} from "../schemas/profile.schema";
import { useProfileData } from "./useProfileData";

type UseEditProfileOptions = {
  onSuccess?: (data: EditProfileFormData) => void;
  onCancel?: () => void;
};

export const useEditProfile = (options: UseEditProfileOptions = {}) => {
  const profile = useProfileData();

  const form = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      name: profile.name,
      username: profile.username,
      email: profile.email,
      phone: profile.phone,
      birthDate: profile.birthDate,
      bio: profile.bio,
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    // TODO: integrar com serviço TanStack Query (profile.service.ts)
    console.log("[edit profile]", data);
    options.onSuccess?.(data);
  });

  const onCancel = () => {
    form.reset();
    options.onCancel?.();
  };

  return {
    control: form.control,
    onSubmit,
    onCancel,
    isValid: form.formState.isValid,
    isSubmitting: form.formState.isSubmitting,
  };
};
