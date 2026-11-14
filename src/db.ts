import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export type Banco = Database.Database;

const SCRIPT_INICIAL = join(__dirname, "..", "db", "init.sql");

export function abrirBanco(arquivo = process.env.DB_ARQUIVO ?? "toca.db"): Banco {
  const banco = new Database(arquivo);
  // eslint-disable-next-line security/detect-non-literal-fs-filename -- caminho fixo, definido no código
  banco.exec(readFileSync(SCRIPT_INICIAL, "utf-8"));
  return banco;
}
