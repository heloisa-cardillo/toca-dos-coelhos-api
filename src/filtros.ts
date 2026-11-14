export type Porte = "mini" | "medio" | "grande";
export type Sexo = "macho" | "femea";

export interface NovoCoelho {
  nome: string;
  porte: Porte;
  idade: number;
  sexo: Sexo;
  castrado: boolean;
  pesoKg: number;
}

export interface Coelho extends NovoCoelho {
  id: number;
}

export interface Filtros {
  porte?: Porte;
  sexo?: Sexo;
  idadeMax?: number;
  castrado?: boolean;
}

const PORTES: string[] = ["mini", "medio", "grande"];
const SEXOS: string[] = ["macho", "femea"];
const ERRO_PORTE = "Porte deve ser mini, medio ou grande.";
const ERRO_SEXO = "Sexo deve ser macho ou femea.";

export class DadosInvalidosError extends Error {}

export function validarFiltros(query: Record<string, unknown>): Filtros {
  const filtros: Filtros = {};
  const { porte, sexo, idadeMax, castrado } = query;

  if (porte !== undefined) {
    if (typeof porte !== "string" || !PORTES.includes(porte)) {
      throw new DadosInvalidosError(ERRO_PORTE);
    }
    filtros.porte = porte as Porte;
  }

  if (sexo !== undefined) {
    if (typeof sexo !== "string" || !SEXOS.includes(sexo)) {
      throw new DadosInvalidosError(ERRO_SEXO);
    }
    filtros.sexo = sexo as Sexo;
  }

  if (idadeMax !== undefined) {
    const valor = Number(idadeMax);
    if (typeof idadeMax !== "string" || idadeMax === "" || !Number.isInteger(valor) || valor < 0) {
      throw new DadosInvalidosError("Idade máxima deve ser um número inteiro a partir de 0.");
    }
    filtros.idadeMax = valor;
  }

  if (castrado !== undefined) {
    if (castrado !== "sim" && castrado !== "nao") {
      throw new DadosInvalidosError("Castrado deve ser sim ou nao.");
    }
    filtros.castrado = castrado === "sim";
  }

  return filtros;
}

export function validarCoelho(dados: unknown): NovoCoelho {
  if (typeof dados !== "object" || dados === null) {
    throw new DadosInvalidosError("Envie os dados do coelho em JSON.");
  }
  const { nome, porte, idade, sexo, castrado, pesoKg } = dados as Record<string, unknown>;

  if (typeof nome !== "string" || nome.trim() === "") {
    throw new DadosInvalidosError("Nome é obrigatório.");
  }
  if (typeof porte !== "string" || !PORTES.includes(porte)) {
    throw new DadosInvalidosError(ERRO_PORTE);
  }
  if (typeof idade !== "number" || !Number.isInteger(idade) || idade < 0) {
    throw new DadosInvalidosError("Idade deve ser um número inteiro a partir de 0.");
  }
  if (typeof sexo !== "string" || !SEXOS.includes(sexo)) {
    throw new DadosInvalidosError(ERRO_SEXO);
  }
  if (typeof castrado !== "boolean") {
    throw new DadosInvalidosError("Castrado deve ser true ou false.");
  }
  if (typeof pesoKg !== "number" || pesoKg <= 0) {
    throw new DadosInvalidosError("Peso deve ser um número maior que 0.");
  }

  return { nome: nome.trim(), porte: porte as Porte, idade, sexo: sexo as Sexo, castrado, pesoKg };
}
