import { Request, Response } from "express";
import { UsuarioDAO } from "../daos/UsuarioDAO";
import { Usuario } from "../models/Usuario";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class UsuarioController {
  private dao = new UsuarioDAO();

  criar = async (req: Request, res: Response) => {
    try {
      const { login, senha } = req.body;

      if (!login || !senha) {
        return res
          .status(400)
          .json({ message: "Login e senha são obrigatórios" });
      }

      const salt = await bcrypt.genSalt(10);
      const senhaHash = await bcrypt.hash(senha, salt);

      const usuario = new Usuario(login, senhaHash);
      const result = await this.dao.criar(usuario);

      res.status(201).json({ id: result.get("id"), login: result.get("login") });
    } catch (error: any) {
      if (error.name === "SequelizeUniqueConstraintError") {
        return res.status(409).json({ message: "Este login já está em uso." });
      }
      res.status(500).json({ message: "Erro ao criar usuário", error });
    }
  };

  login = async (req: Request, res: Response) => {
    try {

      const { login, senha } = req?.body ?? {};
      console.log(req.body)
      if (!login || !senha) {
        return res
          .status(400)
          .json({ message: "Login e senha são obrigatórios" });
      }

      let usuario = await this.dao.buscarPorLogin(login);
      let statusCode = 200;

      if (!usuario) {
        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt);
        const novoUsuario = new Usuario(login, senhaHash);
        usuario = await this.dao.criar(novoUsuario);
        statusCode = 201;
      } else {
        const senhaValida = await bcrypt.compare(senha, usuario.get("senha") as string);
        if (!senhaValida) {
          return res.status(401).json({ message: "Credenciais inválidas" });
        }
      }

      const token = jwt.sign(
        { id: usuario.get("id"), login: usuario.get("login") },
        process.env.JWT_SECRET!,
        { expiresIn: "1h" }
      );

      res.status(statusCode).json({
        access_token: token,
        token_type: "Bearer",
        expires_in: 3600
      });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Erro interno no servidor", error });
    }
  };

  logout = (req: Request, res: Response) => {
    res.json({ message: "Logout realizado com sucesso." });
  };
}
