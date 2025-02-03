import { InitPeca } from "../init-peca.model";
export class Peao extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "peao"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {   
        this.acoes = [];

        let direcaoColuna = this.cor === "branco" ? -1 : 1;
        let movimentoColuna = colunaInicio + direcaoColuna;

        if (movimentoColuna >= 0 && movimentoColuna <= 7){
            if (linhaInicio - 1 >= 0)
                this.adicionarMovimentoPossivel(movimentoColuna, linhaInicio - 1);
            if (linhaInicio + 1 <= 7)
                this.adicionarMovimentoPossivel(movimentoColuna, linhaInicio + 1);
        }  
    }

}