import { Peca } from "../peca.model";
export class Rei extends Peca{  
    
    constructor(cor: string) {
        super(cor, "rei"); 
    }
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];

        this.verificarEAdicionarMovimentoUnico(colunaInicio + 1, linhaInicio);
        this.verificarEAdicionarMovimentoUnico(colunaInicio - 1, linhaInicio); 
        this.verificarEAdicionarMovimentoUnico(colunaInicio, linhaInicio + 1);
        this.verificarEAdicionarMovimentoUnico(colunaInicio, linhaInicio - 1); 
    }

}