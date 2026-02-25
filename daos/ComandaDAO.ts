import { ComandaEntity } from "../entities/ComandaEntity";
import { ClienteEntity } from "../entities/ClienteEntity";
import { ProdutoEntity } from "../entities/ProdutoEntity";
import { Comanda } from "../models/Comanda";

export class ComandaDAO {
  criar(comanda: Comanda) {
    return ComandaEntity.create({
      idCliente: comanda.idCliente
    });
  }

  buscarPorId(id: number) {
    return ComandaEntity.findByPk(id, {
      include: [
        { model: ClienteEntity, as: "cliente" },
        { model: ProdutoEntity, as: "produtos" }
      ]
    });
  }

  listar() {
    return ComandaEntity.findAll({
      include: [
        { model: ClienteEntity, as: "cliente" },
        { model: ProdutoEntity, as: "produtos" }
      ]
    });
  }

  atualizar(id: number, idCliente: number) {
    return ComandaEntity.update({ idCliente }, { where: { id } });
  }

  deletar(id: number) {
    return ComandaEntity.destroy({ where: { id } });
  }
}