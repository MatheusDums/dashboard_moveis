// Função específica para atualizar pedidos em produção
function atualizarCardsUltimos30Dias() {
  const hoje = dayjs();
  const limite = hoje.subtract(30, "days");
  const vendasSalvas = JSON.parse(localStorage.getItem("vendas")) || [];
  
  // Filtra vendas dos últimos 30 dias
  const vendasUltimos30Dias = vendasSalvas.filter(venda => {
    return dayjs(venda.data).isAfter(limite);
  });

  let total = 0;
  let lucro = 0;
  let pedidosEmProducao = 0;
  
  vendasUltimos30Dias.forEach(venda => {
    total += parseFloat(venda.valorTotal || 0);
    lucro += parseFloat(venda.valorLucro || 0);
    
    // Verifica status atual (prioriza o salvo no localStorage)
    const statusSalvo = localStorage.getItem(`statusPedido_${venda.pedidoNum}`);
    const statusAtual = statusSalvo || venda.situacao;
    
    if (statusAtual === "confirmado" || 
        statusAtual === "preparando" || 
        statusAtual === "entrega") {
      pedidosEmProducao++;
    }
  });

  // Atualiza todos os cards
  document.querySelectorAll(".valor_total_ok").forEach(span => {
    span.innerHTML = total.toFixed(0);
  });
  document.querySelectorAll(".valor_lucro_ok").forEach(span => {
    span.innerHTML = lucro.toFixed(0);
  });
  document.querySelectorAll(".quantidade_pedidos").forEach(span => {
    span.innerHTML = vendasUltimos30Dias.length;
  });
  document.querySelectorAll(".pedidos_prep_span").forEach(span => {
    span.innerHTML = pedidosEmProducao;
  });
}

window.onload = () => {
  atualizarCardsUltimos30Dias();
  
  // Listener para mudanças no localStorage (IA)
  window.addEventListener('storage', function(e) {
    if (e.key === 'vendas' || 
        (e.key && e.key.startsWith('statusPedido_')) ||
        e.key === 'sync_pedidos' ||
        e.key === 'force_update') {
      setTimeout(() => {
        atualizarCardsUltimos30Dias();
      }, 100);
    }
  });
  

  let span_date = document.getElementsByClassName("span_date");
  let last30days = dayjs().add(-30, "day").format("DD/MM/YYYY");
  if (span_date.length > 0) {
    span_date[0].innerHTML = last30days;
  }
};

// Função para imprimir a página
function printPage() {
  window.print();
}