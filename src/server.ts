import { criarApp } from "./app";
import { abrirBanco } from "./db";

const PORTA = Number(process.env.PORT) || 3000;

criarApp(abrirBanco()).listen(PORTA, () => {
  console.log(`Toca dos Coelhos rodando na porta ${PORTA}`);
});
