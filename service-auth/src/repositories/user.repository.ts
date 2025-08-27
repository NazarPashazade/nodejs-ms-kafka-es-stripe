import { and, eq } from "drizzle-orm";
import { DB } from "../db/db-connection";
import { NewUser, User, users } from "../db/schema";
import { UserRepositoryType } from "../types";

export const UserRepository: UserRepositoryType = {
  findByEmail: async function (email: string): Promise<User | undefined> {
    return await DB.query.users.findFirst({ where: eq(users.email, email) });
  },

  findByEmailAndPassword: async function (input): Promise<User | undefined> {
    return await DB.query.users.findFirst({
      where: and(
        eq(users.email, input.email),
        eq(users.password, input.password)
      ),
    });
  },

  create: async function (input: NewUser): Promise<User> {
    const [cart] = await DB.insert(users).values(input).returning();
    return cart!;
  },
};
