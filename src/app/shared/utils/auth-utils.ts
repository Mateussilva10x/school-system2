import { AuthService } from "../../core/services/auth.service";

export const isAdmin = (authService: AuthService): boolean => {
  return authService.getCurrentUser()?.role === 'ADMIN';
};
