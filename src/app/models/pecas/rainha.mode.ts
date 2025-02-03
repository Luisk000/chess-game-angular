import { Peca } from "../peca.model";
export class Rainha extends Peca{  
    
    constructor(cor: string) {
        super(cor, "rainha"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];
        this.verificarMovimentosDiagonais(colunaInicio, linhaInicio)
        this.verificarMovimentosRetos(colunaInicio, linhaInicio)
    }

}