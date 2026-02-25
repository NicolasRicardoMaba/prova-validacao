import { ClienteEntity } from "../entities/ClienteEntity";

export class ClienteDAO {
  async buscarPorId(id: number) {
    return await ClienteEntity.findByPk(id);
  }

  async criar(nome: string, telefone: string) {
    return await ClienteEntity.create({ nome, telefone });
  }

  async criarComId(id: number, nome: string, telefone: string) {
    return await ClienteEntity.create({ id, nome, telefone });
  }

  async atualizar(id: number, nome: string, telefone: string) {
    const updateData: any = {};
    if (nome) updateData.nome = nome;
    if (telefone) updateData.telefone = telefone;

    return await ClienteEntity.update(updateData, { where: { id } });
  }
}
