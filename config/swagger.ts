import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Comandas",
      version: "1.0.0",
      description: "API REST para gerenciamento de comandas, produtos e clientes.",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Produto: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID único do produto", example: 1 },
            nome: { type: "string", description: "Nome do produto", example: "Hambúrguer Artesanal" },
            preco: { type: "number", format: "float", description: "Preço do produto", example: 29.90 },
          },
        },
        Cliente: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID único do cliente", example: 101 },
            nome: { type: "string", description: "Nome completo do cliente", example: "João Silva" },
            telefone: { type: "string", description: "Telefone de contato", example: "(11) 99999-8888" },
          },
        },
        Comanda: {
          type: "object",
          properties: {
            id: { type: "integer", description: "ID único da comanda", example: 500 },
            idCliente: { type: "integer", description: "ID do cliente vinculado", example: 101 },
            nomeCliente: { type: "string", description: "Nome do cliente", example: "João Silva" },
            telefoneCliente: { type: "string", description: "Telefone do cliente", example: "(11) 99999-8888" },
            produtos: { 
              type: "array",
              description: "Lista de produtos na comanda",
              items: { $ref: "#/components/schemas/Produto" }
            },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["login", "senha"],
          properties: {
            login: { type: "string", description: "Nome de usuário ou email", example: "admin" },
            senha: { type: "string", description: "Senha de acesso", example: "senha123" },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./app.ts"], // Arquivos onde estão os comentários JSDoc das rotas
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
