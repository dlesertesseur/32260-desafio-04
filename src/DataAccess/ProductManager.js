const fs = require("fs");

class ProductManager {
  path;
  constructor(path) {
    this.path = path;
  }

  getNextId(ids) {
    let id = null;
    if (ids) {
      if (ids.length > 0) {
        const product = ids[ids.length - 1];
        id = product.id + 1;
      } else {
        id = 1;
      }
    }
    return id;
  }

  async addProduct(product) {
    let ret = null;
    const products = await this.getProducts();

    const ids = products.map((p) => p.code);
    if (ids.includes(product.code)) {
      ret = { message: "Duplicate code: " + product.code, code: 400 };
    } else {
      if (product.validate()) {
        product.id = this.getNextId(products);

        /*Agrega el producto*/
        try {
          products.push(product);
          await fs.promises.writeFile(this.path, JSON.stringify(products));
          ret = { product: product };
        } catch (error) {
          ret = { message: error, code: 500 };
        }
      } else {
        ret = { message: "required values", code: 400 };
      }
    }
    return ret;
  }

  async getProducts() {
    let arr = [];
    try {
      const exist = fs.existsSync(this.path);
      if (!exist) {
        await fs.promises.writeFile(this.path, JSON.stringify(arr));
      }
      const ret = await fs.promises.readFile(this.path, "utf-8");
      arr = JSON.parse(ret);
    } catch (error) {
      console.log(error);
    }
    return arr;
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const product = products?.find((product) => product.id === id);
    if (!product) {
      console.log("Not found");
    }
    return product;
  }

  async updateProduct(id, product) {
    let ret = null;
    const products = await this.getProducts();

    /*Toma el indice del objeto*/
    const productIndex = products?.findIndex((p) => p.id === id);
    if (productIndex >= 0) {
      const productFound = products[productIndex];

      /*Actualiza los campos que tienen valor*/
      productFound.title = product.title ? product.title : productFound.title;
      productFound.description = product.description ? product.description : productFound.description;
      productFound.code = product.code ? product.code : productFound.code;
      productFound.price = product.price ? product.price : productFound.price;
      productFound.stock = product.stock ? product.stock : productFound.stock;
      productFound.status = product.status ? product.status : productFound.status;
      productFound.category = product.category? product.category : productFound.category;
      productFound.thumbnail = product.thumbnail ? product.thumbnail : productFound.thumbnail;

      try {
        await fs.promises.writeFile(this.path, JSON.stringify(products));
        ret = { product: productFound };
      } catch (error) {
        ret = { message: error, code: 500 };
      }
    } else {
      ret = { message: `Product id: ${id} Not Found`, code: 404 };
    }

    return ret;
  }

  async deleteProduct(id) {
    let ret = null;
    const products = await this.getProducts();

    /*Filtra el objecto con el id del parametro*/
    const filteredProducts = products?.filter((product) => product.id !== id);
    if (filteredProducts.length !== products.length) {
      try {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify(filteredProducts)
        );
        ret = { message: `Product id: ${id} deleted`, code: 200 };
      } catch (error) {
        ret = { message: error, code: 500 };
      }
    } else {
      ret = { message: `Product id: ${id} Not Found`, code: 404 };
    }
    return ret;
  }
}

module.exports = { ProductManager};
