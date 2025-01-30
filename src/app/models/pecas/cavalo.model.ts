import { InitPeca } from "../init-peca.model";
export class Cavalo extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "cavalo"); 
    }  
    
    override verificarAcoes(colunaInicio: number, linhaInicio: number) {
        let acoes: { colunaPossivel: number, linhaPossivel: number }[] = [];
        let movimentoColuna = this.cor === "branco" ? -1 : 1;
        
    }

}