import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido." });
  }

  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ error: "Token inválido." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded; // adiciona info do usuário à requisição
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
