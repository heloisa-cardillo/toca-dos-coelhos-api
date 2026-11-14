const formulario = document.getElementById("filtros");
const lista = document.getElementById("lista");
const mensagem = document.getElementById("mensagem");

const NOMES_PORTE = { mini: "Mini", medio: "Médio", grande: "Grande" };
const NOMES_SEXO = { macho: "Macho", femea: "Fêmea" };

const ICONE = `
  <svg viewBox="0 0 64 64" aria-hidden="true">
    <ellipse cx="24" cy="14" rx="5" ry="13" />
    <ellipse cx="40" cy="14" rx="5" ry="13" />
    <circle cx="32" cy="32" r="13" />
    <ellipse cx="32" cy="52" rx="17" ry="11" />
  </svg>`;

function montarCartao(coelho) {
  const peso = coelho.pesoKg.toLocaleString("pt-BR");
  return `
    <article class="cartao ${coelho.porte}">
      ${ICONE}
      <h2>${coelho.nome}</h2>
      <ul>
        <li>Porte: ${NOMES_PORTE[coelho.porte]}</li>
        <li>Idade: ${coelho.idade} anos</li>
        <li>Sexo: ${NOMES_SEXO[coelho.sexo]}</li>
        <li>Castrado: ${coelho.castrado ? "Sim" : "Não"}</li>
        <li>Peso: ${peso} kg</li>
      </ul>
    </article>`;
}

async function carregarCoelhos() {
  const parametros = new URLSearchParams();
  for (const [campo, valor] of new FormData(formulario)) {
    if (valor !== "") parametros.append(campo, valor);
  }

  const resposta = await fetch(`/api/coelhos?${parametros}`);
  const dados = await resposta.json();

  if (!resposta.ok) {
    lista.innerHTML = "";
    mensagem.textContent = dados.erro;
    return;
  }

  mensagem.textContent = dados.length === 0 ? "Nenhum coelho com esses filtros." : "";
  lista.innerHTML = dados.map(montarCartao).join("");
}

formulario.addEventListener("change", carregarCoelhos);
carregarCoelhos();
