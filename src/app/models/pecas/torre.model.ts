import { Peca } from "../peca.model";

export class Torre extends Peca{  
    
    constructor(cor: string) {
        super(cor, "torre"); 
    }

    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];
        this.verificarMovimentosRetos(colunaInicio, linhaInicio)
    }

}