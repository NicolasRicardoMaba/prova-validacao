import { ProdutoEntity } from "../entities/ProdutoEntity";
import { Produto } from "../models/Produto";

export class ProdutoDAO {

  criar(produto: Produto) {
    try {
      const dados: any = {
        nome: produto.nome,
        preco: produto.preco,
        idComanda: produto.idComanda
      };
      if (produto.id) {
        dados.id = produto.id;
      }
      return ProdutoEntity.create(dados);
    } catch (error) {
      console.log(error)
    }

  }

  listar() {
    return ProdutoEntity.findAll();
  }

  buscarPorId(id: number) {
    return ProdutoEntity.findByPk(id);
  }

  atualizar(id: number, produto: Produto) {
    return ProdutoEntity.update(
      {
        nome: produto.nome,
        preco: produto.preco
      },
      { where: { id, idComanda: produto.idComanda } }
    );
  }

  deletar(id: number) {
    return ProdutoEntity.destroy({ where: { id } });
  }

  deletarPorComanda(idComanda: number) {
    return ProdutoEntity.destroy({ where: { idComanda } });
  }
}