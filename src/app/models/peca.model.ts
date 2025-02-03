import { Acao } from "./acao.model";

export abstract class Peca {
    nome : string;
    cor: string;
    imagem : string;
    vivo = true;
    acoes: Acao[] = [];

    constructor(cor: string, nome:string){
        this.cor = cor;
        this.nome = nome;
        this.imagem = `assets/${this.nome}_${this.cor}.png`;
    }

    verMovimentosPossiveis(colunaInicio: number, linhaInicio: number): void {}
}

