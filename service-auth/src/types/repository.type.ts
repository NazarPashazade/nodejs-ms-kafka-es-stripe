import { NewUser, User } from "../db/schema";
import { LoginInput } from "../dto/login.dto";

export type UserRepositoryType = {
  findByEmail: (email: string) => Promise<User | undefined>;
  create: (data: NewUser) => Promise<User>;
  findByEmailAndPassword: (input: LoginInput) => Promise<User | undefined>;
};
