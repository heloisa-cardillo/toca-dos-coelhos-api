import express, { type NextFunction, type Request, type Response } from "express";
import { join } from "node:path";
import type { Banco } from "./db";
import { criarRepositorio } from "./coelhos.repository";
import { criarRotasCoelhos } from "./coelhos.routes";
import { DadosInvalidosError } from "./filtros";

export function criarApp(banco: Banco) {
  const app = express();

  app.disable("x-powered-by");
  app.use(express.json());
  app.use(express.static(join(__dirname, "public")));
  app.use("/api/coelhos", criarRotasCoelhos(criarRepositorio(banco)));

  app.use((req: Request, res: Response) => {
    res.status(404).json({ erro: "Rota não encontrada." });
  });

  app.use((erro: unknown, req: Request, res: Response, next: NextFunction) => {
    if (erro instanceof DadosInvalidosError) {
      res.status(400).json({ erro: erro.message });
      return;
    }
    next(erro);
  });

  return app;
}
