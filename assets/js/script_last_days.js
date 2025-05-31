let span_date = document.getElementsByClassName("span_date");

let today = dayjs();
let last30days = dayjs().startOf("month").add(-30, "day").format("DD/MM/YYYY");

console.log(`há um mês atrás: ${last30days}`);

let span_date_ok = span_date;
span_date_ok[0].innerHTML = last30days;

/* FUNÇÃO PARA IMPRIMIR PÁGINA DOS ULTIMOS 30 DIAS */
const printBtn = document.getElementById("print_btn");

function printPage() {
  window.print();
}

/* FUNÇÕES PARA OS CARDS */

window.onload = () => {
  const total = localStorage.getItem("valorTotal") || 0;
  const lucro = localStorage.getItem("lucroTotal") || 0;
  const quantidade = localStorage.getItem("quantidadePedidos") || 0;
  const emProducao = localStorage.getItem("pedidosEmProducao") || 0;

  document.querySelectorAll(".valor_total_ok").forEach((span) => {
    span.innerHTML = `${total}`;
  });

  document.querySelectorAll(".valor_lucro_ok").forEach(span => {
    span.innerHTML = `${lucro}`;
  });

  document.querySelectorAll(".quantidade_pedidos").forEach(span => {
    span.innerHTML = quantidade;
  });

  document.querySelectorAll(".pedidos_prep_span").forEach(span => {
    span.innerHTML = emProducao;
  });
}