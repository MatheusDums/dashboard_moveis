/* SALVAR OPÇÃO DO SELECT NO LOCAL STORAGE  */
const select = document.getElementById("meuSelect");
const valorSalvo = localStorage.getItem('opcaoSelecionada');
if (valorSalvo) {
  select.value = valorSalvo;
}

select.addEventListener('change', function () {
  localStorage.setItem('opcaoSelecionada', select.value);
})


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

console.log(calcularValorTotal());

let valorTotalCerto = document.getElementsByClassName("valor_total_ok");
valorTotalCerto[0].innerHTML = calcularValorTotal().toFixed(0);

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

console.log(calcularLucroTotal());
let valorLucroCerto = document.getElementsByClassName("valor_lucro_ok");
valorLucroCerto[0].innerHTML = calcularLucroTotal();

/* TOTAL DE PEDIDOS CORRETO */

function calcularQuantidadeTotal() {
  let quantidadeTotal = 0;
  let qtdPedidosSpan = document.querySelectorAll(".quantidade_pedidos_span");
  qtdPedidosSpan.forEach((span) => {
    let quantidade = parseInt(span.innerText);
    if (!isNaN(quantidade)) {
      quantidadeTotal++;
    }
  });
  return quantidadeTotal;
}

console.log(calcularQuantidadeTotal());
let quantidadePedidosCerto =
  document.getElementsByClassName("quantidade_pedidos");
quantidadePedidosCerto[0].innerHTML = calcularQuantidadeTotal();

/* TOTAL DE PEDIDOS EM PRODUÇÃO */
/* --------------------------------------------------------------------------------------------------------------------------------- */