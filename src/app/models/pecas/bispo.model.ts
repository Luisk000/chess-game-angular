import { Peca } from "../peca.model";
export class Bispo extends Peca{  
    
    constructor(cor: string) {
        super(cor, "bispo"); 
    }
    

    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];
        this.verificarMovimentosDiagonais(colunaInicio, linhaInicio)
    }

 
}