import { Router } from "express";
import { validarCoelho, validarFiltros } from "./filtros";
import type { Repositorio } from "./coelhos.repository";

const NAO_ENCONTRADO = { erro: "Coelho não encontrado." };

function lerId(valor: string): number | undefined {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : undefined;
}

export function criarRotasCoelhos(repositorio: Repositorio): Router {
  const rotas = Router();

  rotas.get("/", (req, res) => {
    const filtros = validarFiltros(req.query as Record<string, unknown>);
    res.json(repositorio.listar(filtros));
  });

  rotas.get("/:id", (req, res) => {
    const id = lerId(req.params.id);
    const coelho = id === undefined ? undefined : repositorio.buscarPorId(id);
    if (!coelho) {
      res.status(404).json(NAO_ENCONTRADO);
      return;
    }
    res.json(coelho);
  });

  rotas.post("/", (req, res) => {
    const coelho = repositorio.cadastrar(validarCoelho(req.body));
    res.status(201).json(coelho);
  });

  rotas.put("/:id", (req, res) => {
    const id = lerId(req.params.id);
    const dados = validarCoelho(req.body);
    const coelho = id === undefined ? undefined : repositorio.atualizar(id, dados);
    if (!coelho) {
      res.status(404).json(NAO_ENCONTRADO);
      return;
    }
    res.json(coelho);
  });

  rotas.delete("/:id", (req, res) => {
    const id = lerId(req.params.id);
    if (id === undefined || !repositorio.remover(id)) {
      res.status(404).json(NAO_ENCONTRADO);
      return;
    }
    res.status(204).end();
  });

  return rotas;
}
