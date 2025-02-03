import { Peca } from "./peca.model";

export abstract class InitPeca implements Peca{
    nome;
    cor;
    imagem;
    vivo = true;
    acoes: { colunaPossivel: number, linhaPossivel: number }[] = [];

    constructor(cor: string, nome:string){
        this.cor = cor;
        this.nome = nome;
        this.imagem = `${this.nome}_${this.cor}.png`;
    }

    verMovimentosPossiveis(colunaInicio: number, linhaInicio: number): void {}

    adicionarMovimentoPossivel(colunaPossivel: number, linhaPossivel: number) {
        this.acoes.push({ 
            colunaPossivel: colunaPossivel, 
            linhaPossivel: linhaPossivel
        });
    };
}