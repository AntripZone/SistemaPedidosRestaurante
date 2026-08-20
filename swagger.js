import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "API de Sistema de Pedidos - Repartidores",
    description: "Documentación del módulo de personal de reparto",
  },
  host: "localhost:3000",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = ["./src/routes/repartidores.routes.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc);
