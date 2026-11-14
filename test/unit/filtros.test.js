const { validarFiltros, validarCoelho, DadosInvalidosError } = require("../../dist/filtros");

describe("validarFiltros", () => {
  test("sem filtros devolve um objeto vazio", () => {
    expect(validarFiltros({})).toEqual({});
  });

  test("converte idade e castrado para os tipos certos", () => {
    expect(validarFiltros({ porte: "mini", idadeMax: "7", castrado: "sim" })).toEqual({
      porte: "mini",
      idadeMax: 7,
      castrado: true,
    });
  });

  test.each([
    [{ porte: "gigante" }],
    [{ sexo: "outro" }],
    [{ idadeMax: "-1" }],
    [{ idadeMax: "dois" }],
    [{ castrado: "talvez" }],
  ])("rejeita filtro inválido %o", (query) => {
    expect(() => validarFiltros(query)).toThrow(DadosInvalidosError);
  });
});

describe("validarCoelho", () => {
  const valido = {
    nome: "Tom",
    porte: "mini",
    idade: 2,
    sexo: "macho",
    castrado: false,
    pesoKg: 1.2,
  };

  test("aceita um coelho válido e tira os espaços do nome", () => {
    expect(validarCoelho({ ...valido, nome: "  Tom  " })).toEqual(valido);
  });

  test.each([
    [{ ...valido, nome: "" }],
    [{ ...valido, porte: "gigante" }],
    [{ ...valido, idade: -1 }],
    [{ ...valido, idade: 2.5 }],
    [{ ...valido, sexo: "outro" }],
    [{ ...valido, castrado: "sim" }],
    [{ ...valido, pesoKg: 0 }],
    [null],
  ])("rejeita dados inválidos %o", (dados) => {
    expect(() => validarCoelho(dados)).toThrow(DadosInvalidosError);
  });
});
