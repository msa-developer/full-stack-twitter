import type { Response, Request } from "express";

export const signup = (req: Request, res: Response) => {};

export const login = (req: Request, res: Response) => {};

export const logout = (_: Request, res: Response) => {
  res.cookie("jwt", "", {
    maxAge: 0,
  });
  return res.status(200).json({ message: "user logged out " });
};
