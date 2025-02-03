import { Peca } from "../peca.model";
export class Cavalo extends Peca{  
    
    constructor(cor: string) {
        super(cor, "cavalo"); 
    }  
    
    override verMovimentosPossiveis(colunaInicio: number, linhaInicio: number) {
        this.acoes = [];
        this.verificarEAdicionarMovimentoUnico(colunaInicio - 1, linhaInicio+2);
        this.verificarEAdicionarMovimentoUnico(colunaInicio - 1, linhaInicio-2);
        this.verificarEAdicionarMovimentoUnico(colunaInicio + 1, linhaInicio+2);
        this.verificarEAdicionarMovimentoUnico(colunaInicio + 1, linhaInicio-2);
        this.verificarEAdicionarMovimentoUnico(colunaInicio-2, linhaInicio + 1);
        this.verificarEAdicionarMovimentoUnico(colunaInicio-2, linhaInicio - 1);
        this.verificarEAdicionarMovimentoUnico(colunaInicio+2, linhaInicio + 1);
        this.verificarEAdicionarMovimentoUnico(colunaInicio+2, linhaInicio - 1);
    }

}