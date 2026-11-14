import type { Banco } from "./db";
import type { Coelho, Filtros, NovoCoelho, Porte, Sexo } from "./filtros";

interface LinhaCoelho {
  id: number;
  nome: string;
  porte: string;
  idade: number;
  sexo: string;
  castrado: number;
  peso_kg: number;
}

function paraCoelho(linha: LinhaCoelho): Coelho {
  return {
    id: linha.id,
    nome: linha.nome,
    porte: linha.porte as Porte,
    idade: linha.idade,
    sexo: linha.sexo as Sexo,
    castrado: linha.castrado === 1,
    pesoKg: linha.peso_kg,
  };
}

export function criarRepositorio(banco: Banco) {
  return {
    listar(filtros: Filtros): Coelho[] {
      const condicoes: string[] = [];
      const valores: (string | number)[] = [];

      if (filtros.porte !== undefined) {
        condicoes.push("porte = ?");
        valores.push(filtros.porte);
      }
      if (filtros.sexo !== undefined) {
        condicoes.push("sexo = ?");
        valores.push(filtros.sexo);
      }
      if (filtros.idadeMax !== undefined) {
        condicoes.push("idade <= ?");
        valores.push(filtros.idadeMax);
      }
      if (filtros.castrado !== undefined) {
        condicoes.push("castrado = ?");
        valores.push(filtros.castrado ? 1 : 0);
      }

      const where = condicoes.length > 0 ? ` WHERE ${condicoes.join(" AND ")}` : "";
      const linhas = banco
        .prepare(`SELECT * FROM coelhos${where} ORDER BY id`)
        .all(...valores) as LinhaCoelho[];
      return linhas.map(paraCoelho);
    },

    buscarPorId(id: number): Coelho | undefined {
      const linha = banco.prepare("SELECT * FROM coelhos WHERE id = ?").get(id) as
        LinhaCoelho | undefined;
      return linha ? paraCoelho(linha) : undefined;
    },

    cadastrar(dados: NovoCoelho): Coelho {
      const resultado = banco
        .prepare(
          "INSERT INTO coelhos (nome, porte, idade, sexo, castrado, peso_kg) VALUES (?, ?, ?, ?, ?, ?)",
        )
        .run(
          dados.nome,
          dados.porte,
          dados.idade,
          dados.sexo,
          dados.castrado ? 1 : 0,
          dados.pesoKg,
        );
      return { id: Number(resultado.lastInsertRowid), ...dados };
    },

    atualizar(id: number, dados: NovoCoelho): Coelho | undefined {
      const resultado = banco
        .prepare(
          "UPDATE coelhos SET nome = ?, porte = ?, idade = ?, sexo = ?, castrado = ?, peso_kg = ? WHERE id = ?",
        )
        .run(
          dados.nome,
          dados.porte,
          dados.idade,
          dados.sexo,
          dados.castrado ? 1 : 0,
          dados.pesoKg,
          id,
        );
      return resultado.changes > 0 ? { id, ...dados } : undefined;
    },

    remover(id: number): boolean {
      return banco.prepare("DELETE FROM coelhos WHERE id = ?").run(id).changes > 0;
    },
  };
}

export type Repositorio = ReturnType<typeof criarRepositorio>;
