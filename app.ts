import express, { Express, Request, Response, NextFunction } from "express";
import passport from "passport";
import { initDatabase } from "./config/sequelize";
import { setupSwagger } from "./config/swagger"; 
import "./entities/ProdutoEntity"; 
import "./entities/ClienteEntity"; 
import { UsuarioController } from "./controllers/UsuarioController";
import { ComandaController } from "./controllers/ComandaController";
import { authMiddleware } from "./authMiddleware";

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());

const usuarioController = new UsuarioController();
const comandaController = new ComandaController();

setupSwagger(app);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autenticação de usuário
 *     description: Retorna um token JWT para acesso. Se login/senha não existirem, cria novo usuário.
 *     tags: [Autenticação]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login realizado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 access_token:
 *                   type: string
 *                 token_type:
 *                   type: string
 *                 expires_in:
 *                   type: integer
 */
app.post("/login", usuarioController.login);

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Logout (Client-Side)
 *     description: Instrui o cliente a remover o token. Não revoga token no servidor (JWT stateless).
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Instrução enviada com sucesso
 */
app.post("/logout", authMiddleware, usuarioController.logout);

/**
 * @swagger
 * /comandas:
 *   get:
 *     summary: Listar todas as comandas
 *     tags: [Comandas]
 *     responses:
 *       200:
 *         description: Lista de comandas com detalhes do cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comanda'
 */
app.get("/comandas", authMiddleware, comandaController.listar);

/**
 * @swagger
 * /comandas:
 *   post:
 *     summary: Criar nova comanda
 *     description: Cria comanda, produtos e cliente (se necessário).
 *     tags: [Comandas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comanda'
 *     responses:
 *       201:
 *         description: Comanda criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 */
app.post("/comandas", authMiddleware, comandaController.criar);

/**
 * @swagger
 * /comandas/{id}:
 *   get:
 *     summary: Buscar comanda por ID
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalhes da comanda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 *       404:
 *         description: Comanda não encontrada
 */
app.get("/comandas/:id", authMiddleware, comandaController.buscarPorId);

/**
 * @swagger
 * /comandas/{id}:
 *   put:
 *     summary: Atualizar comanda (Parcial)
 *     description: Atualiza cliente vinculado ou lista de produtos. Se ID do produto for enviado, atualiza; senão, cria novo.
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comanda'
 *     responses:
 *       200:
 *         description: Comanda atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comanda'
 *       404:
 *         description: Comanda não encontrada
 */
app.put("/comandas/:id", authMiddleware, comandaController.atualizar);

/**
 * @swagger
 * /comandas/{id}:
 *   delete:
 *     summary: Excluir comanda
 *     description: Remove a comanda e todos os seus produtos vinculados.
 *     tags: [Comandas]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comanda excluída com sucesso
 *       404:
 *         description: Comanda não encontrada
 */
app.delete("/comandas/:id", authMiddleware, comandaController.deletar);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal error." });
});

const startServer = async () => {
  await initDatabase();
  app.listen(port, () => {
    console.log(`porta ${port}`);
  });
};

startServer();