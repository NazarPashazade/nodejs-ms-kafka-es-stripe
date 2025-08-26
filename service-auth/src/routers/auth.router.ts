import * as bcrypt from "bcryptjs";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config";
import { query } from "../db/config";

export const authRouter = express.Router();

interface UserPayload {
  id: number;
  email: string;
}

const generateToken = (user: UserPayload): string => {
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any,
  };

  return jwt.sign(user, JWT_SECRET, options);
};

authRouter.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (existingUser.rows.length > 0) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );

  return res
    .status(201)
    .json({ message: "User created", user: newUser.rows[0] });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await query("SELECT * FROM users WHERE email = $1", [email]);

  if (user.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!validPassword) {
    return res.status(400).json({ message: "Invalid password" });
  }

  const token = generateToken({
    id: user.rows[0].id,
    email: user.rows[0].email,
  });

  return res.status(200).json({ message: "Login successful", token });
});

authRouter.get("/validate", async (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tokenData = token.split(" ")[1];

    const user = jwt.verify(tokenData as any, JWT_SECRET!) as
      | UserPayload
      | jwt.JwtPayload;

    return res.status(200).json({ ...user });
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});
