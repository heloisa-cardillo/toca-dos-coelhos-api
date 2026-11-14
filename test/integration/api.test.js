const request = require("supertest");
const { criarApp } = require("../../dist/app");
const { abrirBanco } = require("../../dist/db");

let banco;
let app;

beforeEach(() => {
  banco = abrirBanco(":memory:");
  app = criarApp(banco);
});

afterEach(() => banco.close());

const novoCoelho = {
  nome: "Tom",
  porte: "mini",
  idade: 2,
  sexo: "macho",
  castrado: false,
  pesoKg: 1.2,
};

describe("GET /api/coelhos", () => {
  test("lista os 7 coelhos do banco", async () => {
    const resposta = await request(app).get("/api/coelhos");
    expect(resposta.status).toBe(200);
    expect(resposta.body).toHaveLength(7);
  });

  test("aplica os filtros na consulta SQL", async () => {
    const resposta = await request(app).get("/api/coelhos?porte=mini&sexo=femea");
    expect(resposta.status).toBe(200);
    expect(resposta.body.map((c) => c.nome)).toEqual(["Frida", "Dani"]);
  });

  test("responde 400 quando o filtro é inválido", async () => {
    const resposta = await request(app).get("/api/coelhos?porte=gigante");
    expect(resposta.status).toBe(400);
    expect(resposta.body).toEqual({ erro: "Porte deve ser mini, medio ou grande." });
  });
});

describe("GET /api/coelhos/:id", () => {
  test("responde 200 com a ficha do coelho", async () => {
    const resposta = await request(app).get("/api/coelhos/2");
    expect(resposta.status).toBe(200);
    expect(resposta.body).toMatchObject({ nome: "Hanna", porte: "grande", pesoKg: 3 });
  });

  test("responde 404 quando o coelho não existe", async () => {
    const resposta = await request(app).get("/api/coelhos/99");
    expect(resposta.status).toBe(404);
  });
});

describe("POST /api/coelhos", () => {
  test("cadastra o coelho e grava no banco", async () => {
    const resposta = await request(app).post("/api/coelhos").send(novoCoelho);
    expect(resposta.status).toBe(201);
    expect(resposta.body).toEqual({ id: 8, ...novoCoelho });

    const busca = await request(app).get("/api/coelhos/8");
    expect(busca.body.nome).toBe("Tom");
  });

  test("responde 400 quando os dados são inválidos", async () => {
    const resposta = await request(app)
      .post("/api/coelhos")
      .send({ ...novoCoelho, idade: -1 });
    expect(resposta.status).toBe(400);
  });
});

describe("PUT /api/coelhos/:id", () => {
  test("edita o coelho", async () => {
    const resposta = await request(app)
      .put("/api/coelhos/1")
      .send({ ...novoCoelho, nome: "Voldemort Jr" });
    expect(resposta.status).toBe(200);

    const busca = await request(app).get("/api/coelhos/1");
    expect(busca.body.nome).toBe("Voldemort Jr");
  });

  test("responde 404 quando o coelho não existe", async () => {
    const resposta = await request(app).put("/api/coelhos/99").send(novoCoelho);
    expect(resposta.status).toBe(404);
  });
});

describe("DELETE /api/coelhos/:id", () => {
  test("remove o coelho do banco", async () => {
    const resposta = await request(app).delete("/api/coelhos/3");
    expect(resposta.status).toBe(204);

    const busca = await request(app).get("/api/coelhos/3");
    expect(busca.status).toBe(404);
  });
});

describe("Front-end", () => {
  test("a página inicial é servida a partir do build", async () => {
    const resposta = await request(app).get("/");
    expect(resposta.status).toBe(200);
    expect(resposta.text).toContain("Toca dos Coelhos");
  });
});
