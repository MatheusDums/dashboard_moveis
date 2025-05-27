// contador para simular número do pedido (caso esteja desabilitado no form)
let pedidoCounter = 1;

function addSaleLine() {
  const quantidadeItens = document.getElementById("quantidade").value;
  const item = document.getElementById("item").value;
  const cliente = document.getElementById("cliente").value;
  const data = document.getElementById("data_venda").value;
  const valorTotal = document.getElementById("valor_total").value;
  const valorLucro = document.getElementById("valor_lucro").value;
  const situacao = document.getElementById("situacao").value;

  const pedidoNum = pedidoCounter++;

  const venda = {
    pedidoNum,
    quantidadeItens,
    item,
    cliente,
    data,
    valorTotal,
    valorLucro,
    situacao,
  };

  // salva no localStorage
  let vendasSalvas = JSON.parse(localStorage.getItem("vendas")) || [];
  vendasSalvas.push(venda);
  localStorage.setItem("vendas", JSON.stringify(vendasSalvas));

  // adiciona visualmente na tabela
  adicionarVendaNaTabela(venda);

  // limpa o formulário
  document.getElementById("quantidade").value = "";
  document.getElementById("item").value = "";
  document.getElementById("cliente").value = "";
  document.getElementById("data_venda").value = "";
  document.getElementById("valor_total").value = "";
  document.getElementById("valor_lucro").value = "";
  document.getElementById("situacao").value = "confirmado";

  // atualiza os valores dos cards após adicionar nova venda
  // atualiza os valores dos cards na tela
  atualizarCards()
  configurarSelects(); // recarrega os selects e a contagem de produção
}

function adicionarVendaNaTabela(venda) {
  const tableSection = document.querySelector(".table_body");
  const newLine = document.createElement("tr");
  newLine.classList.add("table_body_tr");

  newLine.innerHTML = `
    <td># <span class="quantidade_pedidos_span">${venda.pedidoNum}</span></td>
    <td class="quantidade_itens_span">${venda.quantidadeItens}</td>
    <td class="item_span">${venda.item}</td>
    <td class="cliente_span">${venda.cliente}</td>
    <td class="data_span">${venda.data}</td>
    <td class="valor_total_td">R$ <span class="valor_total_span">${
      venda.valorTotal
    }</span></td>
    <td>R$ <span class="valor_lucro_span">${venda.valorLucro}</span></td>
    <td class="select_span">
      <select class="meuSelect">
        <option value="confirmado" ${
          venda.situacao === "confirmado" ? "selected" : ""
        }>Pedido Confirmado</option>
        <option value="preparando" ${
          venda.situacao === "preparando" ? "selected" : ""
        }>Em Preparação</option>
        <option value="entrega" ${
          venda.situacao === "entrega" ? "selected" : ""
        }>Aguardando Entrega</option>
        <option value="finalizada" ${
          venda.situacao === "finalizada" ? "selected" : ""
        }>Entregue</option>
        <option value="deletar">Deletar</option>
      </select>
    </td>
  `;

  tableSection.appendChild(newLine);
}

window.onload = () => {
  const vendasSalvas = JSON.parse(localStorage.getItem("vendas")) || [];

  vendasSalvas.forEach((venda) => {
    if (venda.pedidoNum >= pedidoCounter) {
      pedidoCounter = venda.pedidoNum + 1;
    }
    adicionarVendaNaTabela(venda);
  });

  configurarSelects();
  atualizarCards();
};


document.addEventListener("change", function (e) {
  if (e.target.tagName === "SELECT") {
    const select = e.target;
    const selectedValue = select.value;

    if (selectedValue === "deletar") {
      const row = select.closest("tr");
      const pedidoNumText = row
        .querySelector(".quantidade_pedidos_span")
        .textContent.trim();

      // Remove a linha da tabela
      row.remove();

      // Remove do localStorage
      let vendasSalvas = JSON.parse(localStorage.getItem("vendas")) || [];
      vendasSalvas = vendasSalvas.filter((v) => v.pedidoNum != pedidoNumText);
      localStorage.setItem("vendas", JSON.stringify(vendasSalvas));

      // atualiza os valores dos cards após remover uma venda
      valorTotalCerto[0].innerHTML = calcularValorTotal().toFixed(0);
      valorLucroCerto[0].innerHTML = calcularLucroTotal();
      quantidadePedidosCerto[0].innerHTML = calcularQuantidadeTotal();
      configurarSelects();
    }
  }
});

/* --------------------------------------------------------------------------------------------------------------------------------- */

/* FUNÇÃO PARA SALVAR AS OPÇÕES SELECIONADAS NO LOCALSTORAGE */
function configurarSelects() {
  const selects = document.querySelectorAll(".meuSelect");

  let quantidadeEmProducao = 0;

  selects.forEach((select) => {
    const tr = select.closest("tr");
    const idPedido = tr
      .querySelector(".quantidade_pedidos_span")
      ?.textContent.trim();
    const chave = `statusPedido_${idPedido}`;

    const valorSalvo = localStorage.getItem(chave);
    if (valorSalvo && valorSalvo !== "deletar") {
      select.value = valorSalvo;
    }

    // Atualiza contagem de produção
    if (
      select.value === "confirmado" ||
      select.value === "preparando" ||
      select.value === "entrega"
    ) {
      quantidadeEmProducao++;
    }

    // Evita adicionar múltiplos listeners
    if (!select.dataset.listenerAdicionado) {
      select.addEventListener("change", () => {
        if (select.value === "deletar") {
          const row = select.closest("tr");
          const pedidoNumText = row
            .querySelector(".quantidade_pedidos_span")
            .textContent.trim();

          // Remove visualmente
          row.remove();

          // Remove do localStorage
          let vendasSalvas = JSON.parse(localStorage.getItem("vendas")) || [];
          vendasSalvas = vendasSalvas.filter(
            (v) => v.pedidoNum != pedidoNumText
          );
          localStorage.setItem("vendas", JSON.stringify(vendasSalvas));

          // Remove status salvo
          localStorage.removeItem(`statusPedido_${pedidoNumText}`);

          // Atualiza cards
          atualizarCards();

          configurarSelects(); // recontar produção e limpar selects
        } else {
          localStorage.setItem(chave, select.value);
        }
      });

      // Marcar que já foi adicionado para não duplicar
      select.dataset.listenerAdicionado = "true";
    }
  });

  // Atualiza número de pedidos em produção
  let quantidadeEmProducaoSpan =
    document.querySelectorAll(".pedidos_prep_span");
  quantidadeEmProducaoSpan.forEach((span) => {
    span.innerText = quantidadeEmProducao;
  });
}

window.addEventListener("DOMContentLoaded", configurarSelects);

/* --------------------------------------------------------------------------------------------------------------------------------- */
/* FUNÇÃO PARA RECARREGAR A PAGINA COM O ONCLICK PARA ATUALIZAR OS CARDS */
function reloadPage() {
  window.location.reload();
}

/* --------------------------------------------------------------------------------------------------------------------------------- */
/* DEIXA O No DO PEDIDO AUTOMÁTICO */
const linhas = document.querySelectorAll("tr.table_body_tr");

linhas.forEach((linha, index) => {
  const spanId = linha.querySelector(".quantidade_pedidos_span");
  if (spanId) {
    const idPedido = String(index + 1).padStart(3, "0");
    spanId.textContent = idPedido;
  }
});

let numPedidoInput = document.getElementById("pedido_num");
if (numPedidoInput) {
  numPedidoInput.value = String(linhas.length + 1).padStart(3, "0");
}

/* FUNÇÃO PARA EXIBIR OU NÃO O FORMULÁRIO DE ADCIONAR VENDA */
const infosbBtn = document.querySelectorAll(".info_btn");
let infosBtnText = document.getElementById("infosBtnText");
let addSales = document.getElementById("add_sale");

function showForm() {
  if (addSales.classList.contains("add_sale_disable")) {
    addSales.classList.remove("add_sale_disable");
    addSales.classList.add("add_sale_enable");
    infosBtnText.innerHTML = "Fechar";
  } else {
    addSales.classList.remove("add_sale_enable");
    addSales.classList.add("add_sale_disable");
    infosBtnText.innerHTML = "Adicionar Venda";
  }
}

/* FUNÇÃO PARA IMPRIMIR PÁGINA DOS ULTIMOS 30 DIAS */
const printBtn = document.getElementById("print_btn");

function printPage() {
  window.print();
}

/* --------------------------------------------------------------------------------------------------------------------------------- */
/* VALOR CORRETO EM VALOR TOTAL DE VENDAS */
function calcularValorTotal() {
  let valorTotal = 0;
  let valorTotalSpan = document.querySelectorAll(".valor_total_span");
  valorTotalSpan.forEach((span) => {
    let valor = parseFloat(span.innerText.replace("R$", "").replace(",", "."));
    if (!isNaN(valor)) {
      valorTotal += valor;
    }
  });
  return valorTotal;
}

let valorTotalCerto = document.getElementsByClassName("valor_total_ok");
valorTotalCerto[0].innerHTML = calcularValorTotal().toFixed(0);

/* --------------------------------------------------------------------------------------------------------------------------------- */
/* VALOR CORRETO EM LUCRO */

function calcularLucroTotal() {
  let lucroTotal = 0;
  let lucroTotalSpan = document.querySelectorAll(".valor_lucro_span");
  lucroTotalSpan.forEach((span) => {
    let valor_lucro = parseFloat(
      span.innerText.replace("R$", "").replace(",", ".")
    );
    if (!isNaN(valor_lucro)) {
      lucroTotal += valor_lucro;
    }
  });
  return lucroTotal;
}

let valorLucroCerto = document.getElementsByClassName("valor_lucro_ok");
valorLucroCerto[0].innerHTML = calcularLucroTotal();
/* --------------------------------------------------------------------------------------------------------------------------------- */
/* TOTAL DE PEDIDOS CORRETO */
function calcularQuantidadeTotal() {
  let quantidadePedidosSpan = document.querySelectorAll(
    ".quantidade_pedidos_span"
  );
  return quantidadePedidosSpan.length;
}

let quantidadePedidosCerto =
  document.getElementsByClassName("quantidade_pedidos");
quantidadePedidosCerto[0].innerHTML = calcularQuantidadeTotal();

/* --------------------------------------------------------------------------------------------------------------------------------- */
/* Atualizar os valores do card */
function atualizarCards() {
  valorTotalCerto[0].innerHTML = calcularValorTotal().toFixed(0);
  valorLucroCerto[0].innerHTML = calcularLucroTotal();
  quantidadePedidosCerto[0].innerHTML = calcularQuantidadeTotal();
}
