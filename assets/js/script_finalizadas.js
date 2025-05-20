const infosbBtn = document.querySelectorAll(".info_btn");
let addSales = document.getElementById("add_sale");

function showForm() {
  if (addSales.classList.contains("add_sale_enable")) {
    addSales.classList.remove("add_sale_enable");
    addSales.classList.add("add_sale_disable");
  } else {
    addSales.classList.remove("add_sale_disable");
    addSales.classList.add("add_sale_enable");
  }
}
