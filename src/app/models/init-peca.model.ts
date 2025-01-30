import { Peca } from "./peca.model";

export abstract class InitPeca implements Peca{
    nome;
    cor;
    imagem;
    vivo = true;

    constructor(cor: string, nome:string){
        this.cor = cor;
        this.nome = nome;
        this.imagem = `${this.nome}_${this.cor}.png`;
    }

    acao(coluna: number, linha: number): { novaColuna: number; novaLinha: number; } | void {}
}