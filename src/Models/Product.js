class Product {
    id;
    title;
    description;
    code;
    price;
    status;
    stock;
    category;
    thumbnail;
  
    constructor(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnail
    ) {
      this.title = title;
      this.description = description;
      this.code = code;
      this.price = price;
      this.status = status;
      this.stock = stock;
      this.category = category;
      this.thumbnail = thumbnail;
    }
  
    validate() {
      let ret = this.title !== undefined;
      ret &= this.description !== undefined;
      ret &= this.price !== undefined;
      ret &= this.code !== undefined;
      ret &= this.status !== undefined;
      ret &= this.stock !== undefined;
      ret &= this.category !== undefined;
      //ret &= this.thumbnail !== undefined;
  
      return ret;
    }
  }

  module.exports = { Product };