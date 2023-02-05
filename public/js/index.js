const socket = io();

socket.on("products", (data) => {

  let table = document.getElementById("dataTable");
  let html = "";

  html += "<tr>";
  html += "<th>#ID</th>";
  html += "<th>Titulo</th>";
  html += "<th>Codigo</th>";
  html += "<th>Descripcion</th>";
  html += "<th>Precio</th>";
  html += "<th>Estado</th>";
  html += "<th>Stock</th>";
  html += "<th>Categoria</th>";
  html += "<th>Thumbnail</th>";
  html += "</tr>";

  data.forEach((d) => {
    html += "<tr>";
    html += "<td>" + d.id + "</td>";
    html += "<td>" + d.title + "</td>";
    html += "<td>" + d.code + "</td>";
    html += "<td>" + d.description + "</td>";
    html += "<td>" + d.price + "</td>";
    html += "<td>" + d.status + "</td>";
    html += "<td>" + d.stock + "</td>";
    html += "<td>" + d.category + "</td>";
    html += "<td>" + d.thumbnail + "</td>";
    html += "</tr>";
  });

  table.innerHTML = html;
});
