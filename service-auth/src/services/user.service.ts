import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config";
import { User } from "../db/schema";
import { LoginInput, LoginPayload } from "../dto/login.dto";
import { RegisterInput } from "../dto/register.dto";
import { UserRepository as userRepo } from "../repositories/user.repository";

const generateToken = (user: LoginPayload): string => {
  const options: jwt.SignOptions = { expiresIn: JWT_EXPIRES_IN as any };
  return jwt.sign(user, JWT_SECRET, options);
};

const getUserByEmail = async (email: string): Promise<User> => {
  const user = await userRepo.findByEmail(email);

  if (!user) throw new Error("User not found");

  return user;
};

const register = async (data: RegisterInput): Promise<User> => {
  const { username, email, password } = data;

  const existingUser = await userRepo.findByEmail(email);

  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userRepo.create({
    email,
    password: hashedPassword,
    username,
  });

  return newUser;
};

const login = async (input: LoginInput): Promise<string> => {
  const user = await getUserByEmail(input.email);

  const validPassword = await bcrypt.compare(input.password, user.password);

  if (!validPassword) throw new Error("Invalid password");

  const existingUser = await userRepo.findByEmailAndPassword(input);

  if (existingUser) throw new Error("User already exists");

  const token = generateToken({
    id: user.id,
    email: user.email,
  });

  return token;
};

const validate = async (
  token: string | undefined
): Promise<LoginPayload | jwt.JwtPayload> => {
  if (!token) throw new Error("Unauthorized");

  const tokenData = token.split(" ")[1];

  const user = jwt.verify(tokenData as any, JWT_SECRET!);

  return user as LoginPayload | jwt.JwtPayload;
};

export const UserService = {
  register,
  login,
  validate,
};
