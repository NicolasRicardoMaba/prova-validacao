import { UsuarioEntity } from "../entities/UsuarioEntity";
import { Usuario } from "../models/Usuario";

export class UsuarioDAO {
    async criar(usuario: Usuario) {
        return UsuarioEntity.create({
            login: usuario.login,
            senha: usuario.senha,
        });
    }

    async buscarPorLogin(login: string) {
        return UsuarioEntity.findOne({ where: { login } });
    }

    async buscarPorId(id: number) {
        return UsuarioEntity.findByPk(id);
    }
}