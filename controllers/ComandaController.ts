import { Request, Response } from "express";
import { ComandaDAO } from "../daos/ComandaDAO";
import { ProdutoDAO } from "../daos/ProdutoDAO";
import { ClienteDAO } from "../daos/ClienteDAO";
import { Comanda } from "../models/Comanda";
import { Produto } from "../models/Produto";

export class ComandaController {
  private comandaDAO = new ComandaDAO();
  private produtoDAO = new ProdutoDAO();
  private clienteDAO = new ClienteDAO();

  criar = async (req: Request, res: Response) => {
    const { idCliente, nomeCliente, telefoneCliente, produtos } = req.body;

    if (!nomeCliente || !telefoneCliente) {
      return res.status(400).json({ message: "Nome e telefone do cliente são obrigatórios." });
    }

    if (produtos && Array.isArray(produtos)) {
      for (const p of produtos) {
        if (!p.id || !p.nome || !p.preco) {
          return res.status(400).json({ message: "Produto inválido. ID, nome e preço são obrigatórios." });
        }
      }
    }

    let clienteId = idCliente;

    if (clienteId) {
      const clienteExistente = await this.clienteDAO.buscarPorId(clienteId);
      if (!clienteExistente) {
        await this.clienteDAO.criarComId(clienteId, nomeCliente, telefoneCliente);
      }
    } else {
      const novoCliente = await this.clienteDAO.criar(nomeCliente, telefoneCliente);
      clienteId = novoCliente.getDataValue('id');
    }

    const comanda = new Comanda(clienteId, nomeCliente, telefoneCliente);
    const novaComanda = await this.comandaDAO.criar(comanda);
    const idComanda = novaComanda.getDataValue('id');

    if (produtos && Array.isArray(produtos)) {
      for (const p of produtos) {
        const novoProduto = new Produto(p.id, p.nome, p.preco, idComanda);
        await this.produtoDAO.criar(novoProduto);
      }
    }

    const comandaCompleta = await this.comandaDAO.buscarPorId(idComanda);

    const comandaJson: any = comandaCompleta?.toJSON();
    if (comandaJson && comandaJson.cliente) {
      comandaJson.nomeCliente = comandaJson.cliente.nome;
      comandaJson.telefoneCliente = comandaJson.cliente.telefone;
      delete comandaJson.cliente;
    }

    res.status(201).json({ ...comandaJson });
  };

  buscarPorId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const comanda = await this.comandaDAO.buscarPorId(Number(id));

    if (!comanda) {
      return res.status(404).json({ message: "Comanda não encontrada." });
    }

    const comandaJson: any = comanda.toJSON();
    if (comandaJson.cliente) {
      comandaJson.nomeCliente = comandaJson.cliente.nome;
      comandaJson.telefoneCliente = comandaJson.cliente.telefone;
      delete comandaJson.cliente;
    }

    res.json(comandaJson);
  };

  listar = async (req: Request, res: Response) => {
    const comandas = await this.comandaDAO.listar();

    const result = comandas.map((comanda: any) => {
      const comandaJson = comanda.toJSON();
      if (comandaJson.cliente) {
        comandaJson.nomeCliente = comandaJson.cliente.nome;
        comandaJson.telefoneCliente = comandaJson.cliente.telefone;
        delete comandaJson.cliente;
      }
      return comandaJson;
    });

    res.json(result);
  };

  atualizar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { idCliente, nomeCliente, telefoneCliente, produtos } = req.body;
    const comandaId = Number(id);

    if (produtos && Array.isArray(produtos)) {
      for (const p of produtos) {
        if (!p.id || !p.nome || !p.preco) {
          return res.status(400).json({ message: "Produto inválido. ID, nome e preço são obrigatórios." });
        }
      }
    }

    const comanda = await this.comandaDAO.buscarPorId(comandaId);

    if (!comanda) {
      return res.status(404).json({ message: "Comanda não encontrada." });
    }

    let currentClientId = comanda.getDataValue('idCliente');

    if (idCliente && idCliente !== currentClientId) {
      await this.comandaDAO.atualizar(comandaId, idCliente);
      currentClientId = idCliente;
    }

    if (nomeCliente || telefoneCliente) {
      await this.clienteDAO.atualizar(currentClientId, nomeCliente, telefoneCliente);
    }

    if (produtos && Array.isArray(produtos)) {
      for (const p of produtos) {
        if (p.id) {
          const exists = await this.produtoDAO.buscarPorId(p.id);
          if (exists) {
            await this.produtoDAO.atualizar(p.id, new Produto(p.id, p.nome, p.preco, comandaId));
          } else {
            const novoProduto = new Produto(p.id, p.nome, p.preco, comandaId);
            await this.produtoDAO.criar(novoProduto);
          }
        } else {
          const novoProduto = new Produto(0, p.nome, p.preco, comandaId);
          await this.produtoDAO.criar(novoProduto);
        }
      }
    }

    const comandaAtualizada = await this.comandaDAO.buscarPorId(comandaId);

    const comandaJson: any = comandaAtualizada?.toJSON();
    if (comandaJson && comandaJson.cliente) {
      comandaJson.nomeCliente = comandaJson.cliente.nome;
      comandaJson.telefoneCliente = comandaJson.cliente.telefone;
      delete comandaJson.cliente;
    }

    res.json(comandaJson);
  };

  deletar = async (req: Request, res: Response) => {
    const { id } = req.params;
    const comandaId = Number(id);

    const comanda = await this.comandaDAO.buscarPorId(comandaId);

    if (!comanda) {
      return res.status(404).json({ message: "Comanda não encontrada." });
    }

    await this.produtoDAO.deletarPorComanda(comandaId);

    await this.comandaDAO.deletar(comandaId);

    res.json({ message: "Comanda excluída com sucesso." });
  };
}