import { z } from "zod";
import  { t } from "i18next";


export const loginSchema = z.object({
  phoneNumber: z
    .string()
    .min(9, { message: t("validation.phoneMin") })
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => /^\+998\d{9}$/.test(val), {
      message: t("validation.phoneFormat"),
    }),
  password: z.string().min(6, { message: t("validation.passwordMin") }),
});
export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, { message: t("validation.firstNameRequired") })
      .max(50),
    lastName: z
      .string()
      .min(1, { message: t("validation.lastNameRequired") })
      .max(50),
    phoneNumber: z
      .string()
      .min(9, { message: t("validation.phoneMin") })
      .transform((val) => val.replace(/[\s-]/g, ""))
      .refine((val) => /^\+998\d{9}$/.test(val), {
        message: t("validation.phoneFormat"),
      }),
    password: z.string().min(8, { message: t("validation.passwordMin") }),
    confirmPassword: z
      .string()
      .min(8, { message: t("validation.confirmPasswordRequired") }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: t("validation.passwordsMismatch"),
    path: ["confirmPassword"],
  });
