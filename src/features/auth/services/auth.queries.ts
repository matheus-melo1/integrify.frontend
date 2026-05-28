import { useMutation } from "@tanstack/react-query";
import { authService } from "./auth.service";
import type { LoginRequest } from "../types/auth.types";

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (body: LoginRequest) => authService.login(body),
  });
