import { NextFunction, Request, Response } from "express";
import { validateUser } from "../utils";

export const RequestAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization as string;

    if (!token)
      return res
        .status(403)
        .json({ error: "Unauthorized: Authorization Token is missing" });

    const authdata = await validateUser(token);

    req.user = authdata;

    next();
  } catch (error) {
    console.log("error", error);
    return res.status(403).json({ error });
  }
};
