const express = require("express");
const exphbs = require("express-handlebars");
const { Server } = require("socket.io");
const { ProductManager } = require("./DataAccess/ProductManager");
const { Product } = require("./Models/Product");

const app = express();
const PORT = 8080;

app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("views", "./views");

const httpServer = app.listen(PORT, () =>
  console.log(`Server running on PORT ${PORT}`)
);

httpServer.on("error", (error) => console.log(error));

const io = new Server(httpServer);

app.get("/", async (req, res) => {
  const pm = new ProductManager("./data/productos.json");
  let products = await pm.getProducts();
  res.render("home", { products });
});

app.get("/realtimeproducts", async (req, res) => {
  res.render("realtimeproducts", {});
});

app.get("/newProduct", async (req, res) => {
  res.render("newProduct", {});
});

app.post("/products", async (req, res) => {
  const pm = new ProductManager("./data/productos.json");
  const body = req.body;
  let product = new Product(
    body.title,
    body.description,
    body.code,
    body.price,
    body.stock,
    body.status,
    body.category,
    body.thumbnail
  );

  const ret = await pm.addProduct(product);

  if (!ret.message) {
    const pm = new ProductManager("./data/productos.json");
    let products = await pm.getProducts();
    io.sockets.emit("products", products);

    res.send(JSON.stringify(ret.product));
  } else {
    res.status(ret.code).send({ message: ret.message });
  }
});

app.delete("/products/:pid",  async (req, res) => {
  const param = req.params.pid;
  const pid = parseInt(param);

  const pm = new ProductManager("./data/productos.json");

  let product = await pm.getProductById(pid);
  if (product) {
    const ret = await pm.deleteProduct(pid);

    let products = await pm.getProducts();
    io.sockets.emit("products", products);

    res.status(ret.code).send({ message: ret.message });
  } else {
    res.status(404).send({ message: `Product id: ${pid} Not Found` });
  }
});

io.on("connection", async (socket) => {
  console.log("cliente conectado id:", socket.id);

  const pm = new ProductManager("./data/productos.json");
  let products = await pm.getProducts();
  io.sockets.emit("products", products);
});
