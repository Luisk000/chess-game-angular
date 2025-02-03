import { Peca } from "../peca.model";
export class Peao extends Peca{  
    
    constructor(cor: string) {
        super(cor, "peao"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {   
        this.acoes = [];

        let direcaoColuna = this.cor === "branco" ? -1 : 1;
        let movimentoColuna = colunaInicio + direcaoColuna;

        this.verificarEAdicionarMovimentoUnico(movimentoColuna, linhaInicio - 1);
        this.verificarEAdicionarMovimentoUnico(movimentoColuna, linhaInicio + 1); 
    }

}