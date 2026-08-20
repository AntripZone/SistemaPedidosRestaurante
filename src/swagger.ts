import swaggerAutogen from "swagger-autogen";

const doc = {
  swagger: "2.0",
  info: {
    title: "API Sistema de Pedidos Restaurante",
    description: "Documentación de la API",
    version: "1.0.0",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./src/swagger-output.json";

const routes = ["./src/index.ts"];

swaggerAutogen()(outputFile, routes, doc);
