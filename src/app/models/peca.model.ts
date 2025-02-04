import { Posicao } from "./posicao.model";
import { Casa } from "./casa.model";

export abstract class Peca {
    nome : string;
    cor: string;
    imagem : string;
    vivo = true;
    acoes: Posicao[] = [];

    constructor(cor: string, nome:string){
        this.cor = cor;
        this.nome = nome;
        this.imagem = `assets/${this.nome}_${this.cor}.png`;
    }

    verMovimentosPossiveis(posicao: Posicao, cor: string, tabuleiro: Casa[][]): void {}
}

