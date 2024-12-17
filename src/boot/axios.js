import axios from "axios";

const apiBuscarProducto = axios.create({
  baseURL: "http://localhost:9000/api/v1/productos-algolia",
});

const apiBuscarCategoria = axios.create({
  baseURL: "http://localhost:9000/api/v1/productos-algolia",
});

export { apiBuscarProducto };
export { apiBuscarCategoria};
