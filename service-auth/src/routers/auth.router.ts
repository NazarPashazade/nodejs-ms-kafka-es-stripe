import * as express from "express";
import { RegisterInput, RegisterSchema } from "../dto/register.dto";
import { UserService as service } from "../services/user.service";
import { LoginInput, LoginSchema } from "../dto/login.dto";
import { ValidateRequest } from "../utils";

export const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  const input: RegisterInput = req.body;

  const err = ValidateRequest<RegisterInput>(req.body, RegisterSchema);

  if (err) return res.status(404).json({ err });

  try {
    const newUser = await service.register(input);

    res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const err = ValidateRequest<LoginInput>(req.body, LoginSchema);

    if (err) return res.status(404).json({ err });

    const token = await service.login(req.body);

    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json((error as Error).message || "Internal Server Error");
  }
});

authRouter.get("/validate", async (req, res) => {
  try {
    const user = await service.validate(req.headers["authorization"]);

    return res.status(200).json({ ...user });
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});
