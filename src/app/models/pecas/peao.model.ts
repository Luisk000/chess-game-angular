import { Peca } from "../peca.model";
export class Peao extends Peca{  
    
    constructor(cor: string) {
        super(cor, "peao"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {   
        this.acoes = [];

        if (this.cor === "branco"){
            this.verificarEAdicionarMovimentoUnico(colunaInicio - 1, linhaInicio);
            this.verificarEAdicionarMovimentoUnico(colunaInicio - 2, linhaInicio);
        }
        else{
            this.verificarEAdicionarMovimentoUnico(colunaInicio + 1, linhaInicio);
            this.verificarEAdicionarMovimentoUnico(colunaInicio + 2, linhaInicio);
        }
    
    }

}