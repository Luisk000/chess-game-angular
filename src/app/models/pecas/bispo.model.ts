import { InitPeca } from "../init-peca.model";
export class Bispo extends InitPeca{  
    
    constructor(cor: string) {
        super(cor, "bispo"); 
    }
    
    override verificarAcoes(colunaInicio: number, linhaInicio: number) {
        let acoes: { colunaPossivel: number, linhaPossivel: number }[] = [];
        let movimentoColuna = this.cor === "branco" ? -1 : 1;
        
    }

}