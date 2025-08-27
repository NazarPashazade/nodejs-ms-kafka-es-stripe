import { Static, Type } from "@sinclair/typebox";

export const RegisterSchema = Type.Object({
  username: Type.String({
    minLength: 3,
    maxLength: 50,
    description: "Username must be between 3 and 50 characters",
  }),
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

export type RegisterInput = Static<typeof RegisterSchema>;
