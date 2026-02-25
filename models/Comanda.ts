import { Produto } from "./Produto";

export class Comanda {

    constructor(
        public idCliente: number,
        public nomeCliente: string,
        public telefoneCliente: string,
        public produtos: any[] = []
    ) { }
}   