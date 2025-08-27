import { Static, Type } from "@sinclair/typebox";

export const LoginSchema = Type.Object({
  email: Type.String({
    pattern: "^[\\w.-]+@([\\w-]+\\.)+[\\w-]{2,4}$",
    description: "Must be a valid email address",
  }),
  password: Type.String({
    minLength: 8,
    maxLength: 128,
    pattern:
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$",
    description:
      "Password must be at least 8 characters, include uppercase, lowercase, number, and special character",
  }),
});

export type LoginInput = Static<typeof LoginSchema>;

export type LoginPayload = {
  id: number;
  email: string;
};
